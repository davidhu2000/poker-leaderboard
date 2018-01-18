import React from 'react';
import autoBind from 'react-autobind';
import PropTypes from 'prop-types';
import { BarLoader } from 'react-spinners';

class Charts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      season: 2017,
      players: [],
      dates: [],
      chartType: 'net'
    };
    autoBind(this);
  }

  componentDidMount() {
    $('select').material_select();
    $('select#charts-season-select').change(e => {
      this.setState({ season: e.target.value });
    });

    $('select#charts-type-select').change(e => {
      this.setState({ chartType: e.target.value });
    });

    this.getData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.season !== this.state.season) {
      this.getData();
    }
  }

  getData() {
    let { season } = this.state;
    this.setState({ loading: true });

    let params = season ? `season=${this.state.season}` : '';

    $.ajax({
      url: `/api/analytics/winnings_by_date?${params}`
    }).then(
      ({ players, dates }) => this.setState({ players, dates, loading: false })
    ).then(this.renderChart);
  }

  generateColor() {
    let value1 = Math.round(Math.random()) * 200;
    let value2 = Math.round(Math.random()) * 200;
    let value3 = Math.round(Math.random()) * 200;

    return `rgb(${value1}, ${value2}, ${value3})`;
  }

  renderChart() {
    let chartOptions = {};

    let datasets = [];

    let { dates, players, chartType } = this.state;

    let playerNames = Object.keys(players);

    for (let i = 0; i < playerNames.length; i++) {
      let color = this.generateColor();
      datasets.push({
        label: playerNames[i],
        data: players[playerNames[i]][chartType],
        fill: false,
        backgroundColor: color,
        borderColor: color
      });
    }

    let chartData = {
      data: {
        labels: this.state.dates,
        datasets
      },
      type: 'line'
    };

    let ctx = document.getElementById("canvas").getContext('2d');
    let chart = new Chart(ctx, chartData, {});
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="input-field col s4">
            <select defaultValue={this.state.season} id="charts-season-select">
              <option value=''>All</option>
              <option value="2018">2018</option>
              <option value="2017">2017</option>
            </select>
            <label>Choose Season</label>
          </div>

          <div className="input-field col s4">
            <select defaultValue={this.state.season} id="charts-type-select">
              <option value='net'>Net</option>
              <option value="total">Total</option>
              <option value="buyins">Buyins</option>
            </select>
            <label>Choose Chart Type</label>
          </div>
        </div>
        {this.state.loading ? <BarLoader width={"100%"} /> : <canvas id="canvas"></canvas>}
      </div>
    );
  }
}

Charts.propTypes = {
};

export { Charts };
