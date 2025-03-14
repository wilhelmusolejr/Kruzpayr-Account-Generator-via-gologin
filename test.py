import pyautogui
import time

def click_with_effect(x, y):
    # Draw a red circle to indicate a click effect
    pyautogui.click(x, y)  # Click at the position
    pyautogui.moveTo(x, y, duration=0.1)  # Simulate hover
    pyautogui.click(x, y)  # Another click to reinforce effect
    print(f"Clicked at ({x}, {y}) with effect")

# Example: Click at 500, 500 with effect
click_with_effect(500, 500)