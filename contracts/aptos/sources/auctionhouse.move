module auctionhouse::AuctionHouse {
    
    use auctionhouse::table_set::{Self, TableSet};
    use auctionhouse::table_vector::{Self, TableVector};

    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::account;
    use aptos_framework::timestamp;

    use aptos_token::token::{Self, Token, TokenId};

    use aptos_std::table::{Self, Table};
    use aptos_std::type_info::{Self, TypeInfo};

    use std::option::{Self, Option};
    use std::event::{Self, EventHandle};
    use std::signer;
    use std::string::String;

    // Error consts

    const ERROR_ALREADY_INITIALIZED: u64 = 0;
    const ERROR_UNAUTHORIZED_USER: u64 = 1;
    const ERROR_UNAUTHORIZED_COLLECTION: u64 = 2;
    const ERROR_UNAUTHORIZED_COIN: u64 = 3;
    const ERROR_WRONG_COIN_PASSED: u64 = 4;
    const ERROR_OWNER_RESTRICTED_FUNCTION: u64 = 5;
    const ERROR_INSTANCE_DOES_NOT_HAVE_USER_ALLOWLIST: u64 = 6;
    const ERROR_INSUFFICIENT_BID: u64 = 7;
    const ERROR_AUCTION_INACTIVE: u64 = 8;
    const ERROR_AUCTION_NOT_COMPLETE: u64 = 9;
    const ERROR_NOT_CLAIMABLE: u64 = 10;
    const ERROR_ALREADY_CLAIMED: u64 = 11;
    const ERROR_END_TIME_LESS_THAN_NOW: u64 = 12;
    const ERROR_MIN_SELLING_PRICE_CANNOT_BE_ZERO: u64 = 13;
    const ERROR_COIN_NOT_INITIALIZED: u64 = 14;
    const ERROR_NOT_ENOUGH_COIN_BALANCE: u64 = 15;
    const ERROR_ACCOUNT_NOT_REGISTERED_IN_COIN: u64 = 16;

    // System consts
    
    /// Each bid must run for at least 10 minutes before ending the auction
    const MINIMUM_TIME_AFTER_BID: u64 = 600000000;

    /// Auction representation to be stored
    struct Auction has store {
        id: u64,
        creator: address,
        start_time: u64,
        end_time: u64,
        auction_coin: TypeInfo,
        min_selling_price: u64,
        min_increment: u64,
        current_bid: u64,
        current_bidder: address,
        bid_events: TableVector<BidEvent>,
        locked_token_id: TokenId,
        locked_token: Option<Token>,
        coins_claimed: bool,
    }

    /// stored in each user's account to hold their coins while bidding
    struct CoinEscrow<phantom CoinType> has key {
        /// maps auction_id to the coins locked in that auction
        locked_coins: Table<u64, Coin<CoinType>>,
    }

    /// stored in each user's account to facilitate querying
    /// data that might be relevant for them
    struct UserQueryHelper has key {
        created_auctions: Table<address, TableVector<u64>>,
        bid_auctions: Table<address, TableVector<u64>>,
    }

    /// Internal function to initialize query helper struct
    /// if account doesn't have it yet
    fun create_query_helper(sender: &signer, sender_addr: address) {
        if (!exists<UserQueryHelper>(sender_addr)) {
            move_to(sender, UserQueryHelper {
                created_auctions: table::new<address, TableVector<u64>>(),
                bid_auctions: table::new<address, TableVector<u64>>(),
            });
        };
    }

    fun insert_helper_created(
        helper: &mut UserQueryHelper, 
        auction_house_account: address, 
        id: u64
    ) {
        if (!table::contains(&helper.created_auctions, auction_house_account)) {
            table::add(&mut helper.created_auctions, auction_house_account, table_vector::new<u64>());
        };
        let house_set = table::borrow_mut(&mut helper.created_auctions, auction_house_account);
        table_vector::push(house_set, id);
    }

    fun insert_helper_bid(
        helper: &mut UserQueryHelper, 
        auction_house_account: address, 
        id: u64
    ) {
        if (!table::contains(&helper.bid_auctions, auction_house_account)) {
            table::add(&mut helper.bid_auctions, auction_house_account, table_vector::new<u64>());
        };
        let house_set = table::borrow_mut(&mut helper.bid_auctions, auction_house_account);
        table_vector::push(house_set, id);
    }

    // Set of data sent to the event stream during a auctioning a token
    struct AuctionEvent has store, drop {
        id: u64,
        prize: TokenId,
        min_selling_price: u64,
        min_increment: u64,
        start_time: u64,
        end_time: u64,
    }

    // Set of data sent to the event stream during a bidding for a token
    struct BidEvent has store, drop, copy {
        id: u64,
        timestamp: u64,
        bid: u64,
        account: address,
    }

    // Set of data sent to the event stream during a bidding for a token
    struct ClaimCoinsEvent has store, drop {
        id: u64,
    }

    // Set of data sent to the event stream during a bidding for a token
    struct ClaimTokenEvent has store, drop {
        id: u64,
    }

    /// Struct representing an NFT collection
    struct NftCollection has store, copy, drop {
        creator: address,
        collection_name: String,
    }

    /// Top level structure stored in initializer's account
    /// stores all auctions, events and user data for app
    struct AuctionHouse has key {
        owner: address,
        auctions: TableVector<Auction>,
        allowed_users: Option<TableSet<address>>,
        nft_allowlist: TableSet<NftCollection>,
        coin_allowlist: TableSet<TypeInfo>,
        auction_events: EventHandle<AuctionEvent>,
        bid_events: EventHandle<BidEvent>,
        claim_coins_events: EventHandle<ClaimCoinsEvent>,
        claim_token_events: EventHandle<ClaimTokenEvent>,
    }
    
    /// Used to initialize contract to a new account
    public entry fun initialize_auction_house(
        sender: &signer, 
        restrict_users: bool
    ) {
        let sender_addr = signer::address_of(sender);
        assert!(!exists<AuctionHouse>(sender_addr), ERROR_ALREADY_INITIALIZED);
        
        let allowed_users = if (restrict_users) {
            let collection = table_set::new<address>();
            table_set::insert(&mut collection, sender_addr);
            option::some(collection)
        } else {
            option::none()
        };

        move_to(sender, AuctionHouse {
            owner: sender_addr,
            auctions: table_vector::new<Auction>(),
            allowed_users,
            nft_allowlist: table_set::new<NftCollection>(),
            coin_allowlist: table_set::new<TypeInfo>(),
            auction_events: account::new_event_handle<AuctionEvent>(sender),
            bid_events: account::new_event_handle<BidEvent>(sender),
            claim_coins_events: account::new_event_handle<ClaimCoinsEvent>(sender),
            claim_token_events: account::new_event_handle<ClaimTokenEvent>(sender),
        });
    }

    public entry fun create_auction<CoinType>(
        sender: &signer, 
        auction_house_address: address,
        end_time: u64,
        min_selling_price: u64,
        min_increment: u64,
        creator: address,
        collection_name: String,
        name: String,
        property_version: u64
    ) acquires AuctionHouse, UserQueryHelper {
        let sender_addr = signer::address_of(sender);
        let auction_coin = type_info::type_of<CoinType>();
        let auction_house = borrow_global_mut<AuctionHouse>(auction_house_address);
        let start_time = timestamp::now_microseconds();

        assert!(end_time > start_time, ERROR_END_TIME_LESS_THAN_NOW);
        assert!(min_selling_price > 0, ERROR_MIN_SELLING_PRICE_CANNOT_BE_ZERO);

        // assert that user is authorized to create auctions
        if (option::is_some<TableSet<address>>(&auction_house.allowed_users)) {
            assert!(
                table_set::contains(
                    option::borrow<TableSet<address>>(&auction_house.allowed_users), 
                    sender_addr
                ),
                ERROR_UNAUTHORIZED_USER
            );
        };

        // assert that selected collection is allowed in auctionhouse
        let nft_collection = NftCollection {
            creator,
            collection_name
        };
        assert!(
            table_set::contains(&auction_house.nft_allowlist, nft_collection),
            ERROR_UNAUTHORIZED_COLLECTION
        );

        // assert that selected coin is allowed in auctionhouse
        assert!(
            table_set::contains(&auction_house.coin_allowlist, auction_coin),
            ERROR_UNAUTHORIZED_COIN
        );


        // get reward from user
        let token_id = token::create_token_id_raw(creator, collection_name, name, property_version);
        let token = token::withdraw_token(sender, token_id, 1);

        // build auction object
        let auctions_collection = &mut auction_house.auctions;
        let auction_id = table_vector::len(freeze(auctions_collection));

        let auction = Auction {
            id: auction_id,
            creator: sender_addr,
            start_time,
            end_time,
            auction_coin,
            min_selling_price,
            min_increment,
            current_bid: 0,
            current_bidder: sender_addr,
            bid_events: table_vector::new<BidEvent>(),
            locked_token_id: token_id,
            locked_token: option::some(token),
            coins_claimed: false,
        };

        // insert auction in table_vector
        table_vector::push(auctions_collection, auction);

        // emit event
        event::emit_event<AuctionEvent>(
            &mut auction_house.auction_events,
            AuctionEvent { 
                id: auction_id, 
                prize: token_id, 
                min_selling_price,
                min_increment,
                start_time,
                end_time
            },
        );

        // create query helper if it doesn't exists
        create_query_helper(sender, sender_addr);
        let query_helper = borrow_global_mut<UserQueryHelper>(sender_addr);
        // add created auction to query helper
        insert_helper_created(query_helper, auction_house_address, auction_id);
        
    }

    fun is_auction_active(auction: &Auction): bool {
        let current_time = timestamp::now_microseconds();
        current_time <= auction.end_time
    }

    fun is_auction_complete(auction: &Auction): bool {
        let current_time = timestamp::now_microseconds();
        current_time > auction.end_time
    }

    public entry fun bid<CoinType>(
        sender: &signer, 
        auction_house_address: address,
        id: u64,
        bid: u64
    ) acquires CoinEscrow, AuctionHouse, UserQueryHelper {
        let sender_addr = signer::address_of(sender);
        let now_timestamp = timestamp::now_microseconds();

        let auction_house = borrow_global_mut<AuctionHouse>(auction_house_address);
        let auction_items = &mut auction_house.auctions;
        let auction_item = table_vector::get_borrow_mut<Auction>(auction_items, id);

        // assert that auction is still live
        assert!(is_auction_active(freeze(auction_item)), ERROR_AUCTION_INACTIVE);

        // assert bid is greater than current highest bid
        assert!(
            bid > auction_item.current_bid &&
            bid >= auction_item.current_bid + auction_item.min_increment, 
            ERROR_INSUFFICIENT_BID
        );

        // assert sender is providing the correct coin
        assert!(
            type_info::type_of<CoinType>() == auction_item.auction_coin,
            ERROR_WRONG_COIN_PASSED
        );

        // create coin escrow for bidder if it doesn't exists
        if (!exists<CoinEscrow<CoinType>>(sender_addr)) {
            move_to(sender, CoinEscrow {
                locked_coins: table::new<u64, Coin<CoinType>>()
            });
        };

        // Assert user has enough coins
        assert!(coin::is_account_registered<CoinType>(sender_addr), ERROR_NOT_ENOUGH_COIN_BALANCE);
        assert!(coin::balance<CoinType>(sender_addr) >= bid, ERROR_NOT_ENOUGH_COIN_BALANCE);

        // create query helper if it doesn't exists
        create_query_helper(sender, sender_addr);
        let query_helper = borrow_global_mut<UserQueryHelper>(sender_addr);
        // add bid auction to query helper
        insert_helper_bid(query_helper, auction_house_address, id);

        // return previous high bid to previous high bidder
        // does not execute if there are no current bids (current_bid == 0)
        if (auction_item.current_bid > 0) {
            let current_bidder_locked_coins = &mut borrow_global_mut<CoinEscrow<CoinType>>(auction_item.current_bidder).locked_coins;
            let coins = table::remove(current_bidder_locked_coins, id);
            coin::deposit<CoinType>(auction_item.current_bidder, coins);
        };

        // emit bid events
        event::emit_event<BidEvent>(
            &mut auction_house.bid_events,
            BidEvent { 
                id, 
                timestamp: now_timestamp,
                bid,
                account: sender_addr
            },
        );

        table_vector::push<BidEvent>(
            &mut auction_item.bid_events,
            BidEvent { 
                id, 
                timestamp: now_timestamp,
                bid,
                account: sender_addr
            },
        );

        // Deposit coins to cover new bid
        let locked_coins = &mut borrow_global_mut<CoinEscrow<CoinType>>(sender_addr).locked_coins;
        let coins = coin::withdraw<CoinType>(sender, bid);
        table::add(locked_coins, id, coins);
        auction_item.current_bidder = sender_addr;
        auction_item.current_bid = bid;

        // If auction is about to end, increase duration
        if (auction_item.end_time - now_timestamp < MINIMUM_TIME_AFTER_BID) {
            auction_item.end_time = now_timestamp + MINIMUM_TIME_AFTER_BID;
        };

    }

    public entry fun claim_prize(
        sender: &signer,
        auction_house_address: address, 
        id: u64,
    ) acquires AuctionHouse {
        let sender_addr = signer::address_of(sender);

        let auction_house = borrow_global_mut<AuctionHouse>(auction_house_address);
        let auction_items = &mut auction_house.auctions;
        let auction_item = table_vector::get_borrow_mut(auction_items, id);
        
        // assert that auction is already over
        assert!(is_auction_complete(freeze(auction_item)), ERROR_AUCTION_NOT_COMPLETE);

        // assert that sender won the auction
        assert!(sender_addr == auction_item.current_bidder, ERROR_NOT_CLAIMABLE);

        // emit claim event
        event::emit_event<ClaimTokenEvent>(
            &mut auction_house.claim_token_events,
            ClaimTokenEvent { id },
        );

        // send prize token to sender
        let token = option::extract(&mut auction_item.locked_token);
        token::deposit_token(sender, token);
    }

    public entry fun claim_coins<CoinType>(
        sender: &signer, 
        auction_house_address: address, 
        id: u64,
    ) acquires CoinEscrow, AuctionHouse {
        let sender_addr = signer::address_of(sender);

        let auction_house = borrow_global_mut<AuctionHouse>(auction_house_address);
        let auction_items = &mut auction_house.auctions;

        let auction_item = table_vector::get_borrow_mut(auction_items, id);
        
        // assert called CoinType is equal to auction's CoinType
        assert!(
            type_info::type_of<CoinType>() == auction_item.auction_coin,
            ERROR_WRONG_COIN_PASSED
        );

        // assert auction is completed
        assert!(is_auction_complete(freeze(auction_item)), ERROR_AUCTION_NOT_COMPLETE);
        
        // assert coins haven't been claimed yet
        assert!(!auction_item.coins_claimed, ERROR_ALREADY_CLAIMED);

        // only perform deposit logic if there have been bids
        if (auction_item.current_bid > 0) {
            let locked_coins = &mut borrow_global_mut<CoinEscrow<CoinType>>(auction_item.current_bidder).locked_coins;
            event::emit_event<ClaimCoinsEvent>(
                &mut auction_house.claim_coins_events,
                ClaimCoinsEvent { id },
            );
            let coins = table::remove(locked_coins, id);

            // assert user is registered in CoinTytpe
            if (!coin::is_account_registered<CoinType>(sender_addr)) {
                coin::register<CoinType>(sender);
            };
            coin::deposit<CoinType>(sender_addr, coins);
        };
        
        // mark coins as withdrawn in auction
        auction_item.coins_claimed = true;

    }

    // ADMIN METHODS

    public entry fun add_authorized_users(
        sender: &signer,
        auction_house_address: address, 
        user_to_authorize: address,
    ) acquires AuctionHouse {
        let sender_addr = signer::address_of(sender);

        let auction_house = borrow_global_mut<AuctionHouse>(auction_house_address);

        // assert caller is owner
        assert!(sender_addr == auction_house.owner, ERROR_OWNER_RESTRICTED_FUNCTION);

        // assert auction house only accepts authorized users
        assert!(option::is_some(&auction_house.allowed_users), ERROR_INSTANCE_DOES_NOT_HAVE_USER_ALLOWLIST);

        let user_allowlist = option::borrow_mut(&mut auction_house.allowed_users);
        table_set::insert(user_allowlist, user_to_authorize);
    }

    public entry fun remove_authorized_users(
        sender: &signer,
        auction_house_address: address, 
        user_to_remove: address,
    ) acquires AuctionHouse {
        let sender_addr = signer::address_of(sender);

        let auction_house = borrow_global_mut<AuctionHouse>(auction_house_address);

        // assert caller is owner
        assert!(sender_addr == auction_house.owner, ERROR_OWNER_RESTRICTED_FUNCTION);

        // assert auction house only accepts authorized users
        assert!(option::is_some(&auction_house.allowed_users), ERROR_INSTANCE_DOES_NOT_HAVE_USER_ALLOWLIST);

        let user_allowlist = option::borrow_mut(&mut auction_house.allowed_users);
        table_set::remove(user_allowlist, user_to_remove);
    }

    public entry fun add_authorized_nft_collections(
        sender: &signer,
        auction_house_address: address, 
        creator: address,
        collection_name: String,
    ) acquires AuctionHouse {
        let sender_addr = signer::address_of(sender);

        let auction_house = borrow_global_mut<AuctionHouse>(auction_house_address);

        // assert caller is owner
        assert!(sender_addr == auction_house.owner, ERROR_OWNER_RESTRICTED_FUNCTION);

        table_set::insert(&mut auction_house.nft_allowlist, NftCollection { creator, collection_name });
    }

    public entry fun remove_authorized_nft_collections(
        sender: &signer,
        auction_house_address: address, 
        creator: address,
        collection_name: String,
    ) acquires AuctionHouse {
        let sender_addr = signer::address_of(sender);

        let auction_house = borrow_global_mut<AuctionHouse>(auction_house_address);

        // assert caller is owner
        assert!(sender_addr == auction_house.owner, ERROR_OWNER_RESTRICTED_FUNCTION);

        table_set::remove(&mut auction_house.nft_allowlist, NftCollection { creator, collection_name });
    }
    
    public entry fun add_authorized_coins<CoinType>(
        sender: &signer,
        auction_house_address: address, 
    ) acquires AuctionHouse {
        let sender_addr = signer::address_of(sender);

        let auction_house = borrow_global_mut<AuctionHouse>(auction_house_address);

        // assert caller is owner
        assert!(sender_addr == auction_house.owner, ERROR_OWNER_RESTRICTED_FUNCTION);

        // assert coin exists
        assert!(coin::is_coin_initialized<CoinType>(), ERROR_COIN_NOT_INITIALIZED);

        table_set::insert(&mut auction_house.coin_allowlist, type_info::type_of<CoinType>());
    }

    public entry fun remove_authorized_coins<CoinType>(
        sender: &signer,
        auction_house_address: address, 
    ) acquires AuctionHouse {
        let sender_addr = signer::address_of(sender);

        let auction_house = borrow_global_mut<AuctionHouse>(auction_house_address);

        // assert caller is owner
        assert!(sender_addr == auction_house.owner, ERROR_OWNER_RESTRICTED_FUNCTION);

        table_set::remove(&mut auction_house.coin_allowlist, type_info::type_of<CoinType>());
    }

}

