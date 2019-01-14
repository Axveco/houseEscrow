var HouseEscrow = artifacts.require("./houseEscrow.sol");

var worthInWei = 10000 ;// TODO: fill in the worthInWei here
var objectDescription = "0xabc";// TODO: fill in the keccak256 hash of the objectDescription here


module.exports = function deployer(deployer, network, accounts) {
  let buyer = accounts[1];
  console.log(buyer)
  deployer.deploy(HouseEscrow, accounts[1], worthInWei, objectDescription)
}
