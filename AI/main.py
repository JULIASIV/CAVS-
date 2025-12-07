import time
from attendance_session import start_session, stop_session

start_session()

# simulate teacher keeping session open
close = input()
if close:
    print("✅ Detected students:", stop_session())


