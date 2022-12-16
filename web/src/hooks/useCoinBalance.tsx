import { useEffect, useState } from "react";
import { CoinInfo } from "contract_aptos";
import { AuctionClient, coinClient } from "../config/aptosClient";

export const useCoinBalance = (user: string | null, coinType: string) => {
  const [loadingBalance, setLoadingBalance] = useState<boolean>(true);
  const [balance, setBalance] = useState<bigint>();
  const [coinInfo, setCoinInfo] = useState<CoinInfo>();

  useEffect(() => {
    const fetchBalance = async () => {
      if (!user) {
        setBalance(BigInt("0"));
      } else {
        setBalance(await coinClient.checkBalance(user, { coinType }));
      }
    };

    const fetchCoinInfo = async () => {
      const data = await AuctionClient.getCoinInfo(coinType);
      setCoinInfo(data);
    };
    fetchBalance();
    fetchCoinInfo();

    return () => setLoadingBalance(false);
  }, []);

  return { balance, loadingBalance, coinInfo };
};
