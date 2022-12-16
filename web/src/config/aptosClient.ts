import { FaucetClient, AptosClient, CoinClient, TokenClient } from "aptos"
import { AuctionHouseClient } from "contract_aptos"
import { NODE_URL, FAUCET_URL, MODULE_ADDRESS, AUCTION_HOUSE_ADDRESS } from "./aptosConstants"

export const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL)
export const aptosClient = new AptosClient(NODE_URL)
export const coinClient = new CoinClient(aptosClient)
export const AuctionClient = new AuctionHouseClient(NODE_URL, MODULE_ADDRESS, AUCTION_HOUSE_ADDRESS);
export const tokenClient = new TokenClient(aptosClient)