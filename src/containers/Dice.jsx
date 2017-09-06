import React from 'react';
import DiceContract from '../../build/contracts/Dice.json';
import DiceRoll from '../components/DiceRoll.jsx';
import Balances from '../components/Balances.jsx';
import LetsRoll from '../components/LetsRoll.jsx';

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
      previousImg: null,
      thisRoll: 0,
      thisImg: null,
      winOrLose: "Let's Roll - Guess Higher or Lower",
      playerAddress: "0x39ba05291564d3f184c8ec24042f19a13b5b7d72",
      playerBalance: 0,
      houseAddress: "0x90510cec7e77d80cd6f60804b3ca556935cbcc8d",
      houseBalance: 0
    };
    this.setThisRoll = this.setThisRoll.bind(this);
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
        return diceInstance.getThisRoll.call()
      })
      .then((result) => {
        this.setDiceImages(result.c[0], "this")
        this.setState({ thisRoll: result.c[0] })
      })
      .then(() => {
        return diceInstance.getPreviousRoll.call()
      })
      .then((result) => {
        this.setDiceImages(result.c[0], "previous")
        this.setState({ previousRoll: result.c[0] })
      });
    })
  }

  getBalances() {
    this.state.web3.eth.getBalance(this.state.playerAddress, (error, result) => {
      if(!error) {
        const balance = this.state.web3.fromWei(result.c[0], 'kwei')/10;
        this.setState({ playerBalance: Math.floor(balance) });
      } else {
        console.error(error);
      }
    })

    this.state.web3.eth.getBalance(this.state.houseAddress, (error, result) => {
      if(!error) {
        const balance = this.state.web3.fromWei(result.c[0], 'kwei')/10;
        this.setState({ houseBalance: Math.floor(balance) });
      } else {
        console.error(error);
      }
    })
  }

  rollDice(event) {
    const guess = event.target.value;
    const result = Math.floor((Math.random() * 6) + 1);
    this.setThisRoll(result);
    this.compareResult(guess, result);
  }

  compareResult(guess, result) {
    const playerAddy = this.state.playerAddress;
    const houseAddy = this.state.houseAddress;

    if ( (guess==="higher") && (result>this.state.thisRoll) ) {
      this.setState({ winOrLose: "Alright. We've got a winner!" }, () => {
        this.pay(houseAddy, playerAddy, 2)
      })
    } else if ( (guess==="lower") && (result<this.state.thisRoll) ) {
      this.setState({ winOrLose: "Nice...you win." }, () => {
        this.pay(houseAddy, playerAddy, 2)
      })
    } else if (result===this.state.thisRoll) {
      this.setState({ winOrLose: "Same again! House wins." }, () => {
        this.pay(playerAddy, houseAddy, 1)
      })
    } else {
      this.setState({ winOrLose: "Sorry...you lose." }, () => {
        this.pay(playerAddy, houseAddy, 1)
      })
    }
  }

  pay(payFrom, payTo, amount) {
    const number = this.state.web3.toWei(amount, "ether") 

    this.state.web3.eth.sendTransaction({from: payFrom, to: payTo, value: number}, (err, transactionHash) => {
      if (!err) {
        console.log("Transaction Hash: " + transactionHash)
        this.getBalances()
      } else {
        console.log(err)
      }
    })
  }

  setThisRoll(roll) {
    dice.setProvider(this.state.web3.currentProvider)

    dice.deployed()
    .then((instance) => {
      this.state.contract.set(roll)
    })
    .then(() => {
      console.log("Set ThisRoll in the contract: " + roll)
      return this.state.contract.getThisRoll.call();
    })
    .then((result) => {
      console.log(result)
      this.setDiceImages(result.c[0], "this")
      this.setState({ thisRoll: result.c[0] })
    })
    .then(() => {
      return this.state.contract.getPreviousRoll.call();
    })
    .then((result) => {
      this.setDiceImages(result.c[0], "previous")
      this.setState({ previousRoll: result.c[0] })
    })
  }

  setDiceImages(number, whichDice) {
    let location = "images/Dice" + number +".gif";

    if (whichDice === "this") {
      this.setState({ thisImg: location })
    } else {
      this.setState({ previousImg: location })
    }
  }

  render() {
    return(
      <div className='dice'>
        <div id='background'>
          <img id="backgroundImg" src="images/diceBackground.gif" alt="background dice"/>
        </div>
        <DiceRoll 
          previousRoll={ this.state.previousRoll } 
          previousImg={ this.state.previousImg } 
          thisRoll={ this.state.thisRoll } 
          thisImg={ this.state.thisImg } >
        </DiceRoll>
        <LetsRoll 
          winOrLose={ this.state.winOrLose } 
          rollDice={ this.rollDice } >
        </LetsRoll>
        <Balances
          houseBalance={ this.state.houseBalance } 
          playerBalance={ this.state.playerBalance } >
        </Balances>
      </div>
    )
  }

}

export default Dice