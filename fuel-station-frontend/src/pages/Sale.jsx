import React, { useState } from "react";

const Sale = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [pricePerLiter, setPricePerLiter] = useState("");
  const [message, setMessage] = useState("");

  const handleSaleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Processing...");

    const amountNum = Number(amount);
    const priceNum = Number(pricePerLiter);
    const income = amountNum * priceNum;

    try {
      const response = await fetch("http://localhost:8000/sale", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          amount: amountNum,
          income,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(`✅ Sale recorded with request ID: ${result.request_id}`);
        setName("");
        setAmount("");
        setPricePerLiter("");
      } else {
        setMessage("❌ Failed to record sale.");
      }
    } catch (error) {
      console.error("Sale error:", error);
      setMessage("❌ Error connecting to server.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "2rem 3rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2>Record a Fuel Sale</h2>
        <form onSubmit={handleSaleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="text"
            placeholder="Customer Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
          />
          <input
            type="number"
            placeholder="Amount (liters)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
          />
          <input
            type="number"
            placeholder="Price per Liter"
            value={pricePerLiter}
            onChange={(e) => setPricePerLiter(e.target.value)}
            required
            style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
          />
          <button
            type="submit"
            style={{
              padding: "0.5rem",
              backgroundColor: "#4caf50",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Submit
          </button>
        </form>
        {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
      </div>
    </div>
  );
};

export default Sale;
