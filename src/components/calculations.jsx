import React from 'react';
import autoBind from 'react-autobind';
import { ClimbingBoxLoader } from 'react-spinners';

class Calculations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      season: new Date().getFullYear(),
      loading: false
    };
    autoBind(this);
  }

  componentDidMount() {
    $('select').material_select();
    $('select#calulation-season-select').change(e => {
      this.update(e.target.value);
    });

    this.getWinnings();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.season !== this.state.season) {
      this.getWinnings();
    }
  }

  getWinnings() {
    let { season } = this.state;

    this.setState({ loading: true })

    let params = season ? `season=${this.state.season}` : '';

    $.ajax({
      url: `/api/players/winnings?${params}`
    }).then(
      players => {
        players = players.sort((a, b) => b.netWinnings - a.netWinnings);
        this.setState({ players, loading: false });
      }
    );
  }

  update(season) {
    this.setState({ season });
  }

  renderPlayers() {
    return this.state.players.map(player => (
      <tr key={Math.random()}>
        <td>{player.name}</td>
        <td>{player.totalWinnings.toLocaleString('en', { style: 'currency', currency: "USD"}).split('.')[0]}</td>
        <td>{player.netWinnings.toLocaleString('en', { style: 'currency', currency: "USD"}).split('.')[0]}</td>
        <td>{player.numberFirst}</td>
        <td>{player.numberSecond}</td>
        <td>{player.numberThird}</td>
        <td>{player.gamesPlayed}</td>
        <td>{player.numberBuyins}</td>
      </tr>
    ));
  }

  renderTable() {
    return (
      <table className="responsive-table highlight bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Total Winnings</th>
            <th>Net Winnings</th>
            <th>Total 1st Place</th>
            <th>Total 2nd Place</th>
            <th>Total 3rd Place</th>
            <th>Games Played</th>
            <th>Number Buyins</th>
          </tr>
        </thead>

        <tbody>
          {this.renderPlayers()}
        </tbody>
      </table>
    );
  }

  render() {

    return (
      <div>
        <div className="row">
          <div className="input-field col s4">
            <select defaultValue={this.state.season} onChange={this.update.bind(this)} id="calulation-season-select">
              <option value=''>All</option>
              <option value="2018">2018</option>
              <option value="2017">2017</option>
            </select>
            <label>Choose Season</label>
          </div>
        </div>
        {this.state.loading ? <ClimbingBoxLoader /> : this.renderTable()}
      </div>
    );
  }
}


export { Calculations };
