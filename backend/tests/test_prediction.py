import pytest
from app.services.freshness_scorer import calculate_freshness_score, determine_grade

def test_freshness_scoring():
    predictions = {
        'fresh': 0.9,
        'rotten': 0.1,
        'formalin': 0.0
    }
    score = calculate_freshness_score(predictions)
    assert score == 90
    assert determine_grade(score) == 'A'

    bad_predictions = {
        'fresh': 0.1,
        'rotten': 0.5,
        'formalin': 0.4
    }
    score2 = calculate_freshness_score(bad_predictions)
    # 0.1*100 + 0 + 0.4*-20 = 10 - 8 = 2
    assert score2 == 2
    assert determine_grade(score2) == 'Reject'
