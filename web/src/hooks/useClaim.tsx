import { GenericSender } from 'contract_aptos';
import { useState } from 'react';
import { AuctionClient } from '../config/aptosClient';

export const useClaim: (id: number) => {
  hash: string,
  claimPrize: (func: GenericSender) => void,
  claimCoins: (func: GenericSender) => void,
  loading: boolean,
} = (id) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [hash, setHash] = useState<string>('');
  let running = false;

  function claimPrize(func: GenericSender) {
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

  function claimCoins(func: GenericSender) {
    if(running)
      return;

    setLoading(running = true);
    AuctionClient.claimCoins(func, id)
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