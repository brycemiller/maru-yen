import { FC, useEffect, useState } from 'react';
import { publicKeyToHex } from '@solana/solidity';
import { useContract } from '../../hooks/hooks';
import { name, symbol } from '../../utils/maruyen';
import { Balance } from './Balance';
import { useWallet } from '@solana/wallet-adapter-react';

export const MaruYenBalance: FC = () => {
  const [balance, setBalance] = useState(0);
  const { publicKey } = useWallet();
  const { contract } = useContract();

  useEffect(() => publicKey &&
    contract.balanceOf(publicKeyToHex(publicKey))
      .then((b: any) => setBalance(b.toNumber()))
    , [contract, publicKey]
  );

  return <Balance balance={balance} name={name} symbol={symbol} />;
};
