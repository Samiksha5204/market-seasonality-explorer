// src/hooks/useOrderBook.js
import { useEffect, useState } from "react";
import axios from "axios";

const useOrderBook = (symbol = "BTCUSDT") => {
  const [bids, setBids] = useState([]);
  const [asks, setAsks] = useState([]);

  useEffect(() => {
      const fetchOrderBook = async () => {
      try {
        const response = await axios.get("https://api.binance.com/api/v3/depth", {
          params: {
            symbol,
            limit: 5, // Top 5 bids and asks
          },
        });

        setBids(response.data.bids);
        setAsks(response.data.asks);
      } catch (error) {
        console.error("Order book fetch error:", error);
      }
    };

    fetchOrderBook();

    const interval = setInterval(fetchOrderBook, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, [symbol]);

  return { bids, asks };

};

export default useOrderBook;
