import React from 'react';
import autoBind from 'react-autobind';
import { Form, GameList } from './components';
 
class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      component: 'gamesList'
    }
    autoBind(this);
  }

  changeComponent(component) {
    this.setState({ component })
  }

  renderComponent() {
    switch(this.state.component) {
      case 'form':
        return <Form />;
      case 'gamesList':
        return <GameList />;
    }
  }

  render() {
    return (
      <div className='container'>
        <nav>
          <div class="nav-wrapper">
            <a href="" class="brand-logo">Poker</a>
            <ul id="nav-mobile" class="right">
              <li><a onClick={() => this.changeComponent('form')}>Form</a></li>
              <li><a onClick={() => this.changeComponent('gamesList')}>Games List</a></li>
            </ul>
          </div>
        </nav>

        { this.renderComponent()}
      </div>
    );
  }
}

export default Root;
