import { Contract } from '@solana/solidity';
import { clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js';
import { useMemo } from 'react';
import config from "../../contract.config.json";

const MARUYEN_ABI = require("../contracts/MaruYen.abi.json");
const SECRET_KEY = require( "../../id.json");

export const useContract = () => {
  return useMemo(() => {
    const { connection, programID, storageID, abi, payer } = {
        connection: new Connection(clusterApiUrl("testnet"), "confirmed"),
        programID: new PublicKey(config.programID),
        storageID: new PublicKey(config.storageID),
        abi: MARUYEN_ABI,
        payer: Keypair.fromSecretKey(new Uint8Array(SECRET_KEY)),
    };

    const contract = new Contract(
      connection,
      programID,
      storageID,
      abi,
      payer
    );

    return { contract, payer };
  }, []);
};
