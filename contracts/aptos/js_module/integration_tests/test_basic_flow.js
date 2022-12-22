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
const assert_1 = __importDefault(require("assert"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const shelljs_1 = __importDefault(require("shelljs"));
const auctionHouseClient_1 = require("../ts_client/auctionHouseClient");
const env_1 = require("./env");
/* This test:
 * 1. Creates an NFT collection
 * 2. Creates an AuctionHouse
 * 3. Sets up auctions of NFTs from the collection
 *    with price in aptos token
 * 4. Users bid in the auction
 * 5. Final winner claims prize
 * 6. Auction owner claims coins
*/
const BASE_FUNDS = 500000000;
const aptosCoin = "0x1::aptos_coin::AptosCoin";
const INDEXER_MAINNET = "https://indexer.mainnet.aptoslabs.com/v1/graphql";
function testBasicFlow(client, faucetClient, coinClient, tokenClient) {
    return __awaiter(this, void 0, void 0, function* () {
        // create and fund base accounts
        const moduleAddress = new aptos_1.AptosAccount();
        const ownerAccount = new aptos_1.AptosAccount();
        const bidder1 = new aptos_1.AptosAccount();
        const bidder2 = new aptos_1.AptosAccount();
        const bidder3 = new aptos_1.AptosAccount();
        console.log("module address is: " + moduleAddress.address().hex());
        console.log("contract address is: " + ownerAccount.address().hex());
        yield faucetClient.fundAccount(moduleAddress.address(), BASE_FUNDS);
        yield faucetClient.fundAccount(ownerAccount.address(), BASE_FUNDS);
        yield faucetClient.fundAccount(bidder1.address(), BASE_FUNDS);
        yield faucetClient.fundAccount(bidder2.address(), BASE_FUNDS);
        yield faucetClient.fundAccount(bidder3.address(), BASE_FUNDS);
        const auctionHouseClient = new auctionHouseClient_1.AuctionHouseClient(env_1.NODE_URL, INDEXER_MAINNET, moduleAddress.address().hex(), ownerAccount.address().hex());
        console.log(yield auctionHouseClient.getNftsInWallet("0x2c61f085e96df9f58b4fd3af15c7c1ba5c520e69b091f7bd189f9ea4e643fe9d", 0, 50));
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
        yield client.waitForTransaction(yield auctionHouseClient.initializeAuctionHouse(ownerAccount, ownerAccount.address().hex(), true), { checkSuccess: true });
        // authorize aptosCoin
        yield client.waitForTransaction(yield auctionHouseClient.addAuthorizedCoin(ownerAccount, aptosCoin), { checkSuccess: true });
        // assert that getAuthorizedCoins works
        const authorizedCoins = yield auctionHouseClient.getAuthorizedCoins();
        (0, assert_1.default)(authorizedCoins.includes(aptosCoin));
        (0, assert_1.default)(authorizedCoins.length == 1);
        // authorize bidder1 to create auction
        yield client.waitForTransaction(yield auctionHouseClient.addAuthorizedUser(ownerAccount, bidder1.address().hex()), { checkSuccess: true });
        (0, assert_1.default)(yield auctionHouseClient.isUserAuthorized(bidder1.address().hex()));
        (0, assert_1.default)(!(yield auctionHouseClient.isUserAuthorized(bidder2.address().hex())));
        // create NFT collection and token for auctioning
        const collectionName = "A dumb name";
        const tokenName = "1st dumb token";
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
        // create token (NFT) in collection
        yield client.waitForTransaction(yield tokenClient.createToken(ownerAccount, collectionName, tokenName, "Another description here", 1, "https://aptos.dev/img/nyan.jpeg"), { checkSuccess: true });
        // Authorize NFT Collection
        yield client.waitForTransaction(yield auctionHouseClient.addAuthorizedCollection(ownerAccount, nftCollection), { checkSuccess: true });
        // assert that getAuthorizedCoins works
        const authorizedNfts = yield auctionHouseClient.getAuthorizedNftCollections();
        // assert(authorizedNfts[0].creator == nftCollection.creator);
        // assert(authorizedNfts[0].collectionName == nftCollection.collectionName);
        (0, assert_1.default)(authorizedNfts.length == 1);
        // Create auction
        yield client.waitForTransaction(yield auctionHouseClient.createAuction(ownerAccount, toMicroseconds(Date.now() * 2), "1000", "10", nftCollection.creator, nftCollection.collectionName, tokenName, tokenPropertyVersion.toString(), aptosCoin), { checkSuccess: true });
        const auctionsLen = yield auctionHouseClient.getAllAuctionsLen();
        (0, assert_1.default)(auctionsLen == 1);
        const allAuctions = yield auctionHouseClient.getAllAuctions(0, auctionsLen);
        (0, assert_1.default)(allAuctions.length == 1);
        const createdByUserLen = yield auctionHouseClient.getCreatedByUserAuctionsLen(ownerAccount.address().hex());
        (0, assert_1.default)(createdByUserLen == 1);
        const createdByUserLen2 = yield auctionHouseClient.getCreatedByUserAuctionsLen(bidder1.address().hex());
        (0, assert_1.default)(createdByUserLen2 == 0);
        const createdByUser = auctionHouseClient.getCreatedByUserAuctions(ownerAccount.address().hex(), 0, 10);
        // bid
        yield client.waitForTransaction(yield auctionHouseClient.bid(bidder1, "0", "10000", aptosCoin), { checkSuccess: true });
        const bidByUserLen = yield auctionHouseClient.getBidByUserAuctionsLen(bidder1.address().hex());
        (0, assert_1.default)(bidByUserLen == 1);
        const bidByUser = yield auctionHouseClient.getBidByUserAuctions(bidder1.address().hex(), 0, 10);
        const bidsAuction0 = yield auctionHouseClient.getBidsAuction("0");
        (0, assert_1.default)(bidsAuction0.length == 1);
        const bidsAuction1 = yield auctionHouseClient.getBidsAuction("1");
        (0, assert_1.default)(bidsAuction1.length == 0);
    });
}
exports.testBasicFlow = testBasicFlow;
function toMicroseconds(time) {
    return time.toString() + "000";
}
