import random

def apply_intelligence(decision, surplus, prev_surplus, energy, activity_type, duration):
    """
    Enhances decision with human-like behavior
    """

    # -----------------------------
    # 🧠 Already active → chill
    # -----------------------------
    if activity_type != "none" and duration >= 45:
        return {
            "type": "rest",
            "message_override": "Bro you already did enough today 😭 just chill"
        }

    # -----------------------------
    # 🧠 Yesterday overload
    # -----------------------------
    if prev_surplus > 300:
        return {
            "type": "balance",
            "message_override": "Yesterday was heavy da 😭 let’s balance today"
        }

    # -----------------------------
    # 🧠 Tired + high surplus
    # -----------------------------
    if energy == "tired" and surplus > 500:
        return {
            "type": "walk",
            "target": 2000,
            "message_override": "You’re tired… don’t push. Just walk a bit."
        }

    # -----------------------------
    # default → no change
    # -----------------------------
    return decision


def get_choice_feedback(choice_type, data):
    """
    Returns a motivational message after the choice is made
    """
    
    motivation_msgs = {
        "walk": [
            "Steady wins the race! 🚶‍♂️ Enjoy the breeze.",
            "Great call. Low impact, high consistency. You got this!",
            "Perfect way to clear the head and burn those extra kcal.",
            "Walking is the most underrated fat burner. Solid move."
        ],
        "workout": [
            "Beast mode! 💪 Let's crush those exercises.",
            "High intensity is the way to go today. Focus on the form!",
            "Earning that dinner right now. Push hard!",
            "Respect the grind. Your future self is thanking you."
        ]
    }
    
    msg = random.choice(motivation_msgs.get(choice_type, ["Let's go!"]))
    
    return {
        "motivation_msg": msg,
        "praj_advice": "Consistency is key. Don't stop now."
    }