const { Connection, clusterApiUrl } = require("@solana/web3.js");

exports.connect = network => {
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

exports.lowerBound = (num, lowest) => num < lowest ? lowest : 1;