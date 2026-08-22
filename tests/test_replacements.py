from fastapi.testclient import TestClient

from backend.main import app


client = TestClient(app)


def test_replacement_discovery_returns_results():
    response = client.get(
        "/api/lineups/replacements",
        params={
            "base_lineup_id": "-1628392-1628983-1629652-1631096-1641717-",
            "remove_player": "C. Wallace",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["count"] > 0
    assert len(data["replacements"]) == data["count"]


def test_replacements_are_sorted_by_net_rating():
    response = client.get(
        "/api/lineups/replacements",
        params={
            "base_lineup_id": "-1628392-1628983-1629652-1631096-1641717-",
            "remove_player": "C. Wallace",
        },
    )

    assert response.status_code == 200

    replacements = response.json()["replacements"]

    net_ratings = [
        option["lineup"]["NET_RATING"]
        for option in replacements
    ]

    assert net_ratings == sorted(
        net_ratings,
        reverse=True,
    )


def test_removed_player_is_not_in_replacement_lineups():
    removed_player = "C. Wallace"

    response = client.get(
        "/api/lineups/replacements",
        params={
            "base_lineup_id": "-1628392-1628983-1629652-1631096-1641717-",
            "remove_player": removed_player,
        },
    )

    assert response.status_code == 200

    for option in response.json()["replacements"]:
        lineup_players = option["lineup"]["GROUP_NAME"].split(" - ")

        assert removed_player not in lineup_players


def test_replacement_rejects_player_not_in_base_lineup():
    response = client.get(
        "/api/lineups/replacements",
        params={
            "base_lineup_id": "-1628392-1628983-1629652-1631096-1641717-",
            "remove_player": "A. Caruso",
        },
    )

    assert response.status_code == 400
    assert (
        response.json()["detail"]
        == "Remove player is not part of the selected base lineup."
    )


def test_replacement_returns_404_for_unknown_base_lineup():
    response = client.get(
        "/api/lineups/replacements",
        params={
            "base_lineup_id": "not-a-real-lineup",
            "remove_player": "C. Wallace",
        },
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Base lineup not found."