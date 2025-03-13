import asyncio
import httpx
import pandas as pd
import random
import datetime

from account_info_gen import generate_account_data

async def get_terms_state():
    """Fetches the terms state needed for registration."""
    url = "https://api.onstove.com/sim/v1/crossfire/save/terms"
    payload = {
        "type": "SIGN_UP",
        "service_id": "10",
        "viewarea_id": "STC_REWE",
        "game_service_id": "CF_PH",
        "game_viewarea_id": "SVC_AG",
        "gds_info": {
            "is_default": False,
            "nation": "PH",
            "regulation": "ETC",
            "timezone": "Asia/Manila",
            "utc_offset": 480,
            "lang": "en",
            "ip": ""
        }
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload)
            response_data = response.json()
            return response_data.get("value", {}).get("state")
        except httpx.HTTPStatusError as e:
            print("HTTP error:", e.response.text)
        except Exception as e:
            print("Error fetching state:", str(e))

async def read_csv(file_path):
    """Reads the CSV file and returns a list of dictionaries."""
    try:
        df = pd.read_csv(file_path)
        return df.to_dict(orient="records")  # Convert DataFrame to list of dictionaries
    except FileNotFoundError:
        return []  # Return empty list if file does not exist

async def write_csv(file_path, data):
    """Writes a list of dictionaries to a CSV file."""
    df = pd.DataFrame(data)
    df.to_csv(file_path, index=False)

async def register_user(account_data):  
    """Registers a user and saves their details if successful."""
    url = "https://api.onstove.com/sim/v1/crossfire/register"
    state = await get_terms_state()

    payload = {
        "state": state,
        **account_data
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload, headers={"Content-Type": "application/json"})
            response_data = response.json()

            if response_data.get("message") == "OK":
                print("✅ Registration Successful")
                print("-- username:", account_data["user_id"])
                print("-- password:", account_data["user_password"])

                # Generate registration date
                formatted_date = datetime.datetime.now().strftime("%B %d, %Y")

                # Generate IGN
                year = random.randint(1900, 2024)
                random_digit = random.randint(100, 999)

                # Read existing accounts
                accounts = await read_csv("accounts_database.csv")

                # Append new account details
                accounts.append({
                    "USERNAME": account_data["user_id"],
                    "PASSWORD": account_data["user_password"],
                    "IGN": account_data["ign"],
                    "REGISTER_DATE": formatted_date,
                    "ECOIN": "undefined",
                    "FIRSTNAME": account_data["first_name"],
                    "LASTNAME": account_data["last_name"],
                    "EMAIL": account_data["email"],
                    "Q_ANSWER": account_data["question_answer"],
                    "BIRTHDATE": account_data["birth_dt"],
                    "ACCESS_TOKEN": response_data["value"]["access_token"],
                    "REFRESH_TOKEN": response_data["value"]["refresh_token"],
                    "NICKNAME": response_data["value"]["nickname"]
                })

                # Write updated data to CSV
                await write_csv("accounts_database.csv", accounts)

        except httpx.HTTPStatusError as e:
            print("❌ Registration Failed:", e.response.text)
        except Exception as e:
            print("❌ Registration Failed:", str(e))
