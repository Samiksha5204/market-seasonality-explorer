import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "./CalendarView.css"; // Optional for custom styling
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { Button } from "react-bootstrap";

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
  "2025-07-01": 0.03, // +3%
  "2025-07-05": -0.01, // -1%
  "2025-07-10": 0.07,
  "2025-07-15": -0.05,
  "2025-07-20": 0.12,
};
const CalendarView = () => {
  const [viewMode, setViewMode] = useState("daily");
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const startDay = currentMonth.startOf("month").startOf("week");
  const endDay = currentMonth.endOf("month").endOf("week");

  const generateCalendar = () => {
    if (viewMode === "daily") {
      let date = startDay.clone();
      const calendar = [];

      while (date.isBefore(endDay, "day")) {
        const week = [];
        for (let i = 0; i < 7; i++) {
          week.push(date.clone());
          date = date.add(1, "day");
        }
        calendar.push(week);
      }

      return calendar;
    }

    if (viewMode === "weekly") {
      const calendar = [];
      let date = currentMonth.startOf("month").startOf("week");
      const end = currentMonth.endOf("month").endOf("week");

      while (date.isBefore(end)) {
        calendar.push([date.clone()]); // One cell per week
        date = date.add(1, "week");
      }

      return calendar;
    }

    if (viewMode === "monthly") {
      // Just one cell: the current month
      return [[currentMonth.startOf("month")]];
    }
  };

  const aggregateMetrics = (start, end) => {
    let days = [];
    let date = start.clone();

    while (date.isBefore(end, "day") || date.isSame(end, "day")) {
      days.push(date.format("YYYY-MM-DD"));
      date = date.add(1, "day");
    }

    const vols = days
      .map((d) => volatilityData[d])
      .filter((v) => v !== undefined);
    const liqs = days
      .map((d) => liquidityData[d])
      .filter((v) => v !== undefined);
    const perfs = days
      .map((d) => performanceData[d])
      .filter((v) => v !== undefined);

    const avg = (arr) =>
      arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : undefined;

    return {
      avgVolatility: avg(vols),
      avgLiquidity: avg(liqs),
      avgPerformance: avg(perfs),
    };
  };
  const getVolatilityColor = (date) => {
    let start = date.clone();
    let end = date.clone();

    if (viewMode === "weekly") end = start.clone().add(6, "day");
    if (viewMode === "monthly") end = start.clone().endOf("month");

    const { avgVolatility: vol } = aggregateMetrics(start, end);
    if (vol === undefined) return "";
    if (vol < 0.3) return "bg-success";
    if (vol < 0.6) return "bg-warning";
    return "bg-danger";
  };

  const getLiquidityStyle = (date) => {
    let start = date.clone();
    let end = date.clone();
    if (viewMode === "weekly") end = start.clone().add(6, "day");
    if (viewMode === "monthly") end = start.clone().endOf("month");

    const { avgLiquidity: liquidity } = aggregateMetrics(start, end);
    if (liquidity === undefined) return {};
    if (liquidity < 0.4) return { border: "2px solid #007bff" };
    if (liquidity < 0.7) return { border: "2px dashed #fd7e14" };
    return { border: "3px solid #000" };
  };

  const getPerformanceStyle = (date) => {
    let start = date.clone();
    let end = date.clone();
    if (viewMode === "weekly") end = start.clone().add(6, "day");
    if (viewMode === "monthly") end = start.clone().endOf("month");

    const { avgPerformance: perf } = aggregateMetrics(start, end);
    if (perf === undefined) return {};
    const alpha = Math.min(Math.abs(perf) * 2, 0.6);
    const color =
      perf >= 0 ? `rgba(0, 128, 0, ${alpha})` : `rgba(255, 0, 0, ${alpha})`;

    return { backgroundColor: color };
  };

  const calendar = generateCalendar();

  const goToDashboard = (date) => {
    let selected = date;
    if (viewMode === "weekly") selected = date.clone().startOf("week");
    if (viewMode === "monthly") selected = date.clone().startOf("month");
    navigate(`/dashboard/${selected.format("YYYY-MM-DD")}`);
  };

  return (
    <div>
      <div className="mb-3 d-flex justify-content-end">
        <Button variant="outline-secondary" onClick={toggleTheme}>
          {theme === "light" ? (
            <>
              <Moon size={16} className="me-1" /> Dark Mode
            </>
          ) : (
            <>
              <Sun size={16} className="me-1" /> Light Mode
            </>
          )}
        </Button>
      </div>
      <div className="btn-group mb-3">
        {["daily", "weekly", "monthly"].map((mode) => (
          <Button
            key={mode}
            variant={viewMode === mode ? "primary" : "outline-primary"}
            onClick={() => setViewMode(mode)}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </Button>
        ))}
      </div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          className="btn btn-outline-primary"
          onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
        >
          Prev
        </button>
        <h4>{currentMonth.format("MMMM YYYY")}</h4>
        <button
          className="btn btn-outline-primary"
          onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}
        >
          Next
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered text-center calendar-table">
          <thead className="table-light">
            <tr>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <th key={d}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {calendar.map((week, wi) => (
              <tr key={wi}>
                {week.map((day, di) => {
                  const isToday = day.isSame(dayjs(), "day");
                  const isCurrentMonth = day.month() === currentMonth.month();
                  const dateKey = day.format("YYYY-MM-DD");

                  const tooltip = `📊 Volatility: ${
                    volatilityData[dateKey] ?? "N/A"
                  }
                  💧 Liquidity: ${liquidityData[dateKey] ?? "N/A"}
                  📈 Performance: ${
                    performanceData[dateKey] !== undefined
                      ? (performanceData[dateKey] * 100).toFixed(2) + "%"
                      : "N/A"
                  }`;

                  return (
                    <motion.td
                      key={di}
                      title={tooltip}
                      className={`p-2 ${isCurrentMonth ? "" : "text-muted"} ${
                        isToday ? "border border-dark" : ""
                      } ${getVolatilityColor(day)} calendar-cell`}
                      onClick={() => goToDashboard(day)}
                      style={{
                        cursor: "pointer",
                        ...getLiquidityStyle(day),
                        ...getPerformanceStyle(day),
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {day.date()}
                    </motion.td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CalendarView;
