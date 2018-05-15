function billSearch() {
  var searcher = window.location.search;
  var spot = searcher.indexOf("=");
  return searcher.substring(spot + 1);
}

window.addEventListener('load', function() {
    // Checking if Web3 has been injected by the browser\
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        web3 = new Web3(web3.currentProvider);
    } else {
        window.location.reload();
    }
});

$(document).ready(function(){
  web3.eth.defaultAccount = web3.eth.accounts[0];
  console.log(web3.eth.accounts[0]);
  var MyContract = web3.eth.contract(abi);
  var contractInstance = MyContract.at(contractAddress);

  var billInfo = billSearch().split("-");
  var vote;
  if (billInfo[0] == "true"){
    vote = true;
  }
  else {
    vote = false;
  }

  var billID = billInfo[1] + "-" + billInfo[2];

  contractInstance.castVote(web3.eth.accounts[0], billID, vote, {gasPrice: 1e10}, function(err, result) {
    if (!err) {
      console.log("Casting ballot");
      window.location.replace("http://www.blockreferendum.com/html/voting.html?bill=" + billID);
    }
    else {
      alert("Unable to cast ballot. Going back to bills");
      window.location.replace("http://www.blockreferendum.com/html/bills.html");
    }
  });
});
