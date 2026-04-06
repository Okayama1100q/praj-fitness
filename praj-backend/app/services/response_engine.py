import random

TONES = [
    "Bro...",
    "Okay listen...",
    "Hmm...",
    "Not bad...",
    "Adei..."
]


def generate_response(surplus, decision):
    tone = random.choice(TONES)
    level = decision["level"]

    # -----------------------------
    # 😌 Balanced
    # -----------------------------
    if level == "none":
        return f"{tone} you're actually balanced today 😌 no stress."

    # -----------------------------
    # 🙂 Small surplus
    # -----------------------------
    elif level == "low":
        return f"{tone} small surplus 😌 easy fix da. Little movement is enough."

    # -----------------------------
    # ⚠️ Medium surplus
    # -----------------------------
    elif level == "medium":
        return f"{tone} slight overload 😭 either walk or quick workout — your call."

    # -----------------------------
    # 🔥 High surplus
    # -----------------------------
    else:
        return f"{tone} okay that was heavy 💀 we gotta fix this today. Pick: walk or workout."