import random
import re

# -----------------------------
# 🍛 FOOD DATABASE (Calorie Ranges per serving)
# -----------------------------
# Standard serving sizes (approx): 
# Rice: 150g, Idli: 50g, Dosa: 60g, Bread: 30g
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
    "pomegranate": (120, 180),

    # 🍨 Desserts
    "brownie": (250, 350),
    "gulab jamun": (130, 180),
    "laddu": (150, 220),

    # 🧃 Drinks
    "coffee": (70, 120),
    "tea": (50, 100),
    "juice": (100, 160),
}

# Calories per gram approximation
CAL_PER_GRAM = {
    "rice": 1.3,
    "chicken": 2.2,
    "dal": 1.1,
    "mutton": 2.5,
    "veg": 0.8,
    "idli": 1.5,
    "dosa": 2.5,
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
# 🔢 EXTRACT QUANTITY OR WEIGHT
# -----------------------------
def parse_volume(text: str, food: str):
    """
    Looks for grams or plain quantity
    Example: '100 grams rice' or '2 idli'
    """
    # Look for [number] grams [food] or [number]g [food]
    gram_match = re.search(fr"(\d+)\s*(grams|gram|g)\s+{food}", text)
    if gram_match:
        return {"value": int(gram_match.group(1)), "type": "weight"}
    
    # Look for [food] [number] grams
    gram_match_rev = re.search(fr"{food}\s+(\d+)\s*(grams|gram|g)", text)
    if gram_match_rev:
        return {"value": int(gram_match_rev.group(1)), "type": "weight"}

    # Fallback to plain quantity
    words = text.split()
    for i, word in enumerate(words):
        if word == food.split()[0]:
            if i > 0 and words[i-1].isdigit():
                return {"value": int(words[i-1]), "type": "qty"}
    
    return {"value": 1, "type": "qty"}


# -----------------------------
# 🔥 MAIN FUNCTION
# -----------------------------
def estimate_calories(food_text: str):
    text = normalize_text(food_text)
    total_calories = 0
    matched_items = []

    for food, (low, high) in FOOD_DB.items():
        if food in text:
            volume = parse_volume(text, food)
            
            if volume["type"] == "weight":
                # Calculation based on grams
                multiplier = CAL_PER_GRAM.get(food, 1.5) # Default 1.5 cal/g
                calories = int(volume["value"] * multiplier)
                qty_label = f"{volume['value']}g"
            else:
                # Calculation based on serving quantity
                calories = random.randint(low, high) * volume["value"]
                qty_label = str(volume["value"])

            total_calories += calories
            matched_items.append({
                "item": food,
                "qty": qty_label,
                "calories": calories
            })

    # fallback if nothing matched
    if total_calories == 0:
        words = text.split()
        total_calories = len(words) * 80

    return {
        "total_calories": total_calories,
        "breakdown": matched_items
    }