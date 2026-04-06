import random

WORKOUT_DB = {
    "low": [
        ["Jumping Jacks", "Squats", "Plank"],
        ["High Knees", "Lunges", "Sit-ups"],
    ],

    "medium": [
        ["Burpees", "Push-ups", "Squats"],
        ["Mountain Climbers", "Jump Squats", "Plank"],
    ],

    "high": [
        ["Burpees", "Push-ups", "Jump Squats", "Plank"],
        ["High Knees", "Mountain Climbers", "Lunges", "Sit-ups"],
    ]
}


def get_workout_plan(level):
    """
    Returns a random workout plan based on level
    """

    if level not in WORKOUT_DB:
        level = "low"

    exercises = random.choice(WORKOUT_DB[level])

    return {
        "level": level,
        "exercises": exercises
    }