import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import LineupCard from "../components/LineupCard";
import LineupPicker from "../components/LineupPicker";
import type { LineupsResponse } from "../types/lineup";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ComparePage() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<LineupsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [lineupAId, setLineupAId] = useState("");
  const [lineupBId, setLineupBId] = useState("");

  const [openLineupPicker, setOpenLineupPicker] = useState<"A" | "B" | null>(
    null,
  );

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

        if (result.lineups.length >= 2) {
          const requestedLineupA = searchParams.get("lineupA");
          const requestedLineupB = searchParams.get("lineupB");

          const validLineupA = result.lineups.some(
            (lineup) => lineup.GROUP_ID === requestedLineupA,
          );

          const validLineupB = result.lineups.some(
            (lineup) => lineup.GROUP_ID === requestedLineupB,
          );

          setLineupAId(
            validLineupA && requestedLineupA
              ? requestedLineupA
              : result.lineups[0].GROUP_ID,
          );

          setLineupBId(
            validLineupB && requestedLineupB
              ? requestedLineupB
              : result.lineups[1].GROUP_ID,
          );
        }
      })
      .catch((error) => {
        console.error("Could not load lineup data:", error);
        setData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams]);

  const lineupA = useMemo(
    () => data?.lineups.find((lineup) => lineup.GROUP_ID === lineupAId),
    [data, lineupAId],
  );

  const lineupB = useMemo(
    () => data?.lineups.find((lineup) => lineup.GROUP_ID === lineupBId),
    [data, lineupBId],
  );

  const comparisonMetrics = useMemo(() => {
    if (!lineupA || !lineupB) {
      return [];
    }

    return [
      {
        label: "Minutes",
        a: lineupA.MIN,
        b: lineupB.MIN,
        format: (value: number) => value.toFixed(1),
        higherIsBetter: false,
        descriptiveOnly: true,
      },
      {
        label: "Win %",
        a: lineupA.W_PCT,
        b: lineupB.W_PCT,
        format: (value: number) => `${(value * 100).toFixed(1)}%`,
        higherIsBetter: true,
      },
      {
        label: "FG %",
        a: lineupA.FG_PCT,
        b: lineupB.FG_PCT,
        format: (value: number) => `${(value * 100).toFixed(1)}%`,
        higherIsBetter: true,
      },
      {
        label: "3P %",
        a: lineupA.FG3_PCT,
        b: lineupB.FG3_PCT,
        format: (value: number) => `${(value * 100).toFixed(1)}%`,
        higherIsBetter: true,
      },
      {
        label: "Off Rating",
        a: lineupA.OFF_RATING,
        b: lineupB.OFF_RATING,
        format: (value: number) => value.toFixed(1),
        higherIsBetter: true,
      },
      {
        label: "Def Rating",
        a: lineupA.DEF_RATING,
        b: lineupB.DEF_RATING,
        format: (value: number) => value.toFixed(1),
        higherIsBetter: false,
      },
      {
        label: "Net Rating",
        a: lineupA.NET_RATING,
        b: lineupB.NET_RATING,
        format: (value: number) =>
          value > 0 ? `+${value.toFixed(1)}` : value.toFixed(1),
        higherIsBetter: true,
      },
      {
        label: "Pace",
        a: lineupA.PACE,
        b: lineupB.PACE,
        format: (value: number) => value.toFixed(1),
        higherIsBetter: false,
        descriptiveOnly: true,
      },
      {
        label: "TS %",
        a: lineupA.TS_PCT,
        b: lineupB.TS_PCT,
        format: (value: number) => `${(value * 100).toFixed(1)}%`,
        higherIsBetter: true,
      },
      {
        label: "PTS / 36",
        a: per36(lineupA.PTS, lineupA.MIN),
        b: per36(lineupB.PTS, lineupB.MIN),
        format: (value: number) => value.toFixed(1),
        higherIsBetter: true,
      },
      {
        label: "REB / 36",
        a: per36(lineupA.REB, lineupA.MIN),
        b: per36(lineupB.REB, lineupB.MIN),
        format: (value: number) => value.toFixed(1),
        higherIsBetter: true,
      },
      {
        label: "AST / 36",
        a: per36(lineupA.AST, lineupA.MIN),
        b: per36(lineupB.AST, lineupB.MIN),
        format: (value: number) => value.toFixed(1),
        higherIsBetter: true,
      },
      {
        label: "TOV / 36",
        a: per36(lineupA.TOV, lineupA.MIN),
        b: per36(lineupB.TOV, lineupB.MIN),
        format: (value: number) => value.toFixed(1),
        higherIsBetter: false,
      },
      {
        label: "STL / 36",
        a: per36(lineupA.STL, lineupA.MIN),
        b: per36(lineupB.STL, lineupB.MIN),
        format: (value: number) => value.toFixed(1),
        higherIsBetter: true,
      },
      {
        label: "BLK / 36",
        a: per36(lineupA.BLK, lineupA.MIN),
        b: per36(lineupB.BLK, lineupB.MIN),
        format: (value: number) => value.toFixed(1),
        higherIsBetter: true,
      },
      {
        label: "+/- / 36",
        a: per36(lineupA.PLUS_MINUS, lineupA.MIN),
        b: per36(lineupB.PLUS_MINUS, lineupB.MIN),
        format: (value: number) =>
          value > 0 ? `+${value.toFixed(1)}` : value.toFixed(1),
        higherIsBetter: true,
      },
    ];
  }, [lineupA, lineupB]);

  const comparisonSummary = useMemo(() => {
    if (!lineupA || !lineupB) {
      return null;
    }

    const performanceMetrics = comparisonMetrics.filter(
      (metric) => !metric.descriptiveOnly,
    );

    let lineupAWins = 0;
    let lineupBWins = 0;
    let ties = 0;

    performanceMetrics.forEach((metric) => {
      if (metric.a === metric.b) {
        ties += 1;
        return;
      }

      const aWins = metric.higherIsBetter
        ? metric.a > metric.b
        : metric.a < metric.b;

      if (aWins) {
        lineupAWins += 1;
      } else {
        lineupBWins += 1;
      }
    });

    return {
      lineupAWins,
      lineupBWins,
      ties,
    };
  }, [comparisonMetrics, lineupA, lineupB]);

  if (loading) {
    return <main className="app-shell">Loading lineup comparison...</main>;
  }

  if (!data) {
    return <main className="app-shell">Could not load lineup data.</main>;
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Lineup Analysis</p>
          <h1>Lineup Comparison</h1>
          <p className="subtitle">
            Compare two observed five-man units across performance and
            efficiency metrics.
          </p>
        </div>

        <div className="team-context">
          <strong>{data.team}</strong>
          <span>{data.season} Season</span>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Lineup Explorer</p>
            <h2>Compare Five-Man Units</h2>
          </div>

          <span className="sample-count">{data.count} lineups loaded</span>
        </div>

        <div className="selectors">
          <LineupPicker
            label="Lineup A"
            lineups={data.lineups}
            selectedId={lineupAId}
            onSelect={setLineupAId}
            isOpen={openLineupPicker === "A"}
            onToggle={() =>
              setOpenLineupPicker((current) => (current === "A" ? null : "A"))
            }
            onClose={() => setOpenLineupPicker(null)}
          />

          <LineupPicker
            label="Lineup B"
            lineups={data.lineups}
            selectedId={lineupBId}
            onSelect={setLineupBId}
            isOpen={openLineupPicker === "B"}
            onToggle={() =>
              setOpenLineupPicker((current) => (current === "B" ? null : "B"))
            }
            onClose={() => setOpenLineupPicker(null)}
          />
        </div>
      </section>

      {lineupA && lineupB && (
        <>
          <section className="comparison-grid">
            <LineupCard title="Lineup A" lineup={lineupA} />
            <LineupCard title="Lineup B" lineup={lineupB} />
          </section>

          <section className="panel comparison-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Decision Support</p>
                <h2>Head-to-Head Comparison</h2>
              </div>
            </div>

            <div className="comparison-table">
              <div className="comparison-row comparison-header">
                <span>Metric</span>
                <span>Lineup A</span>
                <span>Difference</span>
                <span>Lineup B</span>
              </div>

              {comparisonMetrics.map((metric) => {
                const difference = metric.a - metric.b;

                const aWins =
                  !metric.descriptiveOnly &&
                  (metric.higherIsBetter
                    ? metric.a > metric.b
                    : metric.a < metric.b);

                const bWins =
                  !metric.descriptiveOnly &&
                  (metric.higherIsBetter
                    ? metric.b > metric.a
                    : metric.b < metric.a);

                return (
                  <div className="comparison-row" key={metric.label}>
                    <span className="comparison-label">{metric.label}</span>

                    <span className={aWins ? "comparison-winner" : ""}>
                      {metric.format(metric.a)}
                    </span>

                    <span className="comparison-difference">
                      {difference > 0 ? "+" : ""}
                      {metric.label.includes("%")
                        ? `${(difference * 100).toFixed(1)}`
                        : difference.toFixed(1)}
                    </span>

                    <span className={bWins ? "comparison-winner" : ""}>
                      {metric.format(metric.b)}
                    </span>
                  </div>
                );
              })}
            </div>

            {comparisonSummary && (
              <div className="comparison-summary">
                <div>
                  <p className="eyebrow">Comparison Profile</p>

                  <h3>
                    {comparisonSummary.lineupAWins >
                    comparisonSummary.lineupBWins
                      ? "Lineup A leads across more measured categories"
                      : comparisonSummary.lineupBWins >
                          comparisonSummary.lineupAWins
                        ? "Lineup B leads across more measured categories"
                        : "The lineups split the measured categories evenly"}
                  </h3>

                  <p className="summary-note">
                    This is a descriptive comparison of the selected metrics,
                    not an overall lineup ranking. Sample size and game context
                    should also be considered.
                  </p>
                </div>

                <div className="summary-score">
                  <div>
                    <span>Lineup A</span>
                    <strong>{comparisonSummary.lineupAWins}</strong>
                  </div>

                  <div>
                    <span>Lineup B</span>
                    <strong>{comparisonSummary.lineupBWins}</strong>
                  </div>

                  <div>
                    <span>Ties</span>
                    <strong>{comparisonSummary.ties}</strong>
                  </div>
                </div>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}

function per36(value: number, minutes: number) {
  return minutes > 0 ? (value / minutes) * 36 : 0;
}

export default ComparePage;
