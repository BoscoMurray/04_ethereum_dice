import React from 'react';

class LetsRoll extends React.Component {

  render() {
    return(
      <div id="lets-roll">
        <button value="higher" onClick={ this.props.rollDice }>Higher</button>
        <button value="lower" onClick={ this.props.rollDice }>Lower</button>
        <p> {this.props.winOrLose} </p>
      </div>
    )
  }
}

export default LetsRoll;