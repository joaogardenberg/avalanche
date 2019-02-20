import React       from 'react';
import { connect } from 'react-redux';
import posed          from 'react-pose';

import * as Constants from '../../../../../Constants';

const Color = posed.div({
  unmerged: {
    'border-top-left-radius': '20%',
    'border-top-right-radius': '20%',
    'border-bottom-right-radius': '20%',
    'border-bottom-left-radius': '20%',
    transition: {
      duration: 100
    }
  },
  merged: {
    'border-top-left-radius': ({ mergeLeft, mergeTop }) => mergeLeft || mergeTop ? '0' : '20%',
    'border-top-right-radius': ({ mergeRight, mergeTop }) => mergeRight || mergeTop ? '0' : '20%',
    'border-bottom-right-radius': ({ mergeBottom, mergeRight }) => mergeBottom || mergeRight ? '0' : '20%',
    'border-bottom-left-radius': ({ mergeBottom, mergeLeft }) => mergeBottom || mergeLeft ? '0' : '20%',
    transition: {
      duration: 100
    }
  }
});

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

  return <Color className={color} pose={ (mergeBottom || mergeLeft || mergeRight || mergeTop) ? 'merged' : 'unmerged' } poseKey={ [mergeBottom, mergeLeft, mergeRight, mergeTop] } mergeBottom={ mergeBottom } mergeLeft={ mergeLeft } mergeRight={ mergeRight } mergeTop={ mergeTop } />;
}

const mapStateToProps = ({ game: { cellSize } }) => {
  return { cellSize };
}

Cell = connect(mapStateToProps, {})(Cell);

export default Cell;
