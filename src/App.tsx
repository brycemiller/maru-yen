import { FC } from 'react';
import { MaruYenBalance } from './components/balance/MaruYenBalance';
import { SolanaBalance } from './components/balance/SolanaBalance';
import { Wallet } from './components/wallet/Wallet';
import './App.css';

export const App: FC = () => (
  <Wallet>
    <SolanaBalance />
    <MaruYenBalance />
  </Wallet>
);

export default App;
