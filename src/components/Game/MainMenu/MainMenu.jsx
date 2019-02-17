import React         from 'react';
import { connect }   from 'react-redux';

import                    './MainMenu.scss';
import { startGame } from '../../../actions';

let MainMenu = props => {
  return (
    <div className="main-menu">
      <button onClick={ () => onStartClick(props.startGame) }>Start</button>
    </div>
  );
}

const onStartClick = startGame => {
  startGame();
}

MainMenu = connect(null, { startGame })(MainMenu);

export default MainMenu;
