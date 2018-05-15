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

  var billID = billSearch();
  // Store initial number of votes for bill to check against, will have to change later
  // as this will mess up if more people use site
  var currVotes;
  contractInstance.getVotes(billID, function(err, result) {
    if (result != null) {
      currVotes = result;
    }
    else {
      alert("Could not get current votes. Going back.");
      window.location.replace("http://www.blockreferendum.com/html/bills.html");
    }
  });

  // Check if transaction has passed every second
  setInterval(function() {
    contractInstance.getVotes(billID, function(err, result) {
      if (result != null) {
        if (result > currVotes) {
          console.log("Vote cast, going to bills");
          window.location.replace("http://www.blockreferendum.com/html/bills.html");
        }
        else {
          window.location.reload();
        }
      }
      else {
        alert("Could not get current votes. Going back.");
        window.location.replace("http://www.blockreferendum.com/html/bills.html");
      }
    });
  }, 1000)

});
