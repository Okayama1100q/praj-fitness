from services.praj_intelligence import apply_intelligence

# Mock decision (what decision_engine normally returns)
decision = {
    "level": "high",
    "walk": {"steps": 4000},
    "workout": {"duration": 30}
}

# -----------------------------
# TEST CASE 1: Already active
# -----------------------------
result = apply_intelligence(
    decision,
    surplus=300,
    prev_surplus=0,
    energy="normal",
    activity_type="medium",
    duration=60
)

print("Test 1:", result)


# -----------------------------
# TEST CASE 2: Yesterday heavy
# -----------------------------
result = apply_intelligence(
    decision,
    surplus=200,
    prev_surplus=400,
    energy="normal",
    activity_type="none",
    duration=0
)

print("Test 2:", result)


# -----------------------------
# TEST CASE 3: Tired + high surplus
# -----------------------------
result = apply_intelligence(
    decision,
    surplus=600,
    prev_surplus=0,
    energy="tired",
    activity_type="none",
    duration=0
)

print("Test 3:", result)