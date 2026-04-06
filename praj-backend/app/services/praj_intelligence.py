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