import type { NextApiRequest, NextApiResponse } from 'next'
 
type ResponseData = {
    error?: string;
    message?: string;
}
 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
    if (req.method === 'POST') {
        console.log('POST request received')
    } else if (req.method === 'GET') {
        console.log('POST request received')
    } else {
        console.log(`${req.method} request received`)
    }
    try {
        // const result = await someAsyncOperation()
        res.status(200).send({ message: 'a banana' })
    } catch (err) {
        console.error('Error fetching data:', err)
        res.status(500).send({ error: 'failed to fetch data' })
    }
  
}