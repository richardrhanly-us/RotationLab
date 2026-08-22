import { useEffect, useMemo, useRef, useState } from "react";

import type { Lineup } from "../types/lineup";

function LineupPicker({
  label,
  lineups,
  selectedId,
  onSelect,
  isOpen,
  onToggle,
  onClose,
}: {
  label: string;
  lineups: Lineup[];
  selectedId: string;
  onSelect: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const pickerRef = useRef<HTMLDivElement>(null);

  const selectedLineup = lineups.find(
    (lineup) => lineup.GROUP_ID === selectedId,
  );

  const filteredLineups = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return lineups;
    }

    return lineups.filter((lineup) =>
      lineup.GROUP_NAME.toLowerCase().includes(query),
    );
  }, [lineups, search]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setSearch("");
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  return (
    <div className="lineup-picker" ref={pickerRef}>
      <span className="lineup-picker-label">{label}</span>

      <button
        type="button"
        className="lineup-picker-trigger"
        onClick={onToggle}
      >
        <span>
          {selectedLineup
            ? selectedLineup.GROUP_NAME
            : "Select a lineup"}
        </span>

        <span className="lineup-picker-arrow">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {isOpen && (
        <div className="lineup-picker-menu">
          <input
            type="text"
            className="lineup-picker-search"
            placeholder="Search by player name..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            autoFocus
          />

          <div className="lineup-picker-results">
            {filteredLineups.map((lineup) => {
              const players = lineup.GROUP_NAME.split(" - ");

              return (
                <button
                  type="button"
                  key={lineup.GROUP_ID}
                  className={`lineup-picker-option ${
                    lineup.GROUP_ID === selectedId
                      ? "lineup-picker-option-selected"
                      : ""
                  }`}
                  onClick={() => {
                    onSelect(lineup.GROUP_ID);
                    setSearch("");
                    onClose();
                  }}
                >
                  <span className="lineup-picker-players">
                    {players.map((player) => (
                      <span key={player}>{player}</span>
                    ))}
                  </span>

                  <span className="lineup-picker-meta">
                    {lineup.MIN.toFixed(1)} MIN
                    {" • "}
                    {lineup.NET_RATING > 0 ? "+" : ""}
                    {lineup.NET_RATING.toFixed(1)} NET
                  </span>
                </button>
              );
            })}

            {filteredLineups.length === 0 && (
              <div className="lineup-picker-empty">
                No matching lineups.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LineupPicker;