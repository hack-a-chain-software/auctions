import { AuctionClient } from '../config/aptosClient';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { CoinInfo } from 'contract_aptos';

export const useAvailableCoins: () => {
  loading: boolean,
  coins: CoinInfo[]
} = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [coins, setCoins] = useState<CoinInfo[]>([]);
  let running = false;

  useEffect(() => {
    if(running)
      return;

    running = true;
    AuctionClient.getAuthorizedCoins()
      .then(coins => Promise.all(coins.map(AuctionClient.getCoinInfo.bind(AuctionClient))))
      .then(setCoins)
      .then(() => running = false)
      .catch(error => {
        console.error(error);
        message.error("Unable to fetch the coins list.").then();
        running = false;
        return [];
      });

    return () => setLoading(false);
  }, []);

  return { loading, coins };
}