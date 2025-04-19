'use client';

import { ChatSection } from '@llamaindex/chat-ui';
import { useChat } from '@ai-sdk/react';
import { useEffect, useState } from 'react';
import ChatLayout from './chat-layout';
import { useSession } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import { ErrorBoundary } from 'react-error-boundary';

import '@llamaindex/chat-ui/styles/markdown.css' // code, latex and custom markdown styling
import '@llamaindex/chat-ui/styles/pdf.css' // pdf styling
import 'react-toastify/dist/ReactToastify.css';

// Error fallback component
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="p-4 border border-red-300 rounded bg-red-50 text-red-800">
      <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
      <p className="mb-4">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  );
}

export default function ChatPage() {
  const { data: session, status } = useSession();
  const [isReady, setIsReady] = useState(false);
  
  // Add delay to ensure session is loaded
  useEffect(() => {
    if (status !== 'loading') {
      setIsReady(true);
    }
  }, [status]);

  const handler = useChat({
    streamProtocol: 'data',
    api: '/api/chat',
    headers: {
      'Authorization': `Bearer ${session?.user?.accessToken || ''}`,
      'Content-Type': 'application/json',
      'x-vercel-ai-data-stream': 'v1'
    },
    initialMessages: [],
    onError: (error) => {
      console.error('Chat error:', error);
      toast.error('Failed to send message. Please try again.');
    },
    body: {
      stream: true,
    },
  });

  // Show loading state while session is loading
  if (!isReady) {
    return (
      <ChatLayout>
        <div className="flex flex-col h-[calc(100vh-160px)] items-center justify-center">
          <div className="animate-pulse text-gray-500">Loading chat...</div>
        </div>
      </ChatLayout>
    );
  }

  return (
    <ChatLayout>
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
        <div className="flex flex-col h-[calc(100vh-160px)] overflow-hidden bg-white">
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <ChatSection 
              handler={handler}
              className="flex flex-col gap-4 h-full
                [&_.user-avatar]:flex [&_.user-avatar]:h-8 [&_.user-avatar]:w-8 [&_.user-avatar]:items-center [&_.user-avatar]:justify-center [&_.user-avatar]:border [&_.user-avatar]:border-gray-200 [&_.user-avatar]:rounded-full
                [&_.flex-1.flex-col.gap-5>div]:mb-4 [&_.flex-1.flex-col.gap-5>div:last-child]:mb-0
                [&_.user-message]:bg-gray-100 [&_.user-message]:rounded-2xl [&_.user-message]:p-4 [&_.user-message]:break-words
                [&_.ai-message]:bg-blue-50 [&_.ai-message]:rounded-2xl [&_.ai-message]:p-4 [&_.ai-message]:break-words
                [&_.group>div:last-child]:opacity-0 [&_.group:hover>div:last-child]:opacity-100
                [&_.copy-button]:bg-transparent [&_.copy-button]:text-gray-400 [&_.copy-button]:hover:bg-gray-100 [&_.copy-button]:hover:text-gray-600 [&_.copy-button]:rounded-md [&_.copy-button]:h-8 [&_.copy-button]:w-8 [&_.copy-button]:transition-colors
                [&_form]:fixed [&_form]:bottom-[100px] [&_form]:left-0 [&_form]:right-0 [&_form]:mx-auto [&_form]:max-w-[480px] [&_form]:px-4 [&_form]:!flex [&_form]:!flex-col [&_form]:!gap-3
                [&_textarea]:w-full [&_textarea]:p-4 [&_textarea]:rounded-xl [&_textarea]:bg-gray-100 [&_textarea]:resize-none [&_textarea]:outline-none [&_textarea]:min-h-[60px] [&_textarea]:max-h-[200px] [&_textarea]:text-sm
                [&_form button]:w-full [&_form button]:px-6 [&_form button]:py-3 [&_form button]:rounded-full [&_form button]:bg-[#FF7043] [&_form button]:text-white [&_form button]:font-medium [&_form button]:hover:bg-[#FF7043]/90 [&_form button]:transition-colors [&_form button]:disabled:opacity-50"
            />
          </div>
        </div>
      </ErrorBoundary>
      <ToastContainer position="bottom-center" autoClose={3000} />
    </ChatLayout>
  );
} 