import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 } from "uuid";

import { Ingredient } from '@/types/ingredients';

type ResponseData = {
    error?: string;
    ingredients?: Ingredient[];
}
 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
    const func_name = 'text_to_ingredients';
    if (req.method === 'GET') {
        console.log(`GET API /${func_name}`);
        try {
            // const result = await someAsyncOperation()
            res.status(200).send({ ingredients: 
                [
                    { id: v4(), name: 'lollipop', quantity: 1, unit: 'pieces', images: { thumbnail_url: '🍭' } },
                ]
             })
        } catch (err) {
            console.error('Error fetching data:', err);
            res.status(500).send({ error: 'failed to fetch data' });
        }
    }
    
    console.error(`API /${func_name} does not support ${req.method}`);
    res.status(405).send({ error: `API /${func_name} does not support ${req.method}` });
}