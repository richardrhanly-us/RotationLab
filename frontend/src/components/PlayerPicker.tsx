import { useEffect, useMemo, useRef, useState } from "react";

type PlayerPickerProps = {
  label: string;
  players: string[];
  selectedPlayer: string;
  onSelect: (player: string) => void;

  placeholder?: string;
  disabledPlayers?: string[];

  allowEmpty?: boolean;
  emptyLabel?: string;

  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
};

function PlayerPicker({
  label,
  players,
  selectedPlayer,
  onSelect,
  placeholder = "Choose player...",
  disabledPlayers = [],
  allowEmpty = true,
  emptyLabel = "Any player",
  isOpen,
  onToggle,
  onClose,
}: PlayerPickerProps) {
  const [search, setSearch] = useState("");

  const pickerRef = useRef<HTMLDivElement>(null);

  const filteredPlayers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return players;
    }

    return players.filter((player) => player.toLowerCase().includes(query));
  }, [players, search]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleMouseDown = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setSearch("");
        onClose();
      }
    };

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [isOpen, onClose]);

  return (
    <div className="player-picker" ref={pickerRef}>
      <span className="player-picker-label">{label}</span>

      <button
        type="button"
        className="player-picker-trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span>{selectedPlayer || (allowEmpty ? emptyLabel : placeholder)}</span>

        <span className="player-picker-arrow">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="player-picker-menu">
          <input
            className="player-picker-search"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search players..."
            autoFocus
          />

          <div className="player-picker-results">
            {allowEmpty && (
              <button
                type="button"
                className={`player-picker-option ${
                  selectedPlayer === "" ? "player-picker-option-selected" : ""
                }`}
                onClick={() => {
                  onSelect("");
                  setSearch("");
                  onClose();
                }}
              >
                <span>{emptyLabel}</span>
              </button>
            )}

            {filteredPlayers.map((player) => {
              const disabled =
                disabledPlayers.includes(player) && player !== selectedPlayer;

              return (
                <button
                  type="button"
                  key={player}
                  disabled={disabled}
                  className={`player-picker-option ${
                    selectedPlayer === player
                      ? "player-picker-option-selected"
                      : ""
                  }`}
                  onClick={() => {
                    if (disabled) {
                      return;
                    }

                    onSelect(player);
                    setSearch("");
                    onClose();
                  }}
                >
                  <span className="player-picker-name">{player}</span>

                  {disabled && (
                    <span className="player-picker-status">Selected</span>
                  )}
                </button>
              );
            })}

            {filteredPlayers.length === 0 && (
              <div className="player-picker-empty">No matching players</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayerPicker;
