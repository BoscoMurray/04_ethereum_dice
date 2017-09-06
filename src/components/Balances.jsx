import React from 'react';

class Balances extends React.Component {

  render() {
    return(
      <div id="balances">
        <div id="player-balance">
          <p>Your Ethereum</p>
          <p>{ this.props.playerBalance }</p>
        </div>
        <div id="house-balance">
          <p>House Ethereum</p>
          <p>{ this.props.houseBalance }</p>
        </div>
      </div>
    )
  }
}

export default Balances;