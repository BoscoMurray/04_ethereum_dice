import React from 'react';

class LetsRoll extends React.Component {

  render() {
    return(
      <div id="lets-roll">
        <div id='buttons'>
          <div id='higher'>
            <button value="higher" onClick={ this.props.rollDice }>Higher</button>
          </div>
          <div id='lower'>
            <button value="lower" onClick={ this.props.rollDice }>Lower</button>
          </div>
        </div>
        <p> {this.props.winOrLose} </p>
      </div>
    )
  }
}

export default LetsRoll;