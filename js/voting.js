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
  // Store initial number of votes for bill to check against, will have to change later
  // as this will mess up if more people use site
  var billID = infoSearch(billInfo[0]);
  var currVotes = infoSearch(billInfo[1]);

  // Check if transaction has passed every second
  setInterval(function() {
    contractInstance.getVotes(billID, function(err, result) {
      if (result != null) {
        if (result > currVotes) {
          console.log("Vote cast, going to bills");
          window.location.replace("http://www.blockreferendum.com/html/bill-data.html?bill=" + billID);
        }
        else {
          window.location.reload();
        }
      }
      else {
        alert("Could not get current votes. Going back.");
        window.location.replace("http://www.blockreferendum.com/html/bills.html?bill=" + billID);
      }
    });
  }, 1000)

});
