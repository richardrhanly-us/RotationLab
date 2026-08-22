import type { Lineup } from "../types/lineup";

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
        <small>
          {reliability.note} • {lineup.MIN.toFixed(1)} minutes
        </small>
      </div>

      <div className="metrics">
        <Metric label="Minutes" value={lineup.MIN.toFixed(1)} />
        <Metric label="Games" value={lineup.GP.toString()} />
        <Metric
          label="Win %"
          value={`${(lineup.W_PCT * 100).toFixed(1)}%`}
        />
        <Metric
          label="FG %"
          value={`${(lineup.FG_PCT * 100).toFixed(1)}%`}
        />
        <Metric
          label="3P %"
          value={`${(lineup.FG3_PCT * 100).toFixed(1)}%`}
        />
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

        <Metric
          label="Off Rating"
          value={lineup.OFF_RATING.toFixed(1)}
        />
        <Metric
          label="Def Rating"
          value={lineup.DEF_RATING.toFixed(1)}
        />
        <Metric
          label="Net Rating"
          value={
            lineup.NET_RATING > 0
              ? `+${lineup.NET_RATING.toFixed(1)}`
              : lineup.NET_RATING.toFixed(1)
          }
        />
        <Metric label="Pace" value={lineup.PACE.toFixed(1)} />
        <Metric
          label="TS %"
          value={`${(lineup.TS_PCT * 100).toFixed(1)}%`}
        />
      </div>
    </article>
  );
}

export default LineupCard;