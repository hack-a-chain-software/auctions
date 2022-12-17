import { TokenTypes } from 'aptos';
import { aptosClient, AuctionClient, tokenClient } from '../config/aptosClient';
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

  //TODO Do some kind of cache to do not need to make 6 requests
  // for every single NFT AuctionHouse has available
  async function useOnAccountNFTs(address: Address) {
    // Get all the authorized collections on AuctionHouse
    const collections = await AuctionClient.getAuthorizedNftCollections()

    // Get the amount of events (NFTs) each collection has
    const counter = await Promise.all(
      collections.map(
        collection => aptosClient.getAccountResource(
          collection.creator,
          "0x3::token::Collections",
        ).then(({data}) => (data as {
          mint_token_events: {
            counter: number
          }
        }).mint_token_events.counter)
      )
    );

    // Fetch all events (NFTs) of all collections on AuctionHouse
    const events = await Promise.all(
      collections.map(
        (collection, key) => {
          const events = [];
          // limit of results is 25/request
          for(let start = 0; start < counter[key]; start += 25) {
            events.push(aptosClient.getEventsByEventHandle(
              collections[0].creator,
              "0x3::token::Collections",
              "mint_token_events",
              {
                start: start,
                limit: 25
              }
            ));
          }
          return events;
        }
      ).flat()
    ).then(list => list.flat());

    // Fetch if user is owner of each of the AuctionHouse NFTs
    const listOfNFTs = await Promise.all(
      events.map(
        ({data: { id: nft }}) => tokenClient.getToken(nft.creator, nft.collection, nft.name)
          .then(token => tokenClient.getTokenForAccount(address, token.id))
    ));

    // Filter only the AuctionHouse NFTs the user has and return only its TokenDataId
    return listOfNFTs
      .filter(nft => nft.amount === '1')
      .map(
        ({ id: { token_data_id: token }}) => token
      )
  }
}