import { Auction } from 'contract_aptos';
import { useState } from 'react';
import { AuctionClient } from '../config/aptosClient';
import { Address } from '@manahippo/aptos-wallet-adapter';

export const useMyAuctions: () => {
  created: Auction[],
  offers: Auction[],
  fetchCreated: (address: Address) => void,
  fetchOffers: (address: Address) => void,
  loading: boolean,
} = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [created, setCreated] = useState<Auction[]>([]);
  const [offers, setOffers] = useState<Auction[]>([]);
  let running = false;

  function fetchCreated(address: Address) {
    if(running)
      return;

    setLoading(running = true);
    AuctionClient.getCreatedByUserAuctionsLen(address.toString())
      .then(amount => AuctionClient.getCreatedByUserAuctions(address.toString(), 0, amount))
      .then(setCreated)
      .then(() => running = false)
      .then(setLoading);
  }

  function fetchOffers(address: Address) {
    if(running)
      return;

    setLoading(running = true);
    AuctionClient.getBidByUserAuctionsLen(address.toString())
      .then(amount => AuctionClient.getBidByUserAuctions(address.toString(), 0, amount))
      .then(setOffers)
      .then(() => running = false)
      .then(setLoading);
  }

  return { loading, created, offers, fetchOffers, fetchCreated };
}