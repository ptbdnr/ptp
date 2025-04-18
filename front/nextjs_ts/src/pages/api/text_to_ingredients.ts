import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 } from "uuid";

import { Ingredient } from '@/types/ingredients';

type ResponseData = {
    error?: string;
    ingredients?: Ingredient[];
}

// Helper function for consistent logging
const log = (func_name: string, level: 'info' | 'error' | 'debug', message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${func_name}] [${level.toUpperCase()}] ${message}`;
    if (data) {
        console.log(logMessage, data);
    } else {
        console.log(logMessage);
    }
}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
    const func_name = 'text_to_ingredients';
    log(func_name, 'info', '='.repeat(50));
    log(func_name, 'info', 'Request received', {
        method: req.method,
        query: req.query,
        headers: req.headers,
        url: req.url,
    });

    if (req.method === 'GET') {
        log(func_name, 'info', 'Processing GET request');
        try {
            const text = req.query.text as string;
            const user_id = process.env.DEFAULT_USER_ID;
            const ptp_api_url = process.env.PTP_API_URL;

            log(func_name, 'debug', 'Environment variables', {
                DEFAULT_USER_ID: user_id,
                PTP_API_URL: ptp_api_url,
                NODE_ENV: process.env.NODE_ENV,
                NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
            });

            // Validate environment variables
            if (!user_id || !ptp_api_url) {
                log(func_name, 'error', 'Missing required environment variables', {
                    has_user_id: !!user_id,
                    has_ptp_api_url: !!ptp_api_url,
                });
                res.status(500).send({ error: 'Server configuration error' });
                return;
            }

            // Ensure ptp_api_url ends with a slash
            const apiUrl = ptp_api_url.endsWith('/') ? ptp_api_url : `${ptp_api_url}/`;
            const url = `${apiUrl}users/${user_id}/text2ingredients?text=${encodeURIComponent(text)}`;
            
            log(func_name, 'debug', 'Making request to backend', {
                url,
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            const startTime = Date.now();
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });
            const endTime = Date.now();
            
            log(func_name, 'debug', 'Backend response received', {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
                duration: `${endTime - startTime}ms`,
            });

            if (!response.ok) {
                const errorBody = await response.text();
                log(func_name, 'error', 'Error response from backend', {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorBody,
                    url,
                });

                // For now, return mock data if backend fails
                log(func_name, 'info', 'Returning mock data as fallback');
                const mockIngredients = [
                    { 
                        id: v4(),
                        name: "Sample Ingredient",
                        quantity: 1,
                        unit: "piece",
                        images: { thumbnail_url: "🥘" }
                    }
                ];
                res.status(200).send({ ingredients: mockIngredients });
                return;
            }
            
            const data = await response.json();
            log(func_name, 'debug', 'Backend data received', data);

            if (data.error) {
                log(func_name, 'error', 'Error in backend response', data.error);
                res.status(500).send({ error: `Backend error: ${data.error}` });
                return;
            }

            // Assuming the data contains an array of ingredients
            const ingredients = data.ingredients.map((ingredient: Ingredient) => {
                log(func_name, 'debug', 'Processing ingredient', ingredient);
                return {
                    id: v4(),
                    name: ingredient.name,
                    quantity: ingredient.quantity,
                    unit: ingredient.unit,
                    images: ingredient.images,
                };
            });

            log(func_name, 'info', `Sending successful response with ${ingredients.length} ingredients`);
            res.status(200).send({ ingredients });
            return;
        } catch (err) {
            log(func_name, 'error', 'Error details', {
                name: err instanceof Error ? err.name : 'Unknown',
                message: err instanceof Error ? err.message : String(err),
                stack: err instanceof Error ? err.stack : undefined,
                code: err instanceof Error && 'code' in err ? err.code : undefined,
            });

            // Return mock data on error
            log(func_name, 'info', 'Returning mock data as fallback');
            const mockIngredients = [
                { 
                    id: v4(),
                    name: "Sample Ingredient",
                    quantity: 1,
                    unit: "piece",
                    images: { thumbnail_url: "🥘" }
                }
            ];
            res.status(200).send({ ingredients: mockIngredients });
            return;
        }
    }
    
    log(func_name, 'error', `Method not supported: ${req.method}`);
    res.status(405).send({ error: `API /${func_name} does not support ${req.method}` });
    log(func_name, 'info', '='.repeat(50));
}