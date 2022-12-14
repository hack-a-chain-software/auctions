import {
    Types,
    TokenTypes,
    AptosClient,
    AptosAccount,
    FaucetClient,
    CoinClient,
    TokenClient,
    BCS
} from 'aptos';

import { NODE_URL, CONTRACT_MODULE, moduleName } from './env';

type NftCollection = {
    creator: string;
    collectionName: string;
};

type Auction = {
    id: number;
    creator: string;
    startTime: BCS.Uint64;
    endTime: BCS.Uint64;
    auctionCoin: string;
    minSellingPrice: string;
    minIncrement: string;
    currentBid: BCS.Uint64;
    currentBidder: string;
    lockedTokenId: TokenTypes.TokenId;
    coinsClaimed: boolean;
}

type Bid = {
    id: number,
    timestamp: BCS.Uint64,
    bid: BCS.Uint64,
    account: string,
}

export class AuctionHouseClient extends AptosClient {

    auctionHouseAddress: string
    contractModule: string

    constructor(node_url: string, moduleAddress: string, auctionHouseAddress: string) {
        super(node_url);
        this.auctionHouseAddress = auctionHouseAddress;
        this.contractModule = `${moduleAddress}::${moduleName}`
    }

    /** Initialize new instance of AuctionHouse */
    async initializeAuctionHouse(
        sender: AptosAccount,
        restrictUsersCreateAuctions: boolean,
    ): Promise<string> {
        const rawTxn = await this.generateTransaction(
            sender.address(),
            {
                function: `${this.contractModule}::initialize_auction_house`,
                type_arguments: [],
                arguments: [restrictUsersCreateAuctions]
            }
        );

        const bcsTxn = await this.signTransaction(sender, rawTxn);
        const pendingTxn = await this.submitTransaction(bcsTxn);
        console.log(pendingTxn.hash);
        return pendingTxn.hash;
    }

    /** Creates a new auction inside auctionhouse by locking an NFT */
    async createAuction(
        sender: AptosAccount,
        endTime: BCS.Uint64,
        minSellingPrice: BCS.Uint64,
        minIncrement: BCS.Uint64,
        creator: AptosAccount,
        collectionName: string,
        name: string,
        propertyVersion: string,
        coinType: string
    ): Promise<string> {
        const rawTxn = await this.generateTransaction(
            sender.address(),
            {
                function: `${this.contractModule}::create_auction`,
                type_arguments: [coinType],
                arguments: [
                    this.auctionHouseAddress,
                    endTime,
                    minSellingPrice,
                    minIncrement,
                    creator,
                    collectionName,
                    name,
                    propertyVersion
                ]
            }
        );

        const bcsTxn = await this.signTransaction(sender, rawTxn);
        const pendingTxn = await this.submitTransaction(bcsTxn);
        console.log(pendingTxn.hash);
        return pendingTxn.hash;
    }

    /** Bids on auction of passed id using coinType */
    async bid(
        sender: AptosAccount,
        id: number,
        bid: BCS.Uint64,
        coinType: string,
    ): Promise<string> {
        const rawTxn = await this.generateTransaction(
            sender.address(),
            {
                function: `${this.contractModule}::bid`,
                type_arguments: [coinType],
                arguments: [
                    this.auctionHouseAddress,
                    id,
                    bid,
                ]
            }
        );

        const bcsTxn = await this.signTransaction(sender, rawTxn);
        const pendingTxn = await this.submitTransaction(bcsTxn);
        console.log(pendingTxn.hash);
        return pendingTxn.hash;
    }

    /** After auction is over, highest bidder can claim the nft prize */
    async claimPrize(
        sender: AptosAccount,
        id: number,
    ): Promise<string> {
        const rawTxn = await this.generateTransaction(
            sender.address(),
            {
                function: `${this.contractModule}::claim_prize`,
                type_arguments: [],
                arguments: [
                    this.auctionHouseAddress,
                    id,
                ]
            }
        );

        const bcsTxn = await this.signTransaction(sender, rawTxn);
        const pendingTxn = await this.submitTransaction(bcsTxn);
        console.log(pendingTxn.hash);
        return pendingTxn.hash;
    }

