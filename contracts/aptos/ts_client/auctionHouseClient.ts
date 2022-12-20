import {
    Types,
    TokenTypes,
    AptosClient,
    AptosAccount
} from 'aptos';

import { gql, createClient, Client as urqlClient, defaultExchanges } from '@urql/core';

const moduleName = "AuctionHouse";

export type NftCollection = {
    creator: string;
    collectionName: string;
};

export type NftItem = {
    creator: string;
    collectionName: string;
    name: string;
    propertyVersion: number;
}

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
}

export type Bid = {
    id: string,
    timestamp: string,
    bid: string,
    account: string,
}

export type CoinInfo = {
    name: string,
    symbol: string,
    decimals: number,
    supply: any,
}

export type SignAndSendFunction = (
    payload: Types.TransactionPayload
) => Promise<{ hash: Types.HexEncodedBytes }>

/** This type is either the AptosAccount type from
 *  aptos typescript SDK or a function that takes a 
 *  transaction payload, signs it and sends the transaction
 *  to the blockchain, returning the transaction hash.
 *  In the hippospace aptos-wallet-adapter, this is 
 *  the signAndSubmitTransaction method.
 */
export type GenericSender = AptosAccount | SignAndSendFunction;

interface TransactionParameters {
    sender: GenericSender,
    functionName: string,
    typeArguments: Array<any>,
    regularArguments: Array<any>
}

export class AuctionHouseClient extends AptosClient {

    auctionHouseAddress: string
    contractAddress: string
    contractModule: string
    graphqlClient: urqlClient | null

    constructor(node_url: string, graqphqlUrl: string | null, moduleAddress: string, auctionHouseAddress: string) {
        super(node_url);
        this.auctionHouseAddress = auctionHouseAddress;
        this.contractAddress = moduleAddress;
        this.contractModule = `${moduleAddress}::${moduleName}`;
        if (graqphqlUrl) {
            this.graphqlClient = createClient({
                url: graqphqlUrl,
                exchanges: defaultExchanges
            });
        } else {
            this.graphqlClient = null;
        }

    }

    /** Initialize new instance of AuctionHouse */
    async initializeAuctionHouse(
        sender: GenericSender,
        owner: string,
        restrictUsersCreateAuctions: boolean,
    ): Promise<string> {
        const functionName = `${this.contractModule}::initialize_auction_house`;
        const typeArguments: any[] = [];
        const regularArguments = [
            owner,
            restrictUsersCreateAuctions
        ];
        return await this.performTransaction({
            sender,
            functionName,
            typeArguments,
            regularArguments,
        });
    }

    /** Creates a new auction inside auctionhouse by locking an NFT */
    async createAuction(
        sender: GenericSender,
        endTime: string,
        minSellingPrice: string,
        minIncrement: string,
        creator: string,
        collectionName: string,
        name: string,
        propertyVersion: string,
        coinType: string
    ): Promise<string> {
        const functionName = `${this.contractModule}::create_auction`;
        const typeArguments = [coinType];
        const regularArguments = [
            this.auctionHouseAddress,
            endTime,
            minSellingPrice,
            minIncrement,
            creator,
            collectionName,
            name,
            propertyVersion
        ];
        return await this.performTransaction({
            sender, functionName, typeArguments, regularArguments
        });
    }

    /** Bids on auction of passed id using coinType */
    async bid(
        sender: GenericSender,
        id: string,
        bid: string,
        coinType: string,
    ): Promise<string> {
        const functionName = `${this.contractModule}::bid`;
        const typeArguments: any[] = [coinType];
        const regularArguments = [
            this.auctionHouseAddress,
            id,
            bid,
        ];
        return await this.performTransaction({
            sender,
            functionName,
            typeArguments,
            regularArguments
        });
    }

