const Tx = require("ethereumjs-tx").Transaction;
const Common = require("ethereumjs-common");
const Web3 = require("web3");
// const web3 = new Web3('https://rpc.ankr.com/fantom_testnet')
const web3 = new Web3("https://rpc.testnet.fantom.network/");
web3.eth.net.isListening().then(console.log);
web3.eth.net.getNetworkType().then(console.log);
const account = "your_account_address";
const privateKey = Buffer.from(
    "your_private_key",
    "hex"
);

const contract_address = "your_contract_address";
const election_abi = [
    {
        inputs: [
            {
                internalType: "string",
                name: "_did",
                type: "string",
            },
            {
                internalType: "string",
                name: "_wallet_hash",
                type: "string",
            },
        ],
        name: "addWallet",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "_did",
                type: "string",
            },
        ],
        name: "getWallet",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        name: "Wallet",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];

const Contract = new web3.eth.Contract(election_abi, contract_address);
Contract.methods.getWallet("5ea709fbee05a9dd9e649af5f7d3ff03aac99ff5b28c5c15dffa9ff86e76244e").call((error, result) => {console.log("Result:",result)})

web3.eth.getTransactionCount(account, (error, txCount) => {
    const data = Contract.methods
        .addWallet(
            "5ea709fbee05a9dd9e649af5f7d3ff03aac99ff5b28c5c15dffa9ff86e76244e",
            "QmUzuQeTqfM2yq3MrhSrNjqYCD4cKFhQdF52HtfqiCCxQF"
        )
        .encodeABI();

    // build a transaction object
    const txObject = {
        nonce: web3.utils.toHex(txCount),
        to: contract_address,
        gasLimit: web3.utils.toHex(50000),
        gasPrice: web3.utils.toHex(web3.utils.toWei("10", "gwei")),
        data: data,
    };

    // console.log(data);

    // sign traction with private key of sender
    const common = Common.default.forCustomChain(
        "mainnet",
        {
            name: "ftm",
            networkId: 4002,
            chainId: 4002,
        },
        "petersburg"
    );

    const tx = new Tx(txObject, { common });
    tx.sign(privateKey);

    // serialize the transaction
    const serializedTransaction = tx.serialize();
    const raw = "0x" + serializedTransaction.toString("hex");

    // broadcast transaction to the network
    web3.eth.sendSignedTransaction(raw, (error, txHash) => {
        console.log(error);
        console.log("Result:", txHash);
    });
});
