import {
    Types, 
    AptosClient, 
    AptosAccount, 
    FaucetClient, 
    CoinClient, 
    TokenClient
} from 'aptos';
import 'isomorphic-unfetch';

import { NODE_URL, FAUCET_URL } from "./env";

import { testBasicFlow } from './test_basic_flow';

// Initialize clients
const client = new AptosClient(NODE_URL);
const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL);
const coinClient = new CoinClient(client);
const tokenClient = new TokenClient(client);

// Run tests
(async () => {
    await testBasicFlow(client, faucetClient, coinClient, tokenClient);
})()