    /** After auction is over, highest bidder can claim the nft prize */
    async claimPrize(
        sender: GenericSender,
        id: number,
    ): Promise<string> {
        const functionName = `${this.contractModule}::claim_prize`;
        const typeArguments: any[] = [];
        const regularArguments = [
            this.auctionHouseAddress,
            id
        ];
        return await this.performTransaction({
            sender,
            functionName,
            typeArguments,
            regularArguments
        });
    }

    /** After auction is over, creator can claim coins bid */
    async claimCoins(
        sender: GenericSender,
        coinType: string,
        id: number,
    ): Promise<string> {
        const functionName = `${this.contractModule}::claim_coins`;
        const typeArguments = [ coinType ];
        const regularArguments = [
            this.auctionHouseAddress,
            id
        ];
        return await this.performTransaction({
            sender,
            functionName,
            typeArguments,
            regularArguments
        });
    }

    // ADMIN METHODS - Will abort if not called by owner
    async addAuthorizedUser(
        sender: GenericSender,
        user: string
    ): Promise<string> {
        const functionName = `${this.contractModule}::add_authorized_users`;
        const typeArguments: any[] = [];
        const regularArguments = [
            this.auctionHouseAddress,
            user
        ];
        return await this.performTransaction({
            sender,
            functionName,
            typeArguments,
            regularArguments
        });
    }

    async removeAuthorizedUser(
        sender: GenericSender,
        user: string
    ): Promise<string> {
        const functionName = `${this.contractModule}::remove_authorized_users`;
        const typeArguments: any[] = [];
        const regularArguments = [
            this.auctionHouseAddress,
            user
        ];
        return await this.performTransaction({
            sender,
            functionName,
            typeArguments,
            regularArguments
        });
    }

    async addAuthorizedCollection(
        sender: GenericSender,
        collection: NftCollection
    ): Promise<string> {
        const functionName = `${this.contractModule}::add_authorized_nft_collections`;
        const typeArguments: any[] = [];
        const regularArguments = [
            this.auctionHouseAddress,
            collection.creator,
            collection.collectionName
        ];
        return await this.performTransaction({
            sender,
            functionName,
            typeArguments,
            regularArguments
        });
    }

    async removeAuthorizedCollection(
        sender: GenericSender,
        collection: NftCollection
    ): Promise<string> {
        const functionName = `${this.contractModule}::remove_authorized_nft_collections`;
        const typeArguments: any[] = [];
        const regularArguments = [
            this.auctionHouseAddress,
            collection.creator,
            collection.collectionName
        ];
        return await this.performTransaction({
            sender,
            functionName,
            typeArguments,
            regularArguments
        });
    }

    async addAuthorizedCoin(
        sender: GenericSender,
        coinType: string
    ): Promise<string> {
        const functionName = `${this.contractModule}::add_authorized_coins`;
        const typeArguments: any[] = [coinType];
        const regularArguments = [
            this.auctionHouseAddress,
        ];
        return await this.performTransaction({
            sender,
            functionName,
            typeArguments,
            regularArguments
        });
    }

    async removeAuthorizedCoin(
        sender: GenericSender,
        coinType: string
    ): Promise<string> {
        const functionName = `${this.contractModule}::remove_authorized_coins`;
        const typeArguments: any[] = [coinType];
        const regularArguments = [
            this.auctionHouseAddress,
        ];
        return await this.performTransaction({
            sender,
            functionName,
            typeArguments,
            regularArguments
        });
    }

    // READ METHODS
    async isUserAuthorized(
        user: string
    ): Promise<boolean> {
        const resource: any = await this.getAccountResource(
            this.auctionHouseAddress,
            `${this.contractModule}::AuctionHouse`,
        );
        const optionVec: Array<any> = resource.data.allowed_users.vec;
        if (optionVec.length > 0) {
            const { handle } = optionVec[0].table;
            try {
                let authorized: boolean = await this.getTableItem(
                    handle,
                    {
                        key_type: "address",
                        value_type: "bool",
                        key: user
                    }
                );
                return authorized;
            } catch (e: any) {
                if ((e!.toString()).includes("Table Item not found by Table handle")) {
                    return false
                }
                throw e;
            }

        }
        return true

    }

