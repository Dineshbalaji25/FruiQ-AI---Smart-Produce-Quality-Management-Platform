def calculate_freshness_score(predictions):
    """
    Fresh: 100 points
    Rotten: 0 points
    Formalin: -20 penalty (unsafe)
    
    Score = weighted sum based on probabilities
    """
    score = (
        predictions['fresh'] * 100 +
        predictions['rotten'] * 0 +
        predictions['formalin'] * -20
    )
    return max(0, min(100, int(score)))

def determine_grade(score):
    if score >= 90:
        return 'A'
    elif score >= 75:
        return 'B'
    elif score >= 60:
        return 'C'
    else:
        return 'Reject'
