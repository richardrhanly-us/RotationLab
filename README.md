# RotationLab

RotationLab is an NBA lineup and rotation analysis application designed to support basketball operations workflows.

The project focuses on five-man lineup performance, lineup comparison, sample reliability, player filtering, replacement analysis, and rotation decision support. It uses NBA lineup data to help identify which units have performed well, how different combinations compare, and where small sample sizes may make conclusions less reliable.

The current version uses the Oklahoma City Thunder as the default team and the 2025-26 NBA season as the initial dataset.

## Current Features

### Five-Man Lineup Explorer

RotationLab loads five-man lineup data and allows two units to be selected for direct comparison.

The application currently loads up to 250 five-man lineup observations.

Each lineup includes:

- Games played
- Minutes
- Win percentage
- Field goal percentage
- Three-point percentage
- Rebounds
- Assists
- Turnovers
- Points
- Plus/minus

### Searchable Lineup Picker

Lineup A and Lineup B are selected through searchable lineup pickers rather than long native dropdown lists.

Each lineup result displays:

- The five players in the lineup
- Total minutes
- Net Rating

Users can search by player name to quickly locate relevant units.

The picker also supports:

- Closing when clicking outside the picker
- Automatically closing Lineup A when Lineup B is opened
- Automatically closing Lineup B when Lineup A is opened

### Advanced Lineup Metrics

The application incorporates advanced NBA lineup metrics including:

- Offensive Rating
- Defensive Rating
- Net Rating
- Pace
- True Shooting Percentage
- Effective Field Goal Percentage
- Assist Percentage
- Assist-to-Turnover Ratio
- Rebound Percentage

These metrics allow comparisons to focus on lineup efficiency rather than raw totals alone.

### Sample Reliability

Each lineup is assigned a simple reliability indicator based on total minutes played.

Current thresholds:

- High reliability: 100+ minutes
- Medium reliability: 40-99.9 minutes
- Low reliability: under 40 minutes

This makes small-sample lineup results easier to identify when evaluating performance.

### Head-to-Head Comparison

Two selected lineups can be compared across traditional and advanced metrics.

The comparison currently includes:

- Minutes
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

Metric winners are highlighted while descriptive metrics such as pace and minutes are not treated as inherently better or worse.

The application also summarizes how many measured categories each lineup leads while explicitly avoiding treating that count as an overall lineup ranking.

### Lineup Leaderboard

RotationLab includes a filterable five-man lineup leaderboard.

Users can filter and rank lineups by:

- Minimum minutes
- Minimum games
- Net Rating
- Offensive Rating
- Defensive Rating
- Minutes
- Win percentage
- True Shooting Percentage

The leaderboard can display the top 5, 10, or 20 qualifying units.

### Player Include / Exclude Filters

The leaderboard supports player-specific filtering.

Users can:

- Show only lineups containing a selected player
- Exclude lineups containing a selected player
- Combine include and exclude filters
- Apply player filters together with minimum-minute and minimum-game thresholds

The player lists are generated directly from the loaded lineup data.

### Leaderboard-to-Comparison Workflow

Each leaderboard row includes:

- Set as A
- Set as B

This allows an analyst to identify an interesting unit in the leaderboard and immediately send it into the head-to-head comparison workflow.

### Player Replacement Analysis

RotationLab includes an observed player replacement analysis tool.

The workflow allows a user to:

1. Select a base five-man lineup
2. Select one player to remove
3. Select a replacement player
4. Search the loaded NBA lineup data for the exact resulting five-man combination
5. Compare the original lineup against the observed replacement lineup

The detailed comparison currently includes:

- Offensive Rating
- Defensive Rating
- Net Rating
- Minutes

Changes are visually classified as improvements, declines, or descriptive differences.

The analysis intentionally treats the results as observational rather than causal.

### Replacement Discovery

RotationLab can also automatically discover replacement options rather than requiring the user to guess which player to test.

After selecting a base lineup and a player to remove, the application:

1. Keeps the remaining four players fixed
2. Searches the loaded lineup data for observed five-man units containing those same four players
3. Identifies the fifth player used in each observed replacement lineup
4. Removes duplicate replacement observations by retaining the largest-minute sample
5. Ranks the replacement options by observed Net Rating

Each discovered option displays:

- Replacement player
- Minutes
- Sample reliability
- Offensive Rating
- Defensive Rating
- Net Rating

A Compare button sends the selected replacement directly into the detailed before-and-after replacement analysis.

Replacement rankings are descriptive and should be interpreted alongside sample size and game context.

## Planned Features

RotationLab is being developed toward a broader basketball operations decision-support workflow.