    // figure how to fetch all in contract
    async getAuthorizedCoins(): Promise<Array<string>> {
        const resource: any = await this.getAccountResource(
            this.auctionHouseAddress,
            `${this.contractModule}::AuctionHouse`,
        );
        const coinAllowlist = resource.data.coin_allowlist;

        const { handle: vectorHandle } = coinAllowlist.aux_vector.table;
        const { len: vectorLen } = coinAllowlist.aux_vector
        const { handle } = coinAllowlist.table;

        let returnValue = [];
        let counter = 0;
        while (counter < vectorLen) {
            let typeInfo: any = await this.getTableItem(
                vectorHandle,
                {
                    key_type: "u64",
                    value_type: "0x1::type_info::TypeInfo",
                    key: counter.toString()
                }
            );
            let authorized: boolean = await this.getTableItem(
                handle,
                {
                    key_type: "0x1::type_info::TypeInfo",
                    value_type: "bool",
                    key: typeInfo
                }
            );
            if (authorized) {
                const moduleName = convertHexToUtf8(typeInfo.module_name);
                const structName = convertHexToUtf8(typeInfo.struct_name);
                returnValue.push(
                    `${typeInfo.account_address}::${moduleName}::${structName}`
                );
            }
            counter += 1;
        }
        return returnValue;
    }

    // figure how to fetch all in contract
    async getAuthorizedNftCollections(): Promise<Array<NftCollection>> {
        const resource: any = await this.getAccountResource(
            this.auctionHouseAddress,
            `${this.contractModule}::AuctionHouse`,
        );
        const nftAllowlist = resource.data.nft_allowlist;

        const { handle: vectorHandle } = nftAllowlist.aux_vector.table;
        const { len: vectorLen } = nftAllowlist.aux_vector
        const { handle } = nftAllowlist.table;

        let returnValue = [];
        let counter = 0;
        while (counter < vectorLen) {
            let nftCollection: any = await this.getTableItem(
                vectorHandle,
                {
                    key_type: "u64",
                    value_type: `${this.contractModule}::NftCollection`,
                    key: counter.toString()
                }
            );
            let authorized: boolean = await this.getTableItem(
                handle,
                {
                    key_type: `${this.contractModule}::NftCollection`,
                    value_type: "bool",
                    key: nftCollection
                }
            );
            if (authorized) {
                returnValue.push(
                    {
                        creator: nftCollection.creator,
                        collectionName: nftCollection.collection_name
                    }
                );
            }
            counter += 1;
        }
        return returnValue;
    }

    async getBidsAuction(
        auctionId: string
    ): Promise<Array<Bid>> {
        if (await this.getAllAuctionsLen() <= parseInt(auctionId)) return [];
        const resource: any = await this.getAccountResource(
            this.auctionHouseAddress,
            `${this.contractModule}::AuctionHouse`,
        );
        const { handle }: { handle: string } = resource.data.auctions.table;

        let auction: any = await this.getTableItem(
            handle,
            {
                key_type: "u64",
                value_type: `${this.contractModule}::Auction`,
                key: auctionId
            }
        );
        const { handle: bidEventsHandle } = auction.bid_events.table;
        const { len } = auction.bid_events;

        let returnValue = [];
        let counter = 0;

        let promiseArray = [];
        while (counter < len) {
            promiseArray.push(this.getTableItem(
                bidEventsHandle,
                {
                    key_type: "u64",
                    value_type: `${this.contractModule}::BidEvent`,
                    key: counter.toString()
                }
            ));
            counter += 1;
        }
        const bidArray: Array<any> = await Promise.all(promiseArray);

        for (const bidEvent of bidArray) {
            const returnBid: Bid = {
                id: bidEvent.id,
                timestamp: bidEvent.timestamp,
                bid: bidEvent.bid,
                account: bidEvent.account,
            }
            returnValue.push(returnBid);
        }

        return returnValue;

    }

