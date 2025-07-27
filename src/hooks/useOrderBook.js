import { useEffect, useState } from "react";
import axios from "axios";

// Custom React hook to fetch and manage order book data from Binance API
const useOrderBook = (symbol = "BTCUSDT") => {
  const [bids, setBids] = useState([]); // State for storing top bid orders
  const [asks, setAsks] = useState([]); // State for storing top ask orders

  useEffect(() => {
    // Function to fetch order book data
    const fetchOrderBook = async () => {
      try {
        const response = await axios.get("https://api.binance.com/api/v3/depth", {
          params: {
            symbol,     
            limit: 5,   // Number of top entries to fetch
          },
        });

        // Update bid and ask states
        setBids(response.data.bids);
        setAsks(response.data.asks);
      } catch (error) {
        console.error("Order book fetch error:", error); // Log error if fetch fails
      }
    };

    fetchOrderBook(); // Initial fetch

    // Set interval to refresh order book data every 5 seconds
    const interval = setInterval(fetchOrderBook, 5000);

    // Cleanup interval on component unmount or symbol change
    return () => clearInterval(interval);
  }, [symbol]);

  // Return current bids and asks
  return { bids, asks };
};

export default useOrderBook;
