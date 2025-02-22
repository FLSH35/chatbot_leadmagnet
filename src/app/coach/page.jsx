"use client";

import React from "react";
import HabitChatbot from "@/components/HabitChatbot";

export default function CoachPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <section className="max-w-4xl mx-auto py-16 px-4">
        <h1 className="text-4xl font-bold text-blue-800 mb-6 text-center">
          Habit-Chatbot: Your Personal AI Coach
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Build better habits with our AI-powered chatbot. Get personalized guidance,
          track your progress, and stay motivated on your journey to success.
        </p>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <HabitChatbot />
        </div>
      </section>
    </main>
  );
}