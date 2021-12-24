require('babel-register');
require('babel-polyfill');
var PrivateKeyProvider = require("truffle-privatekey-provider");
var privateKey = "81198fde271ef6a6c7942111ccdae3439e15106822007ea0ce82e53496fd54e2";

module.exports= {
    networks : {
        development: {
            host:'127.0.0.1',
            port:'7545',
            network_id:'*',
        },
        binance: {
            provider: () => new PrivateKeyProvider(privateKey, "https://data-seed-prebsc-1-s1.binance.org:8545/"),
            network_id: 97,      
        },
    },
    contracts_directory : './src/contracts',
    contracts_build_directory : './src/truffle_abis',
    compilers: {
        solc: {
            version: '^0.5.0',
            optimizer: {
                enabled : true,
                runs : 200
            },
        }
    }
}