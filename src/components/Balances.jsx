import React from 'react';

class Balances extends React.Component {

  render() {
    return(
      <div id="balances">
        <p>House Balance: { this.props.houseBalance }</p>
        <p>Player Balance: { this.props.playerBalance }</p>
      </div>
    )
  }
}

export default Balances;