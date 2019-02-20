import React          from 'react';
import { connect }    from 'react-redux';
import posed          from 'react-pose';

import * as Constants from '../../../../Constants';
import { placeCells } from '../../../../actions';

const INITIAL_POSITION = [2, -1];

const INITIAL_CELL_POSITION = {
  position: INITIAL_POSITION,
  rotation: 0,
  firstFall: 0,
  currentFirstFall: 0,
  secondFall: 0,
  currentSecondFall: 0
};

const INITIAL_CELL_PROPERTIES = {
  shouldFall: true,
  shouldBlink: true,
  shouldPlaceBlock: false
};

const INITIAL_PROPERTIES = {
  blockInput: false
};

const INITIAL_KEYS_PRESSED = {
  fullGravity: false,
  keysPressed: {}
};

const INITIAL_STATE = {
  ...INITIAL_CELL_POSITION,
  ...INITIAL_CELL_PROPERTIES,
  ...INITIAL_PROPERTIES,
  ...INITIAL_KEYS_PRESSED
};

const INITIAL_STATE_WITHOUT_KEYS_PRESSED = {
  ...INITIAL_CELL_POSITION,
  ...INITIAL_CELL_PROPERTIES,
  ...INITIAL_PROPERTIES
};

const FirstCell = posed.div({
  bottom: {
    left: 0,
    top: ({ cellSize }) => cellSize,
    transition: { duration: 100 }
  },
  left: {
    left: ({ cellSize }) => -cellSize,
    top: 0,
    transition: { duration: 100 }
  },
  right: {
    left: ({ cellSize }) => cellSize,
    top: 0,
    transition: { duration: 100 }
  },
  top: {
    left: 0,
    top: ({ cellSize }) => -cellSize,
    transition: { duration: 100 }
  }
});

class Block extends React.Component {
  render() {
    const { shouldBlink }            = this.state;
    const { currentBlock, cellSize } = this.props.game;

    if (!currentBlock) {
      return null;
    }

    return (
      <div className="block" style={ this.getBlockStyle() }>
        <FirstCell className="first" pose={ this.getFirstCellPosition() } cellSize={ cellSize } poseKey={ cellSize } style={ this.getFirstCellStyle() }>
          { this.renderBlock(currentBlock[0]) }
        </FirstCell>
        <div className={ `second${shouldBlink ? ' blinking' : ''}` } style={ this.getSecondCellStyle() }>
          {/*<svg>
            <path d={ `M${cellSize / 2},0 A${cellSize / 2},${cellSize / 2} 0 1,1 ${cellSize / 2},${cellSize} A${cellSize / 2},${cellSize / 2} 0 1,1 ${cellSize / 2},0` } />
          </svg>*/}
          { this.renderBlock(currentBlock[1]) }
        </div>
      </div>
    );
  }

  renderBlock(n) {
    const { cellSize } = this.props.game;
    const color = Constants.getColor(n);

    return <div className={ color } style={{ height: cellSize, width: cellSize }} />;
  }

  constructor(props) {
    super(props);

    this.state = INITIAL_STATE;

    this.rotateCounterclockwiseKeyPressed = false;
    this.rotateClockwiseKeyPressed        = false;
    this.firstLeftMovement                = true;
    this.firstRightMovement               = true;
  }

