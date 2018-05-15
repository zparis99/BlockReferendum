

var Web3 = require('web3');
var web3;
var contractInstance;

window.addEventListener('load', function() {
    // Checking if Web3 has been injected by the browser\
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        window.location.replace("http://www.blockreferendum.com");
    }
});

$(document).ready(function(){
  web3.eth.defaultAccount = web3.eth.accounts[0];
  console.log(web3.eth.accounts[0]);
  var MyContract = web3.eth.contract(abi);
  contractInstance = MyContract.at(contractAddress);

  contractInstance.isVoter(web3.eth.accounts[0], function(err, result) {
    if (!result) {
      window.location.replace("http://www.blockreferendum.com");
    }
  });

  // Get bill title from url, future fix
  var billInfo = billSearch().split("-");
  var billTitle = billInfo[0];
  var billID = billInfo[0] + "-" + billInfo[1];
  console.log(billID);


  console.log("Checking bill")
  contractInstance.isBill(billID, function(err, result) {
    console.log(result);
    if (result != null) {
      if (!result) {
        contractInstance.newBill(billID, {gasPrice: 1e10}, function(err, result) {
          if (!err) {
            console.log("Making bill");
            window.location.replace("http://blockreferendum.com/html/generating-bill.html?bill=" + billID);
          }

          else {
            alert("Could not generate bill, please try again");
            window.location.replace("http://blockreferendum.com/html/bills.html");
          }
        });
      }
    }
    else {
      alert("Could not generate bill, please try again");
      window.location.replace("http://blockreferendum.com/html/bills.html");
    }
  });


  // Load page
  getBillDataJSON(billTitle);

  var numVotes;

  // Find number of votes before passing in
  contractInstance.getVotes(billID, function(err, result) {
    if (result != null) {
      numVotes = result;
    }
    else {
      console.log("Failed to find number of votes");
      alert("Issue with getVotes function, redirecting");
      window.location.reload();
    }
  });

  // Enable/disable button based on check mark
  $("#verify-check").click(function() {
    $("#go-vote").attr("disabled", !$("#verify-check").prop("checked"));
  });


  // Open up voting when ready button clicked
  $("#go-vote").click(function() {
    $("#go-vote").attr("disabled", "disabled");
    $("#voting-list").append("<li class='list-inline-item float-right'><p>Scroll down to vote.</p></li>");
    $("#voting-options").append("<input class='form-check form-check-inline' id='yay' type='checkbox'><label for='yayclass='form-check-label'>Yay</label>" +
                                "<input class='form-check form-check-inline shift-right' type='checkbox' id='nay'><label for='nay' class='form-check-label shift-right'>Nay</label>")
    $("#vote-button").append("<button class='btn btn-warning' id='vote-final' disabled='disabled'>Vote</button>")
    // checkboxes for voting
    $("#yay").click(function() {
      if ($("#nay").prop("checked")) {
        $("#nay").prop("checked", false);
      }
      $("#vote-final").attr("disabled", !$("#yay").prop("checked"));
    })
    $("#nay").click(function() {
      if ($("#yay").prop("checked")) {
        $("#yay").prop("checked", false);
      }
      $("#vote-final").attr("disabled", !$("#nay").prop("checked"));
    })
    console.log(billID)

    // Find current number of votes

    // When they submit vote go to make sure bill exists then vote
    $("#vote-final").click(function() {
      if ($("#yay").prop("checked")) {
        if (confirm("Are you sure you want to vote YES on this bill")) {
            contractInstance.castVote(billID, true, {gasPrice: 1e10}, function(err, result) {
              if (!err) {
                console.log("Voting");
                window.location.replace("http://blockreferendum.com/html/voting.html?bill=" + billID + "&vote=" + numVotes);
              }
              else {
                alert("Voting failed, please try again");
                window.location.reload();
              }
            });
        }
      }

      else if ($("#nay").prop("checked")) {
        if (confirm("Are you sure you want to vote NO on this bill")) {
          $("#vote-final").click(function() {
            if ($("#nay").prop("checked")) {
              if (confirm("Are you sure you want to vote NO on this bill")) {
                  contractInstance.castVote(billID, false, {gasPrice: 1e10}, function(err, result) {
                    if (!err) {
                      console.log("Voting");
                      window.location.replace("http://blockreferendum.com/html/voting.html?bill=" + billID + "&vote=" + numVotes);
                    }
                    else {
                      alert("Voting failed, please try again");
                      window.location.reload();
                    }
                  });
                }
              }
          });
        }
      }
    });
  })
})

function getBillDataJSON(bill) {
  $.ajax({
    method: "GET",
    url: "https://api.propublica.org/congress/v1/115/bills/" + bill + ".json",
    beforeSend: function(request) {
      request.setRequestHeader("X-API-KEY", "JyJSd8WVYPOTK9Sl2AcIIAq1Trwm5k5w33qqSCvJ");
    },
    dataType: "json",
    statusCode: {
      0: function() {
        console.log("0");
      },
      withCredentials: function() {
        console.log("Hello");
      },
      200: function() {
        console.log("Code 200: successs");
      },
      400: function() {
        alert("Error 400: Bad request");
      },
      403: function() {
        alert("Error 403: Forbidden.");
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
  var data = jsonReturn.results[0];
  // Read all data into webpage
  $("head").append("<Title>" + data.number + "</title>");
  $("#header").append("<h1>" + data.number + "</h1>");
  // Title
  if (data.short_title != "")
    $("#title").append("<h3>Title</h3><hr class='white'><h6>" + data.short_title + "</h6>");

  // Primary Subject
  if (data.primary_subject != "")
    $("#primary-subject").append("<h3>Primary Subject</h3><hr class='white'><h6>" + data.primary_subject + "</h6>");

  // Total votes of bill
  contractInstance.getVotes(data.bill_id, function(err, result) {
    if (result != null) {
      $("#total-votes").append("<h3>Total Votes: </h3><hr class='white'<h6>" + result + "</h6>");
    }
    else {
      $("#total-votes").append("<h3>Total Votes: </h3><hr class='white'<h6>0</h6>");
    }
  });

  // Total votes for bill
  contractInstance.getVotesFor(data.bill_id, function(err, result) {
    if (result != null) {
      $("#votes-for").append("<h3>Total Votes For: </h3><hr class='white'<h6>" + result + "</h6>");
    }
    else {
      $("#votes-for").append("<h3>Total Votes For: </h3><hr class='white'<h6>0</h6>");
    }
  });

  // Total votes against the bill
  contractInstance.getVotesAgainst(data.bill_id, function(err, result) {
    if (result != null) {
      $("#votes-against").append("<h3>Total Votes Against: </h3><hr class='white'<h6>" + result + "</h6>");
    }
    else {
      $("#votes-against").append("<h3>Total Votes Against: </h3><hr class='white'<h6>0</h6>");
    }
  });

  // Purpose if title != short title
  if (data.short_title != data.title)
    $("#purpose").append("<h3>Purpose</h3><hr class='white'><h6>" + data.title + "</h6>");

  // Summary
  if (data.summary != "")
    $("#summary").append("<h3>Summary</h3><hr class='white'><h6>" + data.summary + "</h6>");

  // Sponsor
  if (data.sponsor_title != "" && data.sponsor != ""  && data.sponsor_party != "" && data.sponsor_state != "") {
    $("#sponsor").append("<h3>Sponsor</h3><hr class='white'><h6>" + data.sponsor_title + " " + data.sponsor + " "
                        + " " + data.sponsor_party + " " + data.sponsor_state + "</h6>");
  }

  // Introduced Date
  if (data.introduced_date != "")
    $("#data").append("<h3>Introduced Date</h3><hr class='white'><h6>" + data.introduced_date + "</h6>");

  // Committees
  if (data.committees != "")
    $("#committee").append("<h3>Committees Overseeing Bill</h3><hr class='white'><h6>" + data.committees + "</h6>")
  // Senate Passage
  if (data.senate_passage != null)
    $("#senate-passage").append("<h6>Passed Senate on " + data.senate_passage + "</h6>");
  else
    $("#senate-passage").append("<h6>Senate has not yet passed the bill</h6>");


  // House Passage
  if (data.house_passage != null)
    $("#house-passage").append("<h6>Passed House on " + data.house_passage + "</h6>");
  else
    $("#house-passage").append("<h6>House has not yet passed the bill</h6>");


  // Last Major Action
  if (data.latest_major_action != "" && data.latest_major_action_date != "") {
    $("#last-major-action").append("<h3>Last Major Action</h3><hr class='white'><h6>" + data.latest_major_action + " on " +
                                  data.latest_major_action_date + "</h6>");
  }

  // Bill Text
  if (data.billuri != "")
    $("#bill-url").append("<a class='white-text' href='" + data.congressdotgov_url + "/text'><h3 class='underline'>Full Bill Text</h3></a>")
}


// Only really useful in this specific case, should be more general but will come back to
// this later
function billSearch() {
  var searcher = window.location.search;
  var spot = searcher.indexOf("=");
  return searcher.substring(spot + 1);
}
