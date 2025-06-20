# ⛽ Petrol Station Management App

A full-stack fuel station management system built with **FastAPI** (backend) and **React** (frontend). It handles fuel sales, refills, income tracking, and provides detailed history and request statistics — all saved in a persistent JSON file.

---

## 📦 Features

- 🔥 Real-time fuel sales and refills
- 📊 Sales, refill, and income history tracking
- 🧾 Unique request IDs and timestamps
- 📁 JSON-based data storage
- 💻 Clean and responsive React UI
- 🌐 CORS-enabled FastAPI backend for frontend integration

---

## 🛠️ Tech Stack

- **Frontend**: React + Vite
- **Backend**: FastAPI
- **Styling**: Inline CSS (customized)
- **Storage**: JSON file (`data.json`)

---

## 🚀 Getting Started

### 1. Clone the Repo


git clone https://github.com/fylexcon/petrolstationproject.git
cd petrolstationproject


Backend Setup (FastAPI)

cd backend
pip install fastapi uvicorn
uvicorn main:app --reload

FastAPI will run at: http://localhost:8000


3. Frontend Setup (React)

cd fuel-station-frontend
npm install
npm run dev
React app will run at: http://localhost:5173

📬 API Endpoints


| Method | Endpoint        | Description                 |
| ------ | --------------- | --------------------------- |
| POST   | `/sales`        | Submit a fuel sale          |
| POST   | `/refill`       | Submit a fuel refill        |
| GET    | `/sales`        | List all sales              |
| GET    | `/refills`      | List all refills            |
| GET    | `/fuels`        | Get current fuel stock      |
| GET    | `/income`       | Total income from all sales |
| GET    | `/full_history` | Timeline of all activity    |
