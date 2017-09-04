import React from 'react';
import DiceContract from '../../build/contracts/Dice.json'

import getWeb3 from './../utils/getWeb3';

let contract = require('truffle-contract')
let dice = contract(DiceContract)

class Dice extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      contract: null,
      previousRoll: 0,
      lastRoll: 0,
      playerAddress: "0x39ba05291564d3f184c8ec24042f19a13b5b7d72",
      playerBalance: 0,
      houseAddress: "0x90510cec7e77d80cd6f60804b3ca556935cbcc8d",
      houseBalance: 0,
      lastResult: null
    };
    this.setLastRoll = this.setLastRoll.bind(this);
    this.rollDice = this.rollDice.bind(this);
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
    this.state.web3.eth.getBalance(this.state.playerAddress, (error, result) => {
        if(!error)
            return this.setState({ playerBalance: result.c[0] });
        else
            console.error(error);
    })

    this.state.web3.eth.getBalance(this.state.houseAddress, (error, result) => {
        if(!error)
            return this.setState({ houseBalance: result.c[0] });
        else
            console.error(error);
    })
  }

  rollDice(event) {
    const guess = event.target.value;
    const result = Math.floor((Math.random() * 6) + 1);
    this.compareResult(guess, result);
    this.setLastRoll(result);
  }

  compareResult(guess, result) {
    if ( (guess==="higher") && (result>this.state.lastRoll) ) {
      return true
    } else if ( (guess==="lower") && (result<this.state.lastRoll) ) {
      return true
    } else {
      return false
    }
  }

  payWinner(winner) {

  }

  setLastRoll(result) {
    dice.setProvider(this.state.web3.currentProvider)

    dice.deployed()
    .then((instance) => {
      return this.state.contract.set(result)
    })
    .then(() => {
      this.setState({ lastRoll: result })
    })
  }

  render() {
    return(
      <div className='Dice'>
        <h1>Smart-Dice</h1>
        <p>Last Roll: { this.state.lastRoll }</p>
        <p>House Balance: { this.state.playerBalance }</p>
        <p>Player Balance: { this.state.playerBalance }</p>
        <button value="higher" onClick={ this.rollDice }>Higher</button>
        <button value="lower" onClick={ this.rollDice }>Lower</button>
      </div>
    )
  }

}

export default Dice