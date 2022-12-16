import { useEffect, useState } from "react";
import { TokenTypes } from "aptos";
import { tokenClient } from "../config/aptosClient";

export const useNftDetails = (
  creator: string,
  collectionName: string,
  tokenName: string,
  propertyVersion?: string
) => {
  const [loadingNft, setLoadingNft] = useState<boolean>(true);
  const [tokenData, setTokenData] = useState<TokenTypes.TokenData | null>();

  useEffect(() => {
    const fetchTokenData = async () => {
      setTokenData(
        await tokenClient.getTokenData(creator, collectionName, tokenName)
      );
    };

    fetchTokenData();

    return () => setLoadingNft(false);
  }, []);

  return { loadingNft, tokenData };
};
