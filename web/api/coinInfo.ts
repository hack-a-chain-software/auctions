import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AuctionClient } from './setup/env';

export default async function handler(request: VercelRequest, response: VercelResponse) {
    response.setHeader('Cache-Control', 's-maxage=3153600, stale-while-revalidate');
    const coin = request.body.coin;
    const coinInfo = await AuctionClient.getCoinInfo(coin);
    response.status(200).json({ coinInfo });
}