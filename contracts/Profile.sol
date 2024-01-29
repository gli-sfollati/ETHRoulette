// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Profile {

    address payable creator;
    uint256 deposito = 1 * (1 ether);
    address myContract = address(this);

    
    //creazione del giocatore
    struct Player {
        string username;
        uint game; //totali partite giocate 
        uint maxWin; //massima vincita
        uint totalCashFlow; //totali dei soldi giocati
        uint cashInBank; //soldi depositati nel contratto
        address addPlayer;
        bool exist;
    }

    
    //struttura che tiene traccia delle info dei giocatori
    mapping (address => Player) public addToPlayer;
    //struttura che tiene traccia dell'esistenza dei giocatori
     mapping (address => bool) public indirizzoEsiste;

    constructor () payable{
        creator =payable(msg.sender);
    }

    event newPlayer(string, address, uint);
    event existingPlayer(string, address);





    //Serve a depositare del denaro
    function addEther() public payable returns(bool){
        require(msg.value > 0, "non puoi trasferire una quantita pari a 0");
        return true;
    }


    //restituisce lo stato generale del contratto
    function getStato() public view returns(uint, uint){
        return (address(this).balance / 1 ether, deposito);
    }

    function cashOut() public {
    //controllo che il giocartore abbia delle finanze 
    require(addToPlayer[msg.sender].cashInBank > 0, "non hai soldi da prelevare");
    
    //Controllo se ci sono abbastanza fondi per pagare 
    require(addToPlayer[msg.sender].cashInBank <= address(this).balance , "non si sono abbastanza fonsi nel contratto per pagarti");
    
    address payable player = payable(msg.sender); 

    player.transfer(addToPlayer[msg.sender].cashInBank * 1 ether);
    }


    function setUsername (string memory _username) public returns(string memory){
        require(addToPlayer[msg.sender].addPlayer == msg.sender, "L'indirizzo non esiste nel mapping o non combaciano");
        string memory nome = _username;
        addToPlayer[msg.sender].username = nome;
        return nome;
    }

    function getStatoUtente() public view returns(string memory, uint, uint, uint, uint, address ){
       
       //verifichiamo che il chiamante sia il diretto interessato. 
        require(addToPlayer[msg.sender].addPlayer == msg.sender, "L'indirizzo non esiste nel mapping o non combaciano");

        return (addToPlayer[msg.sender].username, 
        addToPlayer[msg.sender].game, 
        addToPlayer[msg.sender].maxWin,
        addToPlayer[msg.sender].totalCashFlow, 
        addToPlayer[msg.sender].cashInBank, 
        addToPlayer[msg.sender].addPlayer);
    }


    //restituisce  false se il giocatore già esiste 
    //restituisce true se il giocatore è stato creato correttamente
    function addPlayer(string memory _name) public returns(bool){
        
        //verifico che il giocatore non sia già un utente registrato
        require(addToPlayer[msg.sender].exist == false, "Giocatore gia registrato");
        
        //verifico che il nome non sia nullo
        require(bytes(_name).length > 0, "Nome inserito non valido");

        address p = msg.sender;

        Player memory giocatore = Player(_name, 0, 0, 0, 0, p, true);

        addToPlayer[p]=giocatore;

        emit newPlayer(_name, p , 0);
        return true;
        

        
    }



}