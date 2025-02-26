"use client";

import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Become a Millionaire</h1>
        <p className="max-w-xl mx-auto text-lg">
          A simple, free calculator that shows you how to reach your first million
          with monthly investments and compound interest.
        </p>
      </section>

      {/* Intro / Explanation */}
      <section className="py-10 px-4 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-4">Start Your Journey</h2>
        <p className="mb-6 text-gray-700">
          Use our compound interest calculator to see how your monthly
          contributions can grow over time. Adjust the numbers to find the plan
          that fits your financial goals.
        </p>
      </section>

      {/* Vision Statement (Why, How, What) */}
      <section className="py-10 px-4 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
        {/* Add the SVG here */}
        <img
          src="/grafik_vision.svg"
          alt="Vision Graphic"
          className="w-full max-w-md mx-auto mb-6"
        />
        <p className="mb-6 text-gray-700">
          <strong>Why:</strong> We believe that AI has the power to expand human
          potential. By connecting people with smart, personalized AI coaching, we
          enable greater autonomy, sharper decision-making, and a deeper sense of
          purpose in life.
        </p>
        <p className="mb-6 text-gray-700">
          <strong>How:</strong> We’re building a seamless interface that bridges
          humans and AI, starting with innovative decision-making tools. These tools
          empower you to tap into the vast capabilities of AI and gain real-time
          guidance—so you can stay in control, yet never alone in your journey.
        </p>
        <p className="mb-6 text-gray-700">
          <strong>What:</strong> Our Monthly Millionaire Calculator is just the first
          step. By giving you insight into compounding growth, we highlight how small
          decisions can lead to big results. Over time, we’ll expand our suite of
          AI-driven coaching solutions that help you reach your full potential and
          make life more meaningful.
        </p>
      </section>

      {/* Product Staircase */}
      <section className="w-full">
        {/* Stair 1: Done For You */}
        <div className="w-full bg-gradient-to-r from-indigo-100 to-indigo-50 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center text-indigo-800">Done For You</h2>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Risiko-Typ-Test */}
              <Link href="/risiko-typ-test" className="w-full md:w-1/2">
                <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:bg-indigo-100 transition-all duration-300 cursor-pointer transform hover:-translate-y-2">
                  <h3 className="text-2xl font-semibold mb-3 text-indigo-700">Risiko-Typ-Test</h3>
                  <p className="text-gray-600">Discover your risk profile</p>
                </div>
              </Link>
              {/* Potential-Analyse */}
              <Link href="/potential-analysis" className="w-full md:w-1/2">
                <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:bg-indigo-100 transition-all duration-300 cursor-pointer transform hover:-translate-y-2">
                  <h3 className="text-2xl font-semibold mb-3 text-indigo-700">Potential-Analyse</h3>
                  <p className="text-gray-600">How long to become a millionaire</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Stair 2: Coach */}
        <div className="w-full bg-gradient-to-r from-blue-100 to-blue-50 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <Link href="/coach">
              <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:bg-blue-100 transition-all duration-300 cursor-pointer transform hover:-translate-y-2">
                <h2 className="text-3xl font-bold mb-3 text-blue-700">Coach</h2>
                <p className="text-gray-600 text-lg">Habit-Chatbot: Your personal AI assistant</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Stair 3: Berater */}
        <div className="w-full bg-gradient-to-r from-purple-100 to-purple-50 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <Link href="/berater">
              <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:bg-purple-100 transition-all duration-300 cursor-pointer transform hover:-translate-y-2">
                <h2 className="text-3xl font-bold mb-3 text-purple-700">Berater</h2>
                <p className="text-gray-600 text-lg">Mastermind-Online-Community</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Stair 4: Trainer */}
        <div className="w-full bg-gradient-to-r from-teal-100 to-teal-50 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <Link href="/trainer">
              <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:bg-teal-100 transition-all duration-300 cursor-pointer transform hover:-translate-y-2">
                <h2 className="text-3xl font-bold mb-3 text-teal-700">Trainer</h2>
                <p className="text-gray-600 text-lg">Exklusive-Wissens-KI</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full mt-8 py-4 bg-gray-100 text-center text-gray-600">
        <p>© {new Date().getFullYear()} My Finance Startup. All rights reserved.</p>
      </footer>
    </main>
  );
}