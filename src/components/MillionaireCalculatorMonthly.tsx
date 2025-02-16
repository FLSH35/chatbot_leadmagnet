"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

const questions = [
  {
    question: "Wie viel Zeit widmest du monatlich dem Studium der folgenden Anlageklassen?",
    types: ["Aktien", "Geldmarkt", "Anleihen", "Immobilien", "Rohstoffe", "Sammlerstücke", "Kryptowährungen"],
    options: ["Weniger als 1 Stunde", "1-5 Stunden", "5-10 Stunden", "Mehr als 10 Stunden"]
  },
  {
    question: "Wie groß ist dein Interesse an folgenden Anlageklassen?",
    types: ["Aktien", "Geldmarkt", "Anleihen", "Immobilien", "Rohstoffe", "Sammlerstücke", "Kryptowährungen"],
    options: ["Kein Interesse", "Geringes Interesse", "Mittleres Interesse", "Hohes Interesse"]
  },
  {
    question: "Wie überzeugt bist du von den langfristigen Aussichten der folgenden Anlageklassen?",
    types: ["Aktien", "Geldmarkt", "Anleihen", "Immobilien", "Rohstoffe", "Sammlerstücke", "Kryptowährungen"],
    options: ["Sehr skeptisch", "Skeptisch", "Neutral", "Zuversichtlich", "Sehr zuversichtlich"]
  },
];

const results = [
  "Analyst – Aktien, Kryptowährungen",
  "Konservativ – Geldmarkt, Anleihen",
  "Diversifiziert – Aktien, Immobilien, Anleihen",
  "Spekulant – Rohstoffe, Kryptowährungen",
  "Kunstliebhaber – Sammlerstücke"
];

export default function AnlageTypTest() {
  const [answers, setAnswers] = useState(new Array(questions.length).fill(new Array(questions[0].types.length).fill(0)));
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [email, setEmail] = useState("");
  const [hasSubscribed, setHasSubscribed] = useState(false);
  const [anlageType, setAnlageType] = useState(null);

  function handleAnswerChange(questionIndex, typeIndex, value) {
    const newAnswers = [...answers];
    newAnswers[questionIndex][typeIndex] = value;
    setAnswers(newAnswers);
  }

  function calculateAnlageType() {
    const scores = answers.map(q => q.reduce((sum, val) => sum + val, 0));
    const maxScore = Math.max(...scores);
    const typesWithMaxScore = scores.reduce((acc, score, index) => {
      if (score === maxScore) acc.push(index);
      return acc;
    }, []);

    // Einfache Entscheidung für das Ergebnis basierend auf dem höchsten Score
    setAnlageType(results[typesWithMaxScore[0]]); 
    setShowEmailPrompt(true); // Zeige das E-Mail-Dialog-Fenster, sobald das Ergebnis berechnet ist
  }

  async function handleEmailSubmit() {
    if (!email.trim()) return;
  
    const resultToSend = anlageType;
    console.log('Subscribing with email:', email, 'and result:', resultToSend);
  
    try {
      const response = await fetch(
        `https://us-central1-personality-score.cloudfunctions.net/subscribe_to_newsletter?email=${encodeURIComponent(email)}&first_name=Max&risikotyp=${encodeURIComponent(resultToSend)}`,
        { method: 'POST' }
      );
  
      if (!response.ok) {
        throw new Error('Subscription failed');
      }
  
      setHasSubscribed(true);
      setShowEmailPrompt(false);
      console.log('Subscription successful');
    } catch (error) {
      console.error('Error subscribing:', error);
    }
  }
  

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Welcher Anlagetyp bist du?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.map((q, i) => (
            <div key={i}>
              <Label>{q.question}</Label>
              {q.types.map((type, typeIndex) => (
                <div key={typeIndex} className="mb-2">
                  <h4 className="text-sm font-medium">{type}</h4>
                  {q.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`question-${i}-type-${typeIndex}`}
                        checked={answers[i][typeIndex] === optionIndex}
                        onChange={() => handleAnswerChange(i, typeIndex, optionIndex)}
                      />
                      <span>{option}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}

          <Button onClick={calculateAnlageType}>Ergebnis anzeigen</Button>

          {hasSubscribed && anlageType !== null && (
            <div className="mt-4 p-3 rounded bg-green-50 text-green-900">
              <p>Du bist ein: <strong>{anlageType}</strong></p>
              <p>Dein Ergebnis wurde an deine E-Mail gesendet.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showEmailPrompt} onOpenChange={setShowEmailPrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gib deine E-Mail-Adresse ein</DialogTitle>
          </DialogHeader>
          <p className="mb-2 text-sm text-gray-600">
            Um dein Ergebnis zu sehen, gib bitte deine E-Mail-Adresse ein. Dein Ergebnis wird dann an diese E-Mail-Adresse gesendet.
          </p>
          <Input
            type="email"
            placeholder="Deine E-Mail..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4"
          />
          <Button onClick={handleEmailSubmit}>Ergebnis per E-Mail erhalten</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}