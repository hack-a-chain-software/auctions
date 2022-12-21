import { AuctionClient } from '../config/aptosClient';
import { NftItem } from 'contract_aptos';
import { message } from 'antd';
import { Address } from '@manahippo/aptos-wallet-adapter';
import { useState } from 'react';

const LIMIT = 24;

export const useOnAccountNFTs: () => {
  list: NftItem[],
  fetch: (address: Address, startAt: number) => void,
  loading: boolean,
  done: boolean
} = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<NftItem[]>([]);
  let running = false;
  let fetchedAll = false

  function fetch(address: Address, startAt: number) {
    if(running && fetchedAll)
      return;

    setLoading(running = true);
    AuctionClient.getNftsInWallet(address.toString(), startAt, LIMIT)
      .then(all => {
        setData([...data, ...all]);
        fetchedAll = data.length + all.length < startAt + LIMIT;
      })
      .then(() => running = false)
      .then(setLoading)
      .catch(error => {
        console.error(error);
        message.error("Unable to fetch the NFTs you have.").then();
        setLoading(running = false);
        return [];
      });
  }

  return { loading, list: data, fetch, done: fetchedAll };
}