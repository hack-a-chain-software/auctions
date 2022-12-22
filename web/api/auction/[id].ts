import type { VercelRequest, VercelResponse } from '@vercel/node';
// import { AuctionClient } from '../setup/env';
import contractAptos from "contract_aptos"
import { NODE_URL, MODULE_ADDRESS, AUCTION_HOUSE_ADDRESS, GRAPHQL_URL } from "../setup/constants"

export default async function handler(request: VercelRequest, response: VercelResponse) {
    response.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    const { id } = request.query;
    const client = new contractAptos.AuctionHouseClient(NODE_URL, GRAPHQL_URL, MODULE_ADDRESS, AUCTION_HOUSE_ADDRESS);
    const auction = await client.getAllAuctions(Number(id), 1);
    response.status(200).json({ 
        auction,
        id,
        NODE_URL,
        MODULE_ADDRESS,
        AUCTION_HOUSE_ADDRESS,
        GRAPHQL_URL,
    });
}