import React           from 'react';
import { connect }     from 'react-redux';

import                      './Game.scss';
import { setCellSize } from '../../actions';
import MainMenu        from './MainMenu/MainMenu';
import Playground      from './Playground/Playground';

class Game extends React.Component {
  render() {
    const { started } = this.props;

    const content = started ? this.renderGame() : this.renderMainMenu();

    return (
      <div className="game" ref={ this.gameRef }>
        { content }
      </div>
    );
  }

  renderGame() {
    return <Playground />;
  }

  renderMainMenu() {
    return <MainMenu />;
  }

  constructor(props) {
    super(props);

    this.gameRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('resize', this.chooseCellSize.bind(this));
    setTimeout(this.chooseCellSize.bind(this), 0);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.chooseCellSize.bind(this));
  }

  chooseCellSize() {
    const { setCellSize }               = this.props;
    const { offsetHeight, offsetWidth } = this.gameRef.current;
    const sizeFromHeight = Math.floor((offsetHeight - 40) / 12);
    const sizeFromWidth = Math.floor((offsetWidth - 40) / 6);

    let size = sizeFromHeight * 6 > offsetWidth - 40 ? sizeFromWidth : sizeFromHeight;

    if (size % 2 !== 0) {
      size = size - 1;
    }

    setCellSize(size);
  }
}

const mapStateToProps = ({ game }) => {
  return game;
}

Game = connect(mapStateToProps, { setCellSize })(Game);

export default Game;
