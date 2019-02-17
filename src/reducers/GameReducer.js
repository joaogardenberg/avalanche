import {
  START_GAME,
  END_GAME,
  PAUSE_GAME,
  UNPAUSE_GAME,
  SET_CELL_SIZE,
  PLACE_CELLS
} from '../actions/Types';

import * as Constants from '../Constants';

const INITIAL_STATE = {
  started: false,
  ended: false,
  paused: false,
  currentBlock: null,
  nextBlock: null,
  speed: 5,
  cellSize: 40,
  cellContent: initialCells()
};

function GameReducer(state = INITIAL_STATE, action) {
  switch(action.type) {
    case START_GAME:
      return {
        ...state,
        started:      true,
        currentBlock: [
                        Math.floor(Math.random() * 5),
                        Math.floor(Math.random() * 5)
                      ],
        nextBlock:    [
                        Math.floor(Math.random() * 5),
                        Math.floor(Math.random() * 5)
                      ]
      };
    case END_GAME:
      return { ...state, started: false, ended: true }
    case PAUSE_GAME:
      return { ...state, paused: true };
    case UNPAUSE_GAME:
      return { ...state, paused: false };
    case PLACE_CELLS:
      const newState = {
        ...state,
        currentBlock: state.nextBlock,
        nextBlock:    [
                        Math.floor(Math.random() * 5),
                        Math.floor(Math.random() * 5)
                      ]
      }

      action.payload.forEach(cell => {
        try {
          newState.cellContent[cell.y][cell.x] = cell.color;
        } catch(error) {}
      });

      return newState;
    case SET_CELL_SIZE:
      return { ...state, cellSize: action.payload };
    default:
      return state;
  }
}

function initialCells() {
  let rows = [];

  for (let row = 0; row < Constants.ROWS; row++) {
    let cells = [];

    for (let column = 0; column < Constants.COLUMNS; column++) {
      cells.push(-1);
    }

    rows.push(cells);
  }

  return rows;
}

export default GameReducer;
