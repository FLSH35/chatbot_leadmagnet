const { restClient } = require("@polygon.io/client-js");
const axios = require("axios");

const POLYGON_API_KEY = "nB26RdpJudmGLdOaXTy3chfsKPCRrjbl";
const rest = restClient(POLYGON_API_KEY);
const TELEGRAM_BOT_TOKEN = "YOUR_TELEGRAM_BOT_TOKEN";
const TELEGRAM_CHAT_ID = "YOUR_CHAT_ID";
const STATIC_USD_TO_EUR_RATE = 0.92;
const TESLA_TICKER = "TSLA";
const BUY_LINK = "https://www.tesla.com/invest";

const getDateRange = () => {
  const today = new Date();
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const dayBeforeYesterday = new Date(today); dayBeforeYesterday.setDate(today.getDate() - 2);
  const formatDate = (date) => date.toISOString().split("T")[0];
  return {
    fromDate: formatDate(dayBeforeYesterday),
    toDate: formatDate(yesterday),
    displayDate: yesterday.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  };
};

const getTeslaEODPriceInUSD = async () => {
  const { fromDate, toDate } = getDateRange();
  const data = await rest.stocks.aggregates(TESLA_TICKER, 1, "day", fromDate, toDate);
  return data.results && data.results.length > 0 ? data.results[data.results.length - 1].c : "N/A";
};

const convertToEUR = (usdPrice) => usdPrice === "N/A" ? "N/A" : (usdPrice * STATIC_USD_TO_EUR_RATE).toFixed(2);

const sendTelegramMessage = async (message) => {
  await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
    parse_mode: "Markdown",
  });
};

const sendStockReminder = async () => {
  const usdPrice = await getTeslaEODPriceInUSD();
  const eurPrice = convertToEUR(usdPrice);
  const { displayDate } = getDateRange();
  const message = `Hey! Tesla’s end-of-day stock price (${displayDate}) was €${eurPrice}. Ready to buy? [Click here](${BUY_LINK})`;
  await sendTelegramMessage(message);
  return { price: eurPrice, date: displayDate }; // Return for potential API use
};

setInterval(sendStockReminder, 20000);
sendStockReminder();