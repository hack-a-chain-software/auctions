import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AuctionClient } from '../setup/env';

export default async function handler(request: VercelRequest, response: VercelResponse) {
    response.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    const { id } = request.query;
    const auction = await AuctionClient.getAllAuctions(Number(id), 1);
    response.status(200).json({ auction });
}