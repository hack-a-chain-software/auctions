import { AuctionClient } from '../config/aptosClient';
import { useEffect, useState } from 'react';

export const useIsAuthorized: (account: string) => {
  isAuthorized: boolean,
  loading: boolean
} = account => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  let running = false;

  useEffect(() => {
    if(running)
      return;

    running = true;
    AuctionClient.isUserAuthorized(account)
      .then(setIsAuthorized)
      .then(() => running = false)
      .catch(error => {
        console.error(error);
        return false;
      });

    return () => setLoading(false);
  }, []);

  return { loading, isAuthorized };
}