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
  error: boolean,
} = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
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
      .then(setLoading)
      .catch(_ => setError(true));
  }

  function fetchOffers(address: Address) {
    if(running)
      return;

    setLoading(running = true);
    AuctionClient.getBidByUserAuctionsLen(address.toString())
      .then(amount => AuctionClient.getBidByUserAuctions(address.toString(), 0, amount))
      .then(setOffers)
      .then(() => running = false)
      .then(setLoading)
      .catch(_ => setError(true));
  }

  return { loading, created, offers, error, fetchOffers, fetchCreated };
}