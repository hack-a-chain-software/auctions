import * as dotenv from "dotenv";
dotenv.config();

const moduleName = "AuctionHouse";

const NODE_URL = throwIfUndefined(process.env.NODE_URL );
const FAUCET_URL = throwIfUndefined(process.env.FAUCET_URL );

function throwIfUndefined(input: string | undefined) {
    if (input === undefined) throw "env not set";
    return input
}

export {moduleName, NODE_URL, FAUCET_URL};