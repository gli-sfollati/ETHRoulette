// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


contract Profile {

    uint256 deposito = 1 * (1 ether);
    address myContract = address(this);
    address payable creator;


    constructor () payable{
        creator =payable(msg.sender);


    }

    function someEther() public payable returns(bool){
        require(msg.value == deposito, "non sono stati versati abbastanza fondi");

        
        return true;
    }


    function getStato() public view returns(uint, uint ){
        
        return (address(this).balance / 1 ether, deposito);

    }

    function cashOut() public {
    address payable player = payable(msg.sender); 

    //Array di giocatori vincenti
    //uint256 amount = winnings[player];
    //require(amount > 0);
    //require(amount <= address(this).balance);
    //winnings[player] = 0;
    player.transfer(1 ether);
  }


}