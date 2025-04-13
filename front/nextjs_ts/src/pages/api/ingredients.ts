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
  res.status(200).json({ ingredients: mockupIngredients })
}