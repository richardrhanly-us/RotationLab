from fastapi.testclient import TestClient

from backend.main import app


client = TestClient(app)


def test_four_player_core_returns_results():
    response = client.get(
        "/api/lineups/four-player-core",
        params={
            "player_1": "S. Gilgeous-Alexander",
            "player_2": "L. Dort",
            "player_3": "C. Holmgren",
            "player_4": "J. Williams",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["count"] > 0
    assert len(data["lineups"]) == data["count"]


def test_four_player_core_is_sorted_by_net_rating():
    response = client.get(
        "/api/lineups/four-player-core",
        params={
            "player_1": "S. Gilgeous-Alexander",
            "player_2": "L. Dort",
            "player_3": "C. Holmgren",
            "player_4": "J. Williams",
        },
    )

    assert response.status_code == 200

    lineups = response.json()["lineups"]

    net_ratings = [
        option["lineup"]["NET_RATING"]
        for option in lineups
    ]

    assert net_ratings == sorted(
        net_ratings,
        reverse=True,
    )


def test_fifth_player_is_not_in_core():
    core_players = {
        "S. Gilgeous-Alexander",
        "L. Dort",
        "C. Holmgren",
        "J. Williams",
    }

    response = client.get(
        "/api/lineups/four-player-core",
        params={
            "player_1": "S. Gilgeous-Alexander",
            "player_2": "L. Dort",
            "player_3": "C. Holmgren",
            "player_4": "J. Williams",
        },
    )

    assert response.status_code == 200

    for option in response.json()["lineups"]:
        assert option["fifth_player"] not in core_players


def test_four_player_core_rejects_duplicate_players():
    response = client.get(
        "/api/lineups/four-player-core",
        params={
            "player_1": "S. Gilgeous-Alexander",
            "player_2": "S. Gilgeous-Alexander",
            "player_3": "C. Holmgren",
            "player_4": "J. Williams",
        },
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Four unique players are required."