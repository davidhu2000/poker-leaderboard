import React from 'react';
import autoBind from 'react-autobind';
import { BarLoader } from 'react-spinners';

class GameList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
      season: new Date().getFullYear(),
      loading: false,
      sortColumn: '',
      ascendingOrder: false
    };
    autoBind(this);
  }

  sortBy(column) {
    let { games, sortColumn, ascendingOrder } = this.state;

    function compare(p1, p2) {
      if (sortColumn === column && !ascendingOrder) {
        return p1[column] - p2[column];
      } else {
        return p2[column] - p1[column];
      }
    }

    games = games.sort(compare);
    ascendingOrder = !ascendingOrder;
    sortColumn = column;

    this.setState({ games, ascendingOrder, sortColumn });
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
    this.setState({ loading: true })

    let params = season ? `season=${this.state.season}` : '';

    $.ajax({
      url: `/api/games?${params}`
    }).then(
      games => this.setState({ games, loading: false })
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

  renderTable() {
    return (
      <table className="responsive-table highlight bordered">
        <thead>
          <tr>
            <th onClick={() => this.sortBy("date")} className="sortable-header">Date</th>
            <th onClick={() => this.sortBy("buyin")} className="sortable-header">Buy In</th>
            <th onClick={() => this.sortBy("potSize")} className="sortable-header">Total Pot</th>
            <th>1st Place</th>
            <th>2nd Place</th>
            <th>3rd Place</th>
            <th>Others</th>
          </tr>
        </thead>

        <tbody>
          {this.renderGames()}
        </tbody>
      </table>
    );
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="input-field col s4">
            <select defaultValue={this.state.season} onChange={this.update.bind(this)} id="games-season-select">
              <option value=''>All</option>
              <option value="2019">2019</option>
              <option value="2018">2018</option>
              <option value="2017">2017</option>
            </select>
            <label>Choose Season</label>
          </div>
        </div>
        {this.state.loading ? <BarLoader width={"100%"} /> : this.renderTable()}
      </div>
    );
  }
}

export { GameList };
