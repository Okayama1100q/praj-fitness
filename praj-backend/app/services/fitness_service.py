# -----------------------------
# 🧠 BMR
# -----------------------------
def calculate_bmr(weight, height, age):
    return 10 * weight + 6.25 * height - 5 * age + 5


# -----------------------------
# 🔥 Burn
# -----------------------------
def calculate_burn(weight, height, age, steps, activity_type="none", duration=0):

    bmr = calculate_bmr(weight, height, age)

    # 🚶 Steps
    step_burn = steps * 0.04

    # 🏃 Activity intensity mapping
    intensity_map = {
        "none": 0,
        "light": 4,
        "medium": 6,
        "intense": 9
    }

    per_min = intensity_map.get(activity_type, 0)
    activity_burn = per_min * duration

    total_burn = bmr + step_burn + activity_burn

    return {
        "bmr": bmr,
        "step_burn": step_burn,
        "activity_burn": activity_burn,
        "total_burn": total_burn
    }


# -----------------------------
# ⚖️ Surplus
# -----------------------------
def calculate_surplus(intake, total_burn):
    surplus = intake - total_burn
    return surplus if surplus > 0 else 0