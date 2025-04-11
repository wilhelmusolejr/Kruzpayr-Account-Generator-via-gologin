import random

first_names = [
    "Juan", "Juann", "Jose", "Joose", "Josse", "Andres", "Andrees", "Abndres",
    "Emilio", "Rafael", "Carlos", "Miguel", "Migueel", "Manuel", "Mannuel",
    "Fernando", "Antonio", "Maria", "Mariia", "Isabel", "Carmen", "Rosa",
    "Roosa", "Teresa", "Terresa", "Lourdes", "Lourrdes", "Clarita", "Claritata",
    "Angela", "Angoola", "Dolores", "Beatriz"
]

demon_names = [
    "Azazel", "Belial", "Lilith", "Asmodeus", "Baal", 
    "Beelzebub", "Leviathan", "Mammon", "Astaroth", "Abaddon", 
    "Baphomet", "Moloch", "Dagon", "Nyx", "Orobas", 
    "Zagan", "Andras", "Pazuzu", "Forneus", "Gusion"
]

last_names = [
    "DelaCruz", "Santos", "Reyes", "Garcia", "Mendoza", "Torres", "Gonzales",
    "Fernandez", "Ramos", "Aquino", "Castro", "Domingo", "Villanueva",
    "Aguilar", "Bautista", "Salazar", "Navarro", "Rivera", "Velasco", "Ocampo"
]

surnames = [
    "Delakruz", "Reyes", "Santos", "Garcia", "Mendoza", "Torres", "Gonzales",
    "Ramos", "Fernandez", "Castro", "Domingo", "Aguilar", "Lopez", "Navarro",
    "Villanueva", "Cortez", "Alvarez", "Bautista", "Salazar", "Morales"
]

def generate_account_data():
    first_name = random.choice(first_names)
    last_name = random.choice(last_names)
    random_surname = random.choice(surnames)
    random_digit = random.randint(100, 999)
    
    listUserName = []
    listUserName.append(f"{first_name}{random_digit}")
    listUserName.append(f"{demon_names }{random_digit}")
    listUserName.append(f"{random_digit}{demon_names}")
    listUserName.append(f"{last_names}{random_digit}")
    listUserName.append(f"{surnames}{random_digit}")
    
    digit1 = random.randint(1, 9)
    digit2 = random.randint(100, 999)

    username = random.choice(listUserName).lower()
    password = f"${digit2}{first_name}{digit1}".lower()
    email = f"{first_name}{last_name}@gmail.com".replace(" ", "").lower()

    month = random.randint(10, 12)
    day = random.randint(20, 29)
    year = random.randint(1990, 2001)
    
    random_year = random.randint(1000, 9999)

    return {
        "user_id": username,
        "user_password": password,
        "email": email,
        "first_name": first_name.lower(),
        "last_name": last_name.lower(),
        "birth_dt": f"{year}-{month:02d}-{day:02d}",
        "question_code": 1,
        'ign': f"666.{random_year}.{random_digit}",
        "question_answer": random_surname.lower(),
    }

