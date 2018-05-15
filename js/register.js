// Function to check whether str is all numerical
function isNumber(str){
  return !/\d+$/.test(str);
}

var Web3 = require('web3');
var web3;

window.addEventListener('load', function() {
    // Checking if Web3 has been injected by the browser\
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        web3 = new Web3(web3.currentProvider);
    } else {
        window.location.replace("http://www.blockreferendum.com");
    }
});

$(document).ready(function(){
  web3.eth.defaultAccount = web3.eth.accounts[0];
  console.log(web3.eth.accounts[0]);
  var MyContract = web3.eth.contract(abi);
  var contractInstance = MyContract.at(contractAddress);

  contractInstance.isVoter(web3.eth.accounts[0], function(err, result) {
    if (result != null) {
      if (result) {
        window.location.replace("http://www.blockreferendum.com/html/bills.html");
      }
    }
    else {
      console.log(err);
    }
  })

  $("input").keyup(function(){
    var disable = false;
    if($.trim($("#name").val()).length == 0) {
      disable = true;
    }
    else if($.trim($("#number").val()).length != 7 || isNumber($.trim($("#number").val()))){
      disable = true;
    }

    if(disable == false) {
      $("#register").removeAttr("disabled");
    }

    else {
      $("#register").attr("disabled", "disabled");
    }
  })

  $("#register").click(function(){
    contractInstance.registerVoter(web3.eth.accounts[0], {gasPrice: 1e10}, function(err, result) {
      if(!err) {
        console.log("Sucess");
        // Change page
        window.location.replace("http://blockreferendum.com/html/registering.html");
      }
      else {
        console.log("Failure");
        alert("Failed to register. Try again please.");
        window.location.reload();
      }
    });
  })
})
