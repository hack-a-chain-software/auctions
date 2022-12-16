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
  const [tokenProperties, setTokenProperties] = useState<any>({});

  useEffect(() => {
    const fetchTokenData = async () => {
      setTokenData(
        await tokenClient.getTokenData(creator, collectionName, tokenName)
      );
      const { token_properties } = await tokenClient.getToken(
        creator,
        collectionName,
        tokenName,
        propertyVersion
      );
      setTokenProperties(token_properties);
    };

    fetchTokenData();

    return () => setLoadingNft(false);
  }, []);

  return { loadingNft, tokenData, tokenProperties };
};
