import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Sale from "./pages/Sale";
import Refill from "./pages/Refill";
import Requests from "./pages/Requests";
import History from "./pages/History";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/refill" element={<Refill />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;
