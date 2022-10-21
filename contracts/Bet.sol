// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Bet {

    address public owner;
    uint public randomNumber;
    bool public win = false;

    mapping(address => uint) public bettorsAmounts;

    event Lose(address indexed _from, address _to, uint amount);
    event Win(address indexed _from, address _to, uint amount);
    constructor(){
        owner = msg.sender;
    }

    function resultBet(uint bettorNumber) external view returns (bool) {
        require(bettorNumber < 97, "your number must be greater than 97");

        randomNumber = uint8(uint256(keccak256(
                abi.encodePacked(block.timestamp, block.difficulty))) % 100);

        if (bettorNumber < randomNumber && bettorNumber == randomNumber) {
            win = true;
        }
        return win;
    }

    function transfer(address bettor, uint amount, uint bettorNumber) internal returns (bool){
        uint totalAmount = xAmount(bettorNumber, amount);
        if (win) {
            emit Win(msg.sender, bettor, amount);
        } else {
            emit Lose(bettor, msg.sender, amount);
        }
        return true;
    }

    function xAmount(uint bettorNumber, uint bettorAmount) internal returns (uint){
        return ((100 / (bettorNumber - 1)) - ((100 - bettorNumber) / 100)) * bettorAmount;
    }
}
