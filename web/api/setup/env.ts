import { AptosClient, CoinClient, TokenClient } from "aptos"
import { AuctionHouseClient } from "contract_aptos"
import { NODE_URL, MODULE_ADDRESS, AUCTION_HOUSE_ADDRESS, GRAPHQL_URL } from "./constants"

export const aptosClient = new AptosClient(NODE_URL)
export const coinClient = new CoinClient(aptosClient)
export const AuctionClient = new AuctionHouseClient(NODE_URL, GRAPHQL_URL, MODULE_ADDRESS, AUCTION_HOUSE_ADDRESS);
export const tokenClient = new TokenClient(aptosClient)