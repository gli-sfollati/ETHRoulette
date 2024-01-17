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
  
        // Use our contract to retrieve and mark the adopted pets
        return App.GetStatus();
      });
  
      return App.GetStatus();
    },
  
    
    GetStatus: function(adopters, account) {
      var rouletteInstance;
  
      App.contracts.Roulette.deployed().then(function(instance) {
        roulettenstance = instance;
  
        return rouletteInstance.getStatus.call();
      }).then(function(int1,int2) {
        console.log(int1,int2);
        var text1 =$('#roulettetext');
      }).catch(function(err) {
        console.log(err.message);
      });
    },
  
    
  
  };
  
  $(function() {
    $(window).load(function() {
      App.initWeb3();
    });
  });