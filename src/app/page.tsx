'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input'; // shadcn input
import { Button } from '@/components/ui/button'; // shadcn button
import { ChatWindow } from '@/components/chat/ChatWindow'; // Import chat window
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'; // Modal

type Message = {
  id: string;
  text: string;
  isUserMessage?: boolean;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [email, setEmail] = useState('');
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: userInput,
      isUserMessage: true,
    };
    setMessages((prev) => [...prev, userMessage]);

    // Check if user has reached 10 messages
    if (messages.length + 1 >= 3 && !email) {
      setShowEmailPrompt(true);
      return; // Stop further messages until email is entered
    }

    // Clear input
    setUserInput('');

    // Mock a bot response
    const botResponse: Message = {
      id: crypto.randomUUID(),
      text: `You said: ${userMessage.text}`,
      isUserMessage: false,
    };

    // Simulate delay
    setTimeout(() => {
      setMessages((prev) => [...prev, botResponse]);
    }, 500);
  };

  const handleEmailSubmit = () => {
    if (email.trim() === '') return;
    setShowEmailPrompt(false);
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto border rounded shadow">
      <ChatWindow messages={messages} />

      {/* Email prompt modal */}
      <Dialog open={showEmailPrompt} onOpenChange={setShowEmailPrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Your Email</DialogTitle>
          </DialogHeader>
          <Input
            type="email"
            placeholder="Enter your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleEmailSubmit}>Submit</Button>
        </DialogContent>
      </Dialog>

      {/* Input area (Disabled if email is required) */}
      <div className="p-3 border-t flex space-x-2">
        <Input
          type="text"
          placeholder="Type your message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="flex-1"
          disabled={showEmailPrompt} // Disable if email is needed
        />
        <Button onClick={handleSend} disabled={showEmailPrompt}>
          Send
        </Button>
      </div>
    </div>
  );
}
