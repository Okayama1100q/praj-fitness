from services.response_engine import generate_response

decision = {
    "level": "medium",
    "walk": {"steps": 3000},
    "workout": {"duration": 20}
}

result = generate_response(500, decision)

print(result)