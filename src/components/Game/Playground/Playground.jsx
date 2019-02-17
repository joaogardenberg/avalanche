import React       from 'react';
import { connect } from 'react-redux';

import                  './Playground.scss';
import Grid        from './Grid/Grid';
import Block       from './Block/Block';

class Playground extends React.Component {
  render() {
    return (
      <div className="playground">
        <Grid />
        <Block />
      </div>
    );
  }
}

const mapStateToProps = ({ game }) => {
  return { game };
}

Playground = connect(mapStateToProps, {})(Playground);

export default Playground;
