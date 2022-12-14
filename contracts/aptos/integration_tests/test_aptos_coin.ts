<<<<<<< HEAD
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
import { NODE_URL } from "./env";

=======
import { 
    AptosClient, 
    CoinClient, 
    FaucetClient, 
    TokenClient,
    AptosAccount,
 } from "aptos";
import { AuctionHouseClient } from "./auctionHouseClient";
>>>>>>> 220dae8 (checkpoint integration tests)

/* This test:
 * 1. Creates an NFT collection
 * 2. Creates an AuctionHouse
 * 3. Sets up auctions of NFTs from the collection
 *    with price in aptos token
 * 4. Users bid in the auction
 * 5. Final winner claims prize
 * 6. Auction owner claims coins
*/
<<<<<<< HEAD
const BASE_FUNDS = 500_000_000;
const aptosCoin = "0x1::aptos_coin::AptosCoin";
=======
const BASE_FUNDS = 100_000_000;
>>>>>>> 220dae8 (checkpoint integration tests)

export async function testAptosCoin(
    client: AptosClient,
    faucetClient: FaucetClient,
    coinClient: CoinClient,
    tokenClient: TokenClient,
<<<<<<< HEAD
): Promise<void> {
    // create and fund base accounts
    const moduleAddress = new AptosAccount();
=======
    auctionHouseClient: AuctionHouseClient
): Promise<void> {
    // create and fund base accounts
>>>>>>> 220dae8 (checkpoint integration tests)
    const ownerAccount = new AptosAccount();
    const bidder1 = new AptosAccount();
    const bidder2 = new AptosAccount();
    const bidder3 = new AptosAccount();

<<<<<<< HEAD
    await faucetClient.fundAccount(moduleAddress.address(), BASE_FUNDS);
=======
>>>>>>> 220dae8 (checkpoint integration tests)
    await faucetClient.fundAccount(ownerAccount.address(), BASE_FUNDS);
    await faucetClient.fundAccount(bidder1.address(), BASE_FUNDS);
    await faucetClient.fundAccount(bidder2.address(), BASE_FUNDS);
    await faucetClient.fundAccount(bidder3.address(), BASE_FUNDS);

<<<<<<< HEAD
    const auctionHouseClient = new AuctionHouseClient(NODE_URL, moduleAddress.address().hex(), ownerAccount.address().hex());

    // deploy module
    console.log(`moduleAddress is ${moduleAddress.address().hex()}`)

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
        await auctionHouseClient.initializeAuctionHouse(ownerAccount, true),
        { checkSuccess: true }
    );

    // authorize aptosCoin
    await client.waitForTransaction(
        await auctionHouseClient.addAuthorizedCoin(ownerAccount, aptosCoin),
        { checkSuccess: true }
    );

    // assert that getAuthorizedCoins works
    const authorizedCoins = await auctionHouseClient.getAuthorizedCoins();
    assert(authorizedCoins.includes(aptosCoin));
    assert(authorizedCoins.length == 1);


    // authorize bidder1 to create auction
    await client.waitForTransaction(
        await auctionHouseClient.addAuthorizedUser(ownerAccount, bidder1.address().hex()),
        { checkSuccess: true }
    );
    assert(await auctionHouseClient.isUserAuthorized(bidder1.address().hex()))
    assert(!(await auctionHouseClient.isUserAuthorized(bidder2.address().hex())))


=======
    // initialize AuctionHouse
    await client.waitForTransaction(
        await auctionHouseClient.initializeAuctionHouse(ownerAccount, false),
        { checkSuccess: true }
    );
    
>>>>>>> 220dae8 (checkpoint integration tests)
    // create NFT collection and token for auctioning
    const collectionName = "A dumb name";
    const tokenName = "1st dumb token";
    const tokenPropertyVersion = 0;

<<<<<<< HEAD
    const nftCollection = {
        creator: ownerAccount.address().hex(),
        collectionName
    };

=======
>>>>>>> 220dae8 (checkpoint integration tests)
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

    // create token (NFT) in collection
    await client.waitForTransaction(
        await tokenClient.createToken(
            ownerAccount,
            collectionName,
            tokenName,
            "Another description here",
            1,
            "https://aptos.dev/img/nyan.jpeg"
        ),
        { checkSuccess: true }
    );

<<<<<<< HEAD
    // Authorize NFT Collection
    await client.waitForTransaction(
        await auctionHouseClient.addAuthorizedCollection(ownerAccount, nftCollection),
        { checkSuccess: true }
    );

    // assert that getAuthorizedCoins works
    const authorizedNfts = await auctionHouseClient.getAuthorizedNftCollections();
    // assert(authorizedNfts[0].creator == nftCollection.creator);
    // assert(authorizedNfts[0].collectionName == nftCollection.collectionName);
    assert(authorizedNfts.length == 1);

    // Create auction
    await client.waitForTransaction(
        await auctionHouseClient.createAuction(
            ownerAccount,
            toMicroseconds(Date.now() * 2),
            "1000",
            "10",
            nftCollection.creator,
            nftCollection.collectionName,
            tokenName,
            tokenPropertyVersion.toString(),
            aptosCoin
        ),
        { checkSuccess: true }
    );

    const auctionsLen = await auctionHouseClient.getAllAuctionsLen();
    assert(auctionsLen == 1);

    const allAuctions = await auctionHouseClient.getAllAuctions(0, auctionsLen);
    console.log(allAuctions);
    assert(allAuctions.length == 1);

    const createdByUserLen = await auctionHouseClient.getCreatedByUserAuctionsLen(ownerAccount.address().hex());
    assert(createdByUserLen == 1);

    const createdByUserLen2 = await auctionHouseClient.getCreatedByUserAuctionsLen(bidder1.address().hex());
    assert(createdByUserLen2 == 0);

    const createdByUser = auctionHouseClient.getCreatedByUserAuctions(ownerAccount.address().hex(), 0, 10);

    // bid
    await client.waitForTransaction(
        await auctionHouseClient.bid(
            bidder1,
            "0",
            "10000",
            aptosCoin
        ),
        { checkSuccess: true }
    );

    const bidByUserLen = await auctionHouseClient.getBidByUserAuctionsLen(bidder1.address().hex());
    assert(bidByUserLen == 1);
    const bidByUser = await auctionHouseClient.getBidByUserAuctions(bidder1.address().hex(), 0, 10);

    const bidsAuction0 = await auctionHouseClient.getBidsAuction("0");
    assert(bidsAuction0.length == 1);

    const bidsAuction1 = await auctionHouseClient.getBidsAuction("1");
    assert(bidsAuction1.length == 0);
}


function toMicroseconds(time: number): string {
    return time.toString() + "000";
=======


>>>>>>> 220dae8 (checkpoint integration tests)
}