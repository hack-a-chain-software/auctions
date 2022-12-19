import { AuctionClient } from '../config/aptosClient';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { CoinInfo } from 'contract_aptos';

export const useAvailableCoins: () => {
  loading: boolean,
  coins: (CoinInfo & { type: string })[],
} = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [coins, setCoins] = useState<(CoinInfo & { type: string })[]>([]);
  let running = false;

  useEffect(() => {
    if(running)
      return;

    running = true;
    AuctionClient.getAuthorizedCoins()
      .then(async coins => ({
        coins: await Promise.all(coins.map(
          coin => AuctionClient.getCoinInfo(coin))
        ),
        types: coins
      }))
      .then(({coins, types}) => coins.map(
          (coinInfo, key) => ({
            ...coinInfo,
            type: types[key]
          })
        ))
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