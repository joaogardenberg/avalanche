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
        const cell = <Cell row={ row } column={ column } content={ cellContent[row][column] } key={ `cell-${row}-${column}` } />;
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
