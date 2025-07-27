import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import useOrderBook from "../../hooks/useOrderBook";
import { motion } from "framer-motion";

// Static data
const volatilityData = {
  "2025-07-01": 0.2,
  "2025-07-05": 0.4,
  "2025-07-10": 0.7,
  "2025-07-15": 0.5,
  "2025-07-20": 0.8,
};
const liquidityData = {
  "2025-07-01": 0.3,
  "2025-07-05": 0.6,
  "2025-07-10": 0.8,
  "2025-07-15": 0.4,
  "2025-07-20": 0.9,
};
const performanceData = {
  "2025-07-01": 0.03,
  "2025-07-05": -0.01,
  "2025-07-10": 0.07,
  "2025-07-15": -0.05,
  "2025-07-20": 0.12,
};

const DashboardPanel = () => {
  const { date } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedAsset, setSelectedAsset] = useState("BTCUSDT");
  const { bids, asks } = useOrderBook(selectedAsset);

  const getVolatilityCategory = (value) => {
    if (value < 0.3) return "Low";
    if (value < 0.6) return "Medium";
    return "High";
  };
  const getLiquidityCategory = (value) => {
    if (value < 0.4) return "Low";
    if (value < 0.7) return "Medium";
    return "High";
  };

  const v = volatilityData[date];
  const l = liquidityData[date];
  const p = performanceData[date];

  // Fetch historical price chart data for the selected asset and date
  useEffect(() => {
    const fetchData = async () => {
      try {
        const selectedDate = new Date(date);
        const startTime = new Date(selectedDate);
        startTime.setDate(startTime.getDate() - 3);
        const endTime = new Date(selectedDate);
        endTime.setDate(endTime.getDate() + 3);

        const response = await axios.get(
          "https://api.binance.com/api/v3/klines",
          {
            params: {
              symbol: selectedAsset,
              interval: "1d",
              startTime: startTime.getTime(),
              endTime: endTime.getTime(),
            },
          }
        );

        // Format response for chart
        const formatted = response?.data.map((d) => ({
          openTime: new Date(d[0]),
          close: parseFloat(d[4]),
          date: new Date(d[0]).toISOString().split("T")[0],
        }));

        setData(formatted);
      } catch (error) {
        console.error("Fetch error", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date, selectedAsset]);

  // Extract close price for selected date
  const selectedClose = data?.find((d) => d.date === date)?.close;

  // Utility: download metrics + chart data as CSV
  const downloadCSV = () => {
    const rows = [
      ["Metric", "Value"],
      ["Date", date],
      ["Volatility", v !== undefined ? v : "N/A"],
      ["Volatility Category", v ? getVolatilityCategory(v) : "N/A"],
      ["Liquidity", l !== undefined ? l : "N/A"],
      ["Liquidity Category", l ? getLiquidityCategory(l) : "N/A"],
      ["Performance", p !== undefined ? (p * 100).toFixed(2) + "%" : "N/A"],
      ["BTC Close", selectedClose ? `$${selectedClose.toFixed(2)}` : "N/A"],
      [],
      ["Date", "BTC Close Price"],
      ...(data?.map((d) => [d.date, d.close]) || []),
    ];

    const csvContent = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `MarketData_${date}.csv`;
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header Section */}
      <div className="d-flex justify-content-between">
        <h3 className="text-success mb-3">Dashboard {date}</h3>
        <div className="d-flex justify-content-between">
          <h5 className="mb-2 fw-semibold text-secondary pe-2">
            Select Asset to View Market Data
          </h5>
          {/* Asset Selector Dropdown */}
          <select
            className="form-select w-auto"
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
          >
            <option value="BTCUSDT">BTC</option>
            <option value="ETHUSDT">ETH</option>
            <option value="BNBUSDT">BNB</option>
          </select>
        </div>
      </div>

      {/* Navigation + CSV Download */}
      <Link to="/" className="btn btn-sm btn-outline-primary mb-3">
        Back to Calendar
      </Link>
      <button
        className="btn btn-sm btn-success mb-3 ms-2"
        onClick={downloadCSV}
      >
        Download CSV
      </button>

      {/* Metrics Summary */}
      <motion.div
        className="card p-3 mb-4 bg-light"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h5 className="mb-3 fw-bold text-dark dark-mode-text-light">
          Market Summary
        </h5>
        <div className="row">
          <div className="col-md-3 fw-bold text-dark">
            <strong>Volatility:</strong> {v ?? "N/A"}{" "}
            <span className="badge bg-info">
              {v ? getVolatilityCategory(v) : ""}
            </span>
          </div>
          <div className="col-md-3 fw-bold text-dark">
            <strong>Liquidity:</strong> {l ?? "N/A"}{" "}
            <span className="badge bg-secondary">
              {l ? getLiquidityCategory(l) : ""}
            </span>
          </div>
          <div className="col-md-3 fw-bold text-dark">
            <strong>Performance:</strong>{" "}
            <span className={p > 0 ? "text-success" : "text-danger"}>
              {p !== undefined ? `${(p * 100).toFixed(2)}%` : "N/A"}
            </span>
          </div>
          <div className="col-md-3 fw-bold text-dark">
            <strong>BTC Close:</strong>{" "}
            {selectedClose ? `$${selectedClose.toFixed(2)}` : "N/A"}
          </div>
        </div>
      </motion.div>

      {/* Conditional: No Chart Data */}
      {!loading && data?.length === 0 && (
        <p>No data available for selected date.</p>
      )}

      {/* Price Line Chart */}
      {!loading && data?.length > 0 && (
        <motion.div
          className="card p-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h5 className="mb-3">
            {selectedAsset.replace("USDT", "")} Close Price (Sample)
          </h5>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <XAxis dataKey="date" />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="close"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Order Book Tables */}
      <div className="row mt-4">
        {/* Top Bids */}
        <motion.div
          className="col-md-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h5 className="text-success">Top Buy Orders (Bids)</h5>
          <table className="table table-sm table-bordered">
            <thead className="table-light">
              <tr>
                <th>Price (USDT)</th>
                <th>Quantity (BTC)</th>
              </tr>
            </thead>
            <tbody>
              {bids.map(([price, qty], i) => (
                <tr key={i}>
                  <td className="text-success">
                    {parseFloat(price).toFixed(2)}
                  </td>
                  <td>{parseFloat(qty).toFixed(6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Top Asks */}
        <motion.div
          className="col-md-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h5 className="text-danger">Top Sell Orders (Asks)</h5>
          <table className="table table-sm table-bordered">
            <thead className="table-light">
              <tr>
                <th>Price (USDT)</th>
                <th>Quantity (BTC)</th>
              </tr>
            </thead>
            <tbody>
              {asks.map(([price, qty], i) => (
                <tr key={i}>
                  <td className="text-danger">
                    {parseFloat(price).toFixed(2)}
                  </td>
                  <td>{parseFloat(qty).toFixed(6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardPanel;
