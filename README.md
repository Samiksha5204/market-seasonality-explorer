
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

    - git clone https://github.com/Samiksha5204/market-seasonality-explorer
    - cd market-seasonality-explorer
    - npm install
    - npm start

2. Share a link to the GitHub repository:
   
    https://github.com/Samiksha5204/market-seasonality-explorer
    
3. Document any assumptions made and libraries used in your README file

    ### Libraries Used:
    - React.js
    - react-router-dom
    - axios
    - dayjs
    - framer-motion
    - bootstrap
    - lucide-react

    ### Assumptions
    - Sample volatility, liquidity, and performance data is mocked in the calendar.
    - Chart uses Binance public API for crypto price data.
    - Market data shown for BTC, ETH, and BNB only.

4. Include unit tests for critical components and functions
    a.Component Test Cases:
    1. CalendarView Component
       - Should render a calendar with 365 day cells.
       - Should highlight the selected date when clicked.
       - Should show correct volatility, liquidity, and performance visual cues.
       - Should navigate to /dashboard/:date when a cell is clicked.

    2. DashboardPanel Component
        - Should fetch and display chart data for the selected date.
        - Should update chart when asset dropdown is changed.
        - Should show "N/A" if data for a date is missing.
        - Should render correct Market Summary with badges (volatility/liquidity).
        - Should fetch Binance chart data via useChartData.       
    3. Asset Dropdown Selector
        - Should default to BTC   
        - Should allow switching between BTC, ETH, BNB    
        - Should update the chart and market summary on asset change.

    4. Theme Toggle (from ThemeContext)
        - Should toggle between light and dark mode     

    b.Function Test Cases:
    1.getVolatilityCategory(volatility)
        - Should return "Low" if volatility < 0.0
        - Should return "Medium" if volatility between 0.02 and 0.0  
        - Should return "High" if volatility > 0.04

    2.getLiquidityCategory(liquidity)
        - Should return "Low" if liquidity < 10
        - Should return "Medium" if liquidity between 10M and 50
        - Should return "High" if liquidity > 50M

5. Data Scenarios & Edge Cases

    - Normal: Full data available (e.g., 2025-01-01)
    - Missing indicators: Shown as “N/A”
    - API failure: Console error, fallback UI
    - Invalid/Out-of-range date: Empty dashboard but app stays stable
    - Responsive layout on small screens
    - Dark mode contrast tested and adjusted

