const { Connection, Keypair, LAMPORTS_PER_SOL } = require("@solana/web3.js");
const { Contract, publicKeyToHex } = require("@solana/solidity");
const { readFileSync } = require("fs");
const yargs = require("yargs");

const MARUYEN_ABI = JSON.parse(readFileSync("./build/MaruYen.abi", "utf8"));
const BUNDLE_SO = readFileSync("./build/bundle.so");
const SECRET_KEY = JSON.parse(readFileSync("./id.json"));
const CONTRACT_NAME = "MaruYen";

const connect = (networkURL) => {
    return new Connection(networkURL, "confirmed");
};

const connectToLocalnet = () => {
    console.log("Connecting to Localnet");
    return connect("http://localhost:8899");
};

const connectToDevnet = () => {
    console.log("Connecting to Devnet");
    return connect("https://api.devnet.solana.com");
};

const connectToTestnet = () => {
    console.log("Connecting to Testnet");
    return connect("https://api.testnet.solana.com");
}

const airdropSol = async (connection, payer) => {
    console.log("Requesting airdrop");
    await connection.requestAirdrop(payer.publicKey, 1 * LAMPORTS_PER_SOL);
    console.log("Getting balance");
    const balance = await connection.getBalance(payer.publicKey);
    console.log(`Airdropped 1 SOL, ${payer.publicKey} balance: ${balance}`);
};

const deployContract = async (params) => {
    const { connection, name, program, storage, abi, bundle, payer } = params;

    const contract = new Contract(
        connection,
        program.publicKey,
        storage.publicKey,
        abi,
        payer
    );
    console.log("Loading contract");
    await contract.load(program, bundle, payer);
    console.log(`Deploying ${name} to ${program.publicKey}`);
    const result = await contract.deploy(name, [], program, storage, 4096 * 8);
    console.log("Contract deployed");
    console.log(result);

    return contract;
};

const main = async (connectionFun, abi, bundle, secret, name) => {
    const deploymentParams = ((connection, abi, bundle, secret, name) => {
        return ({
            connection: connection(),
            name: name,
            program: Keypair.generate(),
            storage: Keypair.generate(),
            abi: abi,
            bundle: bundle,
            payer: Keypair.fromSecretKey(new Uint8Array(secret)),
        });
    })(connectionFun, abi, bundle, secret, name);

    const { connection, payer, program, storage } = deploymentParams;

    console.log(`ProgramID: ${program.publicKey}`);
    console.log(`StorageID: ${storage.publicKey}`);

    await airdropSol(connection, payer);
    const contract = await deployContract(deploymentParams);
    console.log("Getting symbol");
    const symbol = await contract.symbol();
    console.log("Getting balance");
    const balance = await connection.getBalance(payer.publicKey);
    const contractBalance = await contract.balanceOf(publicKeyToHex(payer.publicKey));

    console.log(`ERC20 contract for ${symbol} deployed!`);
    console.log(`Wallet at ${payer.publicKey} has a balance of ${contractBalance}${symbol}.`);
    console.log(`Wallet at ${payer.publicKey} has a balance of ${balance}${symbol}.`);
};

let network = connectToLocalnet;
switch(yargs.argv.network) {
    case "dev":
        network = connectToDevnet;
        break;
    case "test":
        network = connectToTestnet;
        break;
    default:
        break;
}

main(network, MARUYEN_ABI, BUNDLE_SO, SECRET_KEY, CONTRACT_NAME);
