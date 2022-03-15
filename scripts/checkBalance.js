const { Keypair } = require("@solana/web3.js");
const { PublicKey } = require("@solana/web3.js/lib/index.cjs");
const { Contract, publicKeyToHex } = require("@solana/solidity");
const { connect, lowerBound } = require("./utils");
const { readFileSync } = require("fs");
const yargs = require("yargs");

const MARUYEN_ABI = JSON.parse(readFileSync("./build/MaruYen.abi", "utf8"));
const SECRET_KEY = JSON.parse(readFileSync("./id.json"));

const getContract = async (params) => {
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
            programID: "Gu545SJX88HpmKMQZxhbWCLDrjGC7N5gaApD2GTys4ZQ",
            storageID: new PublicKey("FHtdhVvcgu2BkJPF1Z4PLGXxBtkJKLk8TJkpjyrS1Bix"),
            abi: abi,
            payer: Keypair.fromSecretKey(new Uint8Array(secretKey)),
        });
    })(network, abi, secret);

    const { payer } = loadParams;

    const contract = await getContract(loadParams);

    const symbol = await contract.symbol();
    const decimals = await contract.decimals();
    const contractBalance = await contract.balanceOf(publicKeyToHex(payer.publicKey));

    console.log(`Wallet at ${payer.publicKey} has a balance of ${contractBalance/lowerBound(decimals)}${symbol}.`);
};

main(yargs.argv.network, MARUYEN_ABI, SECRET_KEY);
