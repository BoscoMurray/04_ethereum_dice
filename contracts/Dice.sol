pragma solidity ^0.4.10;

contract Dice {

  uint public previousRoll;
  uint public thisRoll;

  function Dice() {
    previousRoll = 1;
    thisRoll = 1;
  }

  function set(uint x) {
    previousRoll = thisRoll;
    thisRoll = x;
  }

  function getThisRoll() constant returns (uint) {
    return thisRoll;
  }

}