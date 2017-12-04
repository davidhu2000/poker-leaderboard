import React from 'react';
import autoBind from 'react-autobind';
import PropTypes from 'prop-types';

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        date: new Date().toJSON().slice(0,10),
        buyin: 20,
        players: {},
        firstPlace: {},
        secondPlace: {},
        thirdPlace: {}
      },
      selectedOption: -1,
      playerList: [],
      showAddPlayerInput: false,
      player: ''
    };

    autoBind(this);
  }
  
  componentDidMount() {
    this.fetchPlayerList();

    $('select').material_select();
    $('select').change(e => {
      this.updateSelection(e.target.value);
    })
  }

  fetchPlayerList() {
    $.ajax({ url: '/api/players' }).then(
      playerList => this.setState({ playerList })
    ).then(() => {
      $('select').material_select();
    });
  }

  addPlayer(e) {
    e.preventDefault();
    let player = { name: this.state.player };

    $.ajax({ 
      url: '/api/players', 
      method: 'POST',
      data: { player }
    }).then(
      () => {
        this.fetchPlayerList();
        this.setState({ player: '', showAddPlayerInput: false });
      }
    );
  } 

  calculateTotalPot() {
    let { players } = this.state.form;

    let total = 0;
    Object.keys(players).forEach(id => {
      total += players[id]
    });

    return total * this.state.form.buyin || 0;
  }

  updateSelection(value) {
    if (value === '0') {
      this.setState({
        showAddPlayerInput: true
      });
    } else {
      let { players } = this.state.form;
      players[value] = 1;
      this.setState({ players });
    }
    $('select').material_select();
  }

  updateBuyins(id, diff) {
    return e => {
      e.preventDefault();
      let { form } = this.state;
      let { players } = form;
      
      form.players[id] += diff;

      this.setState({ form });
    }
  }

  update(field) {
    return e => {
      this.setState({
        form: { [field]: e.target.value }
      });
    };
  }

  renderPlayerBuyins() {
    let { form, playerList } = this.state;
    let { players } = form;
    return Object.keys(players).map(id => (
      <div className="row" key={id}>
        <div className="input-field col s6">
          { playerList[id].name }
        </div>

        <button className="btn-floating waves-effect waves-light red" onClick={this.updateBuyins(id, -1)}>
          -
        </button>

        <span className='player-buyin'>{players[id]}</span>
        <button className="btn-floating waves-effect waves-light" onClick={this.updateBuyins(id, 1)}>
          +
        </button>
      </div>
    ));
  }

  renderAddPlayer() {
    if (this.state.showAddPlayerInput) {
      return (
        <div className="row">
          <div className="input-field col s9">
            <input id="player-name" type="text" className="validate" value={this.state.player} onChange={e => this.setState({ player: e.target.value })} />
            <label htmlFor="player-name" className='active'>Player Name</label>
          </div>

          <div className="input-field col s3">
            <button className="btn-floating waves-effect waves-light" type="submit" onClick={this.addPlayer}>
              +
            </button>
          </div>
        </div>
      );
    }
  }

  renderPlayerSelectOptions(filter = true) {
    let { playerList, form } = this.state;
    let playersAlreadyAdded = Object.keys(form.players);

    let options = Object.keys(playerList);
    if (filter) {
      options = options.filter(id => !playersAlreadyAdded.includes(id));
    } 
    return options.map(id => (
      <option key={id} value={id}>{playerList[id].name}</option> 
    ));
  }

  render() {
    return (
      <div className="form">
        <div className="row">
          <form className="col s12 m6 offset-m3">
            <div className="row">
              <div className="input-field col s12">
                <input id="date" type="date" className="validate" value={this.state.form.date} onChange={this.update('date')} />
                <label htmlFor="date" className='active'>Date</label>
              </div>
            </div>

            <div className="row">
              <div className="input-field col s12">
                <input id="buyin" type="number" className="validate" value={this.state.form.buyin} onChange={this.update('buyin')} />
                <label htmlFor="buyin" className='active'>Buyin</label>
              </div>
            </div>
            
            {this.renderPlayerBuyins()}

            {this.renderAddPlayer()}

            <div className="row">
              <div className="input-field col s12">
                <select value={this.selectedOption} onChange={this.updateSelection.bind(this)}>
                  <option value="-1" disabled>Choose a player</option>
                  <option value="0">Add a player</option>
                  { this.renderPlayerSelectOptions() }
                </select>
                <label>Select a player</label>
              </div>   
            </div>

            <h4>Total Pot Size: ${this.calculateTotalPot()}</h4>

            <div className="row">
              <div className="input-field col s12">
                <select value={"-1"}>
                  <option value="-1" disabled>Choose a winner</option>
                  { this.renderPlayerSelectOptions(false) }
                </select>
                <label>First Place</label>
              </div>   
            </div>
          </form>
        </div>     
      </div>
    );
  }
}

export { Form };
