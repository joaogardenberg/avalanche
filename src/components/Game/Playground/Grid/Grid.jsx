import React          from 'react';
import { connect }    from 'react-redux';

import Cell           from './Cell/Cell';
import * as Constants from '../../../../Constants';

class Grid extends React.Component {
  render() {
    return (
      <div className="grid">
        { this.renderGrid() }
      </div>
    );
  }

  renderGrid() {
    const { game: { cellContent } } = this.props;

    let rows = [];

    for (let row = 0; row < Constants.ROWS; row++) {
      let cells = [];

      for (let column = 0; column < Constants.COLUMNS; column++) {
        let props = {
          mergeBottom: row < Constants.ROWS - 1       && cellContent[row][column] >= 0 && cellContent[row + 1][column] >= 0 && cellContent[row][column] === cellContent[row + 1][column],
          mergeLeft:   column > 0                     && cellContent[row][column] >= 0 && cellContent[row][column - 1] >= 0 && cellContent[row][column] === cellContent[row][column - 1],
          mergeRight:  column < Constants.COLUMNS - 1 && cellContent[row][column] >= 0 && cellContent[row][column + 1] >= 0 && cellContent[row][column] === cellContent[row][column + 1],
          mergeTop:    row > 0                        && cellContent[row][column] >= 0 && cellContent[row - 1][column] >= 0 && cellContent[row][column] === cellContent[row - 1][column]
        };

        const cell = <Cell { ...props } row={ row } column={ column } content={ cellContent[row][column] } key={ `cell-${row}-${column}` } />;
        cells.push(cell);
      }

      const rowWrapper = (
        <div className="cells-row" key={ `row-${row}` }>
          { cells }
        </div>
      );

      rows.push(rowWrapper);
    }

    return rows;
  }
}

const mapStateToProps = ({ game }) => {
  return { game };
}

Grid = connect(mapStateToProps, {})(Grid);

export default Grid;
