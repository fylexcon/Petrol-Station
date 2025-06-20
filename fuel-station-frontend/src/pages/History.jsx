import React, { useEffect, useState } from "react";

const History = () => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("http://localhost:8000/full_history");
        if (!res.ok) throw new Error("Failed to fetch history");
        const data = await res.json();
        setTimeline(data.timeline || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  if (loading) return <p>Loading history...</p>;
  if (error) return <p style={{color: "red"}}>{error}</p>;

  return (
    <div style={{ maxWidth: "700px", margin: "auto", padding: "2rem" }}>
      <h2>Fuel Sales and Refills History</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {timeline.map((item, idx) => (
          <li key={idx} style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: item.type === "sale" ? "#e0f7fa" : "#fff9c4", borderRadius: "8px" }}>
            <strong>{item.type === "sale" ? "Sale" : "Refill"}</strong> —  
            {item.type === "sale" ? (
              <>
                Fuel: {item.name}, Amount: {item.amount}, Income: ${item.income.toFixed(2)}, Time: {new Date(item.timestamp).toLocaleString()}
              </>
            ) : (
              <>
                Fuel: {item.fuel}, Amount: {item.amount}, Time: {new Date(item.timestamp).toLocaleString()}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;
