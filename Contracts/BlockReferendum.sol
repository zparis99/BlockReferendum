pragma solidity 0.4.23;

contract BlockVote {
    // Mapping between bill names and booleans to see if bill already exists
    // Cuts down on gas cost because no need to iterate through array
    mapping (bytes32 => bool) public bills;

    // Associative array for each bill
    mapping (bytes32 => uint256) public votesReceived;

    // Store number of votes for
    mapping (bytes32 => uint256) public votesFor;

    // Store number of votes votes against
    mapping (bytes32 => uint256) public votesAgainst;

    // Store all registered voters, again with mapping to cut down on gas
    mapping (address => bool) public voters;

    // Store person who starts contract as owner so they can kill contract if
    // necessary
    address owner;

    // Constructor
    constructor() public {
        owner = msg.sender;
    }

    // Used to end contract
    function kill() public {
        if (msg.sender == owner) selfdestruct(owner);
    }

    // Check if person is a registered voter
    function isVoter(address check) public constant returns(bool) {
        if (voters[check])
            return true;
        else
            return false;
    }

    // convert string to bytes32
    function toBytes32(string test) private pure returns(bytes32){
        return keccak256(test);
    }

    // Check if bill already exists
    function isBill(string bill_id) public constant returns(bool) {
        if (bills[toBytes32(bill_id)])
            return true;
        else
            return false;
    }

    // Create a new bill
    function newBill(string bill_id) public returns(bool){
        assert(!isBill(bill_id));
        bytes32 billID = toBytes32(bill_id);
        bills[billID] = true;
        votesReceived[billID] = 0;
        votesFor[billID] = 0;
        votesAgainst[billID] = 0;
        return true;
    }

    // Casts a user's vote
    function castVote(address voter, string bill_id, bool vote) public returns(bool){
        bytes32 billID = toBytes32(bill_id);
        assert(bills[billID]);
        assert(voters[voter]);
        if (vote)
            votesFor[billID]++;
        else
            votesAgainst[billID]++;
        votesReceived[billID]++;
        return true;
    }

    // Register voters
    function registerVoter(address voter) public returns(bool){
        assert(!isVoter(voter));
        voters[voter] = true;
        return true;
    }

    // Return number of votes cast for a bill
    function getVotes(string bill_id) public constant returns(uint256) {
        assert(isBill(bill_id));
        return votesReceived[toBytes32(bill_id)];
    }

    // Return number of votes cast for a function
    function getVotesFor(string bill_id) public constant returns(uint256) {
        assert(isBill(bill_id));
        return votesFor[toBytes32(bill_id)];
    }

    // Get votes against a bill
    function getVotesAgainst(string bill_id) public constant returns(uint256) {
        assert(isBill(bill_id));
        return votesAgainst[toBytes32(bill_id)];
    }

    // Remove a voter
    function removeVoter(address voter) public {
        voters[voter] = false;
    }
}
