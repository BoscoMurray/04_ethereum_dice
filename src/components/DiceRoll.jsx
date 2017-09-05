import React from 'react';

class DiceRoll extends React.Component {

  render() {
    console.log(this.props.previousImg)
    return(
      <div className="DiceRoll">
        <div id="previousRoll">
          <p>Previous Roll</p>
          <img src={ this.props.previousImg } alt="previous roll" height="40"/>
        </div>
        <div id="thisRoll">
          <p>This Roll</p>
          <img src={ this.props.thisImg } alt="this roll" height="120" />
        </div>
      </div>
    )
  }
}

export default DiceRoll;