import $ from "jquery";

import {
  default as Web3
} from 'web3';

import contract_artifacts from '../../build/contracts/houseEscrow.json';

console.log(contract_artifacts)

window.App = {
  Backend: {

    enumerateStatus: {
      0: "Respite",
      1: "Finished",
      2: "Dispute",
      3: "Cancelled"
    },

    translateStatusToDescription: function(status) {
      return App.Backend.enumerateStatus[status]

    },

    getAccountZero: async function() {
      return web3.eth.getAccounts(async function(err, accounts) {
        if (err != null) {
          alert("There was an error fetching your accounts.");
          return;
        } else if (accounts.length == 0) {
          alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
          return;
        } else {
          return accounts[0];
        }
      })
    },

    getContractABI: function() {
      return contract_artifacts.abi
    },

    getContractAddress: function() {
      return contract_artifacts.networks[App.web3Provider.networkVersion].address
    },

    getContractInstance: async function() {
        let abi = App.Backend.getContractABI()
        let address = App.Backend.getContractAddress()
        return new web3.eth.Contract(abi, address)
    },

    getMyContractStatus: async function() {
      return await App.Contract.methods.mySaleStatus().call()

    },

    getMyRole: async function() {
      if(App.CurrentAccount == await App.Contract.methods.seller().call()) {
        return "Seller"
      } else if(App.CurrentAccount == await App.Contract.methods.buyer().call()) {
        return "Buyer"
      } else if(App.CurrentAccount == await App.Contract.methods.notary().call()) {
        return "Notary"
      } else if(App.CurrentAccount == await App.Contract.methods.mortgagor().call()) {
        return "Mortgagor"
      } else if(App.CurrentAccount == await App.Contracts.methods.landRegistry().call()) {
        return "LandRegistry"
      }
    },

    start: async function() {
      if (window.ethereum) {
        App.web3Provider = window.ethereum;
        try {
          // Request account access
          await window.ethereum.enable();
        } catch (error) {
          // User denied account access...
          console.error("User denied account access")
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = window.web3.currentProvider;
      }
      // If no injected web3 instance is detected, fall back to Ganache
      else {
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      }
      web3 = new Web3(App.web3Provider);

      App.Contract = await App.Backend.getContractInstance()
      App.Contract.setProvider(App.web3Provider)
      App.CurrentAccount = await App.Backend.getAccountZero()
      App.Interface.setMyCurrentAccount(App.CurrentAccount)
      App.Interface.setMyRole(await App.Backend.getMyRole())
      App.Interface.setContractAddress(App.Contract._address)
      App.Interface.setContractStatus(App.Backend.translateStatusToDescription(await App.Backend.getMyContractStatus()))
    },
  },

  Interface: {
    setContractAddress: function(contractAddress) {
      $("#contractAddress").html(contractAddress)
    },

    setContractStatus: function(contractStatus) {
      $("#contractStatus").html(contractStatus)
    },

    setMyCurrentAccount: function(currentAccount) {
      $("#currentAccount").html(currentAccount)
    },

    setMyRole: function(role) {
      $("#myRole").html(role)
    }
  }
}

$(function() {
  App.Backend.start()
})
