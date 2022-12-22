const auctionNetwork = process.env["AUCTION_NETWORK"];

const LOCAL_NODE_URL = "http://127.0.0.1:8080";
const DEVNET_NODE_URL = "https://fullnode.devnet.aptoslabs.com/v1";
const TESTNET_NODE_URL = "https://fullnode.testnet.aptoslabs.com/v1";
const MAINNET_NODE_URL = "https://fullnode.mainnet.aptoslabs.com/v1";

const TESTNET_GRAPHQL_URL = "https://indexer-testnet.staging.gcp.aptosdev.com/v1/graphql";
const MAINNET_GRAPHQL_URL = "https://indexer.mainnet.aptoslabs.com/v1/graphql";
const OTHER_NETS_GRAPHQL_URL = null;

export const MODULE_ADDRESS = process.env["AUCTION_MODULE_ADDRESS"]!;
export const AUCTION_HOUSE_ADDRESS = process.env["AUCTION_INSTANCE_ADDRESS"]!;


console.log(auctionNetwork);
console.log(MODULE_ADDRESS);
console.log(AUCTION_HOUSE_ADDRESS);


let nodeUrl;
let graphqlUrl;
if (auctionNetwork === "mainnet") {
    nodeUrl = MAINNET_NODE_URL;
    graphqlUrl = MAINNET_GRAPHQL_URL;
} else if (auctionNetwork === "testnet") {
    nodeUrl = TESTNET_NODE_URL;
    graphqlUrl = TESTNET_GRAPHQL_URL;
} else if (auctionNetwork === "devnet") {
    nodeUrl = DEVNET_NODE_URL;
    graphqlUrl = OTHER_NETS_GRAPHQL_URL;
} else if (auctionNetwork === "localnet") {
    nodeUrl = LOCAL_NODE_URL;
    graphqlUrl = OTHER_NETS_GRAPHQL_URL;
} else {
    throw new Error(`AUCTION_NETWORK must be mainnet", "testnet", "devnet" or "localnet", found ${auctionNetwork}`)
}

export const NODE_URL = nodeUrl
export const GRAPHQL_URL = graphqlUrl;

