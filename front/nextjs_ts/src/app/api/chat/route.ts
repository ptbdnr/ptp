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
    
    // Create WebSocket connection to backend (running in Docker)
    const ws = new WebSocket('ws://localhost:8000/chat');
    
    // Set up response stream
    const stream = new ReadableStream({
      start(controller) {
        let isControllerClosed = false;

        const closeController = () => {
          if (!isControllerClosed) {
            isControllerClosed = true;
            try {
              controller.close();
            } catch (e) {
              console.error('Error closing controller:', e);
            }
          }
        };

        // Add connection timeout
        const connectionTimeout = setTimeout(() => {
          console.error('WebSocket connection timeout');
          closeController();
          ws.close();
        }, 5000); // 5 second timeout

        ws.on('open', () => {
          clearTimeout(connectionTimeout);
          console.log('WebSocket connection established');
          // Send messages to backend
          ws.send(JSON.stringify({ messages }));
        });

        ws.on('message', (data: Buffer) => {
          if (!isControllerClosed) {
            try {
              controller.enqueue(data);
            } catch (e) {
              console.error('Error enqueueing data:', e);
              closeController();
            }
          }
        });

        ws.on('close', () => {
          console.log('WebSocket connection closed');
          closeController();
        });

        ws.on('error', (error: Error) => {
          console.error('WebSocket error:', error);
          if (!isControllerClosed) {
            controller.error(error);
            closeController();
          }
        });

        // Handle client disconnect
        req.signal.addEventListener('abort', () => {
          console.log('Client disconnected');
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