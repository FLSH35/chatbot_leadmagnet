'use client';
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input'; // shadcn input
import { Button } from '@/components/ui/button'; // shadcn button
import { ChatWindow } from '@/components/chat/ChatWindow'; // Import chat window
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'; // Modal

// Nachrichtentyp
type Message = {
  id: string;
  text: string;
  isUserMessage?: boolean;
};

export default function ChatPage() {
  // Zustände für Chat, Email, den aktuellen Schritt im Fragenfluss
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [email, setEmail] = useState('');
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  // currentStep repräsentiert den Index der zuletzt gestellten Frage (0 bis 4)
  const [currentStep, setCurrentStep] = useState(0);

  // Definiere die 5 Fragen zu den gewünschten Themen
  const questions = [
    "Frage 1: Wie ist die Verteilung deiner Wochenstunden?",
    "Frage 2: Wie bewertest du Ablenkungen in deinem Alltag?",
    "Frage 3: Wie schätzt du deine Effektivität ein?",
    "Frage 4: Wie würdest du deine Zeitgewohnheiten beschreiben?",
    "Frage 5: Wie beurteilst du deine wertvollen Zeiteinheiten?",
  ];

  // Finale Ergebnisnachricht (Platzhalter) – Zeilenumbrüche und Tabs werden beibehalten
  const finalResult = `Dein Wirksamkeitsfaktor:\t\t\t\t
\t\t\t\t#NAME?
\t\t\t\t#NAME?
\t#NAME?\t\t\t0.0
\t\t\t\t#DIV/0!
\t\t\t\t0.0


\t\t\t\t0.0
     Verteilung Wochenstunden\t\t\t#NAME?\t\t0
     Ablenkungen\t\t\t0%\t\t0.0
     Effektivität\t\t\t0%\t\t0
     Zeitgewohnheiten\t\t\t0%\t\t0
     Wertvolle Zeiteinheiten\t\t\t0%\t\t0


Dein Chronotyp:\t\t\t\t0
\t\t\t\t0
#NAME?\t\t\t\t0
\t\t\t\t0
\t\t\t\t0
Du lebst tendenziell\t\t#NAME?\tStunden versetzt zu deinem Chronotyp\t\t
\t\t
Du schläfst ungefähr\t\t-484\tMinuten zu wenig`;

  // Beim Laden der Seite: Zeige eine Einleitungsnachricht und direkt danach die erste Frage
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: crypto.randomUUID(),
        text: "Willkommen im Chat! Bitte beantworte die folgenden 5 Fragen. Nachdem du die letzte Frage beantwortet hast, wirst du gebeten, deine Email anzugeben, um dein Ergebnis zu erhalten.",
        isUserMessage: false,
      };
      setMessages([welcomeMessage]);

      // Starte mit der ersten Frage (nach kurzem Delay)
      setTimeout(() => {
        const firstQuestion: Message = {
          id: crypto.randomUUID(),
          text: questions[0],
          isUserMessage: false,
        };
        setMessages((prev) => [...prev, firstQuestion]);
      }, 500);
    }
  }, [messages.length, questions]);

  // Wird aufgerufen, wenn der User eine Antwort sendet
  const handleSend = () => {
    if (!userInput.trim()) return;

    // Speichere die Antwort des Users
    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: userInput,
      isUserMessage: true,
    };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput('');

    // Wenn es noch nicht die letzte Frage war, stelle die nächste Frage
    if (currentStep < questions.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      const nextQuestion: Message = {
        id: crypto.randomUUID(),
        text: questions[nextStep],
        isUserMessage: false,
      };
      setTimeout(() => {
        setMessages((prev) => [...prev, nextQuestion]);
      }, 500);
    } else {
      // Nachdem die letzte Frage beantwortet wurde, fordere die Email an,
      // um das Ergebnis anzuzeigen.
      setShowEmailPrompt(true);
    }
  };

  // Wird aufgerufen, wenn der User seine Email eingibt und bestätigt
  const handleEmailSubmit = () => {
    if (email.trim() === '') return;
    setShowEmailPrompt(false);

    // Füge die finale Ergebnisnachricht hinzu
    const resultMessage: Message = {
      id: crypto.randomUUID(),
      text: finalResult,
      isUserMessage: false,
    };
    setTimeout(() => {
      setMessages((prev) => [...prev, resultMessage]);
    }, 500);
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto border rounded shadow">
      <ChatWindow messages={messages} />

      {/* Email Prompt Modal – wird erst nach der letzten Frage angezeigt */}
      <Dialog open={showEmailPrompt} onOpenChange={setShowEmailPrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bitte gib deine Email-Adresse ein, um dein Ergebnis zu erhalten</DialogTitle>
          </DialogHeader>
          <Input
            type="email"
            placeholder="Email eingeben..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleEmailSubmit}>Submit</Button>
        </DialogContent>
      </Dialog>

      {/* Eingabe-Bereich */}
      <div className="p-3 border-t flex space-x-2">
        <Input
          type="text"
          placeholder="Deine Antwort..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="flex-1"
          disabled={showEmailPrompt} // Eingabe sperren, wenn Email abgefragt wird
        />
        <Button onClick={handleSend} disabled={showEmailPrompt}>
          Send
        </Button>
      </div>
    </div>
  );
}
