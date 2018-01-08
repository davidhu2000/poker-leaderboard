import React from 'react';
import autoBind from 'react-autobind';

class GameList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
      season: new Date().getFullYear()
    };
    autoBind(this);
  }

  componentDidMount() {
    $('select').material_select();
    $('select#games-season-select').change(e => {
      this.update(e.target.value);
    });
    this.getGames();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.season !== this.state.season) {
      this.getGames();
    }
  }

  getGames() {
    let { season } = this.state;

    let params = season ? `season=${this.state.season}` : '';

    $.ajax({
      url: `/api/games?${params}`
    }).then(
      games => this.setState({ games })
    );
  }

  update(season) {
    this.setState({ season });
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
        <div className="row">
          <div className="input-field col s4">
            <select defaultValue={this.state.season} onChange={this.update.bind(this)} id="games-season-select">
              <option value=''>All</option>
              <option value="2018">2018</option>
              <option value="2017">2017</option>
            </select>
            <label>Choose Season</label>
          </div>
        </div>
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
