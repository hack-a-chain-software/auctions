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
exports.AuctionHouseClient = void 0;
const aptos_1 = require("aptos");
const core_1 = require("@urql/core");
const moduleName = "AuctionHouse";
class AuctionHouseClient extends aptos_1.AptosClient {
    constructor(node_url, graqphqlUrl, moduleAddress, auctionHouseAddress) {
        super(node_url);
        this.auctionHouseAddress = auctionHouseAddress;
        this.contractAddress = moduleAddress;
        this.contractModule = `${moduleAddress}::${moduleName}`;
        if (graqphqlUrl) {
            this.graphqlClient = (0, core_1.createClient)({
                url: graqphqlUrl,
                exchanges: core_1.defaultExchanges
            });
        }
        else {
            this.graphqlClient = null;
        }
    }
    /** Initialize new instance of AuctionHouse */
    initializeAuctionHouse(sender, owner, restrictUsersCreateAuctions) {
        return __awaiter(this, void 0, void 0, function* () {
            const functionName = `${this.contractModule}::initialize_auction_house`;
            const typeArguments = [];
            const regularArguments = [
                owner,
                restrictUsersCreateAuctions
            ];
            return yield this.performTransaction({
                sender,
                functionName,
                typeArguments,
                regularArguments,
            });
        });
    }
    /** Creates a new auction inside auctionhouse by locking an NFT */
    createAuction(sender, endTime, minSellingPrice, minIncrement, creator, collectionName, name, propertyVersion, coinType) {
        return __awaiter(this, void 0, void 0, function* () {
            const functionName = `${this.contractModule}::create_auction`;
            const typeArguments = [coinType];
            const regularArguments = [
                this.auctionHouseAddress,
                endTime,
                minSellingPrice,
                minIncrement,
                creator,
                collectionName,
                name,
                propertyVersion
            ];
            return yield this.performTransaction({
                sender, functionName, typeArguments, regularArguments
            });
        });
    }
    /** Bids on auction of passed id using coinType */
    bid(sender, id, bid, coinType) {
        return __awaiter(this, void 0, void 0, function* () {
            const functionName = `${this.contractModule}::bid`;
            const typeArguments = [coinType];
            const regularArguments = [
                this.auctionHouseAddress,
                id,
                bid,
            ];
            return yield this.performTransaction({
                sender,
                functionName,
                typeArguments,
                regularArguments
            });
        });
    }
    /** After auction is over, highest bidder can claim the nft prize */
    claimPrize(sender, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const functionName = `${this.contractModule}::claim_prize`;
            const typeArguments = [];
            const regularArguments = [
                this.auctionHouseAddress,
                id
            ];
            return yield this.performTransaction({
                sender,
                functionName,
                typeArguments,
                regularArguments
            });
        });
    }
    /** After auction is over, creator can claim coins bid */
    claimCoins(sender, coinType, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const functionName = `${this.contractModule}::claim_coins`;
            const typeArguments = [coinType];
            const regularArguments = [
                this.auctionHouseAddress,
                id
            ];
            return yield this.performTransaction({
                sender,
                functionName,
                typeArguments,
                regularArguments
            });
        });
    }
    // ADMIN METHODS - Will abort if not called by owner
    addAuthorizedUser(sender, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const functionName = `${this.contractModule}::add_authorized_users`;
            const typeArguments = [];
            const regularArguments = [
                this.auctionHouseAddress,
                user
            ];
            return yield this.performTransaction({
                sender,
                functionName,
                typeArguments,
                regularArguments
            });
        });
    }
    removeAuthorizedUser(sender, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const functionName = `${this.contractModule}::remove_authorized_users`;
            const typeArguments = [];
            const regularArguments = [
                this.auctionHouseAddress,
                user
            ];
            return yield this.performTransaction({
                sender,
                functionName,
                typeArguments,
                regularArguments
            });
        });
    }
    addAuthorizedCollection(sender, collection) {
        return __awaiter(this, void 0, void 0, function* () {
            const functionName = `${this.contractModule}::add_authorized_nft_collections`;
            const typeArguments = [];
            const regularArguments = [
                this.auctionHouseAddress,
                collection.creator,
                collection.collectionName
            ];
            return yield this.performTransaction({
                sender,
                functionName,
                typeArguments,
                regularArguments
            });
        });
    }
    removeAuthorizedCollection(sender, collection) {
        return __awaiter(this, void 0, void 0, function* () {
            const functionName = `${this.contractModule}::remove_authorized_nft_collections`;
            const typeArguments = [];
            const regularArguments = [
                this.auctionHouseAddress,
                collection.creator,
                collection.collectionName
            ];
            return yield this.performTransaction({
                sender,
                functionName,
                typeArguments,
                regularArguments
            });
        });
    }
    addAuthorizedCoin(sender, coinType) {
        return __awaiter(this, void 0, void 0, function* () {
            const functionName = `${this.contractModule}::add_authorized_coins`;
            const typeArguments = [coinType];
            const regularArguments = [
                this.auctionHouseAddress,
            ];
            return yield this.performTransaction({
                sender,
                functionName,
                typeArguments,
                regularArguments
            });
        });
    }
    removeAuthorizedCoin(sender, coinType) {
        return __awaiter(this, void 0, void 0, function* () {
            const functionName = `${this.contractModule}::remove_authorized_coins`;
            const typeArguments = [coinType];
            const regularArguments = [
                this.auctionHouseAddress,
            ];
            return yield this.performTransaction({
                sender,
                functionName,
                typeArguments,
                regularArguments
            });
        });
    }
    // READ METHODS
    isUserAuthorized(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = yield this.getAccountResource(this.auctionHouseAddress, `${this.contractModule}::AuctionHouse`);
            const optionVec = resource.data.allowed_users.vec;
            if (optionVec.length > 0) {
                const { handle } = optionVec[0].table;
                try {
                    let authorized = yield this.getTableItem(handle, {
                        key_type: "address",
                        value_type: "bool",
                        key: user
                    });
                    return authorized;
                }
                catch (e) {
                    if ((e.toString()).includes("Table Item not found by Table handle")) {
                        return false;
                    }
                    throw e;
                }
            }
            return true;
        });
    }
    // figure how to fetch all in contract
    getAuthorizedCoins() {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = yield this.getAccountResource(this.auctionHouseAddress, `${this.contractModule}::AuctionHouse`);
            const coinAllowlist = resource.data.coin_allowlist;
            const { handle: vectorHandle } = coinAllowlist.aux_vector.table;
            const { len: vectorLen } = coinAllowlist.aux_vector;
            const { handle } = coinAllowlist.table;
            let returnValue = [];
            let counter = 0;
            while (counter < vectorLen) {
                let typeInfo = yield this.getTableItem(vectorHandle, {
                    key_type: "u64",
                    value_type: "0x1::type_info::TypeInfo",
                    key: counter.toString()
                });
                let authorized = yield this.getTableItem(handle, {
                    key_type: "0x1::type_info::TypeInfo",
                    value_type: "bool",
                    key: typeInfo
                });
                if (authorized) {
                    const moduleName = convertHexToUtf8(typeInfo.module_name);
                    const structName = convertHexToUtf8(typeInfo.struct_name);
                    returnValue.push(`${typeInfo.account_address}::${moduleName}::${structName}`);
                }
                counter += 1;
            }
            return returnValue;
        });
    }
    // figure how to fetch all in contract
    getAuthorizedNftCollections() {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = yield this.getAccountResource(this.auctionHouseAddress, `${this.contractModule}::AuctionHouse`);
            const nftAllowlist = resource.data.nft_allowlist;
            const { handle: vectorHandle } = nftAllowlist.aux_vector.table;
            const { len: vectorLen } = nftAllowlist.aux_vector;
            const { handle } = nftAllowlist.table;
            let returnValue = [];
            let counter = 0;
            while (counter < vectorLen) {
                let nftCollection = yield this.getTableItem(vectorHandle, {
                    key_type: "u64",
                    value_type: `${this.contractModule}::NftCollection`,
                    key: counter.toString()
                });
                let authorized = yield this.getTableItem(handle, {
                    key_type: `${this.contractModule}::NftCollection`,
                    value_type: "bool",
                    key: nftCollection
                });
                if (authorized) {
                    returnValue.push({
                        creator: nftCollection.creator,
                        collectionName: nftCollection.collection_name
                    });
                }
                counter += 1;
            }
            return returnValue;
        });
    }
    getBidsAuction(auctionId) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((yield this.getAllAuctionsLen()) <= parseInt(auctionId))
                return [];
            const resource = yield this.getAccountResource(this.auctionHouseAddress, `${this.contractModule}::AuctionHouse`);
            const { handle } = resource.data.auctions.table;
            let auction = yield this.getTableItem(handle, {
                key_type: "u64",
                value_type: `${this.contractModule}::Auction`,
                key: auctionId
            });
            const { handle: bidEventsHandle } = auction.bid_events.table;
            const { len } = auction.bid_events;
            let returnValue = [];
            let counter = 0;
            let promiseArray = [];
            while (counter < len) {
                promiseArray.push(this.getTableItem(bidEventsHandle, {
                    key_type: "u64",
                    value_type: `${this.contractModule}::BidEvent`,
                    key: counter.toString()
                }));
                counter += 1;
            }
            const bidArray = yield Promise.all(promiseArray);
            for (const bidEvent of bidArray) {
                const returnBid = {
                    id: bidEvent.id,
                    timestamp: bidEvent.timestamp,
                    bid: bidEvent.bid,
                    account: bidEvent.account,
                };
                returnValue.push(returnBid);
            }
            return returnValue;
        });
    }
    getAllAuctionsLen() {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = yield this.getAccountResource(this.auctionHouseAddress, `${this.contractModule}::AuctionHouse`);
            return resource.data.auctions.len;
        });
    }
    getAllAuctions(start, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = yield this.getAccountResource(this.auctionHouseAddress, `${this.contractModule}::AuctionHouse`);
            const { len } = resource.data.auctions;
            const { handle } = resource.data.auctions.table;
            let returnValue = [];
            let counter = 0;
            let promiseArray = [];
            while (counter < limit) {
                if ((start + counter) >= len)
                    break;
                const id = start + counter;
                promiseArray.push(this.getTableItem(handle, {
                    key_type: "u64",
                    value_type: `${this.contractModule}::Auction`,
                    key: id.toString()
                }));
                counter += 1;
            }
            const auctionArray = yield Promise.all(promiseArray);
            for (const auction of auctionArray) {
                const returnAuction = {
                    id: auction.id,
                    creator: auction.creator,
                    startTime: auction.start_time,
                    endTime: auction.end_time,
                    auctionCoin: `${auction.auction_coin.account_address}::${convertHexToUtf8(auction.auction_coin.module_name)}::${convertHexToUtf8(auction.auction_coin.struct_name)}`,
                    minSellingPrice: auction.min_selling_price,
                    minIncrement: auction.min_increment,
                    currentBid: auction.current_bid,
                    currentBidder: auction.current_bidder,
                    lockedTokenId: {
                        token_data_id: {
                            creator: auction.locked_token_id.token_data_id.creator,
                            collection: auction.locked_token_id.token_data_id.collection,
                            name: auction.locked_token_id.token_data_id.name,
                        },
                        property_version: auction.locked_token_id.property_version,
                    },
                    coinsClaimed: auction.coins_claimed,
                    tokenClaimed: this.unwrapOption(auction.locked_token.vec) === null,
                };
                returnValue.push(returnAuction);
            }
            return returnValue;
        });
    }
    getCreatedByUserAuctionsLen(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let resource;
            try {
                resource = yield this.getAccountResource(user, `${this.contractModule}::UserQueryHelper`);
            }
            catch (e) {
                if ((e.toString()).includes("Resource not found by Address")) {
                    return 0;
                }
                throw e;
            }
            const { handle } = resource.data.created_auctions;
            const innerSet = yield this.getTableItem(handle, {
                key_type: "address",
                value_type: `${this.contractAddress}::table_vector::TableVector<u64>`,
                key: this.auctionHouseAddress
            });
            return innerSet.len;
        });
    }
    getCreatedByUserAuctions(user, start, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = yield this.getAccountResource(this.auctionHouseAddress, `${this.contractModule}::AuctionHouse`);
            const { handle } = resource.data.auctions.table;
            let resourceQuery;
            try {
                resourceQuery = yield this.getAccountResource(user, `${this.contractModule}::UserQueryHelper`);
            }
            catch (e) {
                if ((e.toString()).includes("Resource not found by Address")) {
                    return [];
                }
                throw e;
            }
            const { handle: handleQuery } = resourceQuery.data.created_auctions;
            const innerSetQuery = yield this.getTableItem(handleQuery, {
                key_type: "address",
                value_type: `${this.contractAddress}::table_vector::TableVector<u64>`,
                key: this.auctionHouseAddress
            });
            const len = innerSetQuery.len;
            const { handle: handleQueryIter } = innerSetQuery.table;
            let returnValue = [];
            let counter = 0;
            let promiseArray1 = [];
            while (counter < limit) {
                if ((start + counter) >= len)
                    break;
                promiseArray1.push(this.getTableItem(handleQueryIter, {
                    key_type: "u64",
                    value_type: "u64",
                    key: (start + counter).toString()
                }));
                counter += 1;
            }
            const idArray = yield Promise.all(promiseArray1);
            let promiseArray2 = [];
            for (const id of idArray) {
                promiseArray2.push(this.getTableItem(handle, {
                    key_type: "u64",
                    value_type: `${this.contractModule}::Auction`,
                    key: id
                }));
            }
            let auctionArray = yield Promise.all(promiseArray2);
            for (const auction of auctionArray) {
                const returnAuction = {
                    id: auction.id,
                    creator: auction.creator,
                    startTime: auction.start_time,
                    endTime: auction.end_time,
                    auctionCoin: `${auction.auction_coin.account_address}::${convertHexToUtf8(auction.auction_coin.module_name)}::${convertHexToUtf8(auction.auction_coin.struct_name)}`,
                    minSellingPrice: auction.min_selling_price,
                    minIncrement: auction.min_increment,
                    currentBid: auction.current_bid,
                    currentBidder: auction.current_bidder,
                    lockedTokenId: {
                        token_data_id: {
                            creator: auction.locked_token_id.token_data_id.creator,
                            collection: auction.locked_token_id.token_data_id.collection,
                            name: auction.locked_token_id.token_data_id.name,
                        },
                        property_version: auction.locked_token_id.property_version,
                    },
                    coinsClaimed: auction.coins_claimed,
                    tokenClaimed: this.unwrapOption(auction.locked_token.vec) === null,
                };
                returnValue.push(returnAuction);
            }
            return returnValue;
        });
    }
    getBidByUserAuctionsLen(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let resource;
            try {
                resource = yield this.getAccountResource(user, `${this.contractModule}::UserQueryHelper`);
            }
            catch (e) {
                if ((e.toString()).includes("Resource not found by Address")) {
                    return 0;
                }
                throw e;
            }
            const { handle } = resource.data.bid_auctions;
            const innerSet = yield this.getTableItem(handle, {
                key_type: "address",
                value_type: `${this.contractAddress}::table_vector::TableVector<u64>`,
                key: this.auctionHouseAddress
            });
            return innerSet.len;
        });
    }
    getBidByUserAuctions(user, start, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = yield this.getAccountResource(this.auctionHouseAddress, `${this.contractModule}::AuctionHouse`);
            const { handle } = resource.data.auctions.table;
            let resourceQuery;
            try {
                resourceQuery = yield this.getAccountResource(user, `${this.contractModule}::UserQueryHelper`);
            }
            catch (e) {
                if ((e.toString()).includes("Resource not found by Address")) {
                    return [];
                }
                throw e;
            }
            const { handle: handleQuery } = resourceQuery.data.bid_auctions;
            const innerSetQuery = yield this.getTableItem(handleQuery, {
                key_type: "address",
                value_type: `${this.contractAddress}::table_vector::TableVector<u64>`,
                key: this.auctionHouseAddress
            });
            const len = innerSetQuery.len;
            const { handle: handleQueryIter } = innerSetQuery.table;
            let returnValue = [];
            let counter = 0;
            let promiseArray1 = [];
            while (counter < limit) {
                if ((start + counter) >= len)
                    break;
                promiseArray1.push(this.getTableItem(handleQueryIter, {
                    key_type: "u64",
                    value_type: "u64",
                    key: (start + counter).toString()
                }));
                counter += 1;
            }
            const idArray = yield Promise.all(promiseArray1);
            let promiseArray2 = [];
            for (const id of idArray) {
                promiseArray2.push(this.getTableItem(handle, {
                    key_type: "u64",
                    value_type: `${this.contractModule}::Auction`,
                    key: id
                }));
            }
            let auctionArray = yield Promise.all(promiseArray2);
            for (const auction of auctionArray) {
                const returnAuction = {
                    id: auction.id,
                    creator: auction.creator,
                    startTime: auction.start_time,
                    endTime: auction.end_time,
                    auctionCoin: `${auction.auction_coin.account_address}::${convertHexToUtf8(auction.auction_coin.module_name)}::${convertHexToUtf8(auction.auction_coin.struct_name)}`,
                    minSellingPrice: auction.min_selling_price,
                    minIncrement: auction.min_increment,
                    currentBid: auction.current_bid,
                    currentBidder: auction.current_bidder,
                    lockedTokenId: {
                        token_data_id: {
                            creator: auction.locked_token_id.token_data_id.creator,
                            collection: auction.locked_token_id.token_data_id.collection,
                            name: auction.locked_token_id.token_data_id.name,
                        },
                        property_version: auction.locked_token_id.property_version,
                    },
                    coinsClaimed: auction.coins_claimed,
                    tokenClaimed: this.unwrapOption(auction.locked_token.vec) === null,
                };
                returnValue.push(returnAuction);
            }
            return returnValue;
        });
    }
    getCoinInfo(coinType) {
        return __awaiter(this, void 0, void 0, function* () {
            const splitType = coinType.split("::");
            const address = splitType[0];
            const resource = yield this.getAccountResource(address, `0x1::coin::CoinInfo<${coinType}>`);
            return resource.data;
        });
    }
    /** Returns paginated list of all NFTs owned by wallet
     *  in testnet and mainnet uses Graphql API, in devnet
     *  and localnet, uses recurring queries to node REST API
     */
    getNftsInWallet(user, start, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.graphqlClient) {
                const query = (0, core_1.gql) `
                query CurrentTokens($owner_address: String, $offset: Int, $limit: Int) {
                    current_token_ownerships(
                    where: {owner_address: {_eq: $owner_address}, amount: {_gt: "0"}}
                    order_by: {last_transaction_version: desc}
                    offset: $offset
                    limit: $limit
                    ) {
                    creator_address
                    collection_name
                    name
                    property_version
                    amount
                    }
                }          
            `;
                const response = yield this.graphqlClient.query(query, {
                    owner_address: user,
                    offset: start,
                    limit: limit
                }).toPromise();
                return response.data.current_token_ownerships.map((el) => {
                    return {
                        creator: el.creator_address,
                        collectionName: el.collection_name,
                        name: el.name,
                        propertyVersion: el.property_version,
                    };
                });
            }
            else {
                const tokenClient = new aptos_1.TokenClient(this);
                // Get all the authorized collections on AuctionHouse
                const collections = yield this.getAuthorizedNftCollections();
                // Get the amount of events (NFTs) each collection has
                const counter = yield Promise.all(collections.map(collection => this.getAccountResource(collection.creator, "0x3::token::Collections").then(({ data }) => data.mint_token_events.counter)));
                // Fetch all events (NFTs) of all collections on AuctionHouse
                const events = yield Promise.all(collections.map((collection, key) => {
                    const events = [];
                    // limit of results is 25/request
                    for (let start = 0; start < counter[key]; start += 25) {
                        events.push(this.getEventsByEventHandle(collections[0].creator, "0x3::token::Collections", "mint_token_events", {
                            start: start,
                            limit: 25
                        }));
                    }
                    return events;
                }).flat()).then(list => list.flat());
                // Fetch if user is owner of each of the AuctionHouse NFTs
                const list = yield Promise.all(events.map(({ data: { id: nft } }) => tokenClient.getToken(nft.creator, nft.collection, nft.name)
                    .then(token => tokenClient.getTokenForAccount(user, token.id))));
                // Filter the NFTs the user is onwer and convert to NftItem
                return list.filter(nft => nft.amount === '1').map(nft => ({
                    creator: nft.id.token_data_id.creator,
                    collectionName: nft.id.token_data_id.collection,
                    name: nft.id.token_data_id.name,
                    propertyVersion: Number(nft.id.property_version)
                }));
            }
        });
    }
    // UTILITIES
    performTransaction({ sender, functionName, typeArguments, regularArguments, }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof sender === "function") {
                const payload = {
                    type: 'entry_function_payload',
                    function: functionName,
                    type_arguments: typeArguments,
                    arguments: regularArguments
                };
                const { hash } = yield sender(payload);
                return hash;
            }
            else {
                const rawTxn = yield this.generateTransaction(sender.address(), {
                    function: functionName,
                    type_arguments: typeArguments,
                    arguments: regularArguments
                });
                const bcsTxn = yield this.signTransaction(sender, rawTxn);
                const pendingTxn = yield this.submitTransaction(bcsTxn);
                return pendingTxn.hash;
            }
        });
    }
    unwrapOption(optionElem) {
        if (optionElem.length > 0) {
            return optionElem[0];
        }
        else {
            return null;
        }
    }
}
exports.AuctionHouseClient = AuctionHouseClient;
function convertHexToUtf8(hex) {
    return Buffer.from(hex.slice(2), "hex").toString("utf-8");
}
