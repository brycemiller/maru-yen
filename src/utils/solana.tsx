import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export const symbol = "SOL";

export const lamportsToSol = (lamports: number) => lamports / LAMPORTS_PER_SOL;
export const solToLamports = (sol: number) => sol * LAMPORTS_PER_SOL;
