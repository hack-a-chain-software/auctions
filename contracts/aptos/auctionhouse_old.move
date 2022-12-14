module auctionhouse::AuctionHouse {
    use aptos_framework::coin::{Self, Coin};
    use aptos_std::table::{Self, Table};
    use aptos_framework::timestamp::Timestamp;
    use aptos_token::token::{Self, Token, TokenId};
    use std::option::{Self, Option};
    use std::event::{Self, EventHandle};
    use std::error;
    use std::signer::{Self, Signer};
    use std::string::{Self, String};
    use std::vector;

    const ERROR_INVALID_BUYER: u64 = 0;
    const ERROR_INSUFFICIENT_BID: u64 = 1;
    const ERROR_AUCTION_INACTIVE: u64 = 2;
    const ERROR_AUCTION_NOT_COMPLETE: u64 = 3;
    const ERROR_NOT_CLAIMABLE: u64 = 4;
    const ERROR_CLAIM_COINS_FIRST: u64 = 5;
    const ERROR_ALREADY_CLAIMED: u64 = 6;

    struct AuctionItem has key, store {
        min_selling_price: u64,
        duration: u64,
        start_time: u64,
        current_bid: u64,
        current_bidder: address,
        locked_token: Option<Token>,
    }

    struct CoinEscrow has key {
        locked_coins: Table<TokenId, Coin<TestCoin>>,
    }

    // Set of data sent to the event stream during a auctioning a token
    struct AuctionEvent has store, drop {
        id: TokenId,
        min_selling_price: u64,
        duration: u64
    }

    // Set of data sent to the event stream during a bidding for a token
    struct BidEvent has store, drop {
        id: TokenId,
        bid: u64,
    }

    // Set of data sent to the event stream during a bidding for a token
    struct ClaimCoinsEvent has store, drop {
        id: TokenId,
    }

    // Set of data sent to the event stream during a bidding for a token
    struct ClaimTokenEvent has store, drop {
        id: TokenId,
    }

    struct AuctionData has key {
        auction_items: Table<TokenId, AuctionItem>,
        auction_events: EventHandle<AuctionEvent>,
        bid_events: EventHandle<BidEvent>,
        claim_coins_events: EventHandle<ClaimCoinsEvent>,
        claim_token_events: EventHandle<ClaimTokenEvent>,
    }

    public entry fun initialize_auction(sender: &signer, creator: address, collection_name: vector<u8>, name: vector<u8>, min_selling_price: u64, duration: u64) acquires AuctionData {
        let token_id = token::create_token_id_raw(creator, collection_name, name);
        let sender_addr = signer::address_of(sender);
        if (!exists<AuctionData>(sender_addr)) {
            move_to(sender, AuctionData {
                auction_items: table::new<TokenId, AuctionItem>(),
                auction_events: event::new_event_handle<AuctionEvent>(sender),
                bid_events: event::new_event_handle<BidEvent>(sender),
                claim_coins_events: event::new_event_handle<ClaimCoinsEvent>(sender),
                claim_token_events: event::new_event_handle<ClaimTokenEvent>(sender),
            });
        };
        let start_time = timestamp::now_microseconds();
        let token = token::withdraw_token(sender, token_id, 1);

        let auction_data = borrow_global_mut<AuctionData>(sender_addr);
        let auction_items = &mut auction_data.auction_items;

        // if auction_items still contain token_id, this means that when sender_addr last auctioned this token,
        // they did not claim the coins from the highest bidder
        // sender_addr has received the same token somehow but has not claimed the coins from the initial auction
        assert!(!table::contains(auction_items, token_id), ERROR_CLAIM_COINS_FIRST);

        event::emit_event<AuctionEvent>(
            &mut auction_data.auction_events,
            AuctionEvent { id: token_id, min_selling_price: min_selling_price, duration: duration },
        );

        table::add(auction_items, token_id, AuctionItem {
            min_selling_price,
            duration,
            start_time,
            current_bid: min_selling_price - 1,
            current_bidder: sender_addr,
            locked_token: option::some(token),
        })
    }

    fun is_auction_active(start_time: u64, duration: u64): bool {
        let current_time = timestamp::now_microseconds();
        current_time <= start_time + duration && current_time >= start_time
    }

    fun is_auction_complete(start_time: u64, duration: u64): bool {
        let current_time = timestamp::now_microseconds();
        current_time > start_time + duration
    }

    public entry fun bid(sender: &signer, seller: address, creator: address, collection_name: vector<u8>, name: vector<u8>, bid: u64) acquires CoinEscrow, AuctionData {
        let token_id = token::create_token_id_raw(creator, collection_name, name);
        let sender_addr = signer::address_of(sender);
        assert!(sender_addr != seller, ERROR_INVALID_BUYER);

        let auction_data = borrow_global_mut<AuctionData>(seller);
        let auction_items = &mut auction_data.auction_items;
        let auction_item = table::borrow_mut(auction_items, token_id);
        assert!(is_auction_active(auction_item.start_time, auction_item.duration), ERROR_AUCTION_INACTIVE);

        assert!(bid > auction_item.current_bid, ERROR_INSUFFICIENT_BID);

        if (!exists<CoinEscrow>(sender_addr)) {
            move_to(sender, CoinEscrow {
                locked_coins: table::new<TokenId, Coin<TestCoin>>()
            });
        };

        if (auction_item.current_bidder != seller) {
            let current_bidder_locked_coins = &mut borrow_global_mut<CoinEscrow>(auction_item.current_bidder).locked_coins;
            let coins = table::remove(current_bidder_locked_coins, token_id);
            coin::deposit<TestCoin>(auction_item.current_bidder, coins);
        };

        event::emit_event<BidEvent>(
            &mut auction_data.bid_events,
            BidEvent { id: token_id, bid: bid },
        );

        let locked_coins = &mut borrow_global_mut<CoinEscrow>(sender_addr).locked_coins;
        let coins = coin::withdraw<TestCoin>(sender, bid);
        table::add(locked_coins, token_id, coins);
        auction_item.current_bidder = sender_addr;
        auction_item.current_bid = bid;
    }

    public entry fun claim_token(sender: &signer, seller: address, creator: address, collection_name: vector<u8>, name: vector<u8>) acquires CoinEscrow, AuctionData {
        let token_id = token::create_token_id_raw(creator, collection_name, name);
        let sender_addr = signer::address_of(sender);

        let auction_data = borrow_global_mut<AuctionData>(seller);
        let auction_items = &mut auction_data.auction_items;
        let auction_item = table::borrow_mut(auction_items, token_id);
        assert!(is_auction_complete(auction_item.start_time, auction_item.duration), ERROR_AUCTION_NOT_COMPLETE);

        assert!(sender_addr == auction_item.current_bidder, ERROR_NOT_CLAIMABLE);

        event::emit_event<ClaimTokenEvent>(
            &mut auction_data.claim_token_events,
            ClaimTokenEvent { id: token_id },
        );

        let token = option::extract(&mut auction_item.locked_token);
        token::deposit_token(sender, token);

        // the auction item can be removed from the auctiondata of the seller once the token and coins are claimed
        let locked_coins = &mut borrow_global_mut<CoinEscrow>(sender_addr).locked_coins;
        // deposit the locked coins to the seller's sender if they have not claimed yet
        if (table::contains(locked_coins, token_id)){
            event::emit_event<ClaimCoinsEvent>(
                &mut auction_data.claim_coins_events,
                ClaimCoinsEvent { id: token_id },
            );
            let coins = table::remove(locked_coins, token_id);
            coin::deposit<TestCoin>(seller, coins);
        };
        let AuctionItem{min_selling_price: _, duration: _, start_time: _, current_bid: _, current_bidder: _, locked_token: locked_token} = table::remove(auction_items, token_id);
        option::destroy_none(locked_token);
    }

    public entry fun claim_coins(sender: &signer, creator: address, collection_name: vector<u8>, name: vector<u8>) acquires CoinEscrow, AuctionData {
        let token_id = token::create_token_id_raw(creator, collection_name, name);
        let sender_addr = signer::address_of(sender);

        let auction_data = borrow_global_mut<AuctionData>(sender_addr);
        let auction_items = &mut auction_data.auction_items;

        assert!(table::contains(auction_items, token_id), ERROR_ALREADY_CLAIMED);
        let auction_item = table::borrow(auction_items, token_id);
        assert!(is_auction_complete(auction_item.start_time, auction_item.duration), ERROR_AUCTION_NOT_COMPLETE);
        assert!(sender_addr!=auction_item.current_bidder, ERROR_NOT_CLAIMABLE);

        let locked_coins = &mut borrow_global_mut<CoinEscrow>(auction_item.current_bidder).locked_coins;
        assert!(table::contains(locked_coins, token_id), ERROR_ALREADY_CLAIMED);
        event::emit_event<ClaimCoinsEvent>(
            &mut auction_data.claim_coins_events,
            ClaimCoinsEvent { id: token_id },
        );
        let coins = table::remove(locked_coins, token_id);
        coin::deposit<TestCoin>(sender_addr, coins);

        // if the locked token from sender_addr doesn't contain the key token_id, the highest bidder has already claimed the token
        // and the auction item can be removed from the auctiondata of the seller

        let AuctionItem{min_selling_price: _, duration: _, start_time: _, current_bid: _, current_bidder: _, locked_token: locked_token} = table::remove(auction_items, token_id);
        option::destroy_none(locked_token);
    }
}