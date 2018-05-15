function infoSearch(check) {
  var spot = check.indexOf("=");
  return check.substring(spot + 1);
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

  var billInfo = window.location.search.split("&");
  var voteInfo = infoSearch(billInfo[1]);
  var vote;
  if (voteInfo == "true"){
    vote = true;
  }
  else {
    vote = false;
  }

  // Load in billID
  var billID = infoSearch(billInfo[0]);

  var numVotes;

  // Find number of votes before passing in
  contractInstance.getVotes(billID, function(err, result) {
    if (result != null) {
      numVotes = result;
    }
    else {
      console.log("Failed to find number of votes");
      alert("Issue with getVotes function, redirecting");
      window.location.replace("http://www.blockreferendum.com/html/bill-data.html?bill=" + billID);
    }
  })

  if (vote) {
    contractInstance.castVote(billID, true, {gasPrice: 1e10}, function(err, result) {
      if (!err) {
        console.log("Voting");
        window.location.replace("http://blockreferendum.com/html/voting.html?bill=" + billID + "&num=" + numVotes);
      }
      else {
        alert("Voting failed, please try again");
        window.location.replace("http://www.blockreferendum.com/html/bill-data.html?bill=" + billID);;
      }
    });
  }
  else {
    contractInstance.castVote(billID, false, {gasPrice: 1e10}, function(err, result) {
      if (!err) {
        console.log("Voting");
        window.location.replace("http://blockreferendum.com/html/voting.html?bill=" + billID + "&" + numVotes);
      }
      else {
        alert("Voting failed, please try again");
        window.location.replace("http://www.blockreferendum.com/html/bill-data.html?bill=" + billID);;
      }
    });
  }
});