    /** After auction is over, creator can claim coins bid */
    async claimCoins(
        sender: AptosAccount,
        id: number,
    ): Promise<string> {
        const rawTxn = await this.generateTransaction(
            sender.address(),
            {
                function: `${this.contractModule}::claim_coins`,
                type_arguments: [],
                arguments: [
                    this.auctionHouseAddress,
                    id,
                ]
            }
        );

        const bcsTxn = await this.signTransaction(sender, rawTxn);
        const pendingTxn = await this.submitTransaction(bcsTxn);
        console.log(pendingTxn.hash);
        return pendingTxn.hash;
    }

    // ADMIN METHODS - Will abort if not called by owner

    async addAuthorizedUser(
        sender: AptosAccount,
        user: string
    ): Promise<string> {
        const rawTxn = await this.generateTransaction(
            sender.address(),
            {
                function: `${this.contractModule}::add_authorized_users`,
                type_arguments: [],
                arguments: [ 
                    this.auctionHouseAddress,
                    user
                ]
            }
        );

        const bcsTxn = await this.signTransaction(sender, rawTxn);
        const pendingTxn = await this.submitTransaction(bcsTxn);
        console.log(pendingTxn.hash);
        return pendingTxn.hash;
    }

    async removeAuthorizedUser(
        sender: AptosAccount,
        user: string
    ): Promise<string> {
        const rawTxn = await this.generateTransaction(
            sender.address(),
            {
                function: `${this.contractModule}::remove_authorized_users`,
                type_arguments: [],
                arguments: [ 
                    this.auctionHouseAddress,
                    user
                ]
            }
        );

        const bcsTxn = await this.signTransaction(sender, rawTxn);
        const pendingTxn = await this.submitTransaction(bcsTxn);
        console.log(pendingTxn.hash);
        return pendingTxn.hash;
    }

    async addAuthorizedCollection(
        sender: AptosAccount,
        collection: NftCollection
    ): Promise<string> {
        const rawTxn = await this.generateTransaction(
            sender.address(),
            {
                function: `${this.contractModule}::add_authorized_nft_collections`,
                type_arguments: [],
                arguments: [ 
                    this.auctionHouseAddress,
                    collection.creator,
                    collection.collectionName
                ]
            }
        );

        const bcsTxn = await this.signTransaction(sender, rawTxn);
        const pendingTxn = await this.submitTransaction(bcsTxn);
        console.log(pendingTxn.hash);
        return pendingTxn.hash;
    }

    async removeAuthorizedCollection(
        sender: AptosAccount,
        collection: NftCollection
    ): Promise<string> {
        const rawTxn = await this.generateTransaction(
            sender.address(),
            {
                function: `${this.contractModule}::remove_authorized_nft_collections`,
                type_arguments: [],
                arguments: [ 
                    this.auctionHouseAddress,
                    collection.creator,
                    collection.collectionName
                ]
            }
        );

        const bcsTxn = await this.signTransaction(sender, rawTxn);
        const pendingTxn = await this.submitTransaction(bcsTxn);
        console.log(pendingTxn.hash);
        return pendingTxn.hash;
    }

    async addAuthorizedCoin(
        sender: AptosAccount,
        coinType: string
    ): Promise<string> {
        const rawTxn = await this.generateTransaction(
            sender.address(),
            {
                function: `${this.contractModule}::add_authorized_coins`,
                type_arguments: [ coinType ],
                arguments: [ 
                    this.auctionHouseAddress
                ]
            }
        );

        const bcsTxn = await this.signTransaction(sender, rawTxn);
        const pendingTxn = await this.submitTransaction(bcsTxn);
        console.log(pendingTxn.hash);
        return pendingTxn.hash;
    }

