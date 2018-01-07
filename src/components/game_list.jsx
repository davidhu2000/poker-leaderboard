import React from 'react';
import autoBind from 'react-autobind';

class GameList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      games: []
    };
    autoBind(this);
  }

  componentDidMount() {
    $.ajax({
      url: '/api/games'
    }).then(
      games => this.setState({ games })
    )
  }

  renderWinnerCell(winner) {
    if (!winner) {
      return <td />;
    }
    return (
      <td>
        {winner.name}
        <br/>
        x{winner.timesBoughtIn} (+${winner.amountWon})
      </td>
    );
  }

  renderGames() {
    return this.state.games.map(game => {

      return (
        <tr key={Math.random()}>
          <td>{game.date}</td>
          <td>${game.buyin}</td>
          <td>${game.potSize}</td>
          {this.renderWinnerCell(game.winners[0])}
          {this.renderWinnerCell(game.winners[1])}
          {this.renderWinnerCell(game.winners[2])}
          <td>{this.renderOtherPlayers(game.players)}</td>
        </tr>
      );
    });
  }

  renderOtherPlayers(players) {
    return players.map(player => `${player.name} x${player.timesBoughtIn}`).join(', ');
  }

  render() {
    return (
      <div>
        <table className="responsive-table highlight bordered">
          <thead>
            <tr>
              <th>Date</th>
              <th>Buy In</th>
              <th>Total Pot</th>
              <th>1st Place</th>
              <th>2nd Place</th>
              <th>3rd Place</th>
              <th>Others</th>
            </tr>
          </thead>

          <tbody>
            { this.renderGames() }
          </tbody>
        </table>
      </div>
    );
  }
}

export { GameList };
