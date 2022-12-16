import { Bid } from 'contract_aptos';
import { useEffect, useState } from 'react';
import { AuctionClient } from '../config/aptosClient';

export const useAuctionBids: (id: string) => {
  bids: Bid[]
  loading: boolean,
} = (id) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [bids, setBids] = useState<Bid[]>([]);
  let running = false;

  useEffect(() => {
    if(running)
      return;

    running = true;
    AuctionClient.getBidsAuction(id)
      .then(setBids)
      .then(() => running = false)
      .then(() => console.debug(bids));
    return () => setLoading(false);
  }, []);

  return { loading, bids };
}