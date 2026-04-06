def decide_action(surplus, energy, steps, activity_type):
    """
    Returns options for:
    - walking
    - workout
    """

    # -----------------------------
    # 🧠 Determine level
    # -----------------------------
    if surplus > 700:
        level = "high"
    elif surplus > 400:
        level = "medium"
    elif surplus > 200:
        level = "low"
    else:
        level = "none"

    # -----------------------------
    # 🚶 Walking targets
    # -----------------------------
    walk_targets = {
        "high": 4000,
        "medium": 3000,
        "low": 2000,
        "none": 1000
    }

    # -----------------------------
    # 💪 Workout duration
    # -----------------------------
    workout_targets = {
        "high": 30,
        "medium": 20,
        "low": 10,
        "none": 0
    }

    return {
        "level": level,
        "walk": {
            "steps": walk_targets[level]
        },
        "workout": {
            "duration": workout_targets[level]
        }
    }