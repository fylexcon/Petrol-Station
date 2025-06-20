import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [totals, setTotals] = useState({
    sales: 0,
    refills: 0,
    requests: 0,
  });

  useEffect(() => {
    async function fetchTotals() {
      try {
        const [salesRes, refillsRes, requestsRes] = await Promise.all([
          fetch("http://localhost:8000/sales/total"),
          fetch("http://localhost:8000/refills/total"),
          fetch("http://localhost:8000/requests/total"),
        ]);     
        const salesData = await salesRes.json();
        const refillsData = await refillsRes.json();
        const requestsData = await requestsRes.json();

        setTotals({
          sales: salesData.total || 0,
          refills: refillsData.total || 0,
          requests: requestsData.total || 0,
        });
      } catch (error) {
        console.error("Error fetching totals:", error);
      }
    }

    fetchTotals();
  }, []);

  const navStyle = {
    padding: "1rem",
    backgroundColor: "#333",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
  };

  const linkStyle = {
    margin: "0.5rem 1rem",
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
    position: "relative",
  };

  const badgeStyle = {
    position: "absolute",
    top: "-8px",
    right: "-10px",
    backgroundColor: "#4CAF50",
    borderRadius: "50%",
    color: "#fff",
    padding: "2px 6px",
    fontSize: "0.7rem",
  };

  const renderBadge = (count) => count > 0 ? <span style={badgeStyle}>{count}</span> : null;

  return (
    <nav style={navStyle}>
      <Link to="/" style={linkStyle}>Home</Link>

      <Link to="/sale" style={linkStyle}>
        Sale
        {renderBadge(totals.sales)}
      </Link>

      <Link to="/refill" style={linkStyle}>
        Refill
        {renderBadge(totals.refills)}
      </Link>

      <Link to="/requests" style={linkStyle}>
        Requests
        {renderBadge(totals.requests)}
      </Link>

      <Link to="/history" style={linkStyle}>History</Link>
    </nav>
  );
};

export default Navbar;
