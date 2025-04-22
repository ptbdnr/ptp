'use client';

import { ChatSection } from '@llamaindex/chat-ui';
import { useChat, type Message } from '@ai-sdk/react';
import { useEffect, useState } from 'react';
import ChatLayout from './chat-layout';
import { useSession } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import { usePantryContext } from '@/contexts/PantryContext';

import '@llamaindex/chat-ui/styles/markdown.css' // code, latex and custom markdown styling
import '@llamaindex/chat-ui/styles/pdf.css' // pdf styling
import 'react-toastify/dist/ReactToastify.css';

// Debug wrapper to log ChatSection props
function DebugChatSection({ handler, className }: { handler: ReturnType<typeof useChat>; className?: string }) {
  // Log whenever messages update
  useEffect(() => {
    console.debug('[DebugChatSection] messages:', handler.messages);
    const last = handler.messages[handler.messages.length - 1];
    console.debug('[DebugChatSection] last message parts:', last?.parts);
  }, [handler.messages]);
  // Log status updates
  useEffect(() => {
    console.debug('[DebugChatSection] status:', handler.status);
  }, [handler.status]);
  return <ChatSection handler={handler} className={className} />;
}

export default function ChatPage() {
  const { data: session, status } = useSession();
  const [isReady, setIsReady] = useState(false);
  const { ingredients } = usePantryContext();
  
  // Add delay to ensure session is loaded
  useEffect(() => {
    if (status !== 'loading') {
      setIsReady(true);
    }
  }, [status]);

  // Create pantry system message
  const formatPantryMessage = () => {
    if (!ingredients || !ingredients.ingredients || ingredients.ingredients.length === 0) {
      return null;
    }
    
    const pantryList = ingredients.ingredients
      .map(item => `• ${item.name} (${item.quantity} ${item.unit})`)
      .join('\n');
    
    return {
      id: 'pantry-system-message',
      role: 'user',
      content: `Your pantry contains:\n${pantryList}\n\nWhen asked for recipes, suggest ones that use these ingredients as much as possible. At the end of recipe suggestions, explicitly mention which pantry items you incorporated and how you used them.`
    } as Message;
  };

  const pantrySystemMessage = formatPantryMessage();
  const initialMessages: Message[] = pantrySystemMessage ? [pantrySystemMessage] : [];
  
  const handler = useChat({
    streamProtocol: 'data',
    api: '/api/chat',
    headers: {
      'Authorization': `Bearer ${session?.user?.accessToken || ''}`,
      'Content-Type': 'application/json',
      'x-vercel-ai-data-stream': 'v1'
    },
    initialMessages: initialMessages,
    onError: (error) => {
      console.error('Chat error:', error);
      toast.error('Failed to send message. Please try again.');
    },
    onResponse: (res) => console.debug('[ChatPage] onResponse:', res),
    onFinish: (message, { usage, finishReason }) => console.debug('[ChatPage] onFinish:', message, usage, finishReason),
    experimental_throttle: 50,
    body: {
      stream: true,
    },
  });

  // Override isLoading: hide loader once streaming begins
  const uiHandler = { ...handler, isLoading: handler.status === 'submitted' };

  // Create a function to handle sending messages with pantry awareness
  const sendPantryAwareMessage = (content: string) => {
    // Check if this is a recipe request
    if (content.toLowerCase().includes('recipe')) {
      // Get current pantry items
      const pantryList = ingredients.ingredients
        .map(item => `• ${item.name} (${item.quantity} ${item.unit})`)
        .join('\n');
      
      // Enhance the message with pantry information
      const enhancedContent = `${content}

For this recipe request, please consider the ingredients currently in my pantry:
${pantryList}

Try to use these pantry ingredients when possible, and at the end please mention which specific pantry items you incorporated into the recipe.`;
      
      // Send the enhanced message
      return handler.append({
        role: 'user',
        id: `pantry-recipe-${Date.now()}`,
        content: enhancedContent
      });
    }
    
    // For non-recipe messages, just send as is
    return handler.append({
      role: 'user',
      id: `message-${Date.now()}`,
      content: content
    });
  };

  // Create a copy of the handler with the sendMessage function overridden
  const pantryAwareHandler = {
    ...uiHandler,
    sendMessage: sendPantryAwareMessage
  };

  // Log message and status updates for debugging
  useEffect(() => {
    console.debug('[ChatPage] messages updated:', handler.messages);
  }, [handler.messages]);
  useEffect(() => {
    console.debug('[ChatPage] status updated:', handler.status);
  }, [handler.status]);

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
        <div className="flex flex-col h-[calc(100vh-160px)] overflow-hidden bg-white">
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {/* Use DebugChatSection to trace render timings */}
            <DebugChatSection
              handler={pantryAwareHandler}
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
      <ToastContainer position="bottom-center" autoClose={3000} />
    </ChatLayout>
  );
} 