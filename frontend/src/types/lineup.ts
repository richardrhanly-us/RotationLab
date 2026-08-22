export type Lineup = {
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

export type LineupsResponse = {
  team: string;
  season: string;
  count: number;
  lineups: Lineup[];
};