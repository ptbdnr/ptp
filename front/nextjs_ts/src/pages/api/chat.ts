import type { NextApiRequest, NextApiResponse } from 'next';
import WebSocket from 'ws';

// Define a type for the response we're using that includes flush method
type ResponseWithFlush = NextApiResponse & {
  flush?: () => void;
  flushHeaders?: () => void;
};

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
function validateRequest(body: unknown): body is ChatRequest {
  if (!body || typeof body !== 'object') return false;
  const reqBody = body as Partial<ChatRequest>;
  if (!Array.isArray(reqBody.messages)) return false;
  if (reqBody.messages.length === 0) return false;
  
  return reqBody.messages.every((msg: unknown) => {
    if (!msg || typeof msg !== 'object') return false;
    const message = msg as Partial<ChatMessage>;
    return (
      typeof message.role === 'string' &&
      ['user', 'assistant'].includes(message.role) &&
      typeof message.content === 'string'
    );
  });
}

export default async function handler(req: NextApiRequest, res: ResponseWithFlush) {
  console.log('[Chat API] Starting request handling');
  
  // Set no delay to ensure data is sent immediately
  if (res.socket) {
    res.socket.setNoDelay(true);
  }
  
  // Helper to write and flush if possible
  const writeAndFlush = (chunk: string) => {
    res.write(chunk);
    // Enable immediate flush in Node.js
    if (typeof res.flush === 'function') {
      res.flush();
    }
  };
  
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
    // Flush headers to establish streaming connection
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof (res as any).flushHeaders === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (res as any).flushHeaders();
    }

    // Create WebSocket connection to backend
    console.log('[Chat API] PTP_API_URL:', process.env.PTP_API_URL);
    const backendUrl = process.env.PTP_API_URL ?? 'http://backend:80/';
    const wsUrl = backendUrl.replace('http://', 'ws://');
    console.log('[Chat API] Connecting to WebSocket:', wsUrl);
    
    const ws = new WebSocket(`${wsUrl}chat`);
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
        writeAndFlush(finishStepChunk);
      } catch (e) {
        console.error('[Chat API] Error sending finish step:', e);
      }
    };

    const sendError = (error: string) => {
      if (hasError) return; // Prevent sending multiple errors
      hasError = true;
      console.error('[Chat API] Error:', error);
      sendFinishStep(false, error);
      // Use JSON.stringify for proper escaping
      const errorChunk = `3:${JSON.stringify(error)}\n`;
      console.log('[Chat API] Sending error chunk:', errorChunk);
      writeAndFlush(errorChunk);
      res.end();
    };

    const cleanupAndEnd = () => {
      if (!isStreaming) return; // Prevent multiple cleanups
      
      try {
        isStreaming = false;
        
        // Send the final finish message
        const finishMessage = {
          finishReason: 'stop', 
          usage: { promptTokens: 0, completionTokens: 0 }
        };
        const finishChunk = `d:${JSON.stringify(finishMessage)}\n`;
        console.log('[Chat API] Sending finish message:', finishChunk);
        writeAndFlush(finishChunk);
        res.end();
      } catch (e) {
        console.error('[Chat API] Error during cleanup:', e);
        try {
          // Attempt to end response even if error occurs during cleanup
          if (!res.writableEnded) {
             res.end();
          }
        } catch (finalError) {
          console.error('[Chat API] Final attempt to close response failed:', finalError);
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        sendError('Failed to send messages to backend');
      }
    });

    ws.on('message', (data: WebSocket.Data) => {
      try {
        const rawMessage = data.toString();
        console.log('[Chat API] Raw WebSocket message:', JSON.stringify(rawMessage));

        // Check if this is a control message from backend (e.g., end signal)
        if (rawMessage.startsWith('{')) {
          try {
            const message = JSON.parse(rawMessage) as WebSocketMessage;
            if (message.type === 'end') {
              // If there's any remaining buffered text, flush it before ending
              if (currentMessage) {
                 // Send any remaining text
                 const textChunk = `0:${JSON.stringify(currentMessage)}\n`;
                 console.log('[Chat API] Sending final text chunk:', textChunk);
                 writeAndFlush(textChunk);
                 currentMessage = '';
                 
                 // Indicate last step before final message
                 sendFinishStep(false);
              }
              cleanupAndEnd(); // Send d:{...} and close
              return;
            }
            // If it's a non-end JSON message, we shouldn't receive this in our current setup
            // But keep it here for future extensions
            console.log('[Chat API] Received JSON message (not end):', message);
          } catch {
            // Not a valid JSON control message, treat as text
            console.log('[Chat API] Invalid JSON, treating as text:', rawMessage);
            
            // Send the raw message directly as a text chunk
            // This is important as Python sends plain text, not JSON
            const textChunk = `0:${JSON.stringify(rawMessage)}\n`;
            console.log('[Chat API] Sending text chunk:', textChunk);
            writeAndFlush(textChunk);
            
            // Signal continuation
            sendFinishStep(true);
          }
        } else {
          // It's a plain text chunk from Python (word + space)
          // Important: We send the raw text as is, properly JSON encoded
          const textChunk = `0:${JSON.stringify(rawMessage)}\n`;
          console.log('[Chat API] Sending text chunk:', textChunk);
          writeAndFlush(textChunk);
          
          // Signal that more content is coming (required for the Vercel SDK)
          sendFinishStep(true);
        }

      } catch (error) {
        console.error('[Chat API] Error processing WebSocket message:', error);
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