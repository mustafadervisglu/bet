// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Bet {

    address public owner;
    uint256 public randomNumber;
    bool public win = true;

    mapping(address => uint) public bettorsAmounts;

    event Transfer(address indexed _from, address _to, uint amount);
    event BettorTransfer(address indexed _from, address _to, uint amount);
    constructor(){
        owner = msg.sender;
    }

    function resultBet(uint bettorNumber) external view returns (bool) {
        randomNumber = uint8(uint256(keccak256(
                abi.encodePacked(block.timestamp, block.difficulty))) % 94);

        if (bettorNumber < randomNumber && bettorNumber == randomNumber) {
            win = false;
        }
        return win;
    }

    function transfer(address bettor, uint amount) internal returns (bool){
        if (win) {
            emit BettorTransfer(msg.sender, bettor, amount);
        }else{
            emit Transfer(bettor,msg.sender,amount);
        }
        return true;
    }
}
