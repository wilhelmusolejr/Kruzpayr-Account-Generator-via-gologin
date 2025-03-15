import requests

def sendMessage(MESSAGE):
    TOKEN = "7423490445:AAGN3zK7N97YsfEHzqY6aRuIjV5rwO0Ewf0"
    CHAT_ID = "1559668342"

    url = f"https://api.telegram.org/bot{TOKEN}/sendMessage"
    payload = {"chat_id": CHAT_ID, "text": MESSAGE}

    response = requests.post(url, json=payload)