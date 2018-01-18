import React from 'react';
import autoBind from 'react-autobind';
import { Form, GameList, Calculations, Charts } from './components';
 
class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      component: 'calculations'
    }
    autoBind(this);
  }

  changeComponent(component) {
    this.setState({ component });
  }

  renderComponent() {
    switch(this.state.component) {
      case 'form':
        return <Form />;
      case 'gamesList':
        return <GameList />;
      case 'calculations':
        return <Calculations />;
      case 'charts':
        return <Charts />;
    }
  }

  render() {
    return (
      <div className='container'>
        <nav style={{ marginBottom: 20 }}>
          <div className="nav-wrapper">
            <a href="" className="brand-logo" style={{ left: '12%' }}></a>
            <ul id="nav-mobile" className="right">
              <li><a onClick={() => this.changeComponent('form')}>Form</a></li>
              <li><a onClick={() => this.changeComponent('gamesList')}>Games</a></li>
              <li><a onClick={() => this.changeComponent('calculations')}>Calculation</a></li>
              <li><a onClick={() => this.changeComponent('charts')}>Charts</a></li>
            </ul>
          </div>
        </nav>

        { this.renderComponent()}
      </div>
    );
  }
}

export default Root;
