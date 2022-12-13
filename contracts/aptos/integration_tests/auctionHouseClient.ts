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

const contractModule = `${CONTRACT_MODULE}::${moduleName}`;

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

    auctionHouseAddress: AptosAccount

    constructor(node_url: string, auctionHouseAddress: AptosAccount) {
        super(node_url);
        this.auctionHouseAddress = auctionHouseAddress;
    }

    /** Initialize new instance of AuctionHouse */
    async initializeAuctionHouse(
        sender: AptosAccount,
        restrictUsersCreateAuctions: boolean,
    ): Promise<string> {
        const rawTxn = await this.generateTransaction(
            sender.address(),
            {
                function: `${contractModule}::initialize_auction_house`,
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
                function: `${contractModule}::create_auction`,
                type_arguments: [coinType],
                arguments: [
                    this.auctionHouseAddress.address(),
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
                function: `${contractModule}::bid`,
                type_arguments: [coinType],
                arguments: [
                    this.auctionHouseAddress.address(),
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
                function: `${contractModule}::claim_prize`,
                type_arguments: [],
                arguments: [
                    this.auctionHouseAddress.address(),
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
                function: `${contractModule}::claim_coins`,
                type_arguments: [],
                arguments: [
                    this.auctionHouseAddress.address(),
                    id,
                ]
            }
        );

        const bcsTxn = await this.signTransaction(sender, rawTxn);
        const pendingTxn = await this.submitTransaction(bcsTxn);
        console.log(pendingTxn.hash);
        return pendingTxn.hash;
    }

    // READ METHODS
    async isUserAuthorized(): Promise<boolean> {}
    
    // figure how to fetch all in contract
    async getAuthorizedTokens(): Promise<Array<string>> {
        const resource: any = await this.getAccountResource(
            this.auctionHouseAddress.address().hex(),
            `${contractModule}::AuctionHouse`,
        );
        const { handle }: { handle: string } = resource.data.coin_allowlist.table;
    }

    // figure how to fetch all in contract
    async getAuthorizedNftCollections(
        start: number,
        limit: number,
    ): Promise<Array<NftCollection>> {
        const resources = await this.getAccountResource(
            this.auctionHouseAddress.address().hex(),
                
        )
    }

    async getBidsAuction(
        auctionId: number
    ): Promise<Array<Bid>> {
        const resource: any = await this.getAccountResource(
            this.auctionHouseAddress.address().hex(),
            `${contractModule}::AuctionHouse`,
        );
    }

    async getAllAuctionsLen(): Promise<number> {
        const resource: any = await this.getAccountResource(
            this.auctionHouseAddress.address().hex(),
            `${contractModule}::AuctionHouse`,
        );
        return resource.data["auctions"]["len"]
    }

    async getAllAuctions(
        start: number,
        limit: number,
    ): Promise<Auction> {
        const resource: any = await this.getAccountResource(
            this.auctionHouseAddress.address().hex(),
            `${contractModule}::AuctionHouse`,
        );
        const { handle }: { handle: string } = resource.data.auctions;
        
        let returnValue = [];
        let counter = 0;
        while (counter < limit) {
            let auction: Auction = await this.getTableItem(
                handle,
                {
                    key_type: "",
                    value_type: "",
                    key: start + counter
                }
            );
            returnValue.push(auction);
            counter += 1;
        }
        return returnValue;
    }

    async getCreatedByUserAuctionsLen(
        user: AptosAccount
    ): Promise<number> {
        const resource: any = await this.getAccountResource(
            user.address().hex(),
            `${contractModule}::UserQueryHelper`,
        );
        const { handle }: { handle: string } = resource.data.created_auctions;
        const getTableElementRequest = {}
        return resource.data["auctions"]["len"]
    }

    async getCreatedByUserAuctions(
        start: number,
        limit: number,
    ): Promise<Auction> {
        const resource: any = await this.getAccountResource(
            this.auctionHouseAddress.address().hex(),
            `${contractModule}::AuctionHouse`,
        );
        const { handle }: { handle: string } = resource.data.auctions;
        
        let returnValue = [];
        let counter = 0;
        while (counter < limit) {
            let auction: Auction = await this.getTableItem(
                handle,
                {
                    key_type: "",
                    value_type: "",
                    key: start + counter
                }
            );
            returnValue.push(auction);
            counter += 1;
        }
        return returnValue;
    }

    async getBidByUserAuctionsLen(
        user: AptosAccount
    ): Promise<number> {
        const resource: any = await this.getAccountResource(
            user.address().hex(),
            `${contractModule}::UserQueryHelper`,
        );
        const { handle }: { handle: string } = resource.data.bid_auctions;
        const getTableElementRequest = {}
        return resource.data["auctions"]["len"]
    }

    async getBidByUserAuctions(
        start: number,
        limit: number,
    ): Promise<Auction> {
        const resource: any = await this.getAccountResource(
            this.auctionHouseAddress.address().hex(),
            `${contractModule}::AuctionHouse`,
        );
        const { handle }: { handle: string } = resource.data.auctions;
        
        let returnValue = [];
        let counter = 0;
        while (counter < limit) {
            let auction: Auction = await this.getTableItem(
                handle,
                {
                    key_type: "",
                    value_type: "",
                    key: start + counter
                }
            );
            returnValue.push(auction);
            counter += 1;
        }
        return returnValue;
    }




}
