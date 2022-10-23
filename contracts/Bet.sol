// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Bet {

    address public owner;
    uint public randomNumber;


    mapping(address => uint) public bettorsAmounts;


    constructor() payable  {
        owner = payable(msg.sender);
    }
    event Lose(address indexed _from, address _to, uint amount);
    event Win(address indexed _from, address _to, uint amount);
    //function that calculates bet result;

    function resultBet(uint bettorNumber, uint amount, address payable bettorAddress) payable betRole(bettorNumber) external returns (bool) {

        uint totalAmount = xAmount(bettorNumber, amount);
        require(address(this).balance > totalAmount, "your balance must be greater than your bet");
        randomNumber = uint8(uint256(keccak256(
                abi.encodePacked(block.timestamp, block.difficulty))) % 100);

        if (bettorNumber > randomNumber) {
            (bool sent,) = payable(owner).call{value : totalAmount}("");
            // bool winBettor = bettorAddress.send(totalAmount) transfer bettor;
            emit Win(owner, bettorAddress, totalAmount);
            return sent;
        } else {
            (bool sent,) = bettorAddress.call{value : totalAmount}("");
            emit Lose(bettorAddress, owner, totalAmount);
            return sent;
        }

        // transfer contract

    }

    modifier betRole(uint bettorNumber) {
        require(bettorNumber < 97, "your number must be greater than 97");
        _;
    }
    // function that calculates how much money the user will earn;
    function xAmount(uint bettorNumber, uint bettorAmount) public pure returns (uint){
        return (((100 / (bettorNumber - 1)) - (100 - bettorNumber) / 100)) * bettorAmount;
    }

    receive() external payable {
    }
}
