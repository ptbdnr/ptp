import type { NextApiRequest, NextApiResponse } from 'next'
 
import type { Meal } from '@/types/meals'

import { mockupMeals } from '@/data/meals'

type ResponseData = {
  meals: Meal[]
}
 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const func_name = 'meals';
  res.status(200).json({ meals: mockupMeals })
}