import React, { useEffect, useState } from "react";

const Home = () => {
  const [data, setData] = useState({
    sales: 0,
    refills: 0,
    requests: 0,
    income: 0,
    requestsMessage: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [salesRes, refillsRes, requestsRes, incomeRes] = await Promise.all([
          fetch("http://localhost:8000/sales/total"),
          fetch("http://localhost:8000/refills/total"),
          fetch("http://localhost:8000/requests/total"),
          fetch("http://localhost:8000/income/total"),
        ]);
        

        const [salesData, refillsData, requestsData, incomeData] = await Promise.all([
          salesRes.json(),
          refillsRes.json(),
          requestsRes.json(),
          incomeRes.json(),
        ]);

        // Extract correct values according to your current backend
        setData({
          sales: salesData.total || 0,
          refills: refillsData.total_refills || 0,
          requests: Array.isArray(requestsData.total) ? requestsData.total[0] : 0,
          requestsMessage: Array.isArray(requestsData.total) ? requestsData.total[1] : "",
          income: incomeData.total || 0,
        });
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div style={{ padding: "2rem", color: "#333" }}>
      <h1>Home Page Dashboard</h1>
      <ul style={{ listStyle: "none", padding: 0, fontSize: "1.2rem" }}>
        <li><strong>Total Sales:</strong> {data.sales}</li>
        <li><strong>Total Refills:</strong> {data.refills}</li>
        <li><strong>Total Requests:</strong> {data.requests}</li>
        <li><strong>Total Income:</strong> ${Number(data.income).toFixed(2)}</li>
        {data.requestsMessage && <li><em>{data.requestsMessage}</em></li>}
      </ul>
    </div>
  );
};

export default Home;
