const { Connection, Keypair, LAMPORTS_PER_SOL } = require("@solana/web3.js");
const { Contract, publicKeyToHex } = require("@solana/solidity");
const { readFileSync } = require("fs");

const MARUYEN_ABI = JSON.parse(readFileSync("./build/MaruYen.abi", "utf8"));
const BUNDLE_SO = readFileSync("./build/bundle.so");
const SECRET_KEY = JSON.parse(readFileSync("./id.json"));

const connectToSolana = (networkURL) => {
    return new Connection(networkURL, "confirmed");
};

const connectToLocalnet = () => {
    return connectToSolana("http://localhost:8899");
};

const connectToDevnet = () => {
    return connectToSolana("https://api.devnet.solana.com");
};

const airdropSol = async (connection, payer) => {
    while (true) {
        await connection.requestAirdrop(payer.publicKey, 1 * LAMPORTS_PER_SOL);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (await connection.getBalance(payer.publicKey)) break;
    }
};

const deployContract = async (params) => {
    const { connection, program, storage, abi, bundle, payer } = params;

    const contract = new Contract(
        connection,
        program.publicKey,
        storage.publicKey,
        abi,
        payer
    );

    await contract.load(program, bundle, payer);
    await contract.deploy("MaruYen", ['10000 * 10 **18'], program, storage, 4096 * 8);

    return contract;
};

const main = async (abi, bundle, secret) => {
    const deploymentParams = ((abi, bundle, secret) => {
        const payer = Keypair.fromSecretKey(new Uint8Array(secret));

        return ({
            connection: connectToDevnet(),
            program: Keypair.generate(),
            storage: Keypair.generate(),
            abi: abi,
            bundle: bundle,
            payer: payer,
            address: publicKeyToHex(payer.publicKey),
        });
    })(abi, bundle, secret);

    const { address, connection, payer } = deploymentParams;

    await airdropSol(connection, payer);

    const contract = await deployContract(deploymentParams);

    const symbol = await contract.symbol();
    const balance = await contract.balanceOf(address);

    console.log(`ERC20 contract for ${symbol} deployed!`);
    console.log(`Wallet at ${address} has a balance of ${balance}${symbol}.`);

};

main(MARUYEN_ABI, BUNDLE_SO, SECRET_KEY);