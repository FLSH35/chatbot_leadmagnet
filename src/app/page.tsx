import React from "react"
import MillionaireCalculatorMonthly from "@/components/MillionaireCalculatorMonthly"

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

      {/* Calculator */}
      <section className="py-10 px-4 max-w-2xl mx-auto w-full">
        <MillionaireCalculatorMonthly />
      </section>

      {/* Footer */}
      <footer className="w-full mt-8 py-4 bg-gray-100 text-center text-gray-600">
        <p>© {new Date().getFullYear()} My Finance Startup. All rights reserved.</p>
      </footer>
    </main>
  )
}
