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
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <ChatSection 
            handler={handler}
            className="flex flex-col gap-4 h-full
              [&_.user-avatar]:flex [&_.user-avatar]:h-8 [&_.user-avatar]:w-8 [&_.user-avatar]:items-center [&_.user-avatar]:justify-center [&_.user-avatar]:border [&_.user-avatar]:border-gray-200 [&_.user-avatar]:rounded-full
              [&_.user-message]:bg-gray-100 [&_.user-message]:rounded-2xl [&_.user-message]:p-4 [&_.user-message]:break-words
              [&_.ai-message]:bg-blue-50 [&_.ai-message]:rounded-2xl [&_.ai-message]:p-4 [&_.ai-message]:break-words
              [&_.copy-button]:bg-transparent [&_.copy-button]:hover:bg-gray-100 [&_.copy-button]:rounded-md [&_.copy-button]:h-8 [&_.copy-button]:w-8 [&_.copy-button]:opacity-0 [&_.group:hover_.copy-button]:opacity-100
              [&_form]:fixed [&_form]:bottom-[100px] [&_form]:left-0 [&_form]:right-0 [&_form]:mx-auto [&_form]:max-w-[480px] [&_form]:px-4 [&_form]:!flex [&_form]:!flex-col [&_form]:!gap-3
              [&_textarea]:w-full [&_textarea]:p-4 [&_textarea]:rounded-xl [&_textarea]:bg-gray-100 [&_textarea]:resize-none [&_textarea]:outline-none [&_textarea]:min-h-[60px] [&_textarea]:max-h-[200px] [&_textarea]:text-sm
              [&_form_button]:w-full [&_form_button]:px-6 [&_form_button]:py-3 [&_form_button]:rounded-full [&_form_button]:bg-[#FF7043] [&_form_button]:text-white [&_form_button]:font-medium [&_form_button]:hover:bg-[#FF7043]/90 [&_form_button]:transition-colors [&_form_button]:disabled:opacity-50"
          />
        </div>
      </div>
    </ChatLayout>
  );
} 