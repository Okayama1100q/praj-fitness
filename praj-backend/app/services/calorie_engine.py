import random

# -----------------------------
# 🍛 FOOD DATABASE (Calorie Ranges per serving)
# -----------------------------
FOOD_DB = {
    # 🍚 Rice Meals
    "rice": (180, 220),
    "sambar rice": (220, 300),
    "rasam rice": (150, 220),
    "curd rice": (200, 280),
    "veg biryani": (280, 380),

    # 🍽️ Tiffin
    "idli": (60, 80),
    "dosa": (100, 180),
    "ghee dosa": (180, 300),
    "masala dosa": (220, 350),
    "adai": (150, 250),
    "pongal": (250, 350),

    # 🫓 Breads
    "chapati": (100, 140),
    "roti": (100, 140),
    "bread": (70, 100),

    # 🍛 Curries / Sides
    "sambar": (80, 120),
    "rasam": (40, 70),
    "curd": (80, 120),
    "chutney": (60, 100),
    "kuruma": (120, 200),
    "channa masala": (180, 260),

    # 🍟 Indian Snacks
    "samosa": (220, 300),
    "pakoda": (180, 260),
    "bajji": (180, 260),
    "murukku": (150, 250),
    "thattai": (150, 250),
    "mixture": (200, 300),

    # 🥤 Packaged Snacks
    "lays": (150, 300),
    "chips": (150, 300),
    "kurkure": (150, 300),
    "biscuits": (120, 250),

    # 🍜 Instant / Fast Food
    "noodles": (300, 450),
    "maggi": (300, 400),
    "pasta": (250, 400),

    # 🍎 Fruits
    "apple": (80, 100),
    "banana": (90, 120),
    "orange": (60, 80),
    "mango": (120, 180),
    "grapes": (70, 100),
    "watermelon": (40, 60),

    # 🍨 Desserts
    "brownie": (250, 350),
    "gulab jamun": (130, 180),
    "laddu": (150, 220),

    # 🧃 Drinks
    "coffee": (70, 120),
    "tea": (50, 100),
    "juice": (100, 160),
}


# -----------------------------
# 🔄 ALIASES (Normalize messy input)
# -----------------------------
ALIASES = {
    "chapathi": "chapati",
    "rotti": "roti",
    "biryani": "veg biryani",
    "lays chips": "lays",
    "chips packet": "chips",
    "maggi noodles": "maggi",
}


# -----------------------------
# 🧠 NORMALIZE INPUT
# -----------------------------
def normalize_text(text: str):
    text = text.lower()

    for key, value in ALIASES.items():
        if key in text:
            text = text.replace(key, value)

    return text


# -----------------------------
# 🔢 EXTRACT QUANTITY
# -----------------------------
def extract_quantity(words, index):
    if index > 0 and words[index - 1].isdigit():
        return int(words[index - 1])
    return 1


# -----------------------------
# 🔥 MAIN FUNCTION
# -----------------------------
def estimate_calories(food_text: str):
    text = normalize_text(food_text)
    words = text.split()

    total_calories = 0
    matched_items = []

    for food, (low, high) in FOOD_DB.items():
        if food in text:
            qty = 1

            # find quantity before food word
            food_key = food.split()[0]

            for i, word in enumerate(words):
                if word == food_key:
                    qty = extract_quantity(words, i)

            calories = random.randint(low, high) * qty

            total_calories += calories

            matched_items.append({
                "item": food,
                "qty": qty,
                "calories": calories
            })

    # fallback if nothing matched
    if total_calories == 0:
        total_calories = len(words) * 80

    return {
        "total_calories": total_calories,
        "breakdown": matched_items
    }