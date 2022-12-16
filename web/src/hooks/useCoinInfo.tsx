import { AuctionClient } from '../config/aptosClient';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { CoinInfo } from 'contract_aptos';

export const useCoinInfo: (coin: string) => {
  loading: boolean,
  info: CoinInfo|null
} = (coin) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [info, setInfo] = useState<CoinInfo|null>(null);
  let running = false;

  useEffect(() => {
    if(running)
      return;

    running = true;
    AuctionClient.getCoinInfo(coin)
      .then(setInfo)
      .then(() => running = false)
      .catch(error => {
        console.error(error);
        message.error("Unable to fetch the coins list.").then();
        running = false;
        return null;
      });

    return () => setLoading(false);
  }, []);

  return { loading, info };
}