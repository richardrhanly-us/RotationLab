from pathlib import Path

import pandas as pd
from nba_api.stats.endpoints import teamdashlineups

OKC_TEAM_ID = 1610612760
SEASON = "2025-26"

base_response = teamdashlineups.TeamDashLineups(
    team_id=OKC_TEAM_ID,
    season=SEASON,
    group_quantity=5,
    measure_type_detailed_defense="Base",
)

advanced_response = teamdashlineups.TeamDashLineups(
    team_id=OKC_TEAM_ID,
    season=SEASON,
    group_quantity=5,
    measure_type_detailed_defense="Advanced",
)

base_df = base_response.get_data_frames()[1]
advanced_df = advanced_response.get_data_frames()[1]

base_columns = [
    "GROUP_ID",
    "GROUP_NAME",
    "GP",
    "W",
    "L",
    "W_PCT",
    "MIN",
    "FG_PCT",
    "FG3_PCT",
    "FT_PCT",
    "OREB",
    "DREB",
    "REB",
    "AST",
    "TOV",
    "STL",
    "BLK",
    "PTS",
    "PLUS_MINUS",
    "SUM_TIME_PLAYED",
]

advanced_columns = [
    "GROUP_ID",
    "OFF_RATING",
    "DEF_RATING",
    "NET_RATING",
    "PACE",
    "TS_PCT",
    "EFG_PCT",
    "AST_PCT",
    "AST_TO",
    "REB_PCT",
]

base_clean = base_df[base_columns].copy()
advanced_clean = advanced_df[advanced_columns].copy()

clean_df = base_clean.merge(
    advanced_clean,
    on="GROUP_ID",
    how="left",
)

clean_df = clean_df.sort_values(
    by="MIN",
    ascending=False,
)

output_path = Path("data/okc_lineups_2025_26.csv")
clean_df.to_csv(output_path, index=False)

display_columns = [
    "GROUP_NAME",
    "MIN",
    "OFF_RATING",
    "DEF_RATING",
    "NET_RATING",
    "PACE",
    "TS_PCT",
    "PLUS_MINUS",
]

print(clean_df[display_columns].head(15).to_string(index=False))
print()
print(f"Saved {len(clean_df)} lineups to:")
print(output_path)