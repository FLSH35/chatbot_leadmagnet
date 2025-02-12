"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function MillionaireCalculatorMonthly() {
  // Eingaben
  const [startCapital, setStartCapital] = useState<number>(10000);
  const [monthlyInvest, setMonthlyInvest] = useState<number>(500);
  const [annualReturnPercent, setAnnualReturnPercent] = useState<number>(8);

  // Ergebnis
  const [result, setResult] = useState<{
    months: number;
    years: number;
    restMonths: number;
  } | null>(null);

  function handleCalculate() {
    // Startwerte
    let capital = startCapital;
    const monthlyReturn = Math.pow(1 + annualReturnPercent / 100, 1 / 12) - 1;
    // Alternative (vereinfachte) Variante: annualReturnPercent / 100 / 12

    let months = 0;
    const maxMonths = 12 * 100; // 100 Jahre als Maximum, um Endlosschleifen zu verhindern

    while (capital < 1_000_000 && months < maxMonths) {
      months++;
      // 1) Monatliche Investition hinzufügen
      capital += monthlyInvest;
      // 2) Kapital verzinsen
      capital *= 1 + monthlyReturn;
    }

    if (capital >= 1_000_000) {
      const years = Math.floor(months / 12);
      const restMonths = months % 12;
      setResult({ months, years, restMonths });
    } else {
      // Falls innerhalb von 100 Jahren keine Million erreicht wird
      setResult(null);
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Werde Millionär*in – Monatliche Berechnung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Startkapital */}
          <div>
            <Label htmlFor="startCapital">Startkapital (EUR)</Label>
            <Input
              id="startCapital"
              type="number"
              value={startCapital}
              onChange={(e) => setStartCapital(Number(e.target.value))}
            />
          </div>

          {/* Monatliche Investition */}
          <div>
            <Label htmlFor="monthlyInvest">Monatliche Investition (EUR)</Label>
            <Input
              id="monthlyInvest"
              type="number"
              value={monthlyInvest}
              onChange={(e) => setMonthlyInvest(Number(e.target.value))}
            />
          </div>

          {/* Jährlicher Zinssatz (Slider) */}
          <div>
            <Label>
              Geschätzter jährlicher Return (%): {annualReturnPercent}%
            </Label>
            <Slider
              value={[annualReturnPercent]}
              onValueChange={(val) => setAnnualReturnPercent(val[0])}
              min={0}
              max={50}
              step={0.5}
            />
          </div>

          <Button onClick={handleCalculate}>Berechnen</Button>

          {/* Ergebnis-Anzeige */}
          {result !== null ? (
            <div className="mt-4 p-3 rounded bg-green-50">
              <p>
                Du erreichst die Million in <strong>{result.months}</strong>{" "}
                Monaten, also in{" "}
                <strong>
                  {result.years} Jahren und {result.restMonths} Monaten
                </strong>
                .
              </p>
            </div>
          ) : (
            <div className="mt-4 p-3 rounded bg-red-50">
              <p>
                Mit diesen Annahmen erreichst du die Million leider nicht innerhalb
                von 100 Jahren.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
