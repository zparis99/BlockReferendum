var Web3 = require('web3');
var web3;

window.addEventListener('load', function() {
    // Checking if Web3 has been injected by the browser\
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        web3 = new Web3(web3.currentProvider);
    } else {
        console.log("failed")
    }
});

$(document).ready(function() {
  if (typeof web3 !== "undefined") {
    console.log("Already using web3 provider like metamask go straight to voting booth");
    // Make a new web3 instance to see if they are already registered
    web3.eth.defaultAccount = web3.eth.accounts[0];
    console.log(web3.eth.accounts[0]);
    var MyContract = web3.eth.contract(abi);
    var contractInstance = MyContract.at(contractAddress);
    contractInstance.isVoter(web3.eth.accounts[0], function(err, result) {
      if (result != null) {
        if(result)
          $("#enter-voting").append("<form action='http://www.blockreferendum.com/html/bills.html'><button class='btn btn-default'>Enter the Voting Booth</button></form>");
        else {
          $("#enter-voting").append("<form action='http://www.blockreferendum.com/html/register.html'><button class='btn btn-default'>Enter the Voting Booth</button></form>");
        }
      }
      else {
        console.log(error);
      }
    })
  }
  else {
    $("#enter-voting").append("<form action='register.html'><button class='btn btn-default' disabled='disabled'>Enter the Voting Booth</button></form>");
    $("#enter-voting").append("<p class='white-text'>It appears that you do not have access to an ethereum account yet.</p>");
    $("#enter-voting").append("<p class='white-text'>Please scroll to the bottom of the page and check out the \"Getting Started\" section to start voting.</p>");
  }
})
