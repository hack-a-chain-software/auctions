import type { VercelRequest, VercelResponse } from '@vercel/node';
import { tokenClient } from './env';

export default async function handler(request: VercelRequest, response: VercelResponse) {
    response.setHeader('Cache-Control', 's-maxage=31536000');
    const creator = request.body.creator;
    const collection = request.body.collection;
    const name = request.body.name;
    const data = await tokenClient.getTokenData(creator, collection, name);
    response.status(200).json({ data });
}

