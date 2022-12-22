"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedTestnet = void 0;
const aptos_1 = require("aptos");
require("isomorphic-unfetch");
const auctionHouseClient_1 = require("../ts_client/auctionHouseClient");
const env_1 = require("./env");
/* This script:
 * 1. Deploys auctions module
 * 2. Instantiates module for owner account
 * 3. Creates 100 running NFT auctions
*/
const aptosCoin = "0x1::aptos_coin::AptosCoin";
const INDEXER_MAINNET = "https://indexer.mainnet.aptoslabs.com/v1/graphql";
seedTestnet();
function seedTestnet() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new aptos_1.AptosClient(env_1.NODE_URL);
        const tokenClient = new aptos_1.TokenClient(client);
        // create and fund base accounts
        const moduleAddress = new aptos_1.AptosAccount(Uint8Array.from(Buffer.from(process.argv[2].slice(2), 'hex')));
        const ownerAccount = new aptos_1.AptosAccount(Uint8Array.from(Buffer.from(process.argv[3].slice(2), 'hex')));
        console.log("module address is: " + moduleAddress.address().hex());
        console.log("owner address is: " + ownerAccount.address().hex());
        console.log("owner private key is: " + ownerAccount.toPrivateKeyObject().privateKeyHex);
        const auctionHouseClient = new auctionHouseClient_1.AuctionHouseClient(env_1.NODE_URL, INDEXER_MAINNET, moduleAddress.address().hex(), ownerAccount.address().hex());
        // authorize aptosCoin
        yield client.waitForTransaction(yield auctionHouseClient.addAuthorizedCoin(ownerAccount, aptosCoin), { checkSuccess: true });
        // create NFT collection and token for auctioning
        const collectionName = "Sample collection";
        const tokenName = "Token name #";
        const tokenPropertyVersion = 0;
        const nftCollection = {
            creator: ownerAccount.address().hex(),
            collectionName
        };
        // // create collection
        // await client.waitForTransaction(
        //     await tokenClient.createCollection(
        //         ownerAccount,
        //         collectionName,
        //         "A random description",
        //         "https://something.io"
        //     ),
        //     { checkSuccess: true }
        // );
        // Authorize NFT Collection
        yield client.waitForTransaction(yield auctionHouseClient.addAuthorizedCollection(ownerAccount, nftCollection), { checkSuccess: true });
        const minBid = "100000000";
        const minBidIncrease = "50000000";
        const totalNfts = 30;
        let counter = 15;
        while (counter < totalNfts) {
            console.log(counter);
            // create tokens (NFT) in collection
            const tokenName = `Token name #${counter + 1}`;
            yield client.waitForTransaction(yield tokenClient.createToken(ownerAccount, collectionName, tokenName, "Another description here", 1, `https://api.therealbirds.com/metadata/${counter + 1}.png`, undefined, undefined, undefined, undefined, ["Height", "Gender", "Clothes", "Other"], ["10", "20", "30", "40"], ["u64", "u64", "u64", "u64"]), { checkSuccess: true });
            // Create auction
            if (counter < 15) {
                yield client.waitForTransaction(yield auctionHouseClient.createAuction(ownerAccount, toMicroseconds(Date.now() + (counter + 1) * (90 * 60 * 1000)), minBid, minBidIncrease, nftCollection.creator, nftCollection.collectionName, tokenName, tokenPropertyVersion.toString(), aptosCoin), { checkSuccess: true });
            }
            counter += 1;
        }
    });
}
exports.seedTestnet = seedTestnet;
function toMicroseconds(time) {
    return time.toString() + "000";
}
