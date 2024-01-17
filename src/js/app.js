App = {
    web3Provider: null,
    contracts: {},

    initWeb3: async function () {
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
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
        }
        web3 = new Web3(App.web3Provider);

        return App.initContract();
    },


    initContract: function () {
        $.getJSON('Roulette.json', function (data) {
            var RouletteArtifact = data;
            App.contracts.Roulette = TruffleContract(RouletteArtifact);
            App.contracts.Roulette.setProvider(App.web3Provider);
        });
        return App.GetMyNumber();
    },


    GetMyNumber: async function () {

        //aggiunto un reindirizzamento al contratto perché nella funzione non mi riesce a trovare il contratto
        var RouletteInstance;
        var bet = {
            address: null,
            uint: null,
            uint: null,
        }
        var itemInput = $('#testoInput');
        
        $.getJSON('Roulette.json', function (data) {
            var RouletteArtifact = data;
            App.contracts.Roulette = TruffleContract(RouletteArtifact);

            App.contracts.Roulette.setProvider(App.web3Provider);

            App.contracts.Roulette.deployed().then(async function (instance) {
                RouletteInstance = instance;

                const data = await RouletteInstance.getAllOnSale.call();

                App.bindEvents();
            }).catch(function (err) {
                console.log(err.message);
                //location.reload(true);
                App.bindEvents();
            });
        });
    },


    bindEvents: function () {
        $(document).on('click', '.btn-buy', App.buyDress);

        window.ethereum.on('accountsChanged', () => {
            window.location.reload();
        })

    },

   
};


$(function () {
    $(window).load(function () {

        App.initWeb3();
    });
});
