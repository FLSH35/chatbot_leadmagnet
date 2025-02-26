"use client";

import React, { useState, useEffect } from "react";
import { restClient } from "@polygon.io/client-js";
import axios from "axios";

// Initialize Polygon.io REST client
const POLYGON_API_KEY = "nB26RdpJudmGLdOaXTy3chfsKPCRrjbl";
const rest = restClient(POLYGON_API_KEY);

// Telegram configuration
const TELEGRAM_BOT_TOKEN = "YOUR_TELEGRAM_BOT_TOKEN"; // REPLACE THIS WITH YOUR ACTUAL TOKEN
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

export default function TeslaStockBot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I’ll send Tesla’s EOD price in EUR every 20s here and to Telegram. Use /getchatid to see your chat ID." }
  ]);
  const [input, setInput] = useState("");
  const [telegramChatId, setTelegramChatId] = useState(null); // Persist chat ID

  const TESLA_TICKER = "TSLA";
  const BUY_LINK = "https://www.tesla.com/invest";
  const STATIC_USD_TO_EUR_RATE = 0.92;

  // Get dates: day before yesterday and yesterday
  const getDateRange = () => {
    const today = new Date("2025-02-23"); // Hardcoded; use new Date() in production
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    const dayBeforeYesterday = new Date(today); dayBeforeYesterday.setDate(today.getDate() - 2);
    const formatDate = (date) => date.toISOString().split("T")[0];
    return {
      fromDate: formatDate(dayBeforeYesterday),
      toDate: formatDate(yesterday),
      displayDate: yesterday.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
  };

  // Fetch Tesla EOD price in USD
  const getTeslaEODPriceInUSD = async () => {
    try {
      const { fromDate, toDate } = getDateRange();
      const data = await rest.stocks.aggregates(TESLA_TICKER, 1, "day", fromDate, toDate);
      return data.results && data.results.length > 0 ? data.results[data.results.length - 1].c : "N/A";
    } catch (error) {
      console.error("Error fetching Tesla EOD price:", error);
      return "N/A";
    }
  };

  // Convert USD to EUR
  const convertToEUR = (usdPrice) => usdPrice === "N/A" ? "N/A" : (usdPrice * STATIC_USD_TO_EUR_RATE).toFixed(2);

  // Send message to Telegram
  const sendTelegramMessage = async (chatId, message) => {
    if (!chatId || chatId === "Not found" || chatId.startsWith("No recent updates") || chatId.startsWith("Error")) {
      console.log("No valid chat ID to send Telegram message");
      return;
    }
    try {
      const response = await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      });
      console.log("Telegram response:", response.data);
    } catch (error) {
      console.error("Error sending to Telegram:", error.response?.data || error.message);
    }
  };

  // Fetch chat ID from Telegram updates
  const getChatId = async () => {
    try {
      const response = await axios.get(`${TELEGRAM_API}/getUpdates`);
      const updates = response.data.result;
      if (updates.length > 0) {
        const latestChat = updates[updates.length - 1].message?.chat || updates[updates.length - 1].channel_post?.chat;
        const chatId = latestChat?.id?.toString();
        if (chatId) {
          setTelegramChatId(chatId); // Persist chat ID
          return chatId;
        }
        return "No recent updates. Send me a message in Telegram first!";
      }
      return "No recent updates. Send me a message in Telegram first!";
    } catch (error) {
      console.error("Error fetching chat ID:", error);
      return "Error fetching chat ID";
    }
  };

  // Handle stock reminder and Telegram send
  const sendStockReminder = async () => {
    const usdPrice = await getTeslaEODPriceInUSD();
    const eurPrice = convertToEUR(usdPrice);
    const { displayDate } = getDateRange();
    const botMessage = `Hey! Tesla’s end-of-day stock price (${displayDate}) was €${eurPrice}. Ready to buy? [Click here](${BUY_LINK})`;
    
    // Update UI
    setMessages(prev => [...prev, { sender: "bot", text: botMessage }]);
    
    // Send to Telegram if chatId is available
    if (telegramChatId) {
      await sendTelegramMessage(telegramChatId, botMessage);
    }
  };

  // Set up interval for reminders
  useEffect(() => {
    const initializeAndRun = async () => {
      if (!telegramChatId) {
        const chatId = await getChatId();
        if (!chatId.startsWith("No recent") && !chatId.startsWith("Error")) {
          setTelegramChatId(chatId);
        }
      }
      await sendStockReminder();
    };

    initializeAndRun(); // Initial run
    const interval = setInterval(sendStockReminder, 20000);

    return () => clearInterval(interval);
  }, [telegramChatId]); // Rerun if chatId changes

  // Handle user input (including /getchatid command)
  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { sender: "user", text: input }]);

    if (input.toLowerCase() === "/getchatid") {
      const chatId = await getChatId();
      const response = `Your Telegram chat ID is: ${chatId}. Send me a message in Telegram if not found!`;
      setMessages(prev => [...prev, { sender: "bot", text: response }]);
    } else {
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: "bot", text: "Got it! I’ll keep sending updates here and to Telegram." }]);
      }, 500);
    }
    setInput("");
  };

  // Auto-scroll to latest message
  useEffect(() => {
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [messages]);

  return (
    <div className="flex flex-col h-[500px] w-full">
      <div id="chat-container" className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded-t-xl">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-4 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[70%] p-3 rounded-lg ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
              <span dangerouslySetInnerHTML={{ __html: msg.text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="underline text-blue-600">$1</a>') }} />
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
          placeholder="Type /getchatid or a message..."
          className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={handleSend} className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700">
          Send
        </button>
      </div>
    </div>
  );
}