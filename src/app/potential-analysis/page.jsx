"use client";

import React, { useState } from "react";
import MillionaireCalculatorMonthly from "@/components/MillionaireCalculatorMonthly";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function PotentialAnalysisPage() {
  const [isPaid, setIsPaid] = useState(false); // Tracks payment status
  const [paymentCode, setPaymentCode] = useState(""); // For simple code-based payment simulation
  const [error, setError] = useState(""); // Error message for invalid payment

  // Simulate a payment check (could be replaced with Stripe integration later)
  const handlePayment = () => {
    // For demo purposes, let's say the valid code is "POTENTIAL2025"
    if (paymentCode === "POTENTIAL2025") {
      setIsPaid(true);
      setError("");
    } else {
      setError("Invalid payment code. Please try again or contact support.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h1 className="text-4xl font-bold text-indigo-800 mb-6 text-center">
          Potential-Analyse: Your Path to a Million
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Discover how long it will take you to become a millionaire with our
          powerful calculator. Unlock access with a one-time payment.
        </p>

        {isPaid ? (
          // Show the calculator if payment is complete
          <div className="bg-white rounded-xl shadow-lg p-6">
            <MillionaireCalculatorMonthly />
          </div>
        ) : (
          // Show payment gate if not paid
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-indigo-700">
                Unlock Your Potential Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Access our premium Millionaire Calculator for a one-time payment.
                Enter your payment code below to unlock instant access.
              </p>
              <Input
                type="text"
                placeholder="Enter payment code (e.g., POTENTIAL2025)"
                value={paymentCode}
                onChange={(e) => setPaymentCode(e.target.value)}
                className="w-full"
              />
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              <Button
                onClick={handlePayment}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                Unlock Now
              </Button>
              <p className="text-sm text-gray-500 text-center">
                Need a code? Purchase access for just $9.99 [Contact Support]
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
}