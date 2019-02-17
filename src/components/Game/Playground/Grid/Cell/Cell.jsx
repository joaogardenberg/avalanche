import React       from 'react';
import { connect } from 'react-redux';

import * as Constants from '../../../../../Constants';

let Cell = props => {
  const { cellSize } = props;

  return (
    <div className="cell" style={{ height: cellSize, width: cellSize }}>
      { renderContent(props) }
    </div>
  );
}

const renderContent = ({ content }) => {
  if (content < 0 ) {
    return null;
  }

  const color = Constants.getColor(content);

  return <div className={ color } />;
}

const mapStateToProps = ({ game: { cellSize } }) => {
  return { cellSize };
}

Cell = connect(mapStateToProps, {})(Cell);

export default Cell;
