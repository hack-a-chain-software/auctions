import {
    AptosClient,
    CoinClient,
    FaucetClient,
    TokenClient,
    AptosAccount,
    TxnBuilderTypes,
    HexString
} from "aptos";
import fs from "fs";
import path from "path";
import sh from "shelljs";

import { AuctionHouseClient } from "../ts_client/auctionHouseClient";
import { FAUCET_URL, NODE_URL } from "./env";


/* This script:
 * 1. Deploys auctions module
 * 2. Instantiates module for owner account
 * 3. Creates 100 running NFT auctions
*/
const BASE_FUNDS = 500_000_000;
const aptosCoin = "0x1::aptos_coin::AptosCoin";

testBasicFlow();

export async function testBasicFlow(): Promise<void> {

    const client = new AptosClient(NODE_URL);
    const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL);
    const tokenClient = new TokenClient(client);

    // create and fund base accounts
    const moduleAddress = new AptosAccount();
    const ownerAccount = new AptosAccount();
    const bidder1 = new AptosAccount();
    const bidder2 = new AptosAccount();
    const bidder3 = new AptosAccount();

    const bidders = [bidder1, bidder2, bidder3];

    const mintAddress = process.argv[1];

    console.log("module address is: " + moduleAddress.address().hex());
    console.log("contract address is: " + ownerAccount.address().hex());

    console.log("owner private key is: " + ownerAccount.toPrivateKeyObject().privateKeyHex);

    await faucetClient.fundAccount(moduleAddress.address(), BASE_FUNDS);
    await faucetClient.fundAccount(ownerAccount.address(), BASE_FUNDS);
    await faucetClient.fundAccount(bidder1.address(), BASE_FUNDS);
    await faucetClient.fundAccount(bidder2.address(), BASE_FUNDS);
    await faucetClient.fundAccount(bidder3.address(), BASE_FUNDS);

    const auctionHouseClient = new AuctionHouseClient(NODE_URL, moduleAddress.address().hex(), ownerAccount.address().hex());

    // deploy module
    sh.exec(`
        aptos move compile --named-addresses auctionhouse=${moduleAddress.address().hex()} --included-artifacts all --save-metadata
    `);

    const modulePath = path.join(__dirname, "..");
    const packageMetadata = fs.readFileSync(path.join(modulePath, "build", "AuctionHouse", "package-metadata.bcs"));
    const moduleData1 = fs.readFileSync(path.join(modulePath, "build", "AuctionHouse", "bytecode_modules", "table_vector.mv"));
    const moduleData2 = fs.readFileSync(path.join(modulePath, "build", "AuctionHouse", "bytecode_modules", "table_set.mv"));
    const moduleData3 = fs.readFileSync(path.join(modulePath, "build", "AuctionHouse", "bytecode_modules", "AuctionHouse.mv"));

    let txnHash = await client.publishPackage(
        moduleAddress,
        new HexString(packageMetadata.toString("hex")).toUint8Array(),
        [
            new TxnBuilderTypes.Module(new HexString(moduleData1.toString("hex")).toUint8Array()),
            new TxnBuilderTypes.Module(new HexString(moduleData2.toString("hex")).toUint8Array()),
            new TxnBuilderTypes.Module(new HexString(moduleData3.toString("hex")).toUint8Array()),
        ]
    );
    await client.waitForTransaction(txnHash, { checkSuccess: true });

    // initialize AuctionHouse
    await client.waitForTransaction(
        await auctionHouseClient.initializeAuctionHouse(ownerAccount, false),
        { checkSuccess: true }
    );

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

    const tokenId = {
        token_data_id: {
            creator: ownerAccount.address().hex(),
            collection: collectionName,
            name: tokenName
        },
        property_version: tokenPropertyVersion.toString()
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


    const minBid = "100000";
    const minBidIncrease = "50000";

    const totalNfts = 50;
    let counter = 0;
    while (counter < totalNfts) {
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
                [(counter * 15).toString(), (counter % 2).toString(), (counter ** 7).toString(), (counter % 12).toString()],
                ["string", "string", "string", "string"]
            ),
            { checkSuccess: true }
        );

        // Create auction
        if (counter < totalNfts - 10) {
            await client.waitForTransaction(
                await auctionHouseClient.createAuction(
                    ownerAccount,
                    toMicroseconds(Date.now() + (5 * 60 * 1000)),
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
        
        // Add bids to auction 7
        if (counter == 7) {
            let bid = parseInt(minBid);
            for (const account of bidders) {
                await client.waitForTransaction(
                    await auctionHouseClient.bid(
                        account,
                        "7",
                        bid.toString(),
                        aptosCoin
                    ),
                    { checkSuccess: true }
                );
                bid += parseInt(minBidIncrease);
            }
        }

        counter += 1;
    }

}


function toMicroseconds(time: number): string {
    return time.toString() + "000";
}