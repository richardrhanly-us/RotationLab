import { useEffect, useState } from "react";
import "./App.css";

import { Routes, Route } from "react-router-dom";
import AppNav from "./components/AppNav";
import ComparePage from "./pages/ComparePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ReplacementPage from "./pages/ReplacementPage";
import FourPlayerCorePage from "./pages/FourPlayerCorePage";
import type { LineupsResponse } from "./types/lineup";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function OverviewPage() {
  const [data, setData] = useState<LineupsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/lineups?limit=250`)
      .then((response) => response.json())
      .then((result: LineupsResponse) => {
        setData(result);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <main className="app-shell">Loading RotationLab...</main>;
  }

  if (!data) {
    return <main className="app-shell">Could not load lineup data.</main>;
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Basketball Operations Analytics</p>
          <h1>RotationLab</h1>
          <p className="subtitle">
            Five-man lineup analysis and rotation decision support
          </p>
        </div>

        <div className="team-context">
          <strong>{data.team}</strong>
          <span>{data.season} Season</span>
        </div>
      </section>
    </main>
  );
}

function App() {
  return (
    <>
      <AppNav />

      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/replacements" element={<ReplacementPage />} />
        <Route path="/core" element={<FourPlayerCorePage />} />
      </Routes>
    </>
  );
}

export default App;
