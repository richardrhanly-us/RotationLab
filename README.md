# RotationLab

[![RotationLab CI](https://github.com/richardrhanly-us/RotationLab/actions/workflows/tests.yml/badge.svg)](https://github.com/richardrhanly-us/RotationLab/actions/workflows/tests.yml)

RotationLab is a full-stack NBA lineup and rotation analysis application built to support basketball operations-style decision making.

The current version focuses on the Oklahoma City Thunder and the 2025-26 NBA season. It combines five-man lineup data, advanced efficiency metrics, player-level filtering, replacement analysis, and four-player core analysis in a React interface backed by FastAPI.

## Live Demo

- Frontend: https://rotation-lab.vercel.app
- API: https://rotationlab-api.onrender.com
- API docs: https://rotationlab-api.onrender.com/docs

> The backend is hosted on Render's free tier and may take a short time to wake after a period of inactivity.

## Current Features

### Overview Dashboard

The Overview page provides a clean entry point into RotationLab's four main analysis workflows:

- Lineup Comparison
- Lineup Leaderboard
- Player Replacement Analysis
- Four-Player Core Analysis

The interface uses an Oklahoma City-inspired visual system with shared team branding, navigation, and responsive page layouts.

### Lineup Comparison

Compare any two observed five-man units side by side.

The comparison includes:

- Minutes
- Games played
- Win percentage
- Field goal percentage
- Three-point percentage
- Offensive Rating
- Defensive Rating
- Net Rating
- Pace
- True Shooting Percentage
- Points per 36 minutes
- Rebounds per 36 minutes
- Assists per 36 minutes
- Turnovers per 36 minutes
- Steals per 36 minutes
- Blocks per 36 minutes
- Plus/minus per 36 minutes

Metric leaders are highlighted while descriptive metrics such as pace and minutes are not treated as inherently better or worse.

The comparison view also includes:

- Searchable lineup selection
- Player headshots derived from NBA player IDs
- Sample reliability indicators
- A category summary showing which lineup leads across the selected performance metrics

### Searchable Lineup Picker

Long native dropdowns are replaced with a custom searchable lineup picker.

Each lineup option surfaces:

- The five players in the unit
- Minutes played
- Net Rating

This makes it practical to work with a dataset containing up to 250 observed five-man lineups without navigating a wall of text.

### Searchable Player Picker

RotationLab also includes a reusable player picker for player-specific controls.

The component supports:

- Search
- Disabled players when duplicate selections are not allowed
- Optional empty states such as "Any player"
- Outside-click closing
- Shared styling across analysis workflows

### Lineup Leaderboard

The leaderboard ranks and filters observed five-man lineups.

Available controls include:

- Minimum minutes
- Minimum games
- Sort metric
- Top 5, 10, or 20 lineups
- Include player
- Exclude player

Supported sort metrics include:

- Net Rating
- Offensive Rating
- Defensive Rating
- Minutes
- Win percentage
- True Shooting Percentage

Each row also includes controls for sending a lineup directly into the comparison workflow as Lineup A or Lineup B.

### Sample Reliability

Each lineup is assigned a simple reliability label based on total observed minutes:

- **High:** 100+ minutes
- **Medium:** 40-99.9 minutes
- **Low:** under 40 minutes

The reliability indicator is intended to keep small-sample results visible during analysis rather than treating all lineup statistics as equally trustworthy.

### Player Replacement Analysis

The replacement workflow evaluates observed alternatives to an existing five-man unit.

A user can:

1. Select a base lineup.
2. Select one player to remove.
3. Inspect automatically discovered fifth-player alternatives.
4. Rank those alternatives by observed Net Rating.
5. Select a replacement.
6. Compare the original lineup with the observed replacement lineup.

Each discovered replacement displays:

- Replacement player
- Player headshot
- Minutes
- Reliability
- Offensive Rating
- Defensive Rating
- Net Rating

The detailed comparison shows changes in:

- Offensive Rating
- Defensive Rating
- Net Rating
- Minutes

Replacement results are presented as observational rather than causal.

### Four-Player Core Analysis

The four-player core tool answers a different rotation question:

> If these four players stay on the floor together, which observed fifth players have produced the strongest five-man units?

The user selects four players and RotationLab searches the observed lineup dataset for matching five-man units.

Results are ranked by Net Rating and display:

- Fifth player
- Player headshot
- Minutes
- Reliability
- Offensive Rating
- Defensive Rating
- Net Rating

The tool prevents duplicate player selections and keeps the four-player core fixed while evaluating observed fifth-player combinations.

### NBA Player Identity and Headshots

NBA player IDs are derived directly from each lineup's `GROUP_ID` and matched to the corresponding position in `GROUP_NAME`.

This avoids relying on abbreviated player names alone. That is especially important for ambiguous names such as `J. Williams`, which can represent different Oklahoma City players.

Official NBA CDN headshots are then rendered from the resolved player IDs.

## Backend API

RotationLab moves lineup discovery and analysis logic into FastAPI rather than keeping all calculations in the React client.

Current routes:

```text
GET /
GET /api/lineups
GET /api/lineups/compare
GET /api/lineups/replacements
GET /api/lineups/four-player-core
```

Current backend capabilities include:

- Five-man lineup retrieval
- Lineup comparison support
- Replacement discovery
- Replacement-option ranking
- Four-player core discovery
- Fifth-player ranking

## Automated Tests

The project includes automated API and analytics tests covering:

- API health
- Lineup retrieval
- Lineup sorting
- Replacement discovery
- Replacement validation
- Four-player core discovery
- Duplicate-player validation
- Fifth-player correctness

Current test suite:

```text
12 passed
```

Run the full suite with:

```powershell
pytest
```

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- CSS

### Backend

- Python
- FastAPI
- Uvicorn
- pandas

### NBA Data

- `nba_api`
- NBA Stats lineup endpoints
- NBA player IDs
- NBA CDN player headshots

### Testing

- pytest
- FastAPI `TestClient`
- httpx

### Deployment

- Vercel — frontend
- Render — FastAPI backend

## Project Structure

```text
RotationLab/
├── backend/
│   └── main.py
├── data/
│   └── okc_lineups_2025_26.csv
├── frontend/
│   ├── public/
│   │   └── logos/
│   │       └── okc-logo.png
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppNav.tsx
│   │   │   ├── LineupCard.tsx
│   │   │   ├── LineupPicker.tsx
│   │   │   ├── PlayerAvatar.tsx
│   │   │   ├── PlayerPicker.tsx
│   │   │   └── TeamBadge.tsx
│   │   ├── pages/
│   │   │   ├── ComparePage.tsx
│   │   │   ├── FourPlayerCorePage.tsx
│   │   │   ├── LeaderboardPage.tsx
│   │   │   └── ReplacementPage.tsx
│   │   ├── types/
│   │   │   └── lineup.ts
│   │   ├── utils/
│   │   │   └── lineupPlayers.ts
│   │   ├── App.css
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   └── package.json
├── scripts/
│   └── test_okc_lineups.py
├── tests/
│   ├── test_api.py
│   ├── test_four_player_core.py
│   └── test_replacements.py
├── .gitignore
├── README.md
└── requirements.txt
```

## Running the Project Locally

### 1. Clone and enter the project

```powershell
git clone https://github.com/richardrhanly-us/RotationLab.git
cd RotationLab
```

### 2. Create the Python environment

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

### 3. Configure the frontend environment

Create:

```text
frontend/.env
```

with:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

### 4. Start the backend

From the project root:

```powershell
python -m uvicorn backend.main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

### 5. Start the frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

## Data Pipeline

The current ingestion workflow retrieves Oklahoma City five-man lineup data from NBA Stats using `nba_api`.

The pipeline combines traditional and advanced lineup statistics into:

```text
data/okc_lineups_2025_26.csv
```

Run the data script with:

```powershell
python scripts/test_okc_lineups.py
```

The FastAPI backend reads the processed CSV and exposes the lineup data and analysis endpoints to the React frontend.

## Architecture

```text
NBA Stats / nba_api
        ↓
data ingestion + processing
        ↓
processed five-man lineup CSV
        ↓
FastAPI analytics API
        ↓
React + TypeScript frontend
        ↓
Overview
├── Lineup Comparison
├── Lineup Leaderboard
├── Player Replacement Analysis
└── Four-Player Core Analysis
```

## Interpretation Note

RotationLab analyzes observed lineup performance.

Differences between lineups should not automatically be interpreted as causal effects of a single player or substitution. Results may also be influenced by:

- Opponent quality
- Game state
- Teammate combinations
- Matchups
- Sample size
- Other contextual factors

The application is designed to surface useful basketball information while keeping those limitations visible.

## Future Directions

Potential future expansion includes:

- Game-level rotation timelines
- Play-by-play lineup reconstruction
- Lineup stint analysis
- Possession-level metrics
- More rigorous confidence and sample-size modeling
- Multi-team and multi-season support
- Persistent database storage
- Cross-team lineup analysis

## Project Goal

RotationLab demonstrates an end-to-end basketball analytics software workflow:

```text
NBA data
   ↓
data processing
   ↓
FastAPI analytics
   ↓
React decision-support interface
   ↓
lineup comparison
   ↓
lineup ranking
   ↓
replacement discovery
   ↓
four-player core analysis
   ↓
rotation decision support
```

The project is intended to demonstrate full-stack software development, API design, data processing, automated testing, deployment, and basketball analytics in a single application.
