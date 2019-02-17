import {
  START_GAME,
  END_GAME,
  PAUSE_GAME,
  UNPAUSE_GAME,
  SET_CELL_SIZE,
  PLACE_CELLS
} from '../actions/Types';

export function startGame() {
  return { type: START_GAME };
}

export function endGame() {
  return { type: END_GAME };
}

export function pauseGame() {
  return { type: PAUSE_GAME };
}

export function unpauseGame() {
  return { type: UNPAUSE_GAME };
}

export function setCellSize(size) {
  return {
    type: SET_CELL_SIZE,
    payload: size
  };
}

export function placeCells(cells) {
  return {
    type: PLACE_CELLS,
    payload: cells
  }
}
