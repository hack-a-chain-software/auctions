import {
    AptosClient,
    FaucetClient,
    TokenClient,
    AptosAccount,
    HexString,
} from "aptos";
import 'isomorphic-unfetch';

import { AuctionHouseClient } from "../ts_client/auctionHouseClient";
import { FAUCET_URL, NODE_URL } from "./env";


/* This script:
 * 1. Deploys auctions module
 * 2. Instantiates module for owner account
 * 3. Creates 100 running NFT auctions
*/
const aptosCoin = "0x1::aptos_coin::AptosCoin";
const INDEXER_MAINNET = "https://indexer.mainnet.aptoslabs.com/v1/graphql";

seedTestnet();

export async function seedTestnet(): Promise<void> {

    const client = new AptosClient(NODE_URL);
    const tokenClient = new TokenClient(client);

    console.log(process.argv);

    // create and fund base accounts
    const moduleAddress = new AptosAccount(Uint8Array.from(Buffer.from(process.argv[2].slice(2), 'hex')));
    const ownerAccount = new AptosAccount(Uint8Array.from(Buffer.from(process.argv[3].slice(2), 'hex')));

    console.log("module address is: " + moduleAddress.address().hex());
    console.log("owner address is: " + ownerAccount.address().hex());

    console.log("owner private key is: " + ownerAccount.toPrivateKeyObject().privateKeyHex);

    const auctionHouseClient = new AuctionHouseClient(NODE_URL, INDEXER_MAINNET, moduleAddress.address().hex(), ownerAccount.address().hex());

    // authorize aptosCoin
    await client.waitForTransaction(
        await auctionHouseClient.addAuthorizedCoin(ownerAccount, aptosCoin),
        { checkSuccess: true }
    );

    // create NFT collection and token for auctioning
    const collectionName = "Sample collection";
    const tokenName = "Token name #";
    const tokenPropertyVersion = 0;

    const nftCollection = {
        creator: ownerAccount.address().hex(),
        collectionName
    };

    // create collection
    await client.waitForTransaction(
        await tokenClient.createCollection(
            ownerAccount,
            collectionName,
            "A random description",
            "https://something.io"
        ),
        { checkSuccess: true }
    );

    // Authorize NFT Collection
    await client.waitForTransaction(
        await auctionHouseClient.addAuthorizedCollection(ownerAccount, nftCollection),
        { checkSuccess: true }
    );


    const minBid = "100000000";
    const minBidIncrease = "50000000";

    const totalNfts = 400;
    let counter = 0;
    while (counter < totalNfts) {
        console.log(counter);
        // create tokens (NFT) in collection
        const tokenName = `Token name #${counter + 1}`;
        await client.waitForTransaction(
            await tokenClient.createToken(
                ownerAccount,
                collectionName,
                tokenName,
                "Another description here",
                1,
                `https://api.therealbirds.com/metadata/${counter + 1}.png`,
                undefined,
                undefined,
                undefined,
                undefined,
                ["Height", "Gender", "Clothes", "Other"],
                ["10", "20", "30", "40"],
                ["u64", "u64", "u64", "u64"]
            ),
            { checkSuccess: true }
        );

        // Create auction
        if (counter < 100) {
            await client.waitForTransaction(
                await auctionHouseClient.createAuction(
                    ownerAccount,
                    toMicroseconds(Date.now() + (counter + 1) * (30 * 60 * 1000)),
                    minBid,
                    minBidIncrease,
                    nftCollection.creator,
                    nftCollection.collectionName,
                    tokenName,
                    tokenPropertyVersion.toString(),
                    aptosCoin
                ),
                { checkSuccess: true }
            );
        }
        
        counter += 1;
    }

}


function toMicroseconds(time: number): string {
    return time.toString() + "000";
}