// SPDX-License-Identifier: MIT;
pragma solidity ^0.8.0;

contract Bet {

    address payable public owner;
    uint public randomNumber;
    uint256 public betId;
    uint256 public lastBetId;
    mapping(uint256 => Result) public results;

    struct Result{
        uint256 id;
        uint256 bet;
        uint256 amount;
        address payable player;
    }

    constructor() payable {
        owner = payable(msg.sender);
    }

    event Win(uint256 id, uint256 bet, uint256 randomNumber, uint256 amount, address player, uint256 time);
    event Lose(uint256 id, uint256 bet, uint256 randomNumber, uint256 amount, address player, uint256 time);
    event Received(address indexed _from, uint256 _amount);
    event Withdraw(address indexed _from, address _to, uint256 _amount);

    //function that generates random number;

    function randomNumberGenerator() internal returns(uint){
        randomNumber = uint8(uint256(keccak256(abi.encodePacked(block.timestamp,block.difficulty)))%100);
        this.resultBet(randomNumber);
        return randomNumber;
    }

    function roll(uint bettorNumber)public betRole(bettorNumber) payable returns(bool) {

        require(msg.value > 0, "Error, msg.value must be greater than 0");
        results[betId] = Result(betId, bettorNumber ,msg.value, payable(msg.sender));
        betId += 1;
        randomNumberGenerator();
        return true;
    }


    function resultBet(uint random) external payable returns (bool) {
        uint winAmount = 0;
        for (uint256 i = lastBetId; i < betId; i++) {
            if (random < results[i].bet) {
                // winAmount that calculates how much money the user will earn;
                winAmount = ((981000 / results[i].bet) * msg.value) / 10000;
                results[i].player.transfer(winAmount);
                emit Win(results[i].id, results[i].bet, randomNumber, winAmount,results[i].player, block.timestamp);
                break;
            }
            emit Lose(results[i].id, results[i].bet, randomNumber, winAmount, results[i].player, block.timestamp);
        }
        lastBetId = betId;
        return true;
    }


    function withdraw(uint amount) external onlyOwner payable {
        require(address(this).balance >= amount, "your amount must be equal contract balance or greater than contract balance");
        owner.transfer(amount);
        emit Withdraw(owner, address(this),amount);
    }

    modifier onlyOwner(){
        require(msg.sender == owner, "only owner");
        _;
    }

    modifier betRole(uint bettorNumber) {
        require(bettorNumber > 0, "your number must be greater than 0");
        require(bettorNumber < 97, "your number must be smaller than 97");
        _;
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
}
