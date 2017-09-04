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
      thisRoll: 0,
      winOrLose: "Let's Start",
      playerAddress: "0x39ba05291564d3f184c8ec24042f19a13b5b7d72",
      playerBalance: 0,
      houseAddress: "0x90510cec7e77d80cd6f60804b3ca556935cbcc8d",
      houseBalance: 0
    };
    this.setThisRoll = this.setThisRoll.bind(this);
    this.rollDice = this.rollDice.bind(this);
    // this.pay = this.pay.bind(this);
    // this.compareResult = this.compareResult.bind(this);
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
        return diceInstance.getThisRoll.call(accounts[0])
      })
      .then((result) => {
        return this.setState({ thisRoll: result.c[0] })
      });
    })
  }

  getBalances() {
    this.state.web3.eth.getBalance(this.state.playerAddress, (error, result) => {
      if(!error) {
        const balance = this.state.web3.fromWei(result.c[0], 'kwei');
        return this.setState({ playerBalance: balance });
      } else {
        console.error(error);
      }
    })

    this.state.web3.eth.getBalance(this.state.houseAddress, (error, result) => {
      if(!error) {
        const balance = this.state.web3.fromWei(result.c[0], 'kwei');
        return this.setState({ houseBalance: balance });
      } else {
        console.error(error);
      }
    })
  }

  rollDice(event) {
    const guess = event.target.value;
    const result = Math.floor((Math.random() * 6) + 1);
    this.compareResult(guess, result);
    this.setThisRoll(result);
  }

  compareResult(guess, result) {
    const playerAddy = this.state.playerAddress;
    const contractAddy = this.state.contract.address;
    // const houseAddy = this.state.houseAddress;

    if ( (guess==="higher") && (result>this.state.thisRoll) ) {
      this.setState({ winOrLose: "Winner! You got paid!" }, () => {
        this.pay(playerAddy, contractAddy, 10)
      })
    } else if ( (guess==="lower") && (result<this.state.thisRoll) ) {
      this.setState({ winOrLose: "Winner! You got paid!" }, () => {
        this.pay(playerAddy, contractAddy, 10)
      })
    } else if (result===this.state.thisRoll) {
      this.setState({ winOrLose: "Same number rolled again! Sorry, you still lose!" }, () => {
        this.pay(playerAddy, contractAddy, 10)
      })
    } else {
      this.setState({ winOrLose: "Sorry...you lose." }, () => {
        this.pay(playerAddy, contractAddy, 10)
      })
    }
  }

  pay(payFrom, payTo, amount) {
    this.state.web3.eth.sendTransaction({from: payFrom, to: payTo, value: this.state.web3.toWei(amount, "ether")}, function(err, transactionHash) {
      if (!err) {
        console.log(transactionHash);
      }
    });
  }

  setThisRoll(result) {
    dice.setProvider(this.state.web3.currentProvider)

    dice.deployed()
    .then((instance) => {
      return this.state.contract.set(result)
    })
    .then((reply) => {
      console.log(reply)
      const thisRoll = this.state.thisRoll;
      this.setState({ previousRoll: thisRoll })
      this.setState({ thisRoll: result })
    })
    console.log(this.state.contract.address)

  }

  render() {
    return(
      <div className='Dice'>
        <h1>Smart-Dice</h1>
        <p>Previous Roll: { this.state.previousRoll }</p>
        <p>This Roll: { this.state.thisRoll }</p>
        <p>House Balance: { this.state.houseBalance }</p>
        <p>Player Balance: { this.state.playerBalance }</p>
        <br></br>
        <p> {this.state.winOrLose} </p>
        <button value="higher" onClick={ this.rollDice }>Higher</button>
        <button value="lower" onClick={ this.rollDice }>Lower</button>
      </div>
    )
  }

}

export default Dice