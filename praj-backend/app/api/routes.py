from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from datetime import date

from app.core.database import SessionLocal
from app.models.daily_log import DailyLog
from app.models.user import User

from app.services.calorie_engine import estimate_calories
from app.services.fitness_service import calculate_burn, calculate_surplus
from app.services.decision_engine import decide_action
from app.services.workout_engine import get_workout_plan
from app.services.response_engine import generate_response
from app.services.praj_intelligence import apply_intelligence, get_choice_feedback

from passlib.context import CryptContext
from jose import jwt

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "praj_super_secret_key"
ALGORITHM = "HS256"


# -----------------------------
# 🧠 DB Dependency (IMPORTANT FIX)
# -----------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -----------------------------
# 🔐 PASSWORD
# -----------------------------
def get_password_hash(password):
    return pwd_context.hash(password[:72])


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password[:72], hashed_password)


# -----------------------------
# 📝 REGISTER
# -----------------------------
@router.post("/register")
def register(data: dict, db: Session = Depends(get_db)):
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


# -----------------------------
# 🔑 LOGIN
# -----------------------------
@router.post("/login")
def login(data: dict, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data["email"]).first()

    if not user or not verify_password(data["password"], user.password_hash):
        return {"error": "Invalid credentials"}

    token = jwt.encode(
        {"user_id": user.id, "email": user.email},
        SECRET_KEY,
        algorithm=ALGORITHM
    )

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


# -----------------------------
# 🧠 COACH
# -----------------------------
@router.post("/coach")
def coach(data: dict, db: Session = Depends(get_db)):

    # 🍛 Calories
    food_data = estimate_calories(data["food"])
    dinner_data = estimate_calories(data["dinner"])

    intake = food_data["total_calories"] + dinner_data["total_calories"]

    # 👤 User
    user_id = data.get("user_id", 1)
    user = db.query(User).filter(User.id == user_id).first()

    weight = user.weight if user else data.get("weight", 70)
    height = user.height if user else data.get("height", 175)
    age = user.age if user else data.get("age", 25)

    # 🔥 Burn
    burn_data = calculate_burn(
        weight,
        height,
        age,
        data["steps"],
        data.get("activity_type", "none"),
        data.get("duration", 0)
    )

    total_burn = burn_data["total_burn"]

    # ⚖️ Surplus
    surplus = calculate_surplus(intake, total_burn)

    # 📅 Previous
    today = str(date.today())

    prev_log = db.query(DailyLog).filter(DailyLog.date == today, DailyLog.user_id == user_id).first()
    prev_surplus = prev_log.surplus if prev_log else 0

    adjusted_surplus = surplus + prev_surplus

    # 🧠 Decision
    decision = decide_action(
        adjusted_surplus,
        data["energy"],
        data["steps"],
        data.get("activity_type", "none")
    )

    # 🧠 Intelligence
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

    # 💪 Workout
    workout_plan = get_workout_plan(decision.get("level", "low"))

    # 🎭 Response
    message = decision.get("message_override") or generate_response(adjusted_surplus, decision)

    # 💾 Save
    existing = db.query(DailyLog).filter(DailyLog.date == today, DailyLog.user_id == user_id).first()

    if existing:
        existing.intake = intake
        existing.burn = total_burn
        existing.surplus = surplus
    else:
        db.add(DailyLog(
            date=today,
            user_id=user_id,
            intake=intake,
            burn=total_burn,
            surplus=surplus
        ))

    db.commit()

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
# 📊 LOGS
# -----------------------------
@router.get("/logs")
def get_logs(user_id: int, db: Session = Depends(get_db)):

    logs = db.query(DailyLog).filter(DailyLog.user_id == user_id).all()

    return [
        {
            "date": log.date,
            "intake": log.intake,
            "burn": log.burn,
            "surplus": log.surplus
        }
        for log in logs
    ]

@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()

    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "number": u.number,
            "weight": u.weight,
            "height": u.height,
            "age": u.age
        }
        for u in users
    ]

# -----------------------------
# 👤 PROFILE UPDATE
# -----------------------------
@router.put("/profile")
def update_profile(data: dict, db: Session = Depends(get_db)):
    user_id = data.get("user_id")
    if not user_id:
        return {"error": "user_id is required"}

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"error": "User not found"}

    if "weight" in data:
        user.weight = float(data["weight"])
    if "height" in data:
        user.height = float(data["height"])
    if "age" in data:
        user.age = int(data["age"])

    db.commit()
    db.refresh(user)

    return {
        "message": "Profile updated successfully",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "number": user.number,
            "weight": user.weight,
            "height": user.height,
            "age": user.age
        }
    }