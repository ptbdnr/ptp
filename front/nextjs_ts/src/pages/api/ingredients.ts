import type { NextApiRequest, NextApiResponse } from 'next'
 
import type { Ingredient } from '@/types/ingredients'

import { mockupIngredients } from '@/data/ingredients'

type ResponseData = {
  ingredients: Ingredient[]
}
 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const func_name = 'ingredients';
    if (req.method == 'GET') {
      console.log(`GET API /${func_name}`);
      res.status(200).json({ ingredients: mockupIngredients });
      return res;
    };
    
    if (req.method == 'POST') {
      console.log(`POST API /${func_name}`);
      res.status(200).json({ ingredients: mockupIngredients });
      return res;
    };
    
    console.error(`API /${func_name} does not support ${req.method}`);
    res.status(405).json({ ingredients: [] });
    return res;
}