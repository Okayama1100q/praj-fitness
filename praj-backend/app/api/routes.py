from fastapi import APIRouter

from datetime import date, timedelta

from app.core.database import SessionLocal
from app.models.daily_log import DailyLog

from app.services.calorie_engine import estimate_calories
from app.services.fitness_service import calculate_burn, calculate_surplus
from app.services.decision_engine import decide_action
from app.services.workout_engine import get_workout_plan
from app.services.response_engine import generate_response
from app.services.praj_intelligence import apply_intelligence

router = APIRouter()


@router.post("/coach")
def coach(data: dict):

    # -----------------------------
    # 💾 DB session
    # -----------------------------
    db = SessionLocal()

    # -----------------------------
    # 🍛 Calories
    # -----------------------------
    food_data = estimate_calories(data["food"])
    dinner_data = estimate_calories(data["dinner"])

    intake = food_data["total_calories"] + dinner_data["total_calories"]

    # -----------------------------
    # 🔥 Burn
    # -----------------------------
    burn_data = calculate_burn(
        data["weight"],
        data["height"],
        data["age"],
        data["steps"],
        data.get("activity_type", "none"),
        data.get("duration", 0)
    )

    total_burn = burn_data["total_burn"]

    # -----------------------------
    # ⚖️ Today Surplus
    # -----------------------------
    surplus = calculate_surplus(intake, total_burn)

    # -----------------------------
    # 📅 Yesterday Surplus
    # -----------------------------
    yesterday = str(date.today())

    prev_log = db.query(DailyLog).filter(DailyLog.date == yesterday).first()

    prev_surplus = prev_log.surplus if prev_log else 0

    # -----------------------------
    # ➕ Adjusted Surplus
    # -----------------------------
    adjusted_surplus = surplus + prev_surplus

    # -----------------------------
    # 🧠 Decision
    # -----------------------------
    decision = decide_action(
        adjusted_surplus,
        data["energy"],
        data["steps"],
        data.get("activity_type", "none")
    )

    # -----------------------------
    # 🧠 Praj Intelligence
    # -----------------------------
    intel = apply_intelligence(
        decision,
        adjusted_surplus,
        prev_surplus,
        data["energy"],
        data.get("activity_type", "none"),
        data.get("duration", 0)
    )

    if "message_override" in intel:
        decision["message_override"] = intel["message_override"]

    # -----------------------------
    # 💪 Workout Plan
    # -----------------------------
    workout_plan = get_workout_plan(decision.get("level", "low"))

    # -----------------------------
    # 🎭 Response
    # -----------------------------
    if "message_override" in decision:
        message = decision["message_override"]
    else:
        message = generate_response(adjusted_surplus, decision)

    # -----------------------------
    # 💾 Save today's data
    # -----------------------------
    today = str(date.today())

    existing = db.query(DailyLog).filter(DailyLog.date == today).first()

    if existing:
        existing.intake = intake
        existing.burn = total_burn
        existing.surplus = surplus
    else:
        new_log = DailyLog(
            date=today,
            intake=intake,
            burn=total_burn,
            surplus=surplus
        )
        db.add(new_log)

    db.commit()
    db.close()

    # -----------------------------
    # 📤 Final Output
    # -----------------------------
    return {
        "intake": intake,
        "burn": total_burn,
        "surplus": surplus,
        "adjusted_surplus": adjusted_surplus,
        "previous_surplus": prev_surplus,

        "options": {
            "walk": decision.get("walk", {}),
            "workout": {
                "duration": decision.get("workout", {}).get("duration", 0),
                "plan": workout_plan
            }
        },

        "message": message
    }


# -----------------------------
# 📊 View Logs
# -----------------------------
@router.get("/logs")
def get_logs():
    db = SessionLocal()

    logs = db.query(DailyLog).all()

    result = []
    for log in logs:
        result.append({
            "date": log.date,
            "intake": log.intake,
            "burn": log.burn,
            "surplus": log.surplus
        })

    db.close()

    return result