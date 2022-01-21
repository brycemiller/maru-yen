const { Keypair, LAMPORTS_PER_SOL } = require("@solana/web3.js");
const { Contract, publicKeyToHex } = require("@solana/solidity");
const { connect, lowerBound } = require("./utils");
const { readFileSync } = require("fs");
const yargs = require("yargs");

const MARUYEN_ABI = JSON.parse(readFileSync("./build/MaruYen.abi", "utf8"));
const BUNDLE_SO = readFileSync("./build/bundle.so");
const SECRET_KEY = JSON.parse(readFileSync("./id.json"));
const CONTRACT_NAME = "MaruYen";

const airdropSol = async (connection, payer) => {
    console.log("Requesting airdrop");
    await connection.requestAirdrop(payer.publicKey, 1 * LAMPORTS_PER_SOL);
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

    return contract;
};

const main = async (network, abi, bundle, secretKey, contractName) => {
    const deploymentParams = ((network, abi, bundle, secretKey, contractName) => {
        return ({
            connection: connect(network),
            name: contractName,
            program: Keypair.generate(),
            storage: Keypair.generate(),
            abi: abi,
            bundle: bundle,
            payer: Keypair.fromSecretKey(new Uint8Array(secretKey)),
        });
    })(network, abi, bundle, secretKey, contractName);

    const { connection, payer, program, storage } = deploymentParams;

    console.log(`ProgramID: ${program.publicKey}`);
    console.log(`Program Private Key: ${program.secretKey}`);
    console.log(`StorageID: ${storage.publicKey}`);
    console.log(`Storage Private Key: ${storage.secretKey}`);

    await airdropSol(connection, payer);
    const contract = await deployContract(deploymentParams);
    
    const symbol = await contract.symbol();
    const decimals = await contract.decimals();
    const balance = await connection.getBalance(payer.publicKey);
    const contractBalance = await contract.balanceOf(publicKeyToHex(payer.publicKey));

    console.log(`ERC20 contract for ${symbol} deployed!`);
    console.log(`Wallet at ${payer.publicKey} has a balance of ${contractBalance/lowerBound(decimals)}${symbol}.`);
    console.log(`Wallet at ${payer.publicKey} has a balance of ${balance}SOL.`);
    console.log("Contract:", contract);
};

main(yargs.argv.network, MARUYEN_ABI, BUNDLE_SO, SECRET_KEY, CONTRACT_NAME);
