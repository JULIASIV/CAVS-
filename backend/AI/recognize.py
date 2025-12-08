import cv2
import json
import os
from datetime import datetime

# -----------------------------
# CONFIG
# -----------------------------
import os

# Prefer repository-local paths. Keep them relative so this project works across machines.
REPO_ROOT = os.path.dirname(__file__)
MODEL_PATH = os.path.join(REPO_ROOT, "models", "face_recognizer.yml")
LABELS_PATH = os.path.join(REPO_ROOT, "models", "labels.json")
CONFIDENCE_THRESHOLD = 90  # Lower = more accurate
FACE_SIZE = (150, 150)     # Resize faces for recognition

# -----------------------------
# LOAD LABELS
# -----------------------------
def detect(stop_event, result_container):
    # Validate model and label files exist and give helpful errors
    if not os.path.exists(LABELS_PATH):
        print(f"[recognize] ERROR: labels file not found at {LABELS_PATH}")
        print("Create './models/labels.json' or update LABELS_PATH in recognize.py")
        stop_event.set()
        return

    with open(LABELS_PATH, "r") as f:
        label_dict = json.load(f)

    # Reverse dictionary {id: name}
    inv_label_dict = {int(k): v for k, v in label_dict.items()}

    # -----------------------------
    # LOAD MODEL
    # -----------------------------
    # Ensure OpenCV face module is available (needs opencv-contrib-python)
    if not hasattr(cv2, 'face'):
        print("[recognize] ERROR: cv2.face module not found. Install 'opencv-contrib-python' not just 'opencv-python'.")
        stop_event.set()
        return

    if not os.path.exists(MODEL_PATH):
        print(f"[recognize] ERROR: model file not found at {MODEL_PATH}")
        print("Train a recognizer or copy a trained model to './models/face_recognizer.yml'")
        stop_event.set()
        return

    recognizer = cv2.face.LBPHFaceRecognizer_create()
    try:
        recognizer.read(MODEL_PATH)
    except Exception as exc:
        print(f"[recognize] ERROR reading model: {exc}")
        stop_event.set()
        return

    # -----------------------------
    # LOAD HAAR CASCADE
    # -----------------------------
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

    # -----------------------------
    # START WEBCAM
    # -----------------------------
    cap = cv2.VideoCapture(0)
    print("[recognize] Webcam started...")

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

