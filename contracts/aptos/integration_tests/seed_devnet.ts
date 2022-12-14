import {
    AptosClient,
    CoinClient,
    FaucetClient,
    TokenClient,
    AptosAccount,
    TxnBuilderTypes,
    HexString
} from "aptos";
import assert from "assert";
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

    const mintAddress = process.argv[1];

    console.log("module address is: " + moduleAddress.address().hex());
    console.log("contract address is: " + ownerAccount.address().hex());
    if (mintAddress != undefined) {
        // console.log("minting 5 extra NFTs to address: " + mintAddress);
    }

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
    console.log("A");
    await client.waitForTransaction(
        await auctionHouseClient.initializeAuctionHouse(ownerAccount, false),
        { checkSuccess: true }
    );

    console.log("B");
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

    console.log("C");
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

    console.log("D");
    // Authorize NFT Collection
    await client.waitForTransaction(
        await auctionHouseClient.addAuthorizedCollection(ownerAccount, nftCollection),
        { checkSuccess: true }
    );


    // create tokens (NFT) in collection
    const totalNfts = 40;

    let promiseArray = [];
    let counter = 0;
    while (counter < totalNfts) {
        const tokenName = `Token name #${counter+1}`;
        await client.waitForTransaction(
            await tokenClient.createToken(
                ownerAccount,
                collectionName,
                tokenName,
                "Another description here",
                1,
                `https://api.therealbirds.com/metadata/${counter + 1}.png`
            ),
            { checkSuccess: true }
        );

        // Create auction
        await client.waitForTransaction(
            await auctionHouseClient.createAuction(
                ownerAccount,
                toMicroseconds(Date.now() + (5 * 60 * 1000)),
                "100000000",
                "50000000",
                nftCollection.creator,
                nftCollection.collectionName,
                tokenName,
                tokenPropertyVersion.toString(),
                aptosCoin
            ),
            { checkSuccess: true }
        );

        counter += 1;
    }
}


function toMicroseconds(time: number): string {
    return time.toString() + "000";
}