import { Types } from 'aptos';
import { AuctionClient, tokenClient } from '../config/aptosClient';
import { message } from 'antd';
import { useState } from 'react';
import { NftItem } from 'contract_aptos';

export const useCreateAuction: () => {
  create: (
    signAndSubmitTransaction: (payload: Types.TransactionPayload) => Promise<{ hash: Types.HexEncodedBytes }>,
    endTime: string,
    minSellingPrice: string,
    minIncrement: string,
    nft: NftItem,
    coinType: string
  ) => void,
  success: boolean,
  hash: string|null,
  loading: boolean
} = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [hash, setHash] = useState<string|null>(null);
  let running = false;

  function create(
    signAndSubmitTransaction: (payload: Types.TransactionPayload) => Promise<{ hash: Types.HexEncodedBytes }>,
    endTime: string,
    minSellingPrice: string,
    minIncrement: string,
    nft: NftItem,
    coinType: string
  ) {
    if(running)
      return;

    running = true;
    tokenClient.getToken(nft.creator, nft.collectionName, nft.name)
      .then(token => AuctionClient.createAuction(
        signAndSubmitTransaction,
        endTime,
        minSellingPrice,
        minIncrement,
        nft.creator,
        nft.collectionName,
        nft.name,
        token.id.property_version,
        coinType
      ))
      .then(setHash)
      .then(() => message.success('Your auction was successfully created!'))
      .then(setSuccess)
      .then(() => running = false)
      .then(setLoading)
      .catch(error => {
        console.error(error);
        message.error('Something went wrong.').then();
        setLoading(running = false);
        return false;
      });
  }

  return { create, loading, success, hash };
}