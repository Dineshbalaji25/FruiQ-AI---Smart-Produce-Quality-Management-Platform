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
    
    if freshness_score < 30:
        estimated_days = 0
    elif freshness_score < 40:
        estimated_days = max(1, int(rules['moderate'] * 0.2)) # Very short
    elif freshness_score < 50:
        estimated_days = max(1, int(rules['moderate'] * 0.5)) # Short
    elif freshness_score < 60:
        estimated_days = max(2, int(rules['moderate'] * 0.8)) # Almost moderate
    elif freshness_score < 70:
        estimated_days = rules['moderate']
    elif freshness_score < 90:
        estimated_days = int((rules['fresh'] + rules['moderate']) / 2) # Midpoint
    else:
        estimated_days = rules['fresh']
        
    optimal_date = datetime.now() + timedelta(days=estimated_days)
    
    # Generate a descriptive storage recommendation
    if estimated_days == 0:
        recommendation = "Dispose of securely. Do not consume."
    elif freshness_score < 50:
        recommendation = "Consume immediately. Very low freshness detected. Keep refrigerated."
    elif freshness_score < 60:
        recommendation = "Consume soon. Refrigerate at 4°C to prevent rapid spoiling."
    elif freshness_score < 70:
        recommendation = f"Refrigerate at 4°C to maintain quality for up to {estimated_days} days."
    elif freshness_score < 90:
        recommendation = f"Good quality. Store in a cool, dry place or refrigerate to extend shelf life to {estimated_days} days."
    else:
        recommendation = f"Excellent freshness. Can be stored at room temperature or refrigerated for up to {estimated_days} days."
    
    return {
        "estimated_days": estimated_days,
        "optimal_consumption_date": optimal_date.strftime("%Y-%m-%d"),
        "storage_recommendation": recommendation
    }
