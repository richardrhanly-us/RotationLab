from fastapi.testclient import TestClient

from backend.main import app


client = TestClient(app)


def test_root_health_check():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {
        "app": "RotationLab API",
        "status": "ok",
    }


def test_lineups_endpoint_returns_data():
    response = client.get(
        "/api/lineups",
        params={"limit": 5},
    )

    assert response.status_code == 200

    data = response.json()

    assert data["team"] == "Oklahoma City Thunder"
    assert data["season"] == "2025-26"
    assert data["count"] == 5
    assert len(data["lineups"]) == 5


def test_lineups_are_sorted_by_minutes():
    response = client.get(
        "/api/lineups",
        params={"limit": 10},
    )

    assert response.status_code == 200

    lineups = response.json()["lineups"]

    minutes = [
        lineup["MIN"]
        for lineup in lineups
    ]

    assert minutes == sorted(
        minutes,
        reverse=True,
    )