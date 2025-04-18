import type { NextApiRequest, NextApiResponse } from 'next'
 
import type { Meal } from '@/types/meals'

import { mockupMeals } from '@/data/meals'
import { Ingredient } from '@/types/ingredients';

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
    console.log(`POST API /${func_name}`);
    const url = `${process.env.PTP_API_URL}recommend`;
    console.log(`url: ${url}`);
    const {dietaryPreferences, maxPrepTime, ingredients } = req.body;
    const req_body = {
      userId: process.env.DEFAULT_USER_ID,
      dietaryPreferences: dietaryPreferences,
      maxPrepTime: maxPrepTime,
      ingredients: ingredients.map((ingredient: Ingredient) => {
        return {
          id: ingredient.id,
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
        }
      }),
    };
    console.log('Request Body:', req_body);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req_body),
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
      const meals = data.meals;
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