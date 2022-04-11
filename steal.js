#!/usr/bin/env node

const Web3 = require('web3');

let pk = process.argv[2];
let from = String(process.argv[3]);
let to = String(process.argv[4]);

console.log(
    {
        pk: pk,
        from: from,
        to: to,
    }
)

const provider = new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/');
// const provider = new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');//test
const web3 = new Web3(provider);

function loop() {
    setTimeout(function() {
        web3.eth.getBalance(from).then(async (balance) => {
            console.log(balance);

            if (balance > 0) {
                console.log('Start...');
                await sendToMe(from, balance, 21000, 10000000000);
                console.log('Finish...');
            }

            loop();
        });
    }, 150);
}

loop();

async function sendToMe(from, balance, gas, gasPrice) {
    let count = await web3.eth.getTransactionCount(from);

    console.log(from, count);

    let data = {
        to: to,
        from: from,
        value: web3.utils.toHex(balance-gasPrice*gas),
        gas: parseInt(gas),
        gasPrice: gasPrice,
        gasLimit: parseInt(gas),
        nonce: web3.utils.toHex(count)
    };

    console.log(data);
    console.log({
        to: to,
        from: from,
        value: balance-gasPrice*gas,
        gas: parseInt(gas),
        gasPrice: gasPrice,
        gasLimit: parseInt(gas),
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
