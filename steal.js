#!/usr/bin/env node

const Web3 = require('web3');

let pk = process.argv[2];
let from = String(process.argv[3]);
let to = String(process.argv[4]);
let chain = String(process.argv[5]);

let chains = {
    'polygon': 'https://polygon-rpc.com',
    'polygon-test': 'https://rpc-mumbai.maticvigil.com/',
    'bsc': 'https://bsc-dataseed.binance.org/',
    'bsc-test': 'https://data-seed-prebsc-1-s1.binance.org:8545/',
};

console.log(
    {
        from: from,
        to: to,
    }
)

console.log('Current chain:', chains[chain]);

if (!chains.hasOwnProperty(chain)) {
    throw `Chain ${chain} does not exists`;
}

const provider = new Web3.providers.HttpProvider(chains[chain]);
const web3 = new Web3(provider);

function loop() {
    setTimeout(function() {
        web3.eth.getBalance(from).then(async (balance) => {
            if (balance > 0) {
                console.log(`Start transfer... ${balance}`);
                await sendToMe(from, balance, 21000, await web3.eth.getGasPrice());
                console.log('Finish...');
            }

            loop();
        });
    }, 150);
}

loop();

async function sendToMe(from, balance, gas, gasPrice) {
    let count = await web3.eth.getTransactionCount(from);

    let data = {
        to: to,
        from: from,
        value: web3.utils.toHex(balance-gasPrice*gas),
        gas: parseInt(gas),
        gasPrice: gasPrice,
        nonce: web3.utils.toHex(count)
    };

    console.log({
        to: to,
        from: from,
        value: balance-gasPrice*gas,
        gas: parseInt(gas),
        gasPrice: gasPrice,
        nonce: count
    });

    let createTransaction = await web3.eth.accounts.signTransaction(
        data,
        pk
    );

    const createReceipt = await web3.eth.sendSignedTransaction(
        createTransaction.rawTransaction
    );

    console.log(`Transaction successful with hash: ${createReceipt.transactionHash}`);
}
