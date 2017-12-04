import React from 'react';
import autoBind from 'react-autobind';

class Calculations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      players: []
    };
    autoBind(this);
  }

  componentDidMount() {
    $.ajax({
      url: '/api/players/winnings'
    }).then(
      players => {
        players = players.sort((a, b) => b.netWinnings - a.netWinnings);
        this.setState({ players })
      }
    );
  }

  renderPlayers() {
    return this.state.players.map(player => (
      <tr>
        <td>{player.name}</td>
        <td>{player.totalWinnings.toLocaleString('en', { style: 'currency', currency: "USD"}).split('.')[0]}</td>
        <td>{player.netWinnings.toLocaleString('en', { style: 'currency', currency: "USD"}).split('.')[0]}</td>
        <td>{player.numberFirst}</td>
        <td>{player.numberSecond}</td>
        <td>{player.numberThird}</td>
        <td>{player.gamesPlayed}</td>
      </tr>
    ));
  }

  render() {
    return (
      <div>
        <table className="responsive-table highlight bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Total Winnings</th>
              <th>Net Winnings</th>
              <th>Number of 1st Place</th>
              <th>Number of 2nd Place</th>
              <th>Number of 3rd Place</th>
              <th>Games Played</th>
            </tr>
          </thead>

          <tbody>
            { this.renderPlayers() }
          </tbody>
        </table>
      </div>
    );
  }
}


export { Calculations };
