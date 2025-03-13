from pynput import mouse

def on_click(x, y, button, pressed):
    if pressed:  # Detect only when the button is pressed (not released)
        print(f"Mouse clicked at ({x}, {y})")

# Start listening for mouse clicks
with mouse.Listener(on_click=on_click) as listener:
    listener.join()