from pathlib import Path

import pandas as pd
from fastapi import FastAPI
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="RotationLab API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_PATH = Path("data/okc_lineups_2025_26.csv")


@app.get("/")
def root():
    return {
        "app": "RotationLab API",
        "status": "ok",
    }


@app.get("/api/lineups")
def get_lineups(limit: int = 25):
    df = pd.read_csv(DATA_PATH)

    df = df.sort_values(
        by="MIN",
        ascending=False,
    )

    df = df.head(limit)

    return {
        "team": "Oklahoma City Thunder",
        "season": "2025-26",
        "count": len(df),
        "lineups": df.to_dict(orient="records"),
    }

@app.get("/api/lineups/compare")
def compare_lineups(lineup_a: str, lineup_b: str):
    df = pd.read_csv(DATA_PATH)

    row_a = df[df["GROUP_ID"] == lineup_a]
    row_b = df[df["GROUP_ID"] == lineup_b]

    if row_a.empty:
        return {"error": "Lineup A not found."}

    if row_b.empty:
        return {"error": "Lineup B not found."}

    a = row_a.iloc[0]
    b = row_b.iloc[0]

    metrics = [
        "MIN",
        "GP",
        "W_PCT",
        "FG_PCT",
        "FG3_PCT",
        "FT_PCT",
        "REB",
        "AST",
        "TOV",
        "STL",
        "BLK",
        "PTS",
        "PLUS_MINUS",
    ]

    comparison = {}

    for metric in metrics:
        a_value = a[metric]
        b_value = b[metric]

        comparison[metric] = {
            "lineup_a": None if pd.isna(a_value) else float(a_value),
            "lineup_b": None if pd.isna(b_value) else float(b_value),
        }

    return {
        "team": "Oklahoma City Thunder",
        "season": "2025-26",
        "lineup_a": {
            "id": a["GROUP_ID"],
            "name": a["GROUP_NAME"],
        },
        "lineup_b": {
            "id": b["GROUP_ID"],
            "name": b["GROUP_NAME"],
        },
        "comparison": comparison,
    }

@app.get("/api/lineups/replacements")
def get_lineup_replacements(
    base_lineup_id: str,
    remove_player: str,
):
    df = pd.read_csv(DATA_PATH)

    base_rows = df[df["GROUP_ID"] == base_lineup_id]

    if base_rows.empty:
        raise HTTPException(
            status_code=404,
            detail="Base lineup not found.",
        )

    # If the same GROUP_ID appears more than once,
    # use the observation with the largest minutes sample.
    base = base_rows.sort_values(
        by="MIN",
        ascending=False,
    ).iloc[0]

    base_players = [
        player.strip()
        for player in base["GROUP_NAME"].split(" - ")
    ]

    if remove_player not in base_players:
        raise HTTPException(
            status_code=400,
            detail="Remove player is not part of the selected base lineup.",
        )

    remaining_players = [
        player
        for player in base_players
        if player != remove_player
    ]

    replacement_options = {}

    for _, row in df.iterrows():
        lineup_players = [
            player.strip()
            for player in row["GROUP_NAME"].split(" - ")
        ]

        # All four remaining players must be present.
        if not all(
            player in lineup_players
            for player in remaining_players
        ):
            continue

        # The removed player cannot still be in the candidate lineup.
        if remove_player in lineup_players:
            continue

        added_players = [
            player
            for player in lineup_players
            if player not in remaining_players
        ]

        # A valid five-man replacement should introduce exactly one player.
        if len(added_players) != 1:
            continue

        replacement_player = added_players[0]

        candidate = {
            "replacement_player": replacement_player,
            "lineup": row.to_dict(),
        }

        existing = replacement_options.get(replacement_player)

        # Keep the largest-minute observation for each replacement player.
        if (
            existing is None
            or row["MIN"] > existing["lineup"]["MIN"]
        ):
            replacement_options[replacement_player] = candidate

    results = list(replacement_options.values())

    results.sort(
        key=lambda option: option["lineup"]["NET_RATING"],
        reverse=True,
    )

    return {
        "team": "Oklahoma City Thunder",
        "season": "2025-26",
        "base_lineup": {
            "id": base["GROUP_ID"],
            "name": base["GROUP_NAME"],
            "remove_player": remove_player,
            "remaining_players": remaining_players,
        },
        "count": len(results),
        "replacements": results,
    }