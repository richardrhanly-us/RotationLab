import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { LineupsResponse } from "../types/lineup";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function LeaderboardPage() {
  const navigate = useNavigate();

  const [data, setData] = useState<LineupsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [minimumMinutes, setMinimumMinutes] = useState(20);
  const [minimumGames, setMinimumGames] = useState(3);
  const [sortBy, setSortBy] = useState("NET_RATING");
  const [topN, setTopN] = useState(10);
  const [includePlayer, setIncludePlayer] = useState("");
  const [excludePlayer, setExcludePlayer] = useState("");

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

  const players = useMemo(() => {
    if (!data) {
      return [];
    }

    const names = new Set<string>();

    data.lineups.forEach((lineup) => {
      lineup.GROUP_NAME.split(" - ").forEach((player) => {
        names.add(player.trim());
      });
    });

    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [data]);

  const leaderboard = useMemo(() => {
    if (!data) {
      return [];
    }

    const filtered = data.lineups.filter((lineup) => {
      const lineupPlayers = lineup.GROUP_NAME.split(" - ").map(
        (player) => player.trim(),
      );

      const meetsMinutes = lineup.MIN >= minimumMinutes;
      const meetsGames = lineup.GP >= minimumGames;

      const includesPlayer =
        includePlayer === "" ||
        lineupPlayers.includes(includePlayer);

      const excludesPlayer =
        excludePlayer === "" ||
        !lineupPlayers.includes(excludePlayer);

      return (
        meetsMinutes &&
        meetsGames &&
        includesPlayer &&
        excludesPlayer
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "OFF_RATING":
          return b.OFF_RATING - a.OFF_RATING;

        case "DEF_RATING":
          return a.DEF_RATING - b.DEF_RATING;

        case "MIN":
          return b.MIN - a.MIN;

        case "W_PCT":
          return b.W_PCT - a.W_PCT;

        case "TS_PCT":
          return b.TS_PCT - a.TS_PCT;

        case "NET_RATING":
        default:
          return b.NET_RATING - a.NET_RATING;
      }
    });

    return sorted.slice(0, topN);
  }, [
    data,
    minimumMinutes,
    minimumGames,
    sortBy,
    topN,
    includePlayer,
    excludePlayer,
  ]);

  if (loading) {
    return (
      <main className="app-shell">
        Loading leaderboard...
      </main>
    );
  }

  if (!data) {
    return (
      <main className="app-shell">
        Could not load lineup data.
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Lineup Rankings</p>
          <h1>Five-Man Unit Leaderboard</h1>
          <p className="subtitle">
            Rank observed Oklahoma City lineups by efficiency,
            minutes, shooting, and win rate.
          </p>
        </div>

        <div className="team-context">
          <strong>{data.team}</strong>
          <span>{data.season} Season</span>
        </div>
      </section>

      <section className="panel leaderboard-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Lineup Rankings</p>
            <h2>Leaderboard</h2>
          </div>

          <span className="sample-count">
            {leaderboard.length} lineups shown
          </span>
        </div>

        <div className="leaderboard-controls">
          <label>
            <span>Minimum Minutes</span>

            <input
              type="number"
              min="0"
              step="5"
              value={minimumMinutes}
              onChange={(event) =>
                setMinimumMinutes(Number(event.target.value))
              }
            />
          </label>

          <label>
            <span>Minimum Games</span>

            <input
              type="number"
              min="0"
              step="1"
              value={minimumGames}
              onChange={(event) =>
                setMinimumGames(Number(event.target.value))
              }
            />
          </label>

          <label>
            <span>Sort By</span>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="NET_RATING">Net Rating</option>
              <option value="OFF_RATING">
                Offensive Rating
              </option>
              <option value="DEF_RATING">
                Defensive Rating
              </option>
              <option value="MIN">Minutes</option>
              <option value="W_PCT">Win %</option>
              <option value="TS_PCT">
                True Shooting %
              </option>
            </select>
          </label>

          <label>
            <span>Show</span>

            <select
              value={topN}
              onChange={(event) =>
                setTopN(Number(event.target.value))
              }
            >
              <option value={5}>Top 5</option>
              <option value={10}>Top 10</option>
              <option value={20}>Top 20</option>
            </select>
          </label>

          <label>
            <span>Include Player</span>

            <select
              value={includePlayer}
              onChange={(event) =>
                setIncludePlayer(event.target.value)
              }
            >
              <option value="">Any player</option>

              {players.map((player) => (
                <option key={player} value={player}>
                  {player}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Exclude Player</span>

            <select
              value={excludePlayer}
              onChange={(event) =>
                setExcludePlayer(event.target.value)
              }
            >
              <option value="">No exclusion</option>

              {players.map((player) => (
                <option key={player} value={player}>
                  {player}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="leaderboard-table">
          <div className="leaderboard-row leaderboard-header">
            <span>Rank</span>
            <span>Lineup</span>
            <span>MIN</span>
            <span>GP</span>
            <span>ORTG</span>
            <span>DRTG</span>
            <span>NET</span>
            <span>TS%</span>
            <span>Actions</span>
          </div>

          {leaderboard.map((lineup, index) => (
            <div
              className="leaderboard-row"
              key={lineup.GROUP_ID}
            >
              <span className="leaderboard-rank">
                {index + 1}
              </span>

              <span className="leaderboard-name">
                {lineup.GROUP_NAME}
              </span>

              <span>{lineup.MIN.toFixed(1)}</span>
              <span>{lineup.GP}</span>
              <span>{lineup.OFF_RATING.toFixed(1)}</span>
              <span>{lineup.DEF_RATING.toFixed(1)}</span>

              <span
                className={
                  lineup.NET_RATING > 0
                    ? "positive-rating"
                    : lineup.NET_RATING < 0
                      ? "negative-rating"
                      : ""
                }
              >
                {lineup.NET_RATING > 0 ? "+" : ""}
                {lineup.NET_RATING.toFixed(1)}
              </span>

              <span>
                {(lineup.TS_PCT * 100).toFixed(1)}%
              </span>

              <div className="leaderboard-actions">
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/compare?lineupA=${encodeURIComponent(
                        lineup.GROUP_ID,
                      )}`,
                    )
                  }
                >
                  Compare as A
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/compare?lineupB=${encodeURIComponent(
                        lineup.GROUP_ID,
                      )}`,
                    )
                  }
                >
                  Compare as B
                </button>
              </div>
            </div>
          ))}

          {leaderboard.length === 0 && (
            <div className="leaderboard-empty">
              No lineups meet the selected thresholds.
            </div>
          )}
        </div>

        <p className="leaderboard-note">
          Minimum-minute and minimum-game filters help reduce the
          influence of extremely small lineup samples.
        </p>
      </section>
    </main>
  );
}

export default LeaderboardPage;