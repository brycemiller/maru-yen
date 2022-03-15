import { FC, useEffect, useState } from 'react';
import { publicKeyToHex } from '@solana/solidity';
import { useContract } from '../../hooks/hooks';
import { symbol } from '../../utils/maruyen';
import { Balance } from './Balance';

export const MaruYenBalance: FC = () => {
  /* @TODO Refactor to use Wallet's connection and public key */
  const [balance, setBalance] = useState(0);
  const { contract, payer } = useContract();

  useEffect(() => payer.publicKey &&
    contract.balanceOf(publicKeyToHex(payer.publicKey))
      .then((b: any) => setBalance(b.toNumber()))
    , [contract, payer.publicKey]
  );

  return <Balance balance={balance} symbol={symbol} />;
};
