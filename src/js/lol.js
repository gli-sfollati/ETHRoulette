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
      $.getJSON('Roulette.json', function(data) {
        // Get the necessary contract artifact file and instantiate it with truffle-contract
        var RouletteArtifact = data;
        App.contracts.Roulette = TruffleContract(RouletteArtifact);
  
        // Set the provider for our contract
        App.contracts.Roulette.setProvider(App.web3Provider);
      });
      return App.GetStatus();
    },
  
    
    // GetStatus: function() {
    //   console.log("arrivo fin qui");
    //   var RouletteInstance;
    //   App.contracts.Roulette.deployed().then(function(instance) {
    //     roulettenstance = instance;
  
    //     return rouletteInstance.getStatus.call();
    //   }).then(function(int1,int2) {
    //     console.log(int1,int2);
    //     var text1 =$('#roulettetext');
    //   }).catch(function(err) {
    //     console.log(err.message);
    //   });
    // },
    GetStatus: async function () {

      //aggiunto un reindirizzamento al contratto perché nella funzione non mi riesce a trovare il contratto
      var RouletteInstance;

      $.getJSON('Roulette.json', function (data) {
          var RouletteArtifact = data;
          App.contracts.Roulette = TruffleContract(RouletteArtifact);

          App.contracts.Roulette.setProvider(App.web3Provider);

          App.contracts.Roulette.deployed().then(async function (instance) {
            console.log("sono dentro 1");
            RouletteInstance = instance;
            console.log("sono dentro 2");
              const data = RouletteInstance.getStatus.call();
              
              console.log("sono dentro 3");
              console.log("lo stato è: "+ data);
              return data;
          }).then(function (result) {
              console.log(result);
             
          });
      });
  },
    
  
  };
  
  $(function() {
    $(window).load(function() {
      App.initWeb3();
    });
  });