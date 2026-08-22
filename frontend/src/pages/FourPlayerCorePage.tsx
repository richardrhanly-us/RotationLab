import { useEffect, useMemo, useState } from "react";

import type { Lineup, LineupsResponse } from "../types/lineup";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type FourPlayerCoreOption = {
  fifth_player: string;
  lineup: Lineup;
};

type FourPlayerCoreResponse = {
  team: string;
  season: string;
  core_players: string[];
  count: number;
  lineups: FourPlayerCoreOption[];
};

function FourPlayerCorePage() {
  const [data, setData] = useState<LineupsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [corePlayers, setCorePlayers] = useState([
    "",
    "",
    "",
    "",
  ]);

  const [coreData, setCoreData] =
    useState<FourPlayerCoreResponse | null>(null);

  const [coreLoading, setCoreLoading] = useState(false);
  const [coreError, setCoreError] = useState("");

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

    return Array.from(names).sort((a, b) =>
      a.localeCompare(b),
    );
  }, [data]);

  const analyzeFourPlayerCore = () => {
    const selectedPlayers = corePlayers.filter(
      (player) => player !== "",
    );

    if (selectedPlayers.length !== 4) {
      setCoreError(
        "Choose four players before running the analysis.",
      );
      setCoreData(null);
      return;
    }

    if (new Set(selectedPlayers).size !== 4) {
      setCoreError("Choose four different players.");
      setCoreData(null);
      return;
    }

    const params = new URLSearchParams({
      player_1: corePlayers[0],
      player_2: corePlayers[1],
      player_3: corePlayers[2],
      player_4: corePlayers[3],
    });

    setCoreLoading(true);
    setCoreError("");

    fetch(
      `${API_BASE_URL}/api/lineups/four-player-core?${params.toString()}`,
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Four-player core request failed with status ${response.status}`,
          );
        }

        return response.json();
      })
      .then((result: FourPlayerCoreResponse) => {
        setCoreData(result);
      })
      .catch((error) => {
        console.error(
          "Could not load four-player core analysis:",
          error,
        );

        setCoreData(null);
        setCoreError(
          "Could not load four-player core analysis.",
        );
      })
      .finally(() => {
        setCoreLoading(false);
      });
  };

  if (loading) {
    return (
      <main className="app-shell">
        Loading four-player core analysis...
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
          <p className="eyebrow">Rotation Analysis</p>
          <h1>Four-Player Core Analysis</h1>

          <p className="subtitle">
            Select four players and evaluate every observed
            fifth-player combination built around that core.
          </p>
        </div>

        <div className="team-context">
          <strong>{data.team}</strong>
          <span>{data.season} Season</span>
        </div>
      </section>

      <section className="panel replacement-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Rotation Analysis</p>
            <h2>Find the Fifth Player</h2>
          </div>

          {coreData && (
            <span className="sample-count">
              {coreData.count} fifth-player options
            </span>
          )}
        </div>

        <p className="replacement-intro">
          Select four players to find every observed five-man
          lineup containing that core. Fifth-player options are
          ranked by observed Net Rating.
        </p>

        <div className="replacement-controls">
          {corePlayers.map((selectedPlayer, index) => (
            <label key={index}>
              <span>Player {index + 1}</span>

              <select
                value={selectedPlayer}
                onChange={(event) => {
                  const nextPlayers = [...corePlayers];

                  nextPlayers[index] =
                    event.target.value;

                  setCorePlayers(nextPlayers);
                  setCoreData(null);
                  setCoreError("");
                }}
              >
                <option value="">
                  Choose player...
                </option>

                {players.map((player) => (
                  <option
                    key={player}
                    value={player}
                    disabled={
                      corePlayers.includes(player) &&
                      selectedPlayer !== player
                    }
                  >
                    {player}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>

        <button
          type="button"
          className="core-analyze-button"
          onClick={analyzeFourPlayerCore}
          disabled={coreLoading}
        >
          {coreLoading ? "Analyzing..." : "Analyze Core"}
        </button>

        {coreError && (
          <div className="replacement-empty">
            {coreError}
          </div>
        )}

        {coreData && !coreLoading && (
          <div className="replacement-discovery">
            <div className="replacement-discovery-header">
              <div>
                <p className="eyebrow">
                  Observed Fifth Players
                </p>

                <h3>
                  Best Observed Five-Man Combinations
                </h3>
              </div>

              <span className="sample-count">
                {coreData.count} options found
              </span>
            </div>

            {coreData.lineups.length > 0 ? (
              <div className="replacement-options">
                {coreData.lineups.map(
                  ({ fifth_player, lineup }, index) => {
                    const reliability =
                      getReliability(lineup.MIN);

                    return (
                      <div
                        className="replacement-option core-result-row"
                        key={`${lineup.GROUP_ID}-${fifth_player}`}
                      >
                        <div className="replacement-option-rank">
                          #{index + 1}
                        </div>

                        <div className="replacement-option-player">
                          <strong>
                            {fifth_player}
                          </strong>

                          <span>
                            {lineup.MIN.toFixed(1)} MIN
                            {" • "}
                            {reliability.label} reliability
                          </span>
                        </div>

                        <div className="replacement-option-metric">
                          <span>ORTG</span>
                          <strong>
                            {lineup.OFF_RATING.toFixed(1)}
                          </strong>
                        </div>

                        <div className="replacement-option-metric">
                          <span>DRTG</span>
                          <strong>
                            {lineup.DEF_RATING.toFixed(1)}
                          </strong>
                        </div>

                        <div className="replacement-option-metric">
                          <span>NET</span>

                          <strong
                            className={
                              lineup.NET_RATING > 0
                                ? "positive-rating"
                                : lineup.NET_RATING < 0
                                  ? "negative-rating"
                                  : ""
                            }
                          >
                            {lineup.NET_RATING > 0
                              ? "+"
                              : ""}
                            {lineup.NET_RATING.toFixed(1)}
                          </strong>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            ) : (
              <div className="replacement-empty">
                No observed five-man lineups were found for
                this four-player core.
              </div>
            )}

            <p className="replacement-note">
              Results are ranked by observed Net Rating.
              Minutes and sample reliability should be
              considered when comparing fifth-player
              options.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

function getReliability(minutes: number) {
  if (minutes >= 100) {
    return {
      label: "High",
      className: "reliability-high",
      note: "Large sample",
    };
  }

  if (minutes >= 40) {
    return {
      label: "Medium",
      className: "reliability-medium",
      note: "Moderate sample",
    };
  }

  return {
    label: "Low",
    className: "reliability-low",
    note: "Small sample",
  };
}

export default FourPlayerCorePage;