const { Connection, Keypair, LAMPORTS_PER_SOL, clusterApiUrl } = require("@solana/web3.js");
const { PublicKey } = require("@solana/web3.js/lib/index.cjs");
const { Contract, publicKeyToHex } = require("@solana/solidity");
const { readFileSync } = require("fs");
const yargs = require("yargs");

const MARUYEN_ABI = JSON.parse(readFileSync("./build/MaruYen.abi", "utf8"));
const SECRET_KEY = JSON.parse(readFileSync("./id.json"));

const connect = (network) => {
    let networkURL = "http://localhost:8899";

    switch(network) {
        case "dev":
            networkURL = clusterApiUrl("devnet");
            break;
        case "test":
            networkURL = clusterApiUrl("testnet");
            break;
        default:
            break;
    }

    return new Connection(networkURL, "confirmed");
};

const loadContract = async (params) => {
    const { connection, programID, storageID, abi, payer } = params;

    const contract = new Contract(
        connection,
        programID,
        storageID,
        abi,
        payer
    );

    return contract;
};

const main = async (network, abi, secret) => {
    const loadParams = ((network, abi, secretKey) => {
        return ({
            connection: connect(network),
            programID: "7uAdu912q4Y38XcAwPCGePTjRhhtmeiZrBTsQEmMbhDq",
            storageID: new PublicKey("FmdPYKuEUhNHfLpURQqfAFBBd7ztHjckso2Ds2cK2z1T"),
            abi: abi,
            payer: Keypair.fromSecretKey(new Uint8Array(secretKey)),
        });
    })(network, abi, secret);

    const { payer } = loadParams;

    const contract = await loadContract(loadParams);
    console.log("Getting symbol");
    const symbol = await contract.symbol();
    console.log("Getting balance");
    const contractBalance = await contract.balanceOf(publicKeyToHex(payer.publicKey));
    console.log(`Wallet at ${payer.publicKey} has a balance of ${contractBalance/10 ** 18}${symbol}.`);
};

main(yargs.argv.network, MARUYEN_ABI, SECRET_KEY);
