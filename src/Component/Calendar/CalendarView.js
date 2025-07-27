import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "./CalendarView.css";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { Button } from "react-bootstrap";

// Sample data for visual indicators
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
const CalendarView = () => {
  const [viewMode, setViewMode] = useState("daily"); // Calendar view mode: daily, weekly, or monthly
  const { theme, toggleTheme } = useTheme(); // Custom theme context for light/dark mode
  const navigate = useNavigate(); // React Router navigation
  const [currentMonth, setCurrentMonth] = useState(dayjs()); // Current month state

  // Calculate the range of the calendar grid (starts from Sunday before 1st, ends on Saturday after last day)
  const startDay = currentMonth.startOf("month").startOf("week");
  const endDay = currentMonth.endOf("month").endOf("week");
  // Generate the calendar layout based on selected view mode
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
        calendar.push([date.clone()]); // One entry per week
        date = date.add(1, "week");
      }

      return calendar;
    }

    if (viewMode === "monthly") {
      return [[currentMonth.startOf("month")]];
    }
  };

  // Aggregates volatility, liquidity, and performance data over a given date range
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

  // Returns background class based on average volatility
  const getVolatilityColor = (date) => {
    let start = date.clone();
    let end =
      viewMode === "weekly"
        ? start.clone().add(6, "day")
        : viewMode === "monthly"
        ? start.clone().endOf("month")
        : start;

    const { avgVolatility: vol } = aggregateMetrics(start, end);
    if (vol === undefined) return "";
    if (vol < 0.3) return "bg-success";
    if (vol < 0.6) return "bg-warning";
    return "bg-danger";
  };

  // Returns border styles based on average liquidity
  const getLiquidityStyle = (date) => {
    let start = date.clone();
    let end =
      viewMode === "weekly"
        ? start.clone().add(6, "day")
        : viewMode === "monthly"
        ? start.clone().endOf("month")
        : start;

    const { avgLiquidity: liquidity } = aggregateMetrics(start, end);
    if (liquidity === undefined) return {};
    if (liquidity < 0.4) return { border: "2px solid #007bff" }; // Blue solid
    if (liquidity < 0.7) return { border: "2px dashed #fd7e14" }; // Orange dashed
    return { border: "3px solid #000" }; // Black thick
  };

  // Returns background overlay style based on average performance
  const getPerformanceStyle = (date) => {
    let start = date.clone();
    let end =
      viewMode === "weekly"
        ? start.clone().add(6, "day")
        : viewMode === "monthly"
        ? start.clone().endOf("month")
        : start;

    const { avgPerformance: perf } = aggregateMetrics(start, end);
    if (perf === undefined) return {};
    const alpha = Math.min(Math.abs(perf) * 2, 0.6); // Cap transparency
    const color =
      perf >= 0 ? `rgba(0, 128, 0, ${alpha})` : `rgba(255, 0, 0, ${alpha})`;

    return { backgroundColor: color };
  };

  const calendar = generateCalendar(); // Build calendar matrix for rendering

  // Redirect to dashboard with selected date
  const goToDashboard = (date) => {
    let selected = date;
    if (viewMode === "weekly") selected = date.clone().startOf("week");
    if (viewMode === "monthly") selected = date.clone().startOf("month");
    navigate(`/dashboard/${selected.format("YYYY-MM-DD")}`);
  };

  return (
    <div>
      {/* Theme toggle button */}
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

      {/* View mode buttons */}
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

      {/* Month navigation */}
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

      {/* Calendar Table */}
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

                  // Tooltip showing metrics for each day
                  const tooltip = `Volatility: ${
                    volatilityData[dateKey] ?? "N/A"
                  }
Liquidity: ${liquidityData[dateKey] ?? "N/A"}
Performance: ${
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
