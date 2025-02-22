"use client";

import React, { useState, useEffect } from "react";

export default function HabitChatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I'm your Habit Coach. What habit would you like to work on today?" }
  ]);
  const [input, setInput] = useState("");
  const [habits, setHabits] = useState([]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user's message
    setMessages([...messages, { sender: "user", text: input }]);

    // Simple bot response logic
    let botResponse = "";
    if (input.toLowerCase().includes("habit")) {
      const newHabit = input.replace(/add habit |create habit /i, "").trim();
      setHabits([...habits, { name: newHabit, streak: 0 }]);
      botResponse = `Great! I've added "${newHabit}" to your habits. How can I help you with it today?`;
    } else if (input.toLowerCase().includes("list") || input.toLowerCase().includes("show")) {
      botResponse = habits.length
        ? `Your habits: ${habits.map(h => `${h.name} (Streak: ${h.streak} days)`).join(", ")}`
        : "You haven't added any habits yet!";
    } else if (input.toLowerCase().includes("done") || input.toLowerCase().includes("completed")) {
      const habitName = input.replace(/done |completed /i, "").trim();
      const updatedHabits = habits.map(h =>
        h.name.toLowerCase() === habitName.toLowerCase()
          ? { ...h, streak: h.streak + 1 }
          : h
      );
      setHabits(updatedHabits);
      botResponse = habits.some(h => h.name.toLowerCase() === habitName.toLowerCase())
        ? `Nice work! I've updated your streak for "${habitName}". Keep it up!`
        : `I couldn't find "${habitName}" in your habits. Want to add it?`;
    } else {
      botResponse = "I can help you add habits, list them, or mark them as done. What would you like to do?";
    }

    // Add bot's response
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: "bot", text: botResponse }]);
    }, 500);

    setInput("");
  };

  // Auto-scroll to latest message
  useEffect(() => {
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[500px] w-full">
      <div
        id="chat-container"
        className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded-t-xl"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex p-4 bg-white border-t rounded-b-xl">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}