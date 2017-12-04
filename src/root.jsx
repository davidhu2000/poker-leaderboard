import React from 'react';
import autoBind from 'react-autobind';
import { Form } from './components';
 
class Root extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    return (
      <div className='container'>
        <Form />
      </div>
    );
  }
}

export default Root;
