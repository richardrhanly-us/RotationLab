import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";

import "./App.css";

import AppNav from "./components/AppNav";
import ComparePage from "./pages/ComparePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ReplacementPage from "./pages/ReplacementPage";
import FourPlayerCorePage from "./pages/FourPlayerCorePage";
import TeamBadge from "./components/TeamBadge";

import type { LineupsResponse } from "./types/lineup";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function OverviewPage() {
  const [data, setData] = useState<LineupsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/lineups?limit=250`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Lineup request failed with status ${response.status}`,
          );
        }

        return response.json();
      })
      .then((result: LineupsResponse) => {
        setData(result);
      })
      .catch((error) => {
        console.error("Could not load lineup data:", error);
        setData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <main className="app-shell">Loading RotationLab...</main>;
  }

  if (!data) {
    return <main className="app-shell">Could not load lineup data.</main>;
  }

  return (
    <main className="app-shell overview-page">
      <section className="hero overview-hero">
        <div className="overview-hero-copy">
          <p className="eyebrow">Basketball Operations Analytics</p>

          <h1>RotationLab</h1>

          <p className="subtitle">
            Analyze Oklahoma City Thunder five-man lineups and rotation
            combinations.
          </p>
        </div>

        <TeamBadge team={data.team} season={data.season} />
      </section>

      <section className="overview-summary">
        <div>
          <span className="overview-summary-value">{data.lineups.length}</span>

          <span className="overview-summary-label">
            observed five-man lineups
          </span>
        </div>

        <p>
          Compare units, rank lineup performance, evaluate substitutions, or
          build around a four-player core.
        </p>
      </section>

      <section className="overview-workspace">
        <div className="overview-section-heading">
          <p className="eyebrow">Analysis Tools</p>
          <h2>Choose a workspace</h2>
        </div>

        <div className="overview-tools">
          <Link className="overview-tool-card" to="/compare">
            <div>
              <span className="overview-tool-icon">↔</span>
              <h3>Compare Lineups</h3>
              <p>
                Compare two five-man units across efficiency and advanced
                metrics.
              </p>
            </div>

            <span className="overview-tool-link">Open comparison →</span>
          </Link>

          <Link className="overview-tool-card" to="/leaderboard">
            <div>
              <span className="overview-tool-icon">↑</span>
              <h3>Leaderboard</h3>
              <p>Rank and filter observed units by lineup performance.</p>
            </div>

            <span className="overview-tool-link">View leaderboard →</span>
          </Link>

          <Link className="overview-tool-card" to="/replacements">
            <div>
              <span className="overview-tool-icon">⇄</span>
              <h3>Player Replacements</h3>
              <p>Explore observed alternatives after removing one player.</p>
            </div>

            <span className="overview-tool-link">Analyze replacements →</span>
          </Link>

          <Link className="overview-tool-card" to="/core">
            <div>
              <span className="overview-tool-icon">4+</span>
              <h3>Four-Player Core</h3>
              <p>Find the best observed fifth-player options around a core.</p>
            </div>

            <span className="overview-tool-link">Analyze a core →</span>
          </Link>
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
