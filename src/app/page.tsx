'use client';
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input'; // shadcn input
import { Button } from '@/components/ui/button'; // shadcn button
import { ChatWindow } from '@/components/chat/ChatWindow'; // Import chat window
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'; // Modal

// Erweitere den Nachrichtentyp so, dass text entweder ein string oder ein React-Element sein kann
type Message = {
  id: string;
  text: string | React.ReactNode;
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

  // Finale Ergebnisnachricht als String mit Zeilenumbrüchen
  const finalResultString = `WIRKSAMKEITSFAKTOR:
------------------------------
Messwert 1: 85
Messwert 2: 90
Durchschnitt: 87.5

WOCHENSTUNDEN:
------------------------------
Arbeitszeit: 40h
Freizeit: 20h

ABLENKUNGEN:
------------------------------
Smartphone: 15%
Soziale Medien: 10%
Sonstiges: 5%

EFFEKTIVITÄT:
------------------------------
Produktivität: 80%
Pausen: 20%

ZEITGEWOHNHEITEN:
------------------------------
Frühaufsteher: Ja
Schlafrhythmus: Regelmäßig

WERTVOLLE ZEITEINHEITEN:
------------------------------
Fokuszeiten: 4 Stunden
Ablenkungszeiten: 2 Stunden

CHRONOTYP:
------------------------------
Typ: Morgenmensch
Chronotyp-Verschiebung: +1 Stunde

Du lebst tendenziell 1 Stunde versetzt zu deinem Chronotyp.
Du schläfst ungefähr 30 Minuten zu wenig.`;

  // Beim Laden der Seite: Zeige eine Einleitungsnachricht und danach die erste Frage
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

    // Füge die finale Ergebnisnachricht hinzu – der Text wird in einem <pre>-Block angezeigt,
    // damit die Formatierung (Zeilenumbrüche und Absätze) erhalten bleibt.
    const resultMessage: Message = {
      id: crypto.randomUUID(),
      text: <pre style={{ whiteSpace: 'pre-wrap' }}>{finalResultString}</pre>,
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
