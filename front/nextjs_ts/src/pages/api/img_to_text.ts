import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
    error?: string;
    content?: string;
}
 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
    const func_name = 'img_to_text';
    if (req.method === 'POST') {
        console.log(`POST API /${func_name}`);
        try {
            // const result = await someAsyncOperation()
            res.status(200).send({ content: 'a lollipop' });
        } catch (err) {
            console.error('Error fetching data:', err);
            res.status(500).send({ error: 'failed to fetch data' });
        }
        return res
    }
    
    console.error(`API /${func_name} does not support ${req.method}`);
    res.status(405).send({ error: `API /${func_name} does not support ${req.method}` });
    return res;
}