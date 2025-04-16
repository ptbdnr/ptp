import type { NextApiRequest, NextApiResponse } from 'next'
 
import type { Meal } from '@/types/meals'

import { mockupMeals } from '@/data/meals'

type ResponseData = {
  error?: string;
  meals?: Meal[]
}
 
export default async function handler(
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
    const {dietaryPreferences, maxPrepTime, ingredients } = req.body;
    const user_id = process.env.DEFAULT_USER_ID;
    const ptp_api_url = process.env.PTP_API_URL;
    console.log(`POST API /${func_name}`);
    const body = req.body;
    console.log('Request Body:', body);
    try {
      const response = await fetch(`${ptp_api_url}recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user_id,
          dietaryPreferences: dietaryPreferences,
          maxPrepTime: maxPrepTime,
          ingredients: ingredients,
        }),
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

      // Assuming the data contains an array of meals
      const meals = data.meals.map((meal: Meal) => ({
        id: meal.id,
        name: meal.name,
        description: meal.description,
        ingredients: meal.ingredients,
        images: { thumbnail_url: '🍭' },
      }));
      res.status(200).send({ meals: meals});
      return;
    } catch (err) {
      console.error('Error fetching data:', err);
      res.status(500).send({ error: 'failed to fetch data' });
      return;
    }
  }
  
  console.error(`API /${func_name} does not support ${req.method}`);
  res.status(405).json({ meals: [] });
  return;
}