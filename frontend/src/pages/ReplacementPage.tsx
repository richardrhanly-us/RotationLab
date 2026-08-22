import { useEffect, useMemo, useState } from "react";

import LineupPicker from "../components/LineupPicker";
import TeamBadge from "../components/TeamBadge";

import PlayerAvatar from "../components/PlayerAvatar";
import { getLineupPlayers } from "../utils/lineupPlayers";

import type { Lineup, LineupsResponse } from "../types/lineup";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type ReplacementOption = {
  replacement_player: string;
  lineup: Lineup;
};

type ReplacementResponse = {
  team: string;
  season: string;
  base_lineup: {
    id: string;
    name: string;
    remove_player: string;
    remaining_players: string[];
  };
  count: number;
  replacements: ReplacementOption[];
};

function ReplacementPage() {
  const [data, setData] = useState<LineupsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [replacementBaseId, setReplacementBaseId] = useState("");
  const [removePlayer, setRemovePlayer] = useState("");
  const [replacementPlayer, setReplacementPlayer] = useState("");

  const [replacementData, setReplacementData] =
    useState<ReplacementResponse | null>(null);

  const [replacementLoading, setReplacementLoading] = useState(false);

  const [openLineupPicker, setOpenLineupPicker] = useState(false);

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

        if (result.lineups.length > 0) {
          setReplacementBaseId(result.lineups[0].GROUP_ID);
        }
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

  const replacementBase = useMemo(
    () => data?.lineups.find((lineup) => lineup.GROUP_ID === replacementBaseId),
    [data, replacementBaseId],
  );

  const replacementBasePlayers = useMemo(() => {
    if (!replacementBase) {
      return [];
    }

    return replacementBase.GROUP_NAME.split(" - ").map((player) =>
      player.trim(),
    );
  }, [replacementBase]);

  const replacementCandidates = useMemo(() => {
    return players.filter((player) => !replacementBasePlayers.includes(player));
  }, [players, replacementBasePlayers]);

  const replacementResult = useMemo(() => {
    if (!data || !replacementBase || !removePlayer || !replacementPlayer) {
      return null;
    }

    const targetPlayers = replacementBasePlayers
      .filter((player) => player !== removePlayer)
      .concat(replacementPlayer)
      .sort();

    return (
      data.lineups.find((lineup) => {
        const lineupPlayers = lineup.GROUP_NAME.split(" - ")
          .map((player) => player.trim())
          .sort();

        return (
          lineupPlayers.length === targetPlayers.length &&
          lineupPlayers.every(
            (player, index) => player === targetPlayers[index],
          )
        );
      }) ?? null
    );
  }, [
    data,
    replacementBase,
    replacementBasePlayers,
    removePlayer,
    replacementPlayer,
  ]);

  useEffect(() => {
    if (!replacementBaseId || !removePlayer) {
      return;
    }

    const params = new URLSearchParams({
      base_lineup_id: replacementBaseId,
      remove_player: removePlayer,
    });

    fetch(`${API_BASE_URL}/api/lineups/replacements?${params.toString()}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Replacement request failed with status ${response.status}`,
          );
        }

        return response.json();
      })
      .then((result: ReplacementResponse) => {
        setReplacementData(result);
      })
      .catch((error) => {
        console.error("Could not load replacement options:", error);
        setReplacementData(null);
      })
      .finally(() => {
        setReplacementLoading(false);
      });
  }, [replacementBaseId, removePlayer]);

  if (loading) {
    return <main className="app-shell">Loading replacement analysis...</main>;
  }

  if (!data) {
    return <main className="app-shell">Could not load lineup data.</main>;
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Rotation Analysis</p>

          <h1>Player Replacement Analysis</h1>

          <p className="subtitle">
            Compare observed lineup alternatives after replacing one player in a
            five-man unit.
          </p>
        </div>

        <TeamBadge team={data.team} season={data.season} compact />
      </section>

      <section className="panel replacement-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Rotation Analysis</p>
            <h2>Player Replacement Analysis</h2>
          </div>
        </div>

        <p className="replacement-intro">
          Replace one player in an observed five-man unit and compare it with
          the matching lineup, if that combination has appeared in the loaded
          NBA data.
        </p>

        <div className="replacement-controls">
          <LineupPicker
            label="Base Lineup"
            lineups={data.lineups}
            selectedId={replacementBaseId}
            onSelect={(lineupId) => {
              setReplacementBaseId(lineupId);
              setRemovePlayer("");
              setReplacementPlayer("");
              setReplacementData(null);
              setReplacementLoading(false);
              setOpenLineupPicker(false);
            }}
            isOpen={openLineupPicker}
            onToggle={() => setOpenLineupPicker((current) => !current)}
            onClose={() => setOpenLineupPicker(false)}
          />

          <label>
            <span>Remove Player</span>

            <select
              value={removePlayer}
              onChange={(event) => {
                const nextPlayer = event.target.value;

                setRemovePlayer(nextPlayer);
                setReplacementPlayer("");
                setReplacementData(null);
                setReplacementLoading(nextPlayer !== "");
              }}
            >
              <option value="">Choose player...</option>

              {replacementBasePlayers.map((player) => (
                <option key={player} value={player}>
                  {player}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Add Player</span>

            <select
              value={replacementPlayer}
              onChange={(event) => setReplacementPlayer(event.target.value)}
            >
              <option value="">Choose replacement...</option>

              {replacementCandidates.map((player) => (
                <option key={player} value={player}>
                  {player}
                </option>
              ))}
            </select>
          </label>
        </div>

        {replacementBase && removePlayer && (
          <div className="replacement-discovery">
            <div className="replacement-discovery-header">
              <div>
                <p className="eyebrow">Observed Alternatives</p>

                <h3>Replacement Options for {removePlayer}</h3>
              </div>

              <span className="sample-count">
                {replacementData?.count ?? 0} options found
              </span>
            </div>

            {replacementLoading ? (
              <div className="replacement-empty">
                Loading replacement options...
              </div>
            ) : replacementData && replacementData.replacements.length > 0 ? (
              <div className="replacement-options">
                {replacementData.replacements.map(
                  ({ lineup, replacement_player: candidatePlayer }, index) => {
                    const reliability = getReliability(lineup.MIN);

                    const replacementPlayerData = getLineupPlayers(lineup).find(
                      (player) => player.name === candidatePlayer,
                    );
                    return (
                      <div
                        className="replacement-option"
                        key={`${lineup.GROUP_ID}-${candidatePlayer}`}
                      >
                        <div className="replacement-option-rank">
                          #{index + 1}
                        </div>

                        <div className="replacement-player-result">
                        {replacementPlayerData && (
                            <PlayerAvatar
                            playerId={replacementPlayerData.id}
                            playerName={replacementPlayerData.name}
                            size="medium"
                            />
                        )}

                        <div className="replacement-option-player">
                            <strong>{candidatePlayer}</strong>

                            <span>
                            {lineup.MIN.toFixed(1)} MIN •{" "}
                            {reliability.label} reliability
                            </span>
                        </div>
                        </div>

                        <div className="replacement-option-metric">
                          <span>ORTG</span>
                          <strong>{lineup.OFF_RATING.toFixed(1)}</strong>
                        </div>

                        <div className="replacement-option-metric">
                          <span>DRTG</span>
                          <strong>{lineup.DEF_RATING.toFixed(1)}</strong>
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
                            {lineup.NET_RATING > 0 ? "+" : ""}
                            {lineup.NET_RATING.toFixed(1)}
                          </strong>
                        </div>

                        <button
                          type="button"
                          className="replacement-option-button"
                          onClick={() => setReplacementPlayer(candidatePlayer)}
                        >
                          Compare
                        </button>
                      </div>
                    );
                  },
                )}
              </div>
            ) : (
              <div className="replacement-empty">
                No observed replacement lineups were found for the selected
                player.
              </div>
            )}

            <p className="replacement-note">
              Options are ranked by observed Net Rating. Rankings are
              descriptive and should be interpreted alongside minutes and sample
              reliability.
            </p>
          </div>
        )}

        {replacementBase && removePlayer && replacementPlayer && (
          <div className="replacement-result">
            <div className="replacement-change">
              <span>{removePlayer}</span>
              <strong>→</strong>
              <span>{replacementPlayer}</span>
            </div>

            {replacementResult ? (
              <>
                <div className="replacement-lineups">
                  <div>
                    <p className="eyebrow">Original Unit</p>

                    <h3>{replacementBase.GROUP_NAME}</h3>

                    <span>{replacementBase.MIN.toFixed(1)} minutes</span>
                  </div>

                  <div>
                    <p className="eyebrow">Observed Replacement Unit</p>

                    <h3>{replacementResult.GROUP_NAME}</h3>

                    <span>{replacementResult.MIN.toFixed(1)} minutes</span>
                  </div>
                </div>

                <div className="replacement-metrics">
                  <ReplacementMetric
                    label="Off Rating"
                    before={replacementBase.OFF_RATING}
                    after={replacementResult.OFF_RATING}
                    lowerIsBetter={false}
                  />

                  <ReplacementMetric
                    label="Def Rating"
                    before={replacementBase.DEF_RATING}
                    after={replacementResult.DEF_RATING}
                    lowerIsBetter
                  />

                  <ReplacementMetric
                    label="Net Rating"
                    before={replacementBase.NET_RATING}
                    after={replacementResult.NET_RATING}
                    lowerIsBetter={false}
                  />

                  <ReplacementMetric
                    label="Minutes"
                    before={replacementBase.MIN}
                    after={replacementResult.MIN}
                    lowerIsBetter={false}
                    descriptive
                  />
                </div>

                <p className="replacement-note">
                  This compares two observed lineup samples. It does not
                  establish that the player substitution caused the difference
                  in performance.
                </p>
              </>
            ) : (
              <div className="replacement-empty">
                No observed lineup containing this exact replacement combination
                was found in the loaded data.
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

function ReplacementMetric({
  label,
  before,
  after,
  lowerIsBetter,
  descriptive = false,
}: {
  label: string;
  before: number;
  after: number;
  lowerIsBetter: boolean;
  descriptive?: boolean;
}) {
  const difference = after - before;

  const improved = descriptive
    ? false
    : lowerIsBetter
      ? difference < 0
      : difference > 0;

  const declined = descriptive
    ? false
    : lowerIsBetter
      ? difference > 0
      : difference < 0;

  return (
    <div className="replacement-metric">
      <span>{label}</span>

      <div>
        <strong>{before.toFixed(1)}</strong>
        <span>→</span>
        <strong>{after.toFixed(1)}</strong>
      </div>

      <small
        className={
          improved
            ? "replacement-improved"
            : declined
              ? "replacement-declined"
              : ""
        }
      >
        {difference > 0 ? "+" : ""}
        {difference.toFixed(1)}
      </small>
    </div>
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

export default ReplacementPage;
