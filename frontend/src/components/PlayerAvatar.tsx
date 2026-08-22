type PlayerAvatarProps = {
  playerId: string;
  playerName: string;
  size?: "small" | "medium";
};

function PlayerAvatar({
  playerId,
  playerName,
  size = "small",
}: PlayerAvatarProps) {
  const imageUrl = playerId
    ? `https://cdn.nba.com/headshots/nba/latest/1040x760/${playerId}.png`
    : "";

  return (
    <div
      className={`player-avatar player-avatar-${size}`}
      title={playerName}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={playerName}
          loading="lazy"
        />
      ) : (
        <span>{playerName.charAt(0)}</span>
      )}
    </div>
  );
}

export default PlayerAvatar;