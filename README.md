# RotationLab

RotationLab is an NBA lineup and rotation analysis application designed to support basketball operations workflows.

The project focuses on five-man lineup performance, lineup comparison, sample reliability, and rotation decision support. It uses NBA lineup data to help identify which units have performed well, how different combinations compare, and where small sample sizes may make conclusions less reliable.

The current version uses the Oklahoma City Thunder as the default team and the 2025-26 NBA season as the initial dataset.

## Current Features

### Five-Man Lineup Explorer

RotationLab loads five-man lineup data and allows two units to be selected for direct comparison.

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

### Advanced Lineup Metrics

The application also incorporates advanced NBA lineup metrics:

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

This is intended to make small-sample lineup results easier to identify when evaluating performance.

### Head-to-Head Comparison

Two selected lineups can be compared across traditional and advanced metrics.

The comparison currently includes:

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

Users can currently filter and rank lineups by:

- Minimum minutes
- Minimum games
- Net Rating
- Offensive Rating
- Defensive Rating
- Minutes
- Win percentage
- True Shooting Percentage

The leaderboard can display the top 5, 10, or 20 qualifying units.

## Planned Features

RotationLab is being developed toward a broader basketball operations decision-support workflow.

Planned features include:

### Leaderboard-to-Comparison Workflow

Leaderboard rows will be selectable directly as Lineup A or Lineup B so analysts can identify an interesting unit and immediately compare it against another lineup.

### Player and Lineup Filtering

Future filtering will support questions such as:

- Which lineups include a specific player?
- Which lineups exclude a specific player?
- Which units perform best with a minimum sample threshold?
- What changes when one player is replaced by another?

### Rotation and Substitution Analysis

A future goal is to support rotation-level analysis rather than only season aggregate lineup statistics.

This may include:

- Substitution pattern analysis
- Rotation sequencing
- Lineup stint analysis
- Bench-unit performance
- Starter and reserve combinations
- Player replacement comparisons

### Play-by-Play Lineup Reconstruction

A major planned engineering feature is reconstructing on-court lineups from NBA play-by-play and substitution data.

Instead of relying only on pre-aggregated lineup endpoints, RotationLab will eventually be able to derive lineup stints directly from game events.

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

### API Expansion

The FastAPI backend will be expanded with endpoints for:

- Leaderboard filtering
- Player lookup
- Lineup lookup
- Lineup comparison
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

- `nba_api`
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