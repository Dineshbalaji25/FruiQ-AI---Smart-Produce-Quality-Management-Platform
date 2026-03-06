from datetime import datetime, timedelta

SHELF_LIFE_RULES = {
    'apple': {'fresh': 14, 'moderate': 7, 'rotten': 0},
    'banana': {'fresh': 5, 'moderate': 2, 'rotten': 0},
    'grape': {'fresh': 7, 'moderate': 3, 'rotten': 0},
    'mango': {'fresh': 10, 'moderate': 5, 'rotten': 0},
    'orange': {'fresh': 14, 'moderate': 7, 'rotten': 0},
    'default': {'fresh': 7, 'moderate': 3, 'rotten': 0}
}

def estimate_shelf_life(fruit_type, freshness_score, class_prediction):
    """
    Returns days and optimal consumption date based on fruit type and freshness score.
    """
    normalized_fruit = fruit_type.lower() if fruit_type else 'default'
    if normalized_fruit not in SHELF_LIFE_RULES:
        normalized_fruit = 'default'
        
    rules = SHELF_LIFE_RULES[normalized_fruit]
    
    if class_prediction == 'rotten' or class_prediction == 'formalin' or freshness_score < 60:
        estimated_days = 0
    elif freshness_score > 85:
        estimated_days = rules['fresh']
    else:
        estimated_days = rules['moderate']
        
    optimal_date = datetime.now() + timedelta(days=estimated_days)
    
    return {
        "estimated_days": estimated_days,
        "optimal_consumption_date": optimal_date.strftime("%Y-%m-%d"),
        "storage_recommendation": "Refrigerate at 4°C" if estimated_days > 0 else "Dispose securely"
    }
