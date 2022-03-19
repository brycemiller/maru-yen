import { FC, useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import {
  WalletDisconnectButton,
  WalletModalProvider,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { clusterApiUrl } from '@solana/web3.js';

import '@solana/wallet-adapter-react-ui/styles.css';

export const Wallet: FC = ({ children }) => {
  const network = WalletAdapterNetwork.Testnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() =>  [new SolflareWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
                <WalletMultiButton />
                <WalletDisconnectButton />
                { children }
            </WalletModalProvider>
        </WalletProvider>
    </ConnectionProvider>
  );
};
