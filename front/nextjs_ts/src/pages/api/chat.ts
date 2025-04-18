import type { NextApiRequest, NextApiResponse } from 'next';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
}

type ResponseData = {
  response: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const func_name = 'chat';
  
  if (req.method !== 'POST') {
    console.error(`API /${func_name} does not support ${req.method}`);
    res.status(405).json({ response: '', error: 'Method not allowed' });
    return;
  }

  try {
    const { messages } = req.body as ChatRequest;
    console.log(`POST API /${func_name} with messages:`, messages);
    
    if (!messages) {
      console.error('No messages provided in request');
      res.status(400).json({ response: '', error: 'No messages provided' });
      return;
    }
    
    // Get backend URL from environment variable
    const backendUrl = 'http://backend:80';
    const apiUrl = `${backendUrl}/api/chat`;
    
    // Get authentication headers from the request
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader);
    
    // Make HTTP request to backend
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || '',
      },
      body: JSON.stringify({
        messages,
        stream: true
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Backend error:', error);
      res.status(response.status).json({ 
        response: '', 
        error: error.detail || 'Failed to process chat request' 
      });
      return;
    }
    
    // Get the response from the backend
    const data = await response.json();
    console.log('Backend response:', data);
    
    // Return the response
    res.status(200).json({
      response: data.response,
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    res.status(500).json({ 
      response: '', 
      error: 'Failed to process chat request' 
    });
  }
} 