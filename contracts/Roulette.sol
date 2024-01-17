// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Roulette {
    uint betAmount;
    uint necessaryBalance;
    address payable owner;
    mapping(address => uint256) winnings;
    uint8[] payouts;
    uint8[] numberRange;

    struct Bet {
        address player;
        uint8 betType;
        uint8 number;
    }
    Bet[] public bets;

    constructor() payable {
        owner = payable(msg.sender);
        necessaryBalance = 0;
        payouts = [2, 3, 3, 2, 2, 36];
        numberRange = [1, 2, 2, 1, 1, 36];
        betAmount = 1 ether;
    }

    function getStatus() public view returns (uint) {
        return
            address(this).balance// roulette balance
        ;
    }

   // function addEther() public payable {}
   //cazz
   //okay

    function bet(uint8 number, uint8 betType) public payable {
        require(msg.value >= betAmount);
        require(betType >= 0 && betType <= 5); // 2
        require(number >= 0 && number <= numberRange[betType]);
        bets.push(Bet({betType: betType, player: msg.sender, number: number}));
        
    }
}