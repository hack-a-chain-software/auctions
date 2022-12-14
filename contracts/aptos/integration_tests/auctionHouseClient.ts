import {
    Types,
    AptosClient,
    AptosAccount,
    FaucetClient,
    CoinClient,
    TokenClient,
    TransactionBuilderABI
} from 'aptos';
import { NODE_URL, CONTRACT_MODULE, moduleName } from './env';

const contractModule = `${CONTRACT_MODULE}::${moduleName}`;

export class AuctionHouseClient extends AptosClient {
    constructor(node_url: string) {
        super(node_url);
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
        auctionHouseAddress: AptosAccount,
        endTime: number,
        minSellingPrice: number,
        minIncrement: number,
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
                    auctionHouseAddress.address(),
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
        auctionHouseAddress: AptosAccount,
        id: number,
        bid: number,
        coinType: string,
    ): Promise<string> {
        const rawTxn = await this.generateTransaction(
            sender.address(),
            {
                function: `${contractModule}::bid`,
                type_arguments: [coinType],
                arguments: [
                    auctionHouseAddress.address(),
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
        auctionHouseAddress: AptosAccount,
        id: number,
    ): Promise<string> {
        const rawTxn = await this.generateTransaction(
            sender.address(),
            {
                function: `${contractModule}::claim_prize`,
                type_arguments: [],
                arguments: [
                    auctionHouseAddress.address(),
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
        auctionHouseAddress: AptosAccount,
        id: number,
    ): Promise<string> {
        const rawTxn = await this.generateTransaction(
            sender.address(),
            {
                function: `${contractModule}::claim_coins`,
                type_arguments: [],
                arguments: [
                    auctionHouseAddress.address(),
                    id,
                ]
            }
        );

        const bcsTxn = await this.signTransaction(sender, rawTxn);
        const pendingTxn = await this.submitTransaction(bcsTxn);
        console.log(pendingTxn.hash);
        return pendingTxn.hash;
    }

    
}