  componentDidMount() {
    this.blockTimeout = setTimeout(this.blockGravity.bind(this), (11 - this.props.game.speed) * 30);
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  componentWillUnmount() {
    this.clearAllTimeouts();
    this.clearAllEventListeners();
  }

  onKeyDown({ keyCode }) {
    if (![32, 37, 39, 67, 86].includes(keyCode)) {
      return false;
    }

    if (keyCode === 32) {
      this.placeCells();
    } else if (keyCode === 67) {
      if (!this.rotateCounterclockwiseKeyPressed) {
        this.rotateCounterclockwise();
        this.rotateCounterclockwiseKeyPressed = true;
      }
    } else if (keyCode === 86) {
      if (!this.rotateClockwiseKeyPressed) {
        this.rotateClockwise();
        this.rotateClockwiseKeyPressed = true;
      }
    } else if (keyCode === 37) {
      if (!this.moveLeftKeyPressed) {
        this.moveLeft();
        this.moveLeftKeyPressed = true;
      }
    } else if (keyCode === 39) {
      if (!this.moveRightKeyPressed) {
        this.moveRight();
        this.moveRightKeyPressed = true;
      }
    }
  }

  onKeyUp({ keyCode }) {
    if (![32, 37, 39, 67, 86].includes(keyCode)) {
      return false;
    }

    if (keyCode === 67) {
      this.rotateCounterclockwiseKeyPressed = false;
    } else if (keyCode === 86) {
      this.rotateClockwiseKeyPressed = false;
    } else if (keyCode === 37) {
      this.moveLeftKeyPressed = false;
    } else if (keyCode === 39) {
      this.moveRightKeyPressed = false;
    }
  }

  getFirstCellPosition() {
    const { rotation } = this.state;
    const absRotation = this.getAbsRotation(rotation);

    switch (absRotation) {
      case 1:
        return 'right';
      case 2:
        return 'bottom';
      case 3:
        return 'left';
      default:
        return 'top';
    }
  }

  getAbsRotation(rotation) {
    return rotation % 4 < 0 ? (rotation % 4 + 4) : (rotation % 4);
  }

  clearAllTimeouts() {
    clearTimeout(this.blockTimeout);
    this.blockTimeout = null;
  }

  clearAllEventListeners() {
    window.removeEventListener('keydown', this.onKeyDown.bind(this));
    window.removeEventListener('keyup', this.onKeyUp.bind(this));
  }

  blockGravity() {
    const { game: { speed, cellContent } } = this.props;
    const { position: [x, y], rotation }   = this.state;
    const absRotation = this.getAbsRotation(rotation);

    let maxY;

    if (absRotation === 0) {
      /*
         ─────
        ▐     ▐
         ─────
        ▐  ☼  ▐
         ─────
      */
      // Checking if the column has anything below
      const belowFilledY = cellContent
                           .map(line => line[x])
                           .findIndex(color => color >= 0);

      if (belowFilledY >= 0) {
        maxY = belowFilledY - 1;
      } else {
        maxY = Constants.ROWS - 1;
      }
    } else if (absRotation === 1) {
      /*
         ───── ─────
        ▐  ☼  ▐     ▐
         ───── ─────
      */
      // Checking if the 2 columns have anything below
      const belowFilledYLeft = cellContent
                               .map(line => line[x])
                               .findIndex(color => color >= 0);

      const belowFilledYRight = cellContent
                                .map(line => line[x + 1])
                                .findIndex(color => color >= 0);

      // If any of the lines have something below
      if (belowFilledYLeft >= 0 || belowFilledYRight >= 0) {
        // If both lines have something below
        if (belowFilledYLeft >= 0 && belowFilledYRight >= 0) {
          // If left is higher than right (yeah, less means higher in that case)
          if (belowFilledYLeft < belowFilledYRight) {
            maxY = belowFilledYLeft - 1;
          // If right is higher than left
          } else {
            maxY = belowFilledYRight - 1;
          }
        // If only left one has something below
        } else if (belowFilledYLeft >= 0) {
          maxY = belowFilledYLeft - 1;
        // If only right one has something below
        } else {
          maxY = belowFilledYRight - 1;
        }
      // If nothing is below
      } else {
        maxY = Constants.ROWS - 1;
      }
    } else if (absRotation === 2) {
      /*
         ─────
        ▐  ☼  ▐
         ─────
        ▐     ▐
         ─────
      */
      // Checking if the column has anything below
      const belowFilledY = cellContent
                           .map(line => line[x])
                           .findIndex(color => color >= 0);

      if (belowFilledY >= 0) {
        maxY = belowFilledY - 2;
      } else {
        maxY = Constants.ROWS - 2;
      }
    } else if (absRotation === 3) {
      /*
         ───── ─────
        ▐     ▐  ☼  ▐
         ───── ─────
      */
      // Checking if the 2 columns have anything below
      const belowFilledYLeft = cellContent
                               .map(line => line[x - 1])
                               .findIndex(color => color >= 0);

      const belowFilledYRight = cellContent
                                .map(line => line[x])
                                .findIndex(color => color >= 0);

      // If any of the lines have something below
      if (belowFilledYLeft >= 0 || belowFilledYRight >= 0) {
        // If both lines have something below
        if (belowFilledYLeft >= 0 && belowFilledYRight >= 0) {
          // If left is higher than right (yeah, less means higher in that case)
          if (belowFilledYLeft < belowFilledYRight) {
            maxY = belowFilledYLeft - 1;
          // If right is higher than left
          } else {
            maxY = belowFilledYRight - 1;
          }
        // If only left one has something below
        } else if (belowFilledYLeft >= 0) {
          maxY = belowFilledYLeft - 1;
        // If only right one has something below
        } else {
          maxY = belowFilledYRight - 1;
        }
      // If nothing is below
      } else {
        maxY = Constants.ROWS - 1;
      }
    }

    if (y < maxY) {
      this.setState({ position: [x, y + .5] });
    }

    // Make it so it checkes again in "(11 - speed) * 30" miliseconds
    this.blockTimeout = setTimeout(this.blockGravity.bind(this), (11 - speed) * 30)
  }

  rotateCounterclockwise() {
    const { game: { cellContent } }      = this.props;
    const { position: [x, y], rotation } = this.state;
    const absRotation = this.getAbsRotation(rotation);
    const finalY = Math.ceil(y);

    // Try so that it doesn't throw an error
    // if it's outside of the screen.
    try {
      if (absRotation === 0) {
        /*
           ─────
          ▐     ▐
           ─────
          ▐  ☼  ▐
           ─────
        */
        // If it has a wall to the left and nothing
        // to the right, move 1 to the right
        if (x <= 0 && cellContent[finalY][x + 1] < 0) {
          this.setState({
            rotation: rotation - 1,
            position: [1, y]
          });
        // If it has a filled block to the left and
        // nothing to the right, move 1 to the right
        } else if (
          cellContent[finalY][x - 1] > -1 &&
          cellContent[finalY][x + 1] < 0
        ) {
          this.setState({
            rotation: rotation - 1,
            position: [x + 1, y]
          });
        // If it doesn't have anything to the left,
        // carry on with the rotation
        } else if (cellContent[finalY][x - 1] < 0 && x > 0) {
          this.setState({ rotation: rotation - 1 });
        }
        // If none of the above happened, do nothing
      } else if (absRotation === 1) {
        /*
           ───── ─────
          ▐  ☼  ▐     ▐
           ───── ─────
        */
        // Nothing can block this from happening
        this.setState({ rotation: rotation - 1 });
      } else if (absRotation === 2) {
        /*
           ─────
          ▐  ☼  ▐
           ─────
          ▐     ▐
           ─────
        */
        // If it has a wall to the right and nothing
        // to the left, move 1 to the left
        if (x >= Constants.COLUMNS - 1 && cellContent[finalY][x - 1] < 0) {
          this.setState({
            rotation: rotation - 1,
            position: [Constants.COLUMNS - 2, y]
          });
        // If it has a filled block to the right and
        // nothing to the left, move 1 to the left
        } else if (
          cellContent[finalY][x + 1] > -1 &&
          cellContent[finalY][x - 1] < 0
        ) {
          this.setState({
            rotation: rotation - 1,
            position: [x - 1, y]
          });
        // If it doesn't have anything to the right,
        // carry on with the rotation
        } else if (cellContent[finalY][x + 1] < 0 && x < Constants.COLUMNS - 1) {
          this.setState({ rotation: rotation - 1 });
        }
        // If none of the above happened, do nothing
      } else if (absRotation === 3) {
        /*
           ───── ─────
          ▐     ▐  ☼  ▐
           ───── ─────
        */
        // If touching the floor, move 1 up
        if (finalY >= Constants.ROWS - 1) {
          this.setState({
            rotation: rotation - 1,
            position: [x, Constants.ROWS - 2]
          });
        // If it has a filled block underneath, move 1 up
        } else if (cellContent[finalY + 1][x] > -1) {
          this.setState({
            rotation: rotation - 1,
            position: [x, y - 1]
          });
        // If none of the above happened, carry on
        // with the rotation
        } else {
          this.setState({ rotation: rotation - 1 });
        }
      }
    } catch(error) {}
  }

  rotateClockwise() {
    const { game: { cellContent } }      = this.props;
    const { position: [x, y], rotation } = this.state;
    const absRotation = this.getAbsRotation(rotation);
    const finalY = Math.ceil(y);

    // Try so that it doesn't throw an error
    // if it's outside of the screen.
    try {
      if (absRotation === 0) {
        /*
           ─────
          ▐     ▐
           ─────
          ▐  ☼  ▐
           ─────
        */
        // If it has a wall to the right and nothing
        // to the left, move 1 to the left
        if (x >= Constants.COLUMNS - 1 && cellContent[finalY][x - 1] < 0) {
          this.setState({
            rotation: rotation + 1,
            position: [Constants.COLUMNS - 2, y]
          });
        // If it has a filled block to the right and
        // nothing to the left, move 1 to the left
        } else if (
          cellContent[finalY][x + 1] > -1 &&
          cellContent[finalY][x - 1] < 0
        ) {
          this.setState({
            rotation: rotation + 1,
            position: [x - 1, y]
          });
        // If it doesn't have anything to the right,
        // carry on with the rotation
        } else if (cellContent[finalY][x + 1] < 0 && x < Constants.COLUMNS - 1) {
          this.setState({ rotation: rotation + 1 });
        }
        // If none of the above happened, do nothing
      } else if (absRotation === 1) {
        /*
           ───── ─────
          ▐  ☼  ▐     ▐
           ───── ─────
        */
        // If touching the floor, move 1 up
        if (finalY >= Constants.ROWS - 1) {
          this.setState({
            rotation: rotation + 1,
            position: [x, Constants.ROWS - 2]
          });
        // If it has a filled block underneath, move 1 up
        } else if (cellContent[finalY + 1][x] > -1) {
          this.setState({
            rotation: rotation + 1,
            position: [x, y - 1]
          });
        // If none of the above happened, carry on
        // with the rotation
        } else {
          this.setState({ rotation: rotation + 1 });
        }
      } else if (absRotation === 2) {
        /*
           ─────
          ▐  ☼  ▐
           ─────
          ▐     ▐
           ─────
        */
        // If it has a wall to the left and nothing
        // to the right, move 1 to the right
        if (x <= 0 && cellContent[finalY][x + 1] < 0) {
          this.setState({
            rotation: rotation + 1,
            position: [1, y]
          });
        // If it has a filled block to the left and
        // nothing to the right, move 1 to the right
        } else if (
          cellContent[finalY][x - 1] > -1 &&
          cellContent[finalY][x + 1] < 0
        ) {
          this.setState({
            rotation: rotation + 1,
            position: [x + 1, y]
          });
        // If it doesn't have anything to the right,
        // carry on with the rotation
        } else if (cellContent[finalY][x - 1] < 0 && x > 0) {
          this.setState({ rotation: rotation + 1 });
        }
        // If none of the above happened, do nothing
      } else if (absRotation === 3) {
        /*
           ───── ─────
          ▐     ▐  ☼  ▐
           ───── ─────
        */
        // Nothing can block this from happening
        this.setState({ rotation: rotation + 1 });
      }
    } catch(error) {}
  }

  moveLeft() {
    const { game: { cellContent } }      = this.props;
    const { position: [x, y], rotation } = this.state;
    const absRotation = this.getAbsRotation(rotation);
    const finalY = Math.ceil(y);

    // Surround everything with a "try" block
    // so that it doesn't throw an error if
    // it's outside of the screen.
    try {
      // Move if nothing is blocking on the left
      if (
        !(
          /*
             ─────
            ▐     ▐         ───── ─────
             ─────    or   ▐  ☼  ▐     ▐
            ▐  ☼  ▐         ───── ─────
             ─────
          */
          (absRotation === 0 || absRotation === 1) &&
          (x <= 0 || cellContent[finalY][x - 1] > -1)
        ) && !(
          /*
             ─────
            ▐  ☼  ▐
             ─────
            ▐     ▐
             ─────
          */
          absRotation === 2 &&
          (x <= 0 || cellContent[finalY + 1][x - 1] > -1)
        ) && !(
          /*
             ───── ─────
            ▐     ▐  ☼  ▐
             ───── ─────
          */
          absRotation === 3 &&
          (x <= 1 || cellContent[finalY][x - 2] > -1)
        )
      ) {
        this.setState({ position: [x - 1, y] });
      }
    } catch(error) {}
  }

  moveRight() {
    const { game: { cellContent } }      = this.props;
    const { position: [x, y], rotation } = this.state;
    const absRotation = this.getAbsRotation(rotation);
    const finalY = Math.ceil(y);

    // Surround everything with a "try" block
    // so that it doesn't throw an error if
    // it's outside of the screen.
    try {
      // Move if nothing is blocking on the right
      if (
        !(
          /*
             ─────
            ▐     ▐         ───── ─────
             ─────    or   ▐     ▐  ☼  ▐
            ▐  ☼  ▐         ───── ─────
             ─────
          */
          (absRotation === 0 || absRotation === 3) &&
          (x >= Constants.COLUMNS - 1 || cellContent[finalY][x + 1] > -1)
        ) && !(
          /*
             ─────
            ▐  ☼  ▐
             ─────
            ▐     ▐
             ─────
          */
          absRotation === 2 &&
          (x >= Constants.COLUMNS - 1 || cellContent[finalY + 1][x + 1] > -1)
        ) && !(
          /*
             ───── ─────
            ▐  ☼  ▐     ▐
             ───── ─────
          */
          absRotation === 1 &&
          (x >= Constants.COLUMNS - 2 || cellContent[finalY][x + 2] > -1)
        )
      ) {
        this.setState({ position: [x + 1, y] });
      }
    } catch(error) {}
  }

  placeCells() {
    const { game: { currentBlock, cellContent } } = this.props;
    const { position: [x, y], rotation }          = this.state;
    const absRotation = this.getAbsRotation(rotation);
    const finalY = Math.ceil(y);
    let firstX, firstY, secondX, secondY;

    // Getting the coordinates of the 2 cells
    // depending on the position and the rotation
    switch(absRotation) {
      case 1:
        /*
           ───── ─────
          ▐  ☼  ▐     ▐
           ───── ─────
        */
        let belowFilledYLeft = cellContent
                               .map(line => line[x])
                               .findIndex(color => color >= 0);

        let belowFilledYRight = cellContent
                                .map(line => line[x + 1])
                                .findIndex(color => color >= 0);

        firstX = x + 1;
        secondX = x;

        if (belowFilledYRight < 0) {
          firstY = Constants.ROWS - 1;
        } else if (belowFilledYRight === finalY + 2) {
          firstY = finalY + 1;
        } else {
          firstY = belowFilledYRight - 1;
        }

        if (belowFilledYLeft < 0) {
          secondY = Constants.ROWS - 1;
        } else if (belowFilledYLeft === finalY + 2) {
          secondY = finalY + 1;
        } else {
          secondY = belowFilledYLeft - 1;
        }

        break;
      case 2:
        /*
           ─────
          ▐  ☼  ▐
           ─────
          ▐     ▐
           ─────
        */
        let belowFilledY = cellContent
                           .map(line => line[x])
                           .findIndex(color => color >= 0);

        firstX = x;
        secondX = x;

        if (belowFilledY < 0) {
          firstY = Constants.ROWS - 1;
          secondY = Constants.ROWS - 2;
        } else if (belowFilledY === finalY + 2) {
          firstY = finalY + 1;
          secondY = finalY;
        } else {
          firstY = belowFilledY - 1;
          secondY = belowFilledY - 2;
        }

        break;
      case 3:
        /*
           ───── ─────
          ▐     ▐  ☼  ▐
           ───── ─────
        */
        belowFilledYLeft = cellContent
                           .map(line => line[x - 1])
                           .findIndex(color => color >= 0);

        belowFilledYRight = cellContent
                            .map(line => line[x])
                            .findIndex(color => color >= 0);

        firstX = x - 1;
        secondX = x;

        if (belowFilledYLeft < 0) {
          firstY = Constants.ROWS - 1;
        } else if (belowFilledYLeft === finalY + 2) {
          firstY = finalY + 1;
        } else {
          firstY = belowFilledYLeft - 1;
        }

        if (belowFilledYRight < 0) {
          secondY = Constants.ROWS - 1;
        } else if (belowFilledYRight === finalY + 2) {
          secondY = finalY + 1;
        } else {
          secondY = belowFilledYRight - 1;
        }
        break;
      default:
        /*
           ─────
          ▐     ▐
           ─────
          ▐  ☼  ▐
           ─────
        */
        belowFilledY = cellContent
                       .map(line => line[x])
                       .findIndex(color => color >= 0);

        firstX = x;
        secondX = x;

        if (belowFilledY < 0) {
          firstY = Constants.ROWS - 2;
          secondY = Constants.ROWS - 1;
        } else if (belowFilledY === finalY + 2) {
          firstY = finalY;
          secondY = finalY + 1;
        } else {
          firstY = belowFilledY - 2;
          secondY = belowFilledY - 1;
        }
    }

    // Placing both of the cells
    this.props.placeCells([{
      x: firstX,
      y: firstY,
      color: currentBlock[0]
    }, {
      x: secondX,
      y: secondY,
      color: currentBlock[1]
    }]);

    // Next block
    this.setState(INITIAL_STATE);
  }
}

const mapStateToProps = ({ game }) => {
  return { game };
}

Block = connect(mapStateToProps, { placeCells })(Block);

export default Block;
