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

const renderContent = ({ content, mergeBottom, mergeLeft, mergeRight, mergeTop }) => {
  if (content < 0 ) {
    return null;
  }

  const color = Constants.getColor(content);
  let classes = '';

  classes += mergeBottom ? ' merge-bottom' : '';
  classes += mergeLeft   ? ' merge-left'   : '';
  classes += mergeRight  ? ' merge-right'  : '';
  classes += mergeTop    ? ' merge-top'    : '';

  return <div className={ `${color}${classes}` } />;
}

const mapStateToProps = ({ game: { cellSize } }) => {
  return { cellSize };
}

Cell = connect(mapStateToProps, {})(Cell);

export default Cell;