    async removeAuthorizedCoin(
        sender: AptosAccount,
        coinType: string
    ): Promise<string> {
        const rawTxn = await this.generateTransaction(
            sender.address(),
            {
                function: `${this.contractModule}::remove_authorized_coins`,
                type_arguments: [ coinType ],
                arguments: [ 
                    this.auctionHouseAddress
                ]
            }
        );

        const bcsTxn = await this.signTransaction(sender, rawTxn);
        const pendingTxn = await this.submitTransaction(bcsTxn);
        console.log(pendingTxn.hash);
        return pendingTxn.hash;
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
            } catch (e) {
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
                const moduleName = Buffer.from(typeInfo.module_name.slice(2), "hex").toString("utf-8");
                const structName = Buffer.from(typeInfo.struct_name.slice(2), "hex").toString("utf-8");
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
            console.log(nftCollection);
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

    // async getBidsAuction(
    //     auctionId: number
    // ): Promise<Array<Bid>> {
    //     const resource: any = await this.getAccountResource(
    //         this.auctionHouseAddress.address().hex(),
    //         `${this.contractModule}::AuctionHouse`,
    //     );
    //     const { handle }: { handle: string } = resource.data.auctions;
        
    //     let auction: Auction = await this.getTableItem(
    //         handle,
    //         {
    //             key_type: "",
    //             value_type: "",
    //             key: start + counter
    //         }
    //     );

    // }

    // async getAllAuctionsLen(): Promise<number> {
    //     const resource: any = await this.getAccountResource(
    //         this.auctionHouseAddress.address().hex(),
    //         `${this.contractModule}::AuctionHouse`,
    //     );
    //     return resource.data["auctions"]["len"]
    // }

    // async getAllAuctions(
    //     start: number,
    //     limit: number,
    // ): Promise<Auction> {
    //     const resource: any = await this.getAccountResource(
    //         this.auctionHouseAddress.address().hex(),
    //         `${this.contractModule}::AuctionHouse`,
    //     );
    //     const { handle }: { handle: string } = resource.data.auctions;
        
    //     let returnValue = [];
    //     let counter = 0;
    //     while (counter < limit) {
    //         let auction: Auction = await this.getTableItem(
    //             handle,
    //             {
    //                 key_type: "",
    //                 value_type: "",
    //                 key: start + counter
    //             }
    //         );
    //         returnValue.push(auction);
    //         counter += 1;
    //     }
    //     return returnValue;
    // }

    // async getCreatedByUserAuctionsLen(
    //     user: AptosAccount
    // ): Promise<number> {
    //     const resource: any = await this.getAccountResource(
    //         user.address().hex(),
    //         `${this.contractModule}::UserQueryHelper`,
    //     );
    //     const { handle }: { handle: string } = resource.data.created_auctions;
    //     const getTableElementRequest = {}
    //     return resource.data["auctions"]["len"]
    // }

    // async getCreatedByUserAuctions(
    //     start: number,
    //     limit: number,
    // ): Promise<Auction> {
    //     const resource: any = await this.getAccountResource(
    //         this.auctionHouseAddress.address().hex(),
    //         `${this.contractModule}::AuctionHouse`,
    //     );
    //     const { handle }: { handle: string } = resource.data.auctions;
        
    //     let returnValue = [];
    //     let counter = 0;
    //     while (counter < limit) {
    //         let auction: Auction = await this.getTableItem(
    //             handle,
    //             {
    //                 key_type: "",
    //                 value_type: "",
    //                 key: start + counter
    //             }
    //         );
    //         returnValue.push(auction);
    //         counter += 1;
    //     }
    //     return returnValue;
    // }

    // async getBidByUserAuctionsLen(
    //     user: AptosAccount
    // ): Promise<number> {
    //     const resource: any = await this.getAccountResource(
    //         user.address().hex(),
    //         `${this.contractModule}::UserQueryHelper`,
    //     );
    //     const { handle }: { handle: string } = resource.data.bid_auctions;
    //     const getTableElementRequest = {}
    //     return resource.data["auctions"]["len"]
    // }

    // async getBidByUserAuctions(
    //     start: number,
    //     limit: number,
    // ): Promise<Auction> {
    //     const resource: any = await this.getAccountResource(
    //         this.auctionHouseAddress.address().hex(),
    //         `${this.contractModule}::AuctionHouse`,
    //     );
    //     const { handle }: { handle: string } = resource.data.auctions;
        
    //     let returnValue = [];
    //     let counter = 0;
    //     while (counter < limit) {
    //         let auction: Auction = await this.getTableItem(
    //             handle,
    //             {
    //                 key_type: "",
    //                 value_type: "",
    //                 key: start + counter
    //             }
    //         );
    //         returnValue.push(auction);
    //         counter += 1;
    //     }
    //     return returnValue;
    // }

}
