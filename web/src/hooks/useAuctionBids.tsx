import { Bid } from 'contract_aptos';
import { useState } from 'react';
import { AuctionClient } from '../config/aptosClient';

export const useAuctionBids: () => {
  bids: Bid[],
  fetch: (id: string) => void,
  loading: boolean,
} = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [bids, setBids] = useState<Bid[]>([]);
  let running = false;

  function fetch(id: string) {
    if(running)
      return;

    setLoading(running = true);
    AuctionClient.getBidsAuction(id)
      .then(setBids)
      .then(() => running = false)
      .then(setLoading)
      .catch(error => {
        console.error(error);
        setLoading(running = false);
      });
  }

  return { loading, bids, fetch };
}