# Aptos contract

Implemented using the move language.

# Deploying

To deploy the app to localnet or devnet, simply run the yarn scripts `seed:localnet` or `seed:devnet`.

To deploy to testnet or mainnet, it should be done manually using the CLI to ensure proper configuration.

First deploy the module by calling:
```shell
aptos move publish --named-addresses auctionhouse=<address_to_deploy_module_to> \
--profile <module_profile>
```

Then you can instantiate a new auction house by calling:
```shell
aptos move run \
--function-id '<module_address>::AuctionHouse::initialize_auction_house' \
--args 'address:<owner_address>' 'bool:<whether_only_allowed_users_can_create_auctions>' \
--profile <owner_profile>
```

To add an NFT collection:
```shell
aptos move run \
--function-id '<module_address>::AuctionHouse::add_authorized_nft_collections' \
--args 'address:<owner_address>'  'address:<nft_collection_creator_address>' 'string:<nft_collection_name>' \
--profile <owner_profile>
```

To add a Coin to be used in bidding (must add at leat one):
```shell
aptos move run \
--function-id '<module_address>::AuctionHouse::add_authorized_coins' \
--type-args '<coin_type>' \
--args 'address:<owner_address>' \
--profile <owner_profile>
```

To authorize an user to create auctions (owner is automatically authorized):
```shell
aptos move run \
--function-id '<module_address>::AuctionHouse::add_authorized_users' \
--args 'address:<owner_address>' 'address:<user_to_authorize_address>' \
--profile <owner_profile>
```

When running on testnet, you can call `seed:testnet <module_private_key> <owner_private_key>` yarn script to generate a new NFT collection, with 500 NFTs, add it to the app and create 100 Auctions, space each by 30 minutes.

When running on mainnet, all setups must be done manually, according to the contract's API below:

## Contract API