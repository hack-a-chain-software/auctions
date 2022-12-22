import { Auction } from 'contract_aptos';
import { useState } from 'react';
import { AuctionClient } from '../config/aptosClient';
import { message } from 'antd';

export const useAuctions: () => {
  auctions: Auction[]
  fetch: () => void,
  loading: boolean,
} = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  let running = false;

  function fetch() {
    if(running)
      return;

    setLoading(running = true);
    AuctionClient.getAllAuctionsLen()
      .then(amount => AuctionClient.getAllAuctions(0, amount))
      .then(setAuctions)
      .then(() => running = false)
      .then(setLoading)
      .catch(error => {
        console.error(error);
        message.error("Unable to fetch the auctions.").then();
        setLoading(running = false);
      });
  }

  return { loading, auctions, fetch };
}