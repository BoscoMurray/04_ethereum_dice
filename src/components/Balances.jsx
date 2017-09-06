import React from 'react';

class Balances extends React.Component {

  render() {
    return(
      <div id="balances">
        <p>House Balance: { this.props.houseBalance } Ethereum</p>
        <p>Player Balance: { this.props.playerBalance } Ethereum</p>
      </div>
    )
  }
}

export default Balances;