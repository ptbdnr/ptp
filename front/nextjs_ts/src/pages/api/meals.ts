import type { NextApiRequest, NextApiResponse } from 'next'
import * as mongoDB from "mongodb";

import type { Meal } from '@/types/meals'

import clientPromise from "@/utils/mongodb";
import { mockupMeals } from '@/data/meals'
import { Ingredient } from '@/types/ingredients';

type ResponseData = {
  error?: string;
  meals?: Meal[]
}

interface MongoDBMeal {
  _id: mongoDB.ObjectId;
  name: string;
  description: string;
  ingredients?: string[];
  instructions?: string;
  images?: string;
  videos?: string;
}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const func_name = 'meals';
  if (req.method === 'GET') {
    console.log(`GET API /${func_name}`);
    console.log(`req.query: ${JSON.stringify(req.query)}`);
    const { id } = req.query;
    if (id) {
      console.log(`id: ${id}`);
    }
    const db_name = process.env.MONGODB_DATABASE_NAME;
    const collection_name = process.env.MONGODB_COLLECTION_NAME_MEALS;
    console.log(`db_name: ${db_name}`);
    console.log(`collection_name: ${collection_name}`);
    
    if (db_name == undefined || collection_name === undefined) {
      const msg = 'Invalid/Missing environment variable: "MONGODB_COLLECTION_NAME_MEALS"';
      console.error(msg);
      res.status(500).json({ error: msg });
      return;
    }
    try {
      const client = await clientPromise;
      const db: mongoDB.Db = client.db(db_name);
      const collection: mongoDB.Collection = db.collection(collection_name)
      const items = await collection.find({}).sort({ metacritic: -1 }).limit(10).toArray();
      console.log('items:', items);
      const meals : Meal[] = (items as MongoDBMeal[]).map((item: MongoDBMeal) => {
        return {
          id: item._id.toString(),
          name: item.name,
          description: item.description,
          ingredients: {
            ingredients: item.ingredients 
              ? item.ingredients.map((ingredient: string) => {return JSON.parse(ingredient)})
              : [],
          },
          instructions: item.instructions,
          images: item.images && JSON.parse(item.images),
          videos: item.videos && JSON.parse(item.videos),
        }
      });
      console.log('meals:', meals);
      res.status(200).send({ meals: meals});
      return;
    } catch (e) {
        console.error(e);
        // Handle the error gracefully
        res.status(200).json({ meals: mockupMeals });
        return;
    }
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