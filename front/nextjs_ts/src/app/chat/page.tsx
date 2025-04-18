'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import ChatLayout from './chat-layout';

import '@llamaindex/chat-ui/styles/markdown.css' // code, latex and custom markdown styling
import '@llamaindex/chat-ui/styles/pdf.css' // pdf styling

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });

  return (
    <ChatLayout>
      <div className="flex flex-col h-[calc(100vh-160px)] overflow-hidden bg-white">
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="flex flex-col gap-4 h-full">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-4 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'bg-gray-100'
                      : 'bg-blue-50'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="fixed bottom-[100px] left-0 right-0 mx-auto max-w-[480px] px-4 flex flex-col gap-3"
        >
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="w-full p-4 rounded-xl bg-gray-100 resize-none outline-none min-h-[60px] max-h-[200px] text-sm"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 rounded-full bg-[#FF7043] text-white font-medium hover:bg-[#FF7043]/90 transition-colors disabled:opacity-50"
          >
            Send Message
          </button>
        </form>
      </div>
    </ChatLayout>
  );
} 