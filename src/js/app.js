App = {
    web3Provider: null,
    contracts: {},

  
    initWeb3: async function() {
      // Modern dapp browsers...
      if (window.ethereum) {
        App.web3Provider = window.ethereum;
        try {
          // Request account access
          await window.ethereum.enable();
        } catch (error) {
          // User denied account access...
          console.error("User denied account access")
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = window.web3.currentProvider;
      }
      // If no injected web3 instance is detected, fall back to Ganache
      else {
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      }
      web3 = new Web3(App.web3Provider);
  
      return App.initContract();
    },
  
    initContract: function() {
      $.getJSON('Profile.json', function(data) {
        // Get the necessary contract artifact file and instantiate it with truffle-contract
        var ProfileArtifact = data;
        App.contracts.Profile = TruffleContract(ProfileArtifact);
  
        // Set the provider for our contract
        App.contracts.Profile.setProvider(App.web3Provider);
  
        // Use our contract to retrieve and mark the adopted pets
        //return App.GetStatus();
      });
      return App.GetStatus();
    },

    bindEvents: function() {
      $(document).on('click', '.btn-deposit', App.Deposita);
      $(document).on('click', '.btn-preleva', App.CashOut);

      window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      })

    },
  
    
    GetStatus:async  function() {
      var profileInstance;
      var dato1 = document.getElementById("dato1");
      $.getJSON('Profile.json', function (data) {
          var ProfileArtifact = data;
          App.contracts.Profile = TruffleContract(ProfileArtifact);

          App.contracts.Profile.setProvider(App.web3Provider);

          App.contracts.Profile.deployed().then(async function (instance) {

            profileInstance = instance;
              var data =await profileInstance.getStato.call();
              dato1.value=data[0];
              console.log("soldi totali ether: "+data[0]+" il prezzo è: "+ data[1]);
              return data;
          }).then(function (result) {
              
          });
      });
      
      return App.bindEvents();
    },


    Deposita: function(event){
      var _id = parseInt($(event.target).data('id'));
      var accounts = ethereum.request({ method: 'eth_accounts' });
      console.log(accounts);
      event.preventDefault();
      
      var profileInstance;
      $.getJSON('Profile.json', function (data) {
          var ProfileArtifact = data;
          App.contracts.Profile = TruffleContract(ProfileArtifact);
          App.contracts.Profile.setProvider(App.web3Provider);

          App.contracts.Profile.deployed().then(async function (instance) {
            profileInstance = instance;

            var accounts = await ethereum.request({ method: 'eth_accounts' });

            var price =await profileInstance.getStato.call();
            var prezzo = price[1].toNumber();
            console.log("prima di some ether"+ prezzo, accounts);
            await profileInstance.addEther({ from: accounts[0], value: prezzo });
            

          }).then(function (result ) {     
            console.log(result);
            location.reload(true);
            window.location = "http://localhost:3000/index.html";
          });
      });
      
      return App.GetStatus();
    },


    CashOut: function(event){

      var accounts = ethereum.request({ method: 'eth_accounts' });
      console.log(accounts);
      event.preventDefault();
      
      var profileInstance;
      $.getJSON('Profile.json', function (data) {
          var ProfileArtifact = data;
          App.contracts.Profile = TruffleContract(ProfileArtifact);
          App.contracts.Profile.setProvider(App.web3Provider);

          App.contracts.Profile.deployed().then(async function (instance) {
            profileInstance = instance;

            var accounts = await ethereum.request({ method: 'eth_accounts' });

            await profileInstance.cashOut({from: accounts[0]});
            

          }).then(function (result ) {     
            console.log("cashout eseguito");
            location.reload(true);
            window.location = "http://localhost:3000/index.html";
          });
      });
      
      return App.GetStatus();
    }


  
  };
  
  $(function() {
    $(window).load(function() {
      App.initWeb3();
    });
  });