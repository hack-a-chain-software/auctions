import { Auction } from 'contract_aptos';
import { useEffect, useState } from 'react';
import { AuctionClient } from '../config/aptosClient';

export const useAuctions: () => {
  auctions: Auction[]
  loading: boolean,
} = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  let running = false;

  useEffect(() => {
    if(running)
      return;

    running = true;
    AuctionClient.getAllAuctionsLen()
      .then(amount => AuctionClient.getAllAuctions(0, amount))
      .then(setAuctions)
      .then(() => running = false)
    return () => setLoading(false);
  }, []);

  return { loading, auctions };
}