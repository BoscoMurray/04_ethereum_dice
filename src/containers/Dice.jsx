import React from 'react';
import DiceContract from '../../build/contracts/Dice.json'

import getWeb3 from './../utils/getWeb3';

class Dice extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      contract: null,
      lastRoll: 0,
      playerAddress: "0x39ba05291564d3f184c8ec24042f19a13b5b7d72",
      playerBalance: 0,
      houseAddress: "0x90510cec7e77d80cd6f60804b3ca556935cbcc8d",
      houseBalance: 0,
      lastResult: null
    };
    this.setLastRoll = this.setLastRoll.bind(this);
  }

  componentWillMount() {
    getWeb3
    .then(results => {
      results.web3.eth.defaultAccount = "0x68aa944b28982761c753e3b10d6a3d435e0f27c7"
      this.setState({
        web3: results.web3
      })
      this.instantiateContract()
      this.getBalances()
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
      dice.deployed()
      .then((instance) => {
        diceInstance = instance
        this.setState({ contract: diceInstance })
        return diceInstance.getLastRoll.call(accounts[0])
      })
      .then((result) => {
        return this.setState({ lastRoll: result.c[0] })
      });
    })
  }

  getBalances() {
    this.state.web3.eth.getBalance(this.state.playerAddress, function(error, result){
        if(!error)
            return this.setState({ playerBalance: result.c[0] });
        else
            console.error(error);
    }.bind(this))

    this.state.web3.eth.getBalance(this.state.houseAddress, function(error, result){
        if(!error)
            return this.setState({ houseBalance: result.c[0] });
        else
            console.error(error);
    }.bind(this))
  }

  setLastRoll(event) {
    event.persist();
    const contract = require('truffle-contract')
    const dice = contract(DiceContract)
    dice.setProvider(this.state.web3.currentProvider)
    var diceInstance;

    dice.deployed()
    .then((instance) => {
      diceInstance = instance;
      return diceInstance.set(event.target.value)
    })
    .then(() => {
      this.setState({ lastRoll: event.target.value })
    })
  }

  render() {
    return(
      <div className='Dice'>
        <h1>Smart-Dice</h1>
        <p>Last Roll: { this.state.lastRoll }</p>
        <p>House Balance: { this.state.playerBalance }</p>
        <p>Player Balance: { this.state.playerBalance }</p>
        <button value="1" onClick={ this.setLastRoll }>1</button>
        <button value="6" onClick={ this.setLastRoll }>6</button>
        <button value="higher" onClick={ this.setLastRoll }>Higher</button>
        <button value="lower" onClick={ this.setLastRoll }>Lower</button>
      </div>
    )
  }

}

export default Dice