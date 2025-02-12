"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

// Example "ChatWindow" that displays messages (custom component)
import { ChatWindow } from "@/components/chat/ChatWindow";

type Message = {
  id: string;
  text: string;
  isUserMessage?: boolean;
};

export default function ChatLeadMagnet() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");

  // Step-based approach: 0 -> greet, 1 -> Start Capital, 2 -> Monthly Invest, 3 -> Annual Return, 4 -> Ready to calc
  const [currentStep, setCurrentStep] = useState<number>(0);

  // State for the three main inputs
  const [startCapital, setStartCapital] = useState<number>(10000);
  const [monthlyInvest, setMonthlyInvest] = useState<number>(500);
  const [annualReturn, setAnnualReturn] = useState<number>(8);

  // For email gating
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [email, setEmail] = useState("");
  const [finalResult, setFinalResult] = useState<string>("");

  // On first render, welcome the user
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMsg: Message = {
        id: crypto.randomUUID(),
        text: "Welcome to the Millionaire Calculator Chat! We'll collect three inputs and then require your email to see your final result. Let's begin!",
        isUserMessage: false,
      };
      setMessages([welcomeMsg]);
    }
  }, [messages]);

  // Helper: Add a bot message to the chat
  const addBotMessage = (text: string) => {
    const newMsg: Message = { id: crypto.randomUUID(), text, isUserMessage: false };
    setMessages((prev) => [...prev, newMsg]);
  };

  // Helper: Add a user message to the chat
  const addUserMessage = (text: string) => {
    const newMsg: Message = { id: crypto.randomUUID(), text, isUserMessage: true };
    setMessages((prev) => [...prev, newMsg]);
  };

  // When user types in the chat's text field and clicks "Send"
  const handleSend = () => {
    if (!userInput.trim()) return;
    // Add user input to chat
    addUserMessage(userInput);

    // Try parsing float if relevant to the current step
    const numericVal = parseFloat(userInput.replace(",", "."));
    if (!isNaN(numericVal)) {
      if (currentStep === 1) {
        setStartCapital(numericVal);
      } else if (currentStep === 2) {
        setMonthlyInvest(numericVal);
      } else if (currentStep === 3) {
        setAnnualReturn(numericVal);
      }
    }

    setUserInput("");
  };

  // Move to the next step in the conversation
  const goToNextStep = () => {
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);

    // Provide "bot" text for next step
    switch (nextStep) {
      case 1:
        addBotMessage("Step 1: Please set your Start Capital (you can use the slider or type a value).");
        break;
      case 2:
        addBotMessage("Step 2: Please set your Monthly Investment (slider or type).");
        break;
      case 3:
        addBotMessage("Step 3: Please set your expected Annual Return (%) (slider or type).");
        break;
      case 4:
        addBotMessage("Great! Now click 'Calculate' to see how many months (or years) it might take to reach $1,000,000.");
        break;
      default:
        break;
    }
  };

  // Calculation logic (monthly compounding)
  const calculateResult = () => {
    // Convert annualReturn to monthly
    const monthlyRate = Math.pow(1 + annualReturn / 100, 1 / 12) - 1;
    let capital = startCapital;
    let months = 0;
    const maxMonths = 12 * 100; // up to 100 years

    while (capital < 1_000_000 && months < maxMonths) {
      months++;
      // add monthly investment
      capital += monthlyInvest;
      // apply monthly interest
      capital *= 1 + monthlyRate;
    }

    if (capital >= 1_000_000) {
      const years = Math.floor(months / 12);
      const restMonths = months % 12;
      setFinalResult(
        `You will likely reach one million after ${months} months, which is about ${years} years and ${restMonths} months.`
      );
    } else {
      setFinalResult(
        "It looks like you won't reach one million within 100 years at these parameters."
      );
    }

    // Show the email prompt
    setShowEmailPrompt(true);
  };

  // Submit the email to reveal the final result
  const handleEmailSubmit = () => {
    if (!email.trim()) return;

    setShowEmailPrompt(false);

    // Now we add the final result as a new message
    const resultMsg: Message = {
      id: crypto.randomUUID(),
      text: finalResult,
      isUserMessage: false,
    };
    setMessages((prev) => [...prev, resultMsg]);
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto border rounded shadow">
      {/* Chat display */}
      <ChatWindow messages={messages} />

      {/* STEP-CONTROLLED UI WIDGETS */}
      <div className="p-3 border-t flex flex-col space-y-3">
        {/* If we're not yet at step 1, show a button to begin */}
        {currentStep === 0 && (
          <Button onClick={goToNextStep}>Start the Input Steps</Button>
        )}

        {currentStep === 1 && (
          <div className="space-y-2">
            <p className="text-sm">Start Capital: {startCapital} USD</p>
            <Slider
              value={[startCapital]}
              onValueChange={(v) => setStartCapital(v[0])}
              min={0}
              max={200000}
              step={1000}
            />
            <Button onClick={goToNextStep}>Next</Button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-2">
            <p className="text-sm">Monthly Investment: {monthlyInvest} USD</p>
            <Slider
              value={[monthlyInvest]}
              onValueChange={(v) => setMonthlyInvest(v[0])}
              min={0}
              max={5000}
              step={50}
            />
            <Button onClick={goToNextStep}>Next</Button>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-2">
            <p className="text-sm">Annual Return: {annualReturn}%</p>
            <Slider
              value={[annualReturn]}
              onValueChange={(v) => setAnnualReturn(v[0])}
              min={0}
              max={20}
              step={0.5}
            />
            <Button onClick={goToNextStep}>Next</Button>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-2">
            <p className="text-sm">
              Click the button to calculate how many months/years until you reach one million.
            </p>
            <Button onClick={calculateResult}>Calculate</Button>
          </div>
        )}

        {/* The chat text input (always visible) */}
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Type here if you prefer text input..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </div>

      {/* EMAIL PROMPT */}
      <Dialog open={showEmailPrompt} onOpenChange={setShowEmailPrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Please enter your email to get your result:</DialogTitle>
          </DialogHeader>
          <Input
            type="email"
            placeholder="Your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleEmailSubmit}>Submit</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
