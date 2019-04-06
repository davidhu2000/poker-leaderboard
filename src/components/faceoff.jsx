import React from 'react';
import autoBind from 'react-autobind';
import PropTypes from 'prop-types';
import { BarLoader } from 'react-spinners';

class Faceoff extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      players: {},
      season: new Date().getFullYear(),
      player: null
    };
    autoBind(this);
  }

  componentDidMount() {
    $('select').material_select();
    $('select#charts-season-select').change(e => {
      this.setState({ season: e.target.value });
    });

    $('select#player-faceoff-select').change(e => {
      this.setState({ player: e.target.value });
    });

    this.getData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.season !== this.state.season) {
      this.getData();
      return;
    }

    if (prevState.player !== this.state.player) {
      this.renderChart();
    }
  }

  getData() {
    let { season } = this.state;
    this.setState({ loading: true });

    let params = season ? `season=${this.state.season}` : '';

    $.ajax({
      url: `/api/analytics/win_loss_against?${params}`
    }).then(
      ({ players }) => this.setState({ players, loading: false })
    ).then(() => {
      this.renderChart();
      $('select').material_select();
    });
  }

  renderChart() {
    let chartOptions = [];

    let { players, player } = this.state;

    if (!player) {
      return;
    }

    let opponents = players[player];

    let opponentNames = Object.keys(opponents);

    // let winPercentage = opponentNames.map(name => {
    //   let winLoss = opponents[name];
    //   return winLoss.win / (winLoss.loss + winLoss.win);
    // });

    let wins = [];
    let losses = [];

    opponentNames.forEach(name => {
      wins.push(opponents[name].win);
      losses.push(opponents[name].loss);
    });

    let data = {
      labels: opponentNames,
      datasets: [
        {
          label: "Wins",
          data: wins,
          backgroundColor: "rgba(85, 239, 38 ,0.05)",
          pointBackgroundColor: "rgba(85, 239, 38 ,1)",
          borderColor: "rgba(85, 239, 38 ,0.8)"
        }, 
        {
          label: "Losses",
          data: losses,
          backgroundColor: "rgba(255,101,133,0.05)",
          pointBackgroundColor: "rgba(255,101,133,1)",
          borderColor: "rgba(255,101,133,0.8)"
        }
      ]
    };

    let ctx = document.getElementById("canvas").getContext('2d');
    let chart = new Chart(ctx, { data: data, responsive: true, maintainAspectRatio: false, type: 'radar' });
  }

  render() {
    let { players } = this.state;

    return (
      <div>
        <div className="row">
          <div className="input-field col s4">
            <select defaultValue={this.state.season} id="charts-season-select">
              <option value=''>All</option>
              <option value="2019">2019</option>
              <option value="2018">2018</option>
              <option value="2017">2017</option>
            </select>
            <label>Choose Season</label>
          </div>

          <div className="input-field col s4">
            <select defaultValue={"0"} id="player-faceoff-select">
              <option value='0' disabled>-- Select a Player --</option>
              { Object.keys(players).map(player => <option value={player}>{player}</option>)}
            </select>
            <label>Choose Chart Type</label>
          </div>
        </div>
        {this.state.loading ? <BarLoader width={"100%"} /> : <div style={{ height: 400 }}><canvas id="canvas" /></div>}
      </div>
    );
  }
}

Faceoff.propTypes = {
};

export { Faceoff };
