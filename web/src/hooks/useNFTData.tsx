import { TokenTypes } from 'aptos';
import { tokenClient } from '../config/aptosClient';
import { useEffect, useState } from 'react';

export const useNFTData: (creator: string, collection: string, name: string) => {
  data: TokenTypes.TokenData|null,
  loading: boolean
} = (creator, collection, name) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<TokenTypes.TokenData|null>(null);
  let running = false;

  useEffect(() => {
    if(running)
      return;

    running = true;
    tokenClient.getTokenData(creator, collection, name)
      .then(setData)
      .then(() => running = false)
      .catch(error => {
        console.error(error);
        running = false;
        return null;
      });

    return () => setLoading(false);
  }, []);

  return { loading, data };
}