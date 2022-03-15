import { Contract } from '@solana/solidity';
import { clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js';
import { useMemo } from 'react';

const MARUYEN_ABI = require("../contracts/MaruYen.abi.json");
const SECRET_KEY = require( "../../id.json");

/* @TODO: Move strings to config file */
export const useContract = () => {
  return useMemo(() => {
    const { connection, programID, storageID, abi, payer } = {
        connection: new Connection(clusterApiUrl("testnet"), "confirmed"),
        programID: new PublicKey("Gu545SJX88HpmKMQZxhbWCLDrjGC7N5gaApD2GTys4ZQ"),
        storageID: new PublicKey("FHtdhVvcgu2BkJPF1Z4PLGXxBtkJKLk8TJkpjyrS1Bix"),
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
