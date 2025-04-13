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
  if (req.method === 'GET') {
    console.log(`GET API /${func_name}`);
    res.status(200).json({ meals: mockupMeals });
    return;
  };
  
  if (req.method === 'POST') {
    console.log(`POST API /${func_name}`);
    res.status(200).json({ meals: mockupMeals });
    return;
  };
  
  console.error(`API /${func_name} does not support ${req.method}`);
  res.status(405).json({ meals: [] });
  return;
}