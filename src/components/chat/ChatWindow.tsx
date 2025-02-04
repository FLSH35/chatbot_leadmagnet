import React from 'react';
import { MessageBubble } from './MessageBubble';

type Message = {
  id: string;
  text: string;
  isUserMessage?: boolean;
};

type ChatWindowProps = {
  messages: Message[];
};

export function ChatWindow({ messages }: ChatWindowProps) {
  return (
    <div className="flex flex-col w-full h-full">
      {/* Chat messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            text={msg.text}
            isUserMessage={msg.isUserMessage}
          />
        ))}
      </div>
    </div>
  );
}
