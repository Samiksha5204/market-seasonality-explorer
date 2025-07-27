import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CalenderView from "./Component/Calendar/CalendarView";
import DashboardPanel from "./Component/Dashboard/DashboardPanel";
import "bootstrap/dist/css/bootstrap.min.css";
import "../src/App.css"

function App() {
  return (
    <Router>
      <div className="container mt-4">
        <div className="hero-heading mb-5 text-center">
          <h1 className="display-5 fw-bold">
            📊 Digital Asset Seasonality Explorer
          </h1>
          <p className="lead text-muted">
            Visualize crypto volatility, liquidity, and performance trends—day
            by day.
          </p>
        </div>
        <Routes>
          <Route path="/" element={<CalenderView />} />
          <Route path="/dashboard/:date" element={<DashboardPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
