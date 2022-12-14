import {
    Types, 
    AptosClient, 
    AptosAccount, 
    FaucetClient, 
    CoinClient, 
    TokenClient
} from 'aptos';

import { NODE_URL, FAUCET_URL } from "./env";
<<<<<<< HEAD
=======
import { AuctionHouseClient } from './auctionHouseClient';
>>>>>>> 220dae8 (checkpoint integration tests)

import { testAptosCoin } from './test_aptos_coin';

// Initialize clients
const client = new AptosClient(NODE_URL);
const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL);
const coinClient = new CoinClient(client);
const tokenClient = new TokenClient(client);
<<<<<<< HEAD

// Run tests
(async () => {
    await testAptosCoin(client, faucetClient, coinClient, tokenClient);
=======
const auctionHouseClient = new AuctionHouseClient(NODE_URL);

// Run tests
(async () => {
    await testAptosCoin(client, faucetClient, coinClient, tokenClient, auctionHouseClient);
>>>>>>> 220dae8 (checkpoint integration tests)
})()
