import { Types, TokenTypes, AptosClient, AptosAccount } from 'aptos';
import { Client as urqlClient } from '@urql/core';
export type NftCollection = {
    creator: string;
    collectionName: string;
};
export type NftItem = {
    creator: string;
    collectionName: string;
    name: string;
    propertyVersion: number;
};
export type Auction = {
    id: number;
    creator: string;
    startTime: string;
    endTime: string;
    auctionCoin: string;
    minSellingPrice: string;
    minIncrement: string;
    currentBid: string;
    currentBidder: string;
    lockedTokenId: TokenTypes.TokenId;
    coinsClaimed: boolean;
    tokenClaimed: boolean;
};
export type Bid = {
    id: string;
    timestamp: string;
    bid: string;
    account: string;
};
export type CoinInfo = {
    name: string;
    symbol: string;
    decimals: number;
    supply: any;
};
export type SignAndSendFunction = (payload: Types.TransactionPayload) => Promise<{
    hash: Types.HexEncodedBytes;
}>;
/** This type is either the AptosAccount type from
 *  aptos typescript SDK or a function that takes a
 *  transaction payload, signs it and sends the transaction
 *  to the blockchain, returning the transaction hash.
 *  In the hippospace aptos-wallet-adapter, this is
 *  the signAndSubmitTransaction method.
 */
export type GenericSender = AptosAccount | SignAndSendFunction;
interface TransactionParameters {
    sender: GenericSender;
    functionName: string;
    typeArguments: Array<any>;
    regularArguments: Array<any>;
}
export declare class AuctionHouseClient extends AptosClient {
    auctionHouseAddress: string;
    contractAddress: string;
    contractModule: string;
    graphqlClient: urqlClient | null;
    constructor(node_url: string, graqphqlUrl: string | null, moduleAddress: string, auctionHouseAddress: string);
    /** Initialize new instance of AuctionHouse */
    initializeAuctionHouse(sender: GenericSender, owner: string, restrictUsersCreateAuctions: boolean): Promise<string>;
    /** Creates a new auction inside auctionhouse by locking an NFT */
    createAuction(sender: GenericSender, endTime: string, minSellingPrice: string, minIncrement: string, creator: string, collectionName: string, name: string, propertyVersion: string, coinType: string): Promise<string>;
    /** Bids on auction of passed id using coinType */
    bid(sender: GenericSender, id: string, bid: string, coinType: string): Promise<string>;
    /** After auction is over, highest bidder can claim the nft prize */
    claimPrize(sender: GenericSender, id: number): Promise<string>;
    /** After auction is over, creator can claim coins bid */
    claimCoins(sender: GenericSender, coinType: string, id: number): Promise<string>;
    addAuthorizedUser(sender: GenericSender, user: string): Promise<string>;
    removeAuthorizedUser(sender: GenericSender, user: string): Promise<string>;
    addAuthorizedCollection(sender: GenericSender, collection: NftCollection): Promise<string>;
    removeAuthorizedCollection(sender: GenericSender, collection: NftCollection): Promise<string>;
    addAuthorizedCoin(sender: GenericSender, coinType: string): Promise<string>;
    removeAuthorizedCoin(sender: GenericSender, coinType: string): Promise<string>;
    isUserAuthorized(user: string): Promise<boolean>;
    getAuthorizedCoins(): Promise<Array<string>>;
    getAuthorizedNftCollections(): Promise<Array<NftCollection>>;
    getBidsAuction(auctionId: string): Promise<Array<Bid>>;
    getAllAuctionsLen(): Promise<number>;
    getAllAuctions(start: number, limit: number): Promise<Array<Auction>>;
    getCreatedByUserAuctionsLen(user: string): Promise<number>;
    getCreatedByUserAuctions(user: string, start: number, limit: number): Promise<Array<Auction>>;
    getBidByUserAuctionsLen(user: string): Promise<number>;
    getBidByUserAuctions(user: string, start: number, limit: number): Promise<Array<Auction>>;
    getCoinInfo(coinType: string): Promise<CoinInfo>;
    /** Returns paginated list of all NFTs owned by wallet
     *  in testnet and mainnet uses Graphql API, in devnet
     *  and localnet, uses recurring queries to node REST API
     */
    getNftsInWallet(user: string, start: number, limit: number): Promise<Array<NftItem>>;
    performTransaction({ sender, functionName, typeArguments, regularArguments, }: TransactionParameters): Promise<string>;
    unwrapOption(optionElem: Array<any>): any;
}
export {};
