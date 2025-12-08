from threading import Thread, Event
import time

# Prefer improved detector when available
try:
    from recognize import detect
    _USING_IMPROVED = True
except Exception:
    from recognize import detect
    _USING_IMPROVED = False

stop_event = Event()
result_container = []
thread = None

def start_session():
    global thread, result_container

    result_container.clear()
    stop_event.clear()

    thread = Thread(
        target=detect,
        args=(stop_event, result_container),
        daemon=True
    )
    thread.start()

    print("✅ Attendance session started")


def stop_session():
    stop_event.set()
    print("🛑 Attendance session stopping...")
    time.sleep(2)
    return result_container
