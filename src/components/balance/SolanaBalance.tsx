import { FC, useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { lamportsToSol, name, symbol } from '../../utils/solana';
import { Balance } from './Balance';

export const SolanaBalance: FC = () => {
  const [balance, setBalance] = useState(0);
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  useEffect(() => {
    publicKey &&
      connection.getBalance(publicKey)
        .then(b => setBalance(lamportsToSol(b)));
  }, [connection, publicKey]);

  return <Balance balance={balance} name={name} symbol={symbol} />;
};
