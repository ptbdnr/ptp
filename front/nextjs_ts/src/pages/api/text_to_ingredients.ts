import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 } from "uuid";

import { Ingredient } from '@/types/ingredients';

type ResponseData = {
    error?: string;
    ingredients?: Ingredient[];
}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
    const func_name = 'text_to_ingredients';
    if (req.method === 'GET') {
        console.log(`GET API /${func_name}`);
        try {
            // const result = await someAsyncOperation()
            const text = req.query.text as string;
            const user_id = process.env.DEFAULT_USER_ID;
            const ptp_api_url = process.env.PTP_API_URL;
            const response = await fetch(`${ptp_api_url}users/${user_id}/text2ingredients?text=${text}`, {
                method: 'GET',
            });
            
            if (!response.ok) {
                console.error('Error fetching data:', response.statusText);
                res.status(500).send({ error: 'failed to fetch data' });
                return;
            };
            
            const data = await response.json();
            console.log('data:', data);
            if (data.error) {
                console.error('Error in response:', data.error);
                res.status(500).send({ error: 'failed to fetch data' });
                return;
            }

            // Assuming the data contains an array of ingredients
            const ingredients = data.ingredients.map((ingredient: any) => ({
                id: v4(),
                name: ingredient.name,
                quantity: ingredient.quantity,
                unit: ingredient.unit,
                images: ingredient.images,
            }));
            res.status(200).send({ ingredients });

            // res.status(200).send({ ingredients: 
            //     [
            //         { id: v4(), name: 'lollipop', quantity: 1, unit: 'pieces', images: { thumbnail_url: '🍭' } },
            //     ]
            // })
            return;
        } catch (err) {
            console.error('Error fetching data:', err);
            res.status(500).send({ error: 'failed to fetch data' });
            return;
        }
    }
    
    console.error(`API /${func_name} does not support ${req.method}`);
    res.status(405).send({ error: `API /${func_name} does not support ${req.method}` });
}