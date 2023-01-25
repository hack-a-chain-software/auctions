import { AuctionClient } from '../config/aptosClient';
import { NftCollection, NftItem } from 'contract_aptos';
import { message } from 'antd';
import { Address } from '@manahippo/aptos-wallet-adapter';
import { useState } from 'react';

const LIMIT = 24;

export const useAuthorizedCollections: () => {
    collections: Promise<NftCollection[]>,
} = () => {
    return { collections: AuctionClient.getAuthorizedNftCollections() };
}