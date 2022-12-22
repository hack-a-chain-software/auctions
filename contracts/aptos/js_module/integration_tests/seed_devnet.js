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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testBasicFlow = void 0;
const aptos_1 = require("aptos");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const shelljs_1 = __importDefault(require("shelljs"));
require("isomorphic-unfetch");
const auctionHouseClient_1 = require("../ts_client/auctionHouseClient");
const env_1 = require("./env");
/* This script:
 * 1. Deploys auctions module
 * 2. Instantiates module for owner account
 * 3. Creates 100 running NFT auctions
*/
const BASE_FUNDS = 500000000;
const aptosCoin = "0x1::aptos_coin::AptosCoin";
const INDEXER_MAINNET = "https://indexer.mainnet.aptoslabs.com/v1/graphql";
testBasicFlow();
function testBasicFlow() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new aptos_1.AptosClient(env_1.NODE_URL);
        const faucetClient = new aptos_1.FaucetClient(env_1.NODE_URL, env_1.FAUCET_URL);
        const tokenClient = new aptos_1.TokenClient(client);
        // create and fund base accounts
        const moduleAddress = new aptos_1.AptosAccount();
        const ownerAccount = new aptos_1.AptosAccount();
        const bidder1 = new aptos_1.AptosAccount();
        const bidder2 = new aptos_1.AptosAccount();
        const bidder3 = new aptos_1.AptosAccount();
        const bidders = [bidder1, bidder2, bidder3];
        const mintAddress = process.argv[1];
        console.log("module address is: " + moduleAddress.address().hex());
        console.log("contract address is: " + ownerAccount.address().hex());
        console.log("owner private key is: " + ownerAccount.toPrivateKeyObject().privateKeyHex);
        yield faucetClient.fundAccount(moduleAddress.address(), BASE_FUNDS);
        yield faucetClient.fundAccount(ownerAccount.address(), BASE_FUNDS);
        yield faucetClient.fundAccount(bidder1.address(), BASE_FUNDS);
        yield faucetClient.fundAccount(bidder2.address(), BASE_FUNDS);
        yield faucetClient.fundAccount(bidder3.address(), BASE_FUNDS);
        const auctionHouseClient = new auctionHouseClient_1.AuctionHouseClient(env_1.NODE_URL, INDEXER_MAINNET, moduleAddress.address().hex(), ownerAccount.address().hex());
        // deploy module
        shelljs_1.default.exec(`
        aptos move compile --named-addresses auctionhouse=${moduleAddress.address().hex()} --included-artifacts all --save-metadata
    `);
        const modulePath = path_1.default.join(__dirname, "..");
        const packageMetadata = fs_1.default.readFileSync(path_1.default.join(modulePath, "build", "AuctionHouse", "package-metadata.bcs"));
        const moduleData1 = fs_1.default.readFileSync(path_1.default.join(modulePath, "build", "AuctionHouse", "bytecode_modules", "table_vector.mv"));
        const moduleData2 = fs_1.default.readFileSync(path_1.default.join(modulePath, "build", "AuctionHouse", "bytecode_modules", "table_set.mv"));
        const moduleData3 = fs_1.default.readFileSync(path_1.default.join(modulePath, "build", "AuctionHouse", "bytecode_modules", "AuctionHouse.mv"));
        let txnHash = yield client.publishPackage(moduleAddress, new aptos_1.HexString(packageMetadata.toString("hex")).toUint8Array(), [
            new aptos_1.TxnBuilderTypes.Module(new aptos_1.HexString(moduleData1.toString("hex")).toUint8Array()),
            new aptos_1.TxnBuilderTypes.Module(new aptos_1.HexString(moduleData2.toString("hex")).toUint8Array()),
            new aptos_1.TxnBuilderTypes.Module(new aptos_1.HexString(moduleData3.toString("hex")).toUint8Array()),
        ]);
        yield client.waitForTransaction(txnHash, { checkSuccess: true });
        // initialize AuctionHouse
        yield client.waitForTransaction(yield auctionHouseClient.initializeAuctionHouse(ownerAccount, ownerAccount.address().hex(), false), { checkSuccess: true });
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
        const tokenId = {
            token_data_id: {
                creator: ownerAccount.address().hex(),
                collection: collectionName,
                name: tokenName
            },
            property_version: tokenPropertyVersion.toString()
        };
        // create collection
        yield client.waitForTransaction(yield tokenClient.createCollection(ownerAccount, collectionName, "A random description", "https://something.io"), { checkSuccess: true });
        // Authorize NFT Collection
        yield client.waitForTransaction(yield auctionHouseClient.addAuthorizedCollection(ownerAccount, nftCollection), { checkSuccess: true });
        const minBid = "100000";
        const minBidIncrease = "50000";
        const totalNfts = 50;
        let counter = 0;
        while (counter < totalNfts) {
            console.log(counter);
            // create tokens (NFT) in collection
            const tokenName = `Token name #${counter + 1}`;
            yield client.waitForTransaction(yield tokenClient.createToken(ownerAccount, collectionName, tokenName, "Another description here", 1, `https://api.therealbirds.com/metadata/${counter + 1}.png`, undefined, undefined, undefined, undefined, ["Height", "Gender", "Clothes", "Other"], ["10", "20", "30", "40"], ["u64", "u64", "u64", "u64"]), { checkSuccess: true });
            // Create auction
            if (counter < totalNfts - 10) {
                yield client.waitForTransaction(yield auctionHouseClient.createAuction(ownerAccount, toMicroseconds(Date.now() + (5 * 60 * 1000)), minBid, minBidIncrease, nftCollection.creator, nftCollection.collectionName, tokenName, tokenPropertyVersion.toString(), aptosCoin), { checkSuccess: true });
            }
            // Add bids to auction 7
            if (counter == 7) {
                let bid = parseInt(minBid);
                for (const account of bidders) {
                    yield client.waitForTransaction(yield auctionHouseClient.bid(account, "7", bid.toString(), aptosCoin), { checkSuccess: true });
                    bid += parseInt(minBidIncrease);
                }
            }
            counter += 1;
        }
    });
}
exports.testBasicFlow = testBasicFlow;
function toMicroseconds(time) {
    return time.toString() + "000";
}
