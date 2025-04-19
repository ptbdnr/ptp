import type { NextApiRequest, NextApiResponse } from 'next';
import WebSocket from 'ws';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  parts?: Array<{
    type: string;
    text: string;
  }>;
}

interface ChatRequest {
  messages: ChatMessage[];
  stream?: boolean;
}

interface FinishStep {
  finishReason: 'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error';
  usage: {
    promptTokens: number;
    completionTokens: number;
  };
  isContinued: boolean;
}

interface WebSocketMessage {
  type?: 'end';
  content?: string;
  error?: string;
}

// Validate request body
function validateRequest(body: any): body is ChatRequest {
  if (!body || typeof body !== 'object') return false;
  if (!Array.isArray(body.messages)) return false;
  if (body.messages.length === 0) return false;
  
  return body.messages.every((msg: any) => (
    msg &&
    typeof msg === 'object' &&
    typeof msg.role === 'string' &&
    ['user', 'assistant'].includes(msg.role) &&
    typeof msg.content === 'string'
  ));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const func_name = 'chat';
  console.log('[Chat API] Starting request handling');
  
  if (req.method !== 'POST') {
    console.error(`[Chat API] Method not allowed: ${req.method}`);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate request body
  if (!validateRequest(req.body)) {
    console.error('[Chat API] Invalid request body:', req.body);
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const { messages } = req.body;
  console.log('[Chat API] Received messages:', JSON.stringify(messages, null, 2));

  try {
    console.log('[Chat API] Setting up streaming response');
    // Set headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('x-vercel-ai-data-stream', 'v1');

    // Create WebSocket connection to backend
    const backendUrl = 'http://backend:80';
    const wsUrl = backendUrl.replace('http://', 'ws://');
    console.log('[Chat API] Connecting to WebSocket:', wsUrl);
    
    const ws = new WebSocket(`${wsUrl}/chat`);
    let currentMessage = '';
    let isStreaming = true;
    let hasError = false;

    const sendFinishStep = (isContinued: boolean, error?: string) => {
      try {
        const finishStep: FinishStep = {
          finishReason: error ? 'error' : 'stop',
          usage: { promptTokens: 0, completionTokens: 0 },
          isContinued
        };
        const finishStepChunk = `e:${JSON.stringify(finishStep)}\n`;
        console.log('[Chat API] Sending finish step:', finishStepChunk);
        res.write(finishStepChunk);
      } catch (e) {
        console.error('[Chat API] Error sending finish step:', e);
      }
    };

    const sendError = (error: string) => {
      if (hasError) return; // Prevent sending multiple errors
      hasError = true;
      console.error('[Chat API] Error:', error);
      sendFinishStep(false, error);
      const errorChunk = `e:"${error}"\n`;
      console.log('[Chat API] Sending error chunk:', errorChunk);
      res.write(errorChunk);
      res.end();
    };

    const flushResponse = () => {
      if (currentMessage) {
        try {
          const textChunk = `0:"${currentMessage}"\n`;
          console.log('[Chat API] Sending chunk:', textChunk);
          res.write(textChunk);
          currentMessage = '';
        } catch (e) {
          console.error('[Chat API] Error flushing response:', e);
        }
      }
    };

    const cleanupAndEnd = () => {
      if (!isStreaming) return; // Prevent multiple cleanups
      
      try {
        isStreaming = false;
        flushResponse();
        sendFinishStep(false);
        const finishMessage = {
          finishReason: 'stop',
          usage: { promptTokens: 0, completionTokens: 0 }
        };
        const finishChunk = `d:${JSON.stringify(finishMessage)}\n`;
        console.log('[Chat API] Sending finish message:', finishChunk);
        res.write(finishChunk);
        res.end();
      } catch (e) {
        console.error('[Chat API] Error during cleanup:', e);
        try {
          res.end();
        } catch (e) {
          // Final attempt to close response
        }
      }
    };

    ws.on('error', (error: Error) => {
      console.error('[Chat API] WebSocket error:', error);
      sendError(error.message || 'Failed to connect to backend service');
    });

    ws.on('open', () => {
      console.log('[Chat API] WebSocket connected, sending messages');
      try {
        ws.send(JSON.stringify({ messages, stream: true }));
      } catch (error) {
        sendError('Failed to send messages to backend');
      }
    });

    ws.on('message', (data: WebSocket.Data) => {
      try {
        const rawMessage = data.toString();
        console.log('[Chat API] Raw WebSocket message:', rawMessage);

        // Check if this is a control message
        if (rawMessage.startsWith('{')) {
          try {
            const message = JSON.parse(rawMessage) as WebSocketMessage;
            if (message.type === 'end') {
              cleanupAndEnd();
              return;
            }
          } catch (e) {
            // Not a valid JSON control message, treat as text
            currentMessage += rawMessage;
          }
        } else {
          // Accumulate the message
          currentMessage += rawMessage;
        }

        // Send the accumulated message on sentence boundaries
        if (currentMessage.length > 0 && (
          currentMessage.endsWith('. ') || 
          currentMessage.endsWith('! ') || 
          currentMessage.endsWith('? ') ||
          currentMessage.endsWith('\n')
        )) {
          flushResponse();
          sendFinishStep(true);
        }
      } catch (error) {
        sendError('Failed to process message');
      }
    });

    ws.on('close', () => {
      console.log('[Chat API] WebSocket closed');
      cleanupAndEnd();
    });

    // Handle client disconnect
    req.on('close', () => {
      console.log('[Chat API] Client disconnected');
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    });

  } catch (error) {
    console.error('[Chat API] Unhandled error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 