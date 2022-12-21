import { GenericSender } from 'contract_aptos';
import { useState } from 'react';
import { AuctionClient } from '../config/aptosClient';

export const useClaim: () => {
  hash: string,
  claimPrize: (func: GenericSender, id: number) => void,
  claimCoins: (func: GenericSender, coin: string, id: number) => void,
  loading: boolean,
} = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [hash, setHash] = useState<string>('');
  let running = false;

  function claimPrize(func: GenericSender, id: number) {
    if(running)
      return;

    setLoading(running = true);
    AuctionClient.claimPrize(func, id)
      .then(setHash)
      .then(() => running = false)
      .then(setLoading)
      .catch(error => {
        console.error(error);
        setLoading(running = false);
        return null;
      });
  }

  function claimCoins(func: GenericSender, coin: string, id: number) {
    if(running)
      return;

    setLoading(running = true);
    AuctionClient.claimCoins(func, coin, id)
      .then(setHash)
      .then(() => running = false)
      .then(setLoading)
      .catch(error => {
        console.error(error);
        setLoading(running = false);
        return null;
      });
  }

  return { loading, hash, claimPrize, claimCoins };
}