
Project Github Repository:
https://github.com/Samiksha5204/market-seasonality-explorer

# Market Seasonality Explorer

An interactive financial calendar visualizing market volatility, liquidity, and performance on a daily basis using Binance crypto data. Users can explore seasonality patterns and view a dashboard for detailed metrics.

## Features

- Calendar heatmap for market indicators (volatility, liquidity, performance)
- Clickable days to open a dashboard
- Real-time chart with Binance Kline data
- Light/Dark mode toggle
- Asset selector (BTC, ETH, BNB)
- Market summary panel
- Responsive and animated UI with Framer Motion

1. Include instructions on how to run the project locally

### Prerequisites:
- Node.js (v18 or above)
- npm
- Go to this URL in your browser:(if Binance request API is not working)
  https://cors-anywhere.herokuapp.com/corsdemo

Click the button:
Request temporary access to the demo server

You’ll see:
"Temporary access granted..."

Now go back to your React app and refresh the page — the Binance request will work.

### Steps:

git clone https://github.com/Samiksha5204/market-seasonality-explorer
cd market-seasonality-explorer
npm install
npm start

2. Document any assumptions made and libraries used in your README file

### Libraries Used:
React.js
react-router-dom
axios
dayjs
framer-motion
bootstrap
lucide-react

### Assumptions
Sample volatility, liquidity, and performance data is mocked in the calendar.
Chart uses Binance public API for crypto price data.
Market data shown for BTC, ETH, and BNB only.

3. Data Scenarios & Edge Cases

- Normal: Full data available (e.g., 2025-01-01)
- Missing indicators: Shown as “N/A”
- API failure: Console error, fallback UI
- Invalid/Out-of-range date: Empty dashboard but app stays stable
- Responsive layout on small screens
- Dark mode contrast tested and adjusted

