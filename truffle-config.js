require('dotenv').config();

const Web3 = require("web3");
const web3 = new Web3();
const WalletProvider = require("truffle-hdwallet-provider");
//const mnemonic = process.env["MNEMONIC"];
let mnemonic = // 12 words here
const provider = new WalletProvider(mnemonic, "https://ropsten.infura.io/v3/962d0a6080a947db9a0b5eb6c8cabcd9", 0, 4);

module.exports = {
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
    },
    ropsten: {
      provider: provider,
      network_id: "3",
    },
  }
};
