import random

first_names = [
    "Juan", "Juann", "Jose", "Joose", "Josse", "Andres", "Andrees", "Abndres",
    "Emilio", "Rafael", "Carlos", "Miguel", "Migueel", "Manuel", "Mannuel",
    "Fernando", "Antonio", "Maria", "Mariia", "Isabel", "Carmen", "Rosa",
    "Roosa", "Teresa", "Terresa", "Lourdes", "Lourrdes", "Clarita", "Claritata",
    "Angela", "Angoola", "Dolores", "Beatriz"
]

last_names = [
    "Dela Cruz", "Santos", "Reyes", "Garcia", "Mendoza", "Torres", "Gonzales",
    "Fernandez", "Ramos", "Aquino", "Castro", "Domingo", "Villanueva",
    "Aguilar", "Bautista", "Salazar", "Navarro", "Rivera", "Velasco", "Ocampo"
]

surnames = [
    "Dela Cruz", "Reyes", "Santos", "Garcia", "Mendoza", "Torres", "Gonzales",
    "Ramos", "Fernandez", "Castro", "Domingo", "Aguilar", "Lopez", "Navarro",
    "Villanueva", "Cortez", "Alvarez", "Bautista", "Salazar", "Morales"
]

def generate_account_data():
    first_name = random.choice(first_names)
    last_name = random.choice(last_names)
    random_surname = random.choice(surnames)
    random_digit = random.randint(100, 999)

    username = f"{first_name}{random_digit}".lower()
    password = "boktitelo1".lower()
    email = f"{first_name}{last_name}@gmail.com".replace(" ", "").lower()

    month = random.randint(10, 12)
    day = random.randint(20, 29)
    year = random.randint(1990, 2001)

    return {
        "user_id": username,
        "user_password": password,
        "email": email,
        "first_name": first_name.lower(),
        "last_name": last_name.lower(),
        "birth_dt": f"{year}-{month:02d}-{day:02d}",
        "question_code": 1,
        'ign': f"666.{year}.{random_digit}",
        "question_answer": random_surname.lower(),
    }

