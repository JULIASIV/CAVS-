import cv2
import json
import os
from datetime import datetime

# -----------------------------
# CONFIG
# -----------------------------
MODEL_PATH = r"C:\Users\j\Desktop\git tutor\student_attendace_system\models\face_recognizer.yml"
LABELS_PATH = r"C:\Users\j\Desktop\git tutor\student_attendace_system\models\labels.json"
CONFIDENCE_THRESHOLD = 90  # Lower = more accurate
FACE_SIZE = (150, 150)     # Resize faces for recognition

# -----------------------------
# LOAD LABELS
# -----------------------------
def detect(stop_event, result_container):
    with open(LABELS_PATH, "r") as f:
        label_dict = json.load(f)

    # Reverse dictionary {id: name}
    inv_label_dict = {int(k): v for k, v in label_dict.items()}

    # -----------------------------
    # LOAD MODEL
    # -----------------------------
    recognizer = cv2.face.LBPHFaceRecognizer_create()
    recognizer.read(MODEL_PATH)

    # -----------------------------
    # LOAD HAAR CASCADE
    # -----------------------------
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

    # -----------------------------
    # START WEBCAM
    # -----------------------------
    cap = cv2.VideoCapture(0)
    print("[recognize] Webcam started... press Q to exit")

    # Keep track of recognized students
    recognized_names = set()

    # Optional: attendance log file
    attendance_file = "attendance_log.csv"
    if not os.path.exists(attendance_file):
        with open(attendance_file, "w") as f:
            f.write("Name,Time\n")

    while not stop_event.is_set():
        ret, frame = cap.read()
        if not ret:
            print("[recognize] Camera error")
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)

        for (x, y, w, h) in faces:
            # Resize face ROI for consistent prediction
            face_roi = cv2.resize(gray[y:y+h, x:x+w], FACE_SIZE)

            pred, confidence = recognizer.predict(face_roi)

            # Determine name
            if confidence < CONFIDENCE_THRESHOLD:
                name = inv_label_dict.get(pred, "Unknown")
            else:
                name = "Unknown"

            # Track recognized students
            if name != "Unknown" and name not in recognized_names:
                recognized_names.add(name)
                timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                print(f"[Attendance] {name} recognized at {timestamp}")

                # Log attendance to CSV
                with open(attendance_file, "a") as f:
                    f.write(f"{name},{timestamp}\n")

            # Draw rectangle and label
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
            cv2.putText(frame, name, (x, y - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        cv2.imshow("Face Recognition", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            print("[recognize] Exiting...")
            break

    cap.release()
    cv2.destroyAllWindows()
    result_container.extend(list(recognized_names))

