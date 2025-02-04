import React from 'react';
import clsx from 'clsx';

type MessageBubbleProps = {
  text: string;
  isUserMessage?: boolean;
};

export function MessageBubble({ text, isUserMessage }: MessageBubbleProps) {
  return (
    <div
      className={clsx(
        'px-4 py-2 rounded-lg max-w-xs break-words',
        isUserMessage
          ? 'ml-auto bg-blue-500 text-white'
          : 'mr-auto bg-gray-200 text-gray-900'
      )}
    >
      {text}
    </div>
  );
}
