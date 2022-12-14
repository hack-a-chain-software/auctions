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
const aptos_1 = require("aptos");
const env_1 = require("./env");
const test_aptos_coin_1 = require("./test_aptos_coin");
// Initialize clients
const client = new aptos_1.AptosClient(env_1.NODE_URL);
const faucetClient = new aptos_1.FaucetClient(env_1.NODE_URL, env_1.FAUCET_URL);
const coinClient = new aptos_1.CoinClient(client);
const tokenClient = new aptos_1.TokenClient(client);
// Run tests
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, test_aptos_coin_1.testAptosCoin)(client, faucetClient, coinClient, tokenClient);
}))();
