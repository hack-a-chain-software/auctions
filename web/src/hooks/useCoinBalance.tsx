import { useEffect, useState } from "react";
import { CoinInfo } from "contract_aptos";
import { AuctionClient, coinClient } from "../config/aptosClient";
import Big from "big.js";

export const useCoinBalance = (user: string, coinType: string) => {
  const [loadingBalance, setLoadingBalance] = useState<boolean>(true);
  const [balance, setBalance] = useState<Big>();
  const [coinInfo, setCoinInfo] = useState<CoinInfo>();

  useEffect(() => {
    const fetchBalance = async () => {
      coinClient
        .checkBalance(user, { coinType })
        .then((res) => setBalance(new Big(String(res))))
        .catch(() => setBalance(new Big("0")));
    };

    const fetchCoinInfo = async () => {
      const data = await AuctionClient.getCoinInfo(coinType);
      setCoinInfo(data);
    };
    fetchBalance();
    fetchCoinInfo();

    return () => setLoadingBalance(false);
  }, [user]);

  return { balance, loadingBalance, coinInfo };
};
