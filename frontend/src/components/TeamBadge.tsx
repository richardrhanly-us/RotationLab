type TeamBadgeProps = {
  team: string;
  season: string;
  compact?: boolean;
};

function TeamBadge({
  team,
  season,
  compact = false,
}: TeamBadgeProps) {
  return (
    <div
      className={`team-context ${
        compact ? "team-context-compact" : ""
      }`}
    >
      <div className="team-context-logo-frame">
        <img
          src="/logos/okc-logo.png"
          alt="Oklahoma City Thunder logo"
          className="team-context-logo"
        />
      </div>

      <div className="team-context-text">
        <strong>{team}</strong>
        <span>{season} Season</span>
      </div>
    </div>
  );
}

export default TeamBadge;