from pathlib import Path

import pandas as pd
from fastapi import FastAPI
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