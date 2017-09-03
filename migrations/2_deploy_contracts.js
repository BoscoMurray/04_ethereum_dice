var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Dice = artifacts.require("./Dice.sol");


module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Dice);
};
