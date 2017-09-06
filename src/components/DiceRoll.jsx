import React from 'react';

class DiceRoll extends React.Component {

  render() {
    return(
      <div className="dice-roll">
        <div id="inner-dice">
          <div id="previous-roll">
            <p>Previous Roll</p>
            <img src={ this.props.previousImg } alt="previous roll"/>
          </div>
          <div id="this-roll">
            <p>This Roll</p>
            <img src={ this.props.thisImg } alt="this roll"/>
          </div>
        </div>
      </div>
    )
  }
}

export default DiceRoll;