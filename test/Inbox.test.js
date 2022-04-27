const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const { interface, bytecode } = require('../compile');

const web3 = new Web3(ganache.provider());

let accounts = [];
let inbox;
const INITIAL_MESSAGE = 'hello world'

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: [INITIAL_MESSAGE]})
        .send({ from: accounts[0], gas: 1000000 });
});

describe('Inbox', async () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () => {
        const message = await inbox.methods.getMessage().call();
        assert.equal(message, INITIAL_MESSAGE);
    });

    it('can change a message', async () => {
        const NEW_MESSAGE = 'new message';
        await inbox.methods.setMessage(NEW_MESSAGE)
            .send({ from: accounts[0], gas: 1000000 });
        const message = await inbox.methods.getMessage().call();  
        assert.equal(message, NEW_MESSAGE);
    });
});