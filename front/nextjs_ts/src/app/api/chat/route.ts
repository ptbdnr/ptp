import { WebSocket } from 'ws';
import { NextResponse } from 'next/server';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json() as ChatRequest;
    console.log('Received chat request with messages:', messages);
    
    if (!messages) {
      console.error('No messages provided in request');
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }
    
    // Get backend URL from environment variable
    const backendUrl = 'http://backend:80';
    // Ensure we have a valid WebSocket URL
    const wsUrl = backendUrl.replace(/^http/, 'ws') + '/chat';
    console.log('Connecting to WebSocket at:', wsUrl);
    
    // Create WebSocket connection to backend
    const ws = new WebSocket(wsUrl);
    
    // Set up response stream
    const stream = new ReadableStream({
      start(controller) {
        let isControllerClosed = false;
        let connectionTimeout: NodeJS.Timeout | null = null;

        const closeController = () => {
          if (!isControllerClosed) {
            console.log('Closing controller');
            isControllerClosed = true;
            try {
              controller.close();
            } catch (e) {
              console.error('Error closing controller:', e);
            }
          }
        };

        const sendError = (message: string) => {
          if (!isControllerClosed) {
            try {
              controller.enqueue(`data: ${JSON.stringify({ error: message })}\n\n`);
            } catch (e) {
              console.error('Error sending error message:', e);
            }
          }
        };

        // Add connection timeout
        connectionTimeout = setTimeout(() => {
          console.error('WebSocket connection timeout');
          sendError('Connection timeout. Please check if the backend server is running.');
          closeController();
          ws.close();
        }, 5000); // 5 second timeout

        ws.on('open', () => {
          console.log('WebSocket connection established');
          if (connectionTimeout) {
            clearTimeout(connectionTimeout);
            connectionTimeout = null;
          }
          // Send messages to backend
          const payload = JSON.stringify({ 
            messages,
            stream: true // Enable streaming by default
          });
          console.log('Sending messages to backend:', payload);
          ws.send(payload);
        });

        ws.on('message', (data: Buffer) => {
          if (!isControllerClosed) {
            try {
              // Parse the chunk and format it for the UI
              const chunk = data.toString();
              console.log('Received chunk from backend:', chunk);
              const formattedChunk = `data: ${chunk}\n\n`;
              controller.enqueue(formattedChunk);
            } catch (e) {
              console.error('Error enqueueing data:', e);
              closeController();
            }
          }
        });

        ws.on('close', (code, reason) => {
          console.log('WebSocket connection closed', { code, reason: reason.toString() });
          if (code === 1006) {
            sendError('Connection refused. Please check if the backend server is running at ' + wsUrl);
          }
          closeController();
        });

        ws.on('error', (error: Error & { code?: string }) => {
          console.error('WebSocket error:', error);
          if (error.code === 'ECONNREFUSED') {
            sendError('Connection refused. Please check if the backend server is running at ' + wsUrl);
          } else {
            sendError(`WebSocket error: ${error.message}`);
          }
          closeController();
        });

        // Handle client disconnect
        req.signal.addEventListener('abort', () => {
          console.log('Client disconnected');
          if (connectionTimeout) {
            clearTimeout(connectionTimeout);
            connectionTimeout = null;
          }
          ws.close();
          closeController();
        });
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
} 