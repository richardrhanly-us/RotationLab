import type { Lineup } from "../types/lineup";

export type LineupPlayer = {
  id: string;
  name: string;
};

export function getLineupPlayers(lineup: Lineup): LineupPlayer[] {
  const names = lineup.GROUP_NAME.split(" - ").map((name) =>
    name.trim(),
  );

  const ids = lineup.GROUP_ID.split("-").filter(Boolean);

  return names.map((name, index) => ({
    name,
    id: ids[index] ?? "",
  }));
}