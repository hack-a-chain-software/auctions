import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AuctionClient } from './setup/env';
import * as bip39 from '@scure/bip39';

export default async function handler(request: VercelRequest, response: VercelResponse) {
    // Fix Vercel dependency bug (ignore me)
    bip39.generateMnemonic([]);

    response.setHeader('Cache-Control', 's-maxage=3153600, stale-while-revalidate');
    const coin = request.body.coin;
    const coinInfo = await AuctionClient.getCoinInfo(coin);
    response.status(200).json({ coinInfo });
}