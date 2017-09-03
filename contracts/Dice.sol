pragma solidity ^0.4.10;

contract Dice {

  uint public lastRoll;

  function set(uint x) {
    storedData = x;
  }

  function get() constant returns (uint) {
    return lastRoll;
  }

}