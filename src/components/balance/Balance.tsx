import { FC } from 'react';
import { lang } from '../../utils/lang';
import { YOUR_0_BALANCE } from './Balance.lang';

export const Balance: FC<Balance.IBalance> = ({ balance, name, symbol }) =>
  <div>{lang(YOUR_0_BALANCE, name)} {balance} <abbr title={name}>{symbol}</abbr></div>;