    async getAllAuctionsLen(): Promise<number> {
        const resource: any = await this.getAccountResource(
            this.auctionHouseAddress,
            `${this.contractModule}::AuctionHouse`,
        );
        return resource.data.auctions.len;
    }

    async getAllAuctions(
        start: number,
        limit: number,
    ): Promise<Array<Auction>> {
        const resource: any = await this.getAccountResource(
            this.auctionHouseAddress,
            `${this.contractModule}::AuctionHouse`,
        );
        const { len } = resource.data.auctions;
        const { handle }: { handle: string } = resource.data.auctions.table;
        let returnValue = [];
        let counter = 0;

        let promiseArray = [];
        while (counter < limit) {
            if ((start + counter) >= len) break;
            const id = start + counter;
            promiseArray.push(this.getTableItem(
                handle,
                {
                    key_type: "u64",
                    value_type: `${this.contractModule}::Auction`,
                    key: id.toString()
                }
            ));
            counter += 1;
        }

        const auctionArray: Array<any> = await Promise.all(promiseArray);
        for (const auction of auctionArray) {
            const returnAuction: Auction = {
                id: auction.id,
                creator: auction.creator,
                startTime: auction.start_time,
                endTime: auction.end_time,
                auctionCoin: `${auction.auction_coin.account_address}::${convertHexToUtf8(auction.auction_coin.module_name)}::${convertHexToUtf8(auction.auction_coin.struct_name)}`,
                minSellingPrice: auction.min_selling_price,
                minIncrement: auction.min_increment,
                currentBid: auction.current_bid,
                currentBidder: auction.current_bidder,
                lockedTokenId: {
                    token_data_id: {
                        creator: auction.locked_token_id.token_data_id.creator,
                        collection: auction.locked_token_id.token_data_id.collection,
                        name: auction.locked_token_id.token_data_id.name,
                    },
                    property_version: auction.locked_token_id.property_version,
                },
                coinsClaimed: auction.coins_claimed,
                tokenClaimed: this.unwrapOption(auction.locked_token.vec) === null,
            }
            returnValue.push(returnAuction);
        }


        return returnValue;
    }

    async getCreatedByUserAuctionsLen(
        user: string
    ): Promise<number> {
        let resource: any;
        try {
            resource = await this.getAccountResource(
                user,
                `${this.contractModule}::UserQueryHelper`,
            );
        } catch (e: any) {
            if ((e!.toString()).includes("Resource not found by Address")) {
                return 0
            }
            throw e;
        }

        const { handle }: { handle: string } = resource.data.created_auctions;
        const innerSet = await this.getTableItem(
            handle,
            {
                key_type: "address",
                value_type: `${this.contractAddress}::table_vector::TableVector<u64>`,
                key: this.auctionHouseAddress
            }
        );
        return innerSet.len;
    }

