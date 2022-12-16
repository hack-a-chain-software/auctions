import { TokenTypes } from 'aptos';
import { aptosClient, AuctionClient } from '../config/aptosClient';
import { message } from 'antd';
import { Address } from '@manahippo/aptos-wallet-adapter';
import { useState } from 'react';

export const useOnAccountNFTs: () => {
  list: TokenTypes.TokenDataId[],
  fetch: (address: Address) => void,
  loading: boolean
} = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<TokenTypes.TokenDataId[]>([]);
  let running = false;

  function fetch(address: Address) {
    if(running)
      return;

    running = true;
    useOnAccountNFTs(address)
      .then(setData)
      .then(() => running = false)
      .then(setLoading)
      .catch(error => {
        console.error(error);
        message.error("Unable to fetch the NFTs you have.").then();
        setLoading(running = false);
        return [];
      });
  }

  return { loading, list: data, fetch };

  async function useOnAccountNFTs(address: Address) {
    const collections = await AuctionClient.getAuthorizedNftCollections();

    // Get the amount of events (NFTs) the account has
    const amount = await aptosClient.getAccountResource(
      address,
      "0x1::aptos_token::Collections",
    );

    // Get the list of events (NFTs) the account has
    const onAccountNFTs = await aptosClient.getEventsByEventHandle(
      address,
      "0x1::aptos_token::Collections",
      "mint_token_events", {
        start: 0,
        limit: (amount.data as { counter: number }).counter
      }
    );

    return onAccountNFTs.filter(event => collections.reduce(
      (has: boolean, collection) => collection.collectionName === event.data.id.collection
        ? (collection.creator === event.data.id.creator
          ? true
          : has)
        : has,
      false
    )).map(event => event.data.id as TokenTypes.TokenDataId);
  }
}