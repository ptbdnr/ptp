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
}

interface FinishStep {
  finishReason: 'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error';
  usage: {
    promptTokens: number;
    completionTokens: number;
  };
  isContinued: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const func_name = 'chat';
  console.log('[Chat API] Starting request handling');
  
  if (req.method !== 'POST') {
    console.error(`[Chat API] Method not allowed: ${req.method}`);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;
  console.log('[Chat API] Received messages:', JSON.stringify(messages, null, 2));

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    console.error('[Chat API] Invalid messages:', messages);
    return res.status(400).json({ error: 'Messages array is required' });
  }

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

    const sendFinishStep = (isContinued: boolean, error?: string) => {
      const finishStep: FinishStep = {
        finishReason: error ? 'error' : 'stop',
        usage: { promptTokens: 0, completionTokens: 0 },
        isContinued
      };
      const finishStepChunk = `e:${JSON.stringify(finishStep)}\n`;
      console.log('[Chat API] Sending finish step:', finishStepChunk);
      res.write(finishStepChunk);
    };

    const sendError = (error: string) => {
      console.error('[Chat API] Error:', error);
      sendFinishStep(false, error);
      const errorChunk = `e:"${error}"\n`;
      console.log('[Chat API] Sending error chunk:', errorChunk);
      res.write(errorChunk);
      res.end();
    };

    const flushResponse = () => {
      if (currentMessage) {
        const textChunk = `0:"${currentMessage}"\n`;
        console.log('[Chat API] Sending chunk:', textChunk);
        res.write(textChunk);
        currentMessage = '';
      }
    };

    ws.on('error', (error) => {
      console.error('[Chat API] WebSocket error:', error);
      sendError(error.message || 'Failed to connect to backend service');
    });

    ws.on('open', () => {
      console.log('[Chat API] WebSocket connected, sending messages');
      try {
        ws.send(JSON.stringify({ messages }));
      } catch (error) {
        sendError('Failed to send messages to backend');
      }
    });

    ws.on('message', (data) => {
      try {
        const rawMessage = data.toString();
        console.log('[Chat API] Raw WebSocket message:', rawMessage);

        // Check if this is a control message
        if (rawMessage.startsWith('{')) {
          try {
            const message = JSON.parse(rawMessage);
            if (message.type === 'end') {
              flushResponse();
              isStreaming = false;
              sendFinishStep(false);
              const finishMessage = {
                finishReason: 'stop',
                usage: { promptTokens: 0, completionTokens: 0 }
              };
              const finishChunk = `d:${JSON.stringify(finishMessage)}\n`;
              console.log('[Chat API] Sending finish message:', finishChunk);
              res.write(finishChunk);
              res.end();
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

        // Send the accumulated message periodically
        if (currentMessage.length > 0 && (currentMessage.endsWith('. ') || currentMessage.endsWith('! ') || currentMessage.endsWith('? '))) {
          flushResponse();
          sendFinishStep(true);
        }
      } catch (error) {
        sendError('Failed to process message');
      }
    });

    ws.on('close', () => {
      console.log('[Chat API] WebSocket closed');
      if (isStreaming) {
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
      }
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