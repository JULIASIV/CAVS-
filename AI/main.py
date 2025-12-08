import time
from attendance_session import start_session, stop_session

start_session()

# simulate teacher keeping session open
print("Press Enter to stop the attendance session (or type anything then Enter)")
close = input()
if close is not None:
    print("✅ Detected students:", stop_session())


