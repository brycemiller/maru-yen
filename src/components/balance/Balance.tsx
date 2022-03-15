import { FC } from 'react';
import { CURRENT_BALANCE } from './Balance.lang';

export const Balance: FC<Balance.IBalance> = ({ balance, symbol }) =>
  <div>{CURRENT_BALANCE} {balance} {symbol}</div>;
