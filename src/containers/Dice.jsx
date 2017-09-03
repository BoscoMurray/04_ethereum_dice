import React from 'react';
import DiceContract from '../../build/contracts/Dice.json'

import getWeb3 from './../utils/getWeb3';

class Dice extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      web3: null
      lastRoll: 0,
      playerFunds: 0,
      houseFunds: 0
    };
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
      const contract = require('truffle-contract')
      const dice = contract(DiceContract)
      dice.setProvider(this.state.web3.currentProvider)

      var diceInstance;

      this.state.web3.eth.getAccounts((error, accounts) => {
        dice.deployed().then((instance) => {
          diceInstance = instance
          return diceInstance.getLastRoll.call(accounts[0])
        }).then((result) => {
          return this.setState({ lastRoll: result.c[0] })
      });
    }
  }

  render() {
    return(
      <div className='Dice'>
        <h1>Smart-Dice</h1>
        <p>Last Roll: { this.state.lastRoll }</p>
        <p>House Funds: </p>
        <p>Player Funds: </p>
      </div>
    )
  }

}
