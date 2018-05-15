// would rather not make global, but is needed for current functionality
var Web3 = require("web3");
var web3;
var contractInstance;

window.addEventListener("load", function() {
    if (typeof web3 !== "undefined") {
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

  // Go back home if not registered
  contractInstance.isVoter(web3.eth.accounts[0], function(err, result) {
    if (result != null) {
      if (!result) {
        console.log("Not yet registered");
        window.location.replace("http://blockreferendum.com");
      }
    }
    else {
      console.log(err);
    }
  })

  // Track how many searches we have done
  var offset = 0;

  // Load in first set of bills
  getBillsJSON(offset);

  // If next clicked load in next set of bills
  $("#next").click(function(){
    //tab += 10;
    //if (tab % 20 == 0 && offset != 100) {
    //  offset += 20;
    //  tab = 0;
    //}
    // Disable buttons so they can't be clicked while loading
    offset += 20;
    $("#previous").attr("disabled", "disabled");
    $("#next").attr("disabled", "disabled");
    getBillsJSON(offset)
    if (offset == 100) {
      $("#next").attr("disabled", "disabled");
    }
    else {
      $("#next").removeAttr("disabled");
    }
    $("#previous").removeAttr("disabled");
  })

  // If previous clicked load in previous set of bills
  $("#previous").click(function(){
    offset -= 20;
    //tab -= 10;
    //if (tab % 20 == 0 && offset != 0) {
    //  offset -= 20;
    //  tab = 0;

    $("#previous").attr("disabled", "disabled");
    $("#next").attr("disabled", "disabled");
    getBillsJSON(offset);
    if (offset == 0) {
      $("#previous").attr("disabled", "disabled");
    }
    else {
      $("#previous").removeAttr("disabled", "disabled");
    }
    $("#next").removeAttr("disabled");
  })
})

function getBillsJSON(offset) {
  $.ajax({
    method: "GET",
    url: "https://api.propublica.org/congress/v1/115/both/bills/active.json?&offset=" + offset,
    beforeSend: function(request) {
      request.setRequestHeader("X-API-KEY", "JyJSd8WVYPOTK9Sl2AcIIAq1Trwm5k5w33qqSCvJ");
    },
    dataType: "json",
    statusCode: {
      0: function() {
        console.log("0");
      },
      200: function() {
        console.log("Code 200: successs");
      },
      400: function() {
        alert("Error 400: Bad request");
      },
      403: function() {
        alert("Error 403: No authorization header.");
      },
      404: function() {
        alert("Error 404: Not found");
      },
      406: function() {
        alert("Error 406: Requested non-json or xml format");
      },
      500: function() {
        alert("Error 500: API error, please try again later");
      },
      503: function() {
        alert("Error 503: API is down, please try again later");
      }
    },
    success: ifSuccess,
    error: function() {
      console.log("Something went wrong");
    }
  })
}

function ifSuccess(jsonReturn) {
  // Clear bills
  $("#bills").empty();
  var data = jsonReturn.results[0].bills;
  for(var i = 0; i < 20; i++) {
    // Add in bills for the page
    $("#bills").append("<div class='wide'><div class='box-shadow'><div class='card-header'><ul class='list-inline'><li  class='list-inline-item'><div class='name'><a href='http://www.blockreferendum.com/html/bill-data.html?bill=" +
                      data[i].bill_id + "'>" + "<h4 class='align-middle'>" +
                      data[i].number +
                      "</h4></a></div></li></ul></div>");
    $("#bills").append("<div class='card-body'><p>" + data[i].title + "</p></div></div></div><hr>");
  }
}
