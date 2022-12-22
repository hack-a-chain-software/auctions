import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AuctionClient } from '../env';

export default async function handler(request: VercelRequest, response: VercelResponse) {
    response.setHeader('Cache-Control', 's-maxage=300');
    const { id } = request.query;
    const auction = await AuctionClient.getAllAuctions(Number(id), 1);
    response.status(200).json({ auction });
}