    async getCreatedByUserAuctions(
        user: string,
        start: number,
        limit: number,
    ): Promise<Array<Auction>> {
        const resource: any = await this.getAccountResource(
            this.auctionHouseAddress,
            `${this.contractModule}::AuctionHouse`,
        );
        const { handle }: { handle: string } = resource.data.auctions.table;
        let resourceQuery: any;
        try {
            resourceQuery = await this.getAccountResource(
                user,
                `${this.contractModule}::UserQueryHelper`,
            );
        } catch (e: any) {
            if ((e!.toString()).includes("Resource not found by Address")) {
                return []
            }
            throw e;
        }
        const { handle: handleQuery }: { handle: string } = resourceQuery.data.created_auctions;

        const innerSetQuery = await this.getTableItem(
            handleQuery,
            {
                key_type: "address",
                value_type: `${this.contractAddress}::table_vector::TableVector<u64>`,
                key: this.auctionHouseAddress
            }
        );
        const len = innerSetQuery.len;
        const { handle: handleQueryIter } = innerSetQuery.table;

        let returnValue = [];
        let counter = 0;

        let promiseArray1 = []
        while (counter < limit) {
            if ((start + counter) >= len) break;
            promiseArray1.push(this.getTableItem(
                handleQueryIter,
                {
                    key_type: "u64",
                    value_type: "u64",
                    key: (start + counter).toString()
                }
            ));
            counter += 1;
        }
        const idArray: Array<string> = await Promise.all(promiseArray1);
        let promiseArray2 = [];
        for (const id of idArray) {
            promiseArray2.push(this.getTableItem(
                handle,
                {
                    key_type: "u64",
                    value_type: `${this.contractModule}::Auction`,
                    key: id
                }
            ));
        }
        let auctionArray: Array<any> = await Promise.all<Auction>(promiseArray2);
        for (const auction of auctionArray) {
            const returnAuction: Auction = {
                id: auction.id,
                creator: auction.creator,
                startTime: auction.start_time,
                endTime: auction.end_time,
                auctionCoin: `${auction.auction_coin.account_address}::${convertHexToUtf8(auction.auction_coin.module_name)}::${convertHexToUtf8(auction.auction_coin.struct_name)}`,
                minSellingPrice: auction.min_selling_price,
                minIncrement: auction.min_increment,
                currentBid: auction.current_bid,
                currentBidder: auction.current_bidder,
                lockedTokenId: {
                    token_data_id: {
                        creator: auction.locked_token_id.token_data_id.creator,
                        collection: auction.locked_token_id.token_data_id.collection,
                        name: auction.locked_token_id.token_data_id.name,
                    },
                    property_version: auction.locked_token_id.property_version,
                },
                coinsClaimed: auction.coins_claimed,
                tokenClaimed: this.unwrapOption(auction.locked_token.vec) === null,
            }
            returnValue.push(returnAuction);
        }

        return returnValue;
    }

    async getBidByUserAuctionsLen(
        user: string
    ): Promise<number> {
        let resource: any;
        try {
            resource = await this.getAccountResource(
                user,
                `${this.contractModule}::UserQueryHelper`,
            );
        } catch (e: any) {
            if ((e!.toString()).includes("Resource not found by Address")) {
                return 0
            }
            throw e;
        }
        const { handle }: { handle: string } = resource.data.bid_auctions;
        const innerSet = await this.getTableItem(
            handle,
            {
                key_type: "address",
                value_type: `${this.contractAddress}::table_vector::TableVector<u64>`,
                key: this.auctionHouseAddress
            }
        );
        return innerSet.len;
    }

    async getBidByUserAuctions(
        user: string,
        start: number,
        limit: number,
    ): Promise<Array<Auction>> {
        const resource: any = await this.getAccountResource(
            this.auctionHouseAddress,
            `${this.contractModule}::AuctionHouse`,
        );
        const { handle }: { handle: string } = resource.data.auctions.table;
        let resourceQuery: any;
        try {
            resourceQuery = await this.getAccountResource(
                user,
                `${this.contractModule}::UserQueryHelper`,
            );
        } catch (e: any) {
            if ((e!.toString()).includes("Resource not found by Address")) {
                return []
            }
            throw e;
        }
        const { handle: handleQuery }: { handle: string } = resourceQuery.data.bid_auctions;

        const innerSetQuery = await this.getTableItem(
            handleQuery,
            {
                key_type: "address",
                value_type: `${this.contractAddress}::table_vector::TableVector<u64>`,
                key: this.auctionHouseAddress
            }
        );
        const len = innerSetQuery.len;
        const { handle: handleQueryIter } = innerSetQuery.table;

        let returnValue = [];
        let counter = 0;
        let promiseArray1 = []
        while (counter < limit) {
            if ((start + counter) >= len) break;
            promiseArray1.push(this.getTableItem(
                handleQueryIter,
                {
                    key_type: "u64",
                    value_type: "u64",
                    key: (start + counter).toString()
                }
            ));
            counter += 1;
        }
        const idArray: Array<string> = await Promise.all(promiseArray1);
        let promiseArray2 = [];
        for (const id of idArray) {
            promiseArray2.push(this.getTableItem(
                handle,
                {
                    key_type: "u64",
                    value_type: `${this.contractModule}::Auction`,
                    key: id
                }
            ));
        }
        let auctionArray: Array<any> = await Promise.all<Auction>(promiseArray2);
        for (const auction of auctionArray) {
            const returnAuction: Auction = {
                id: auction.id,
                creator: auction.creator,
                startTime: auction.start_time,
                endTime: auction.end_time,
                auctionCoin: `${auction.auction_coin.account_address}::${convertHexToUtf8(auction.auction_coin.module_name)}::${convertHexToUtf8(auction.auction_coin.struct_name)}`,
                minSellingPrice: auction.min_selling_price,
                minIncrement: auction.min_increment,
                currentBid: auction.current_bid,
                currentBidder: auction.current_bidder,
                lockedTokenId: {
                    token_data_id: {
                        creator: auction.locked_token_id.token_data_id.creator,
                        collection: auction.locked_token_id.token_data_id.collection,
                        name: auction.locked_token_id.token_data_id.name,
                    },
                    property_version: auction.locked_token_id.property_version,
                },
                coinsClaimed: auction.coins_claimed,
                tokenClaimed: this.unwrapOption(auction.locked_token.vec) === null,
            }
            returnValue.push(returnAuction);
        }
        return returnValue;
    }

    async getCoinInfo(coinType: string): Promise<CoinInfo> {
        const splitType = coinType.split("::");
        const address = splitType[0];
        const resource: any = await this.getAccountResource(
            address,
            `0x1::coin::CoinInfo<${coinType}>`,
        );
        return resource.data as CoinInfo;
    }

    /** Returns paginated list of all NFTs owned by wallet
     *  in testnet and mainnet uses Graphql API, in devnet
     *  and localnet, uses recurring queries to node REST API
     */
    async getNftsInWallet(
        user: string,
        start: number,
        limit: number
    ): Promise<Array<NftItem>> {

        if (this.graphqlClient) {
            const query = gql`
                query CurrentTokens($owner_address: String, $offset: Int, $limit: Int) {
                    current_token_ownerships(
                    where: {owner_address: {_eq: $owner_address}, amount: {_gt: "0"}}
                    order_by: {last_transaction_version: desc}
                    offset: $offset
                    limit: $limit
                    ) {
                    creator_address
                    collection_name
                    name
                    property_version
                    amount
                    }
                }          
            `;

            const response = await this.graphqlClient.query(query, {
                owner_address: user,
                offset: start,
                limit: limit
            }).toPromise();

            return response.data.current_token_ownerships.map(
                (el: any) => {
                    return {
                        creator: el.creator_address,
                        collectionName: el.collection_name,
                        name: el.name,
                        propertyVersion: el.property_version,
                    }
                }
            );
        } else {
            return [];
        }


    }

    // UTILITIES
    async performTransaction({
        sender,
        functionName,
        typeArguments,
        regularArguments,
    }: TransactionParameters): Promise<string> {
        if (typeof sender === "function") {
            const payload: Types.TransactionPayload = {
                type: 'entry_function_payload',
                function: functionName,
                type_arguments: typeArguments,
                arguments: regularArguments
            };
            const { hash } = await sender(payload);
            return hash;

        } else {
            const rawTxn = await this.generateTransaction(
                sender.address(),
                {
                    function: functionName,
                    type_arguments: typeArguments,
                    arguments: regularArguments
                }
            );

            const bcsTxn = await this.signTransaction(sender, rawTxn);
            const pendingTxn = await this.submitTransaction(bcsTxn);
            return pendingTxn.hash;
        }
    }

    unwrapOption(optionElem: Array<any>): any {
        if (optionElem.length > 0) {
            return optionElem[0]
        } else {
            return null;
        }
    }

}

function convertHexToUtf8(hex: string): string {
    return Buffer.from(hex.slice(2), "hex").toString("utf-8");
}

