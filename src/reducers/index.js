import { combineReducers } from 'redux';
import GameReducer         from './GameReducer';

const RootReducer = combineReducers({
  game: GameReducer
});

export default RootReducer;
