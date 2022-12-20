import { AuctionClient } from '../config/aptosClient';
import { message } from 'antd';
import { useState } from 'react';
import { CoinInfo } from 'contract_aptos';

export const useCoinInfo: () => {
  loading: boolean,
  fetch: (coin: string) => void,
  info: CoinInfo|null
} = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [info, setInfo] = useState<CoinInfo|null>(null);
  let running = false;

  function fetch(coin: string) {
    if(running)
      return;

    setLoading(running = true);
    AuctionClient.getCoinInfo(coin)
      .then(setInfo)
      .then(() => running = false)
      .then(setLoading)
      .catch(error => {
        console.error(error);
        message.error("Unable to fetch the coins list.").then();
        setLoading(running = false);
        return null;
      });
  }

  return { loading, info, fetch };
}