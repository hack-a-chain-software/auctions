import * as dotenv from "dotenv"
dotenv.config()

const moduleName = "AuctionHouse"

const NODE_URL = "https://fullnode.devnet.aptoslabs.com/v1"
const FAUCET_URL = "https://faucet.devnet.aptoslabs.com"

function throwIfUndefined(input: string | undefined) {
	if (input === undefined) throw "env not set"
	return input
}

export { moduleName, NODE_URL, FAUCET_URL }
