import { useEffect, useMemo, useState } from "react";
import "./App.css";

type Lineup = {
  GROUP_ID: string;
  GROUP_NAME: string;
  GP: number;
  W: number;
  L: number;
  W_PCT: number;
  MIN: number;
  FG_PCT: number;
  FG3_PCT: number;
  FT_PCT: number;
  REB: number;
  AST: number;
  TOV: number;
  STL: number;
  BLK: number;
  PTS: number;
  PLUS_MINUS: number;
  OFF_RATING: number;
  DEF_RATING: number;
  NET_RATING: number;
  PACE: number;
  TS_PCT: number;
  EFG_PCT: number;
  AST_PCT: number;
  AST_TO: number;
  REB_PCT: number;
};

type LineupsResponse = {
  team: string;
  season: string;
  count: number;
  lineups: Lineup[];
};

function App() {
  const [data, setData] = useState<LineupsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [lineupAId, setLineupAId] = useState("");
  const [lineupBId, setLineupBId] = useState("");
  const [minimumMinutes, setMinimumMinutes] = useState(20);
  const [minimumGames, setMinimumGames] = useState(3);
  const [sortBy, setSortBy] = useState("NET_RATING");
  const [topN, setTopN] = useState(10);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/lineups?limit=50")
      .then((response) => response.json())
      .then((result: LineupsResponse) => {
        setData(result);

        if (result.lineups.length >= 2) {
          setLineupAId(result.lineups[0].GROUP_ID);
          setLineupBId(result.lineups[1].GROUP_ID);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const lineupA = useMemo(
    () => data?.lineups.find((lineup) => lineup.GROUP_ID === lineupAId),
    [data, lineupAId]
  );

  const lineupB = useMemo(
    () => data?.lineups.find((lineup) => lineup.GROUP_ID === lineupBId),
    [data, lineupBId]
  );


const comparisonMetrics = useMemo(() => {
  if (!lineupA || !lineupB) return [];

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
  if (!lineupA || !lineupB) return null;

  const performanceMetrics = comparisonMetrics.filter(
    (metric) => !metric.descriptiveOnly
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


const leaderboard = useMemo(() => {
  if (!data) return [];

  const filtered = data.lineups.filter(
    (lineup) =>
      lineup.MIN >= minimumMinutes &&
      lineup.GP >= minimumGames
  );

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
]);


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

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Lineup Explorer</p>
            <h2>Compare Five-Man Units</h2>
          </div>
          <span className="sample-count">{data.count} lineups loaded</span>
        </div>

        <div className="selectors">
          <label>
            <span>Lineup A</span>
            <select
              value={lineupAId}
              onChange={(event) => setLineupAId(event.target.value)}
            >
              {data.lineups.map((lineup) => (
                <option key={lineup.GROUP_ID} value={lineup.GROUP_ID}>
                  {lineup.GROUP_NAME}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Lineup B</span>
            <select
              value={lineupBId}
              onChange={(event) => setLineupBId(event.target.value)}
            >
              {data.lineups.map((lineup) => (
                <option key={lineup.GROUP_ID} value={lineup.GROUP_ID}>
                  {lineup.GROUP_NAME}
                </option>
              ))}
            </select>
          </label>
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
                  {comparisonSummary.lineupAWins > comparisonSummary.lineupBWins
                    ? "Lineup A leads across more measured categories"
                    : comparisonSummary.lineupBWins > comparisonSummary.lineupAWins
                    ? "Lineup B leads across more measured categories"
                    : "The lineups split the measured categories evenly"}
                </h3>

                <p className="summary-note">
                  This is a descriptive comparison of the selected metrics, not an
                  overall lineup ranking. Sample size and game context should also be
                  considered.
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

        <section className="panel leaderboard-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Lineup Rankings</p>
              <h2>Five-Man Unit Leaderboard</h2>
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
                <option value="OFF_RATING">Offensive Rating</option>
                <option value="DEF_RATING">Defensive Rating</option>
                <option value="MIN">Minutes</option>
                <option value="W_PCT">Win %</option>
                <option value="TS_PCT">True Shooting %</option>
              </select>
            </label>

            <label>
              <span>Show</span>
              <select
                value={topN}
                onChange={(event) => setTopN(Number(event.target.value))}
              >
                <option value={5}>Top 5</option>
                <option value={10}>Top 10</option>
                <option value={20}>Top 20</option>
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
            </div>

            {leaderboard.map((lineup, index) => (
              <div className="leaderboard-row" key={lineup.GROUP_ID}>
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
              </div>
            ))}

            {leaderboard.length === 0 && (
              <div className="leaderboard-empty">
                No lineups meet the selected thresholds.
              </div>
            )}
          </div>

          <p className="leaderboard-note">
            Minimum-minute and minimum-game filters help reduce the influence
            of extremely small lineup samples.
          </p>
        </section>


      </>
    )}
    </main>
  );
}




function LineupCard({
  title,
  lineup,
}: {
  title: string;
  lineup: Lineup;
}) {
  const reliability = getReliability(lineup.MIN);
  return (
    <article className="lineup-card">
      <p className="eyebrow">{title}</p>
      <h3>{lineup.GROUP_NAME}</h3>

      <div className={`reliability-badge ${reliability.className}`}>
        <span>{reliability.label} reliability</span>
        <small>{reliability.note} • {lineup.MIN.toFixed(1)} minutes</small>
      </div>

      <div className="metrics">
        <Metric label="Minutes" value={lineup.MIN.toFixed(1)} />
        <Metric label="Games" value={lineup.GP.toString()} />
        <Metric label="Win %" value={`${(lineup.W_PCT * 100).toFixed(1)}%`} />
        <Metric label="FG %" value={`${(lineup.FG_PCT * 100).toFixed(1)}%`} />
        <Metric label="3P %" value={`${(lineup.FG3_PCT * 100).toFixed(1)}%`} />
        <Metric label="Rebounds" value={lineup.REB.toString()} />
        <Metric label="Assists" value={lineup.AST.toString()} />
        <Metric label="Turnovers" value={lineup.TOV.toString()} />
        <Metric label="Points" value={lineup.PTS.toString()} />
        <Metric
          label="+/-"
          value={
            lineup.PLUS_MINUS > 0
              ? `+${lineup.PLUS_MINUS}`
              : lineup.PLUS_MINUS.toString()
          }
        />
        <Metric label="Off Rating" value={lineup.OFF_RATING.toFixed(1)} />
        <Metric label="Def Rating" value={lineup.DEF_RATING.toFixed(1)} />

        <Metric
          label="Net Rating"
          value={
            lineup.NET_RATING > 0
              ? `+${lineup.NET_RATING.toFixed(1)}`
              : lineup.NET_RATING.toFixed(1)
          }
        />

        <Metric label="Pace" value={lineup.PACE.toFixed(1)} />
        <Metric label="TS %" value={`${(lineup.TS_PCT * 100).toFixed(1)}%`} />
      </div>
    </article>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}


function per36(value: number, minutes: number) {
  return minutes > 0 ? (value / minutes) * 36 : 0;
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

export default App;