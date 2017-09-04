pragma solidity ^0.4.10;

contract Dice {

  uint public previousRoll;
  uint public lastRoll;

  function Dice() {
    previousRoll = 1;
    lastRoll = 1;
  }

  function set(uint x) {
    previousRoll = lastRoll;
    lastRoll = x;
  }

  function getLastRoll() constant returns (uint) {
    return lastRoll;
  }

}