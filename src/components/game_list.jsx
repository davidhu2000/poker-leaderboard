import React from 'react';
import autoBind from 'react-autobind';

class GameList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    autoBind(this);
  }

  render() {
    return (
      <div>
        Content
      </div>
    );
  }
}

export { GameList };
