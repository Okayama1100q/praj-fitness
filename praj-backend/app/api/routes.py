from fastapi import APIRouter

from datetime import date, timedelta

from app.core.database import SessionLocal
from app.models.daily_log import DailyLog

from app.services.calorie_engine import estimate_calories
from app.services.fitness_service import calculate_burn, calculate_surplus
from app.services.decision_engine import decide_action
from app.services.workout_engine import get_workout_plan
from app.services.response_engine import generate_response
from app.services.praj_intelligence import apply_intelligence, get_choice_feedback
from app.models.user import User
from passlib.context import CryptContext
from jose import jwt

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "praj_super_secret_key"
ALGORITHM = "HS256"

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

@router.post("/register")
def register(data: dict):
    db = SessionLocal()
    existing = db.query(User).filter(User.email == data["email"]).first()
    if existing:
        return {"error": "Email already registered"}
    
    new_user = User(
        name=data["name"],
        email=data["email"],
        number=data["number"],
        password_hash=get_password_hash(data["password"]),
        weight=float(data["weight"]),
        height=float(data["height"]),
        age=int(data["age"])
    )
    db.add(new_user)
    db.commit()
    return {"message": "User registered successfully"}

@router.post("/login")
def login(data: dict):
    db = SessionLocal()
    user = db.query(User).filter(User.email == data["email"]).first()
    if not user or not verify_password(data["password"], user.password_hash):
        return {"error": "Invalid credentials"}
    
    token = jwt.encode({"user_id": user.id, "email": user.email}, SECRET_KEY, algorithm=ALGORITHM)
    return {
        "access_token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "weight": user.weight,
            "height": user.height,
            "age": user.age
        }
    }



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
    # 👤 User Context (Mocking session via token or plain user lookup for MVP)
    # -----------------------------
    user_id = data.get("user_id", 1) # Default to 1 for demo
    user = db.query(User).filter(User.id == user_id).first()
    
    # Use profile data if user found, fallback to body data
    weight = user.weight if user else data.get("weight", 70)
    height = user.height if user else data.get("height", 175)
    age = user.age if user else data.get("age", 25)

    # -----------------------------
    # 🔥 Burn
    # -----------------------------
    burn_data = calculate_burn(
        weight,
        height,
        age,
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
            "walk": {
                **decision.get("walk", {}),
                **get_choice_feedback("walk", decision.get("walk", {}))
            },
            "workout": {
                "duration": decision.get("workout", {}).get("duration", 0),
                "plan": workout_plan,
                **get_choice_feedback("workout", workout_plan)
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