import { useEffect, useState } from "react";
import { coinClient } from "../config/aptosClient";

export const useCoinBalance = (user: string, coinType: string) => {
  const [balance, setBalance] = useState<bigint>();

  useEffect(() => {
    const fetchBalance = async () => {
      setBalance(await coinClient.checkBalance(user, { coinType }));
    };

    fetchBalance();
  }, []);

  return { balance };
};
