'use client';

import { ChatSection } from '@llamaindex/chat-ui';
import { useChat } from 'ai/react';
import ChatLayout from './chat-layout';

import '@llamaindex/chat-ui/styles/markdown.css' // code, latex and custom markdown styling
import '@llamaindex/chat-ui/styles/pdf.css' // pdf styling

export default function ChatPage() {
  const handler = useChat();
  
  return (
    <ChatLayout>
      <div className="flex flex-col h-[calc(100vh-160px)] overflow-hidden bg-white">
        <div className="flex-1 overflow-y-auto">
          <ChatSection 
            handler={handler}
            className="flex flex-col gap-4 p-4 h-full [&_.user-avatar]:border-2 [&_.user-avatar]:border-gray-200 [&_.user-avatar]:rounded-full [&_.user-message]:bg-gray-100 [&_.ai-message]:bg-blue-50 [&_form]:bg-gray-100 [&_form]:p-2 [&_textarea]:bg-gray-100 [&_textarea]:my-2 [&_form_button]:bg-[#FF7043] [&_form_button]:text-white [&_form_button:hover]:bg-[#FF7043]/90 [&_.copy-button]:bg-transparent"
          />
        </div>
      </div>
    </ChatLayout>
  );
} 