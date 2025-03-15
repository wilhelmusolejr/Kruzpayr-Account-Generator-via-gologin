import subprocess
import time
from pynput import mouse
import pyautogui
import pandas as pd

import asyncio
import httpx
import pandas as pd
import random
import datetime

from account_info_gen import generate_account_data
from playground import register_user

def run_cf_client():
    print("Running crossfire...")
    
    game_path = r"C:\Program Files (x86)\Crossfire PH\patcher_cf2.exe"
    working_directory = r"C:\Program Files (x86)\Crossfire PH"

    # Run with correct working directory
    subprocess.Popen(game_path, cwd=working_directory, shell=True)

    print("Wait for 1 minute")
    time.sleep(60)
    
def login(data):
    print("Logging in...")
    usernameInput = [905, 647]
    pyautogui.moveTo(usernameInput[0],usernameInput[1], duration=0.5)  # Move smoothly to the target
    pyautogui.click()

    time.sleep(1)

    usernameInput = [905, 647]
    pyautogui.moveTo(usernameInput[0],usernameInput[1], duration=0.5)  # Move smoothly to the target
    pyautogui.click()
    print("Typing username")
    pyautogui.write(data['username'], interval=0.05)

    time.sleep(1)

    passwordInput = [905, 697]
    pyautogui.moveTo(passwordInput[0],passwordInput[1], duration=0.5)  # Move smoothly to the target
    pyautogui.click()
    print("Typing password")
    pyautogui.write(data['password'], interval=0.05)

    time.sleep(1)

    loginBtn = [940, 760]
    pyautogui.moveTo(loginBtn[0],loginBtn[1], duration=0.5)  # Move smoothly to the target
    pyautogui.click()
    print("Logged in")

    time.sleep(10)

def ignSetUp(data):
    print("Setting up ign...")
    ignSetUpInput = [877, 579]
    pyautogui.moveTo(ignSetUpInput[0],ignSetUpInput[1], duration=0.5)  # Move smoothly to the target
    pyautogui.click()
    pyautogui.write(data['ign'], interval=0.05)

    time.sleep(2)

    ignConfirmBtn = [1100, 577]
    pyautogui.moveTo(ignConfirmBtn[0],ignConfirmBtn[1], duration=0.5)  # Move smoothly to the target
    pyautogui.click()

    time.sleep(2)

    ignOkayBtn = [920, 660]
    pyautogui.moveTo(ignOkayBtn[0],ignOkayBtn[1], duration=0.5)  # Move smoothly to the target
    pyautogui.click()

    time.sleep(2)

def buyCharacter():
    print("Buying char...")
    buyCharBtn = [950, 780]
    pyautogui.moveTo(buyCharBtn[0],buyCharBtn[1], duration=0.5)  # Move smoothly to the target
    pyautogui.click()

    time.sleep(2)

    confirmBtn = [950, 630]
    pyautogui.moveTo(confirmBtn[0],confirmBtn[1], duration=0.5)  # Move smoothly to the target
    pyautogui.click()

    time.sleep(2)

def luckyRaffle():
    print("Opening lucky raffle box")
    closeFloatingOverlay = [846, 325]
    pyautogui.moveTo(closeFloatingOverlay[0],closeFloatingOverlay[1], duration=0.5)  # Move smoothly to the target
    pyautogui.click()

    time.sleep(1)

    luckdrawBtn = [846, 325]
    pyautogui.moveTo(luckdrawBtn[0],luckdrawBtn[1], duration=0.5)  # Move smoothly to the target
    pyautogui.click()

    time.sleep(2)

    print("Spinning raffle")
    raffleBtn = [912, 770]
    pyautogui.moveTo(raffleBtn[0],raffleBtn[1], duration=0.5)  # Move smoothly to the target
    pyautogui.click()

    time.sleep(5)

    print("Close raffle")
    closeLuckDraw = [1240, 399]
    pyautogui.moveTo(closeLuckDraw[0],closeLuckDraw[1], duration=0.5)  # Move smoothly to the target
    pyautogui.click()

    time.sleep(2)

def close_cf_client():
    print("Closing client...")
    subprocess.run(["taskkill", "/F", "/IM", "crossfire.exe"], shell=True)
    
def process(data):
    run_cf_client()
    login(data)
    ignSetUp(data)
    buyCharacter()
    luckyRaffle()
    close_cf_client()


runOnce = True

while runOnce:
    account_info = generate_account_data()
    result = asyncio.run(register_user(account_info))

    if result:
        data = {
            "username": account_info["user_id"],
            'password': account_info["user_password"],
            "ign": account_info["ign"]
        }

        process(data)
        time.sleep(30)# Wait for 30 seconds



# usernameInput = [905, 647]
# passwordInput = [905, 697]
# loginBtn = [940, 760]
# ----------
# ignSetUpInput = [877, 579]
# ignConfirmBtn = [1100, 577]
# ignOkayBtn = [918, 504]
# ----------
# buyCharBtn = [962, 746]
# confirmBtn = [959, 630]
# ----------
# closeFloatingOverlay = [846, 325]
# luckdrawBtn = [846, 325]
# raffleBtn = [912, 770]
# closeLuckDraw = [1240, 399]
# closeClientBtn = [1337, 252]