### Rotation and Substitution Analysis

A future goal is to support rotation-level analysis rather than only season aggregate lineup statistics.

Planned areas include:

- Substitution pattern analysis
- Rotation sequencing
- Lineup stint analysis
- Bench-unit performance
- Starter and reserve combinations
- Game-level rotation timelines

### Play-by-Play Lineup Reconstruction

A major planned engineering feature is reconstructing on-court lineups from NBA play-by-play and substitution data.

Instead of relying only on pre-aggregated lineup endpoints, RotationLab will eventually derive lineup stints directly from game events.

This will enable analysis of:

- Who was on the court during each possession or stint
- When substitutions occurred
- How long individual lineup combinations remained together
- Score differential during each stint
- Possession-level lineup performance

### Possession-Based Metrics

Future versions will move beyond per-36 normalization and support possession-based analysis such as:

- Points per 100 possessions
- Offensive Rating derived from possessions
- Defensive Rating derived from possessions
- Net Rating
- Pace
- Turnover rate
- Rebounding rate
- Shot profile metrics

### Sample-Size and Confidence Analysis

The current reliability indicator is intentionally simple.

Future versions may incorporate more rigorous approaches such as:

- Minimum possession thresholds
- Confidence intervals
- Regression toward team averages
- Shrinkage for small lineup samples
- Sample-size warnings

### Multi-Team Support

The current dataset is focused on Oklahoma City.

Future versions are planned to support:

- Team selection
- Season selection
- Cross-team lineup analysis
- Historical seasons

### Data Persistence

The current development version reads processed lineup data from CSV.

A future version is planned to use PostgreSQL for persistent storage of:

- Teams
- Players
- Games
- Lineups
- Lineup stints
- Possessions
- Advanced metrics

### Backend Analytics API

RotationLab now moves meaningful lineup analysis logic into the FastAPI backend rather than keeping all analytics calculations in the React client.

Current API capabilities include:

- Five-man lineup retrieval
- Lineup comparison
- Player replacement discovery
- Replacement-option ranking

The replacement discovery endpoint accepts a base lineup and a player to remove, then:

1. Identifies the remaining four-player core
2. Searches the full lineup dataset for observed alternatives
3. Identifies the replacement player in each matching unit
4. Deduplicates repeated replacement observations using the largest-minute sample
5. Ranks the observed options by Net Rating

The React frontend requests these results from FastAPI and uses the returned data to populate the replacement discovery interface.

Future API expansion may include:

- Leaderboard filtering
- Player lookup
- Lineup lookup
- Rotation analysis
- Game-level lineup data
- Stint analysis

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- CSS

### Backend

- Python
- FastAPI
- Uvicorn
- pandas

### NBA Data

- nba_api
- NBA Stats lineup endpoints

### Planned Data Layer

- PostgreSQL
- SQLAlchemy

## Project Structure

```text
RotationLab/
├── backend/
│   └── main.py
├── data/
│   └── okc_lineups_2025_26.csv
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   └── App.css
│   └── package.json
├── scripts/
│   └── test_okc_lineups.py
├── .gitignore
└── README.md
```

## Running the Project Locally

### Backend

From the project root:

```powershell
.\.venv\Scripts\Activate.ps1
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

### Frontend

Open a second terminal:

```powershell
cd frontend
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

## Data Pipeline

The current data ingestion script retrieves Oklahoma City five-man lineup data from NBA Stats using `nba_api`.

The pipeline retrieves both base and advanced lineup statistics and combines them into the processed dataset used by the application.

Run:

```powershell
python scripts\test_okc_lineups.py
```

The processed dataset is written to:

```text
data/okc_lineups_2025_26.csv
```

The FastAPI backend reads this dataset and exposes it to the React frontend.

## Project Goal

RotationLab is intended to demonstrate a full basketball analytics software workflow:

```text
NBA data ingestion
        ↓
data processing
        ↓
traditional + advanced basketball metrics
        ↓
FastAPI backend
        ↓
React decision-support interface
        ↓
lineup discovery
        ↓
lineup comparison
        ↓
player replacement analysis
        ↓
rotation decision support
```

The long-term goal is to evolve the project from a lineup statistics explorer into a more complete basketball operations application capable of supporting lineup evaluation, player replacement analysis, rotation analysis, substitution analysis, and possession-level decision support.

## Interpretation Note

RotationLab currently works with observed lineup performance data.

Differences between two lineups should not automatically be interpreted as causal effects of a single player or substitution. Lineup performance can also be influenced by opponent quality, game state, teammate combinations, sample size, and other contextual factors.

The application is designed to surface useful basketball information while keeping those limitations visible.