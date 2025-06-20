import React, { useState } from "react";

const Requests = () => {
  const [requestId, setRequestId] = useState("");
  const [saleData, setSaleData] = useState(null);
  const [refillData, setRefillData] = useState(null);
  const [message, setMessage] = useState("");

  const fetchRequest = async () => {
    if (!requestId) return;

    setMessage("Loading...");
    setSaleData(null);
    setRefillData(null);

    try {
      const saleRes = await fetch(`http://localhost:8000/sales/request/${requestId}`);
      const saleJson = await saleRes.json();

      const refillRes = await fetch(`http://localhost:8000/refills/request/${requestId}`);
      const refillJson = await refillRes.json();

      setSaleData(saleJson.sales || null);
      setRefillData(refillJson.refills || null);

      if ((!saleJson.sales || saleJson.sales.length === 0) && (!refillJson.refills || refillJson.refills.length === 0)) {
        setMessage(`No data found for request ID ${requestId}`);
      } else {
        setMessage("");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error fetching request data");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h2>Request Lookup</h2>
      <input
        type="number"
        placeholder="Enter Request ID"
        value={requestId}
        onChange={(e) => setRequestId(e.target.value)}
        style={{ padding: "0.5rem", width: "100%", marginBottom: "1rem" }}
      />
      <button onClick={fetchRequest} style={{ padding: "0.5rem 1rem" }}>Fetch Request</button>

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}

      {saleData && saleData.length > 0 && (
        <>
          <h3>Sale Request Details</h3>
          <ul>
            {saleData.map((item) => (
              <li key={item.request_id}>
                Fuel: {item.name}, Amount: {item.amount}, Income: ${item.income.toFixed(2)}, Time: {new Date(item.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        </>
      )}

      {refillData && refillData.length > 0 && (
        <>
          <h3>Refill Request Details</h3>
          <ul>
            {refillData.map((item, idx) => (
              <li key={idx}>
                Fuel: {item.fuel}, Amount: {item.amount}, Time: {new Date(item.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Requests;
