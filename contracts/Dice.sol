pragma solidity ^0.4.10;

contract Dice {

  uint public lastRoll;

  function Dice() {
    lastRoll = 1;
  }

  function set(uint x) {
    lastRoll = x;
  }

  function getLastRoll() constant returns (uint) {
    return lastRoll;
  }

}