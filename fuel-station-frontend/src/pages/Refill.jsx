import React, { useState } from "react";

const Refill = () => {
  const [refills, setRefills] = useState([{ name: "", amount: "" }]);
  const [message, setMessage] = useState("");

  const handleChange = (index, field, value) => {
    const updated = [...refills];
    updated[index][field] = value;
    setRefills(updated);
  };

  const addRefill = () => {
    setRefills([...refills, { name: "", amount: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Sending refill...");

    const payload = refills
      .filter(r => r.name && r.amount)
      .map(r => ({ name: r.name.toLowerCase(), amount: Number(r.amount) }));

    try {
      const res = await fetch("http://localhost:8000/refill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        setMessage(`✅ Refill completed for request ID: ${result.updated?.[0]?.request_id || "N/A"}`);
        setRefills([{ name: "", amount: "" }]);
      } else {
        setMessage("❌ Refill failed.");
      }
    } catch (err) {
      console.error("Refill error:", err);
      setMessage("❌ Server error during refill.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f0f0f0" }}>
      <div style={{ background: "#fff", padding: "2rem", borderRadius: "12px", boxShadow: "0 0 12px rgba(0,0,0,0.1)", maxWidth: "450px", width: "100%" }}>
        <h2 style={{ textAlign: "center" }}>Refill Fuels</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {refills.map((r, idx) => (
            <div key={idx} style={{ display: "flex", gap: "1rem" }}>
              <input
                type="text"
                placeholder="Fuel type (e.g. diesel)"
                value={r.name}
                onChange={(e) => handleChange(idx, "name", e.target.value)}
                required
                style={{ flex: 1, padding: "0.5rem", border: "1px solid #ccc", borderRadius: "6px" }}
              />
              <input
                type="number"
                placeholder="Amount"
                value={r.amount}
                onChange={(e) => handleChange(idx, "amount", e.target.value)}
                required
                style={{ width: "100px", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "6px" }}
              />
            </div>
          ))}
          <button type="button" onClick={addRefill} style={{ padding: "0.5rem", backgroundColor: "#bbb", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            + Add More
          </button>
          <button type="submit" style={{ padding: "0.5rem", backgroundColor: "#2196f3", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            Submit Refill
          </button>
        </form>
        {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
      </div>
    </div>
  );
};

export default Refill;
