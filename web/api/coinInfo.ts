import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AuctionClient } from './env';

export default async function handler(request: VercelRequest, response: VercelResponse) {
    response.setHeader('Cache-Control', 's-maxage=31536000');
    const coin = request.body.coin;
    const coinInfo = await AuctionClient.getCoinInfo(coin);
    response.status(200).json({ coinInfo });
}