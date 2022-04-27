const HDWalletprovider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletprovider(
    'YOUR_MNEMONIC',
    'YOUR_INFURA_URL'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('account: ' + accounts[0]);
    const results = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: ['initial message']})
        .send({ from: accounts[0], gas: '1000000' });
    console.log('Contract deployed to: ' + results.options.address);
    provider.engine.stop();
};

deploy();
