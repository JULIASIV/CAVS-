import time
import cv2
import numpy as np
import json

# def detect():
        
#     # Load model and labels
#     recognizer = cv2.face.LBPHFaceRecognizer_create()
#     recognizer.read("./models/face_recognizer.yml")

#     with open("./models/labels.json", "r") as f:
#         labels = json.load(f)

#     face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

#     cap = cv2.VideoCapture(0)
#     temp_stud_id = set()
#     while True:
#         ret, frame = cap.read()
#         if not ret:
#             break

#         gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
#         faces_detected = face_cascade.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=5)

#         for (x, y, w, h) in faces_detected:
#             face_roi = gray[y:y+h, x:x+w]
#             label, confidence = recognizer.predict(face_roi)
#             student_id = labels[str(label)]
#             print(student_id)
#             cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
#             cv2.putText(frame, f"ID: {student_id}", (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0,255,0), 2)
#             temp_stud_id.add(student_id)
#         cv2.imshow("Attendance", frame)
#         if cv2.waitKey(1) & 0xFF == ord("q"):
#             break
#     cap.release()
#     cv2.destroyAllWindows()

# detect()




def detect(stop_event, result_container):
    recognizer = cv2.face.LBPHFaceRecognizer_create()
    recognizer.read("./models/face_recognizer.yml")

    with open("./models/labels.json") as f:
        labels = json.load(f)

    # load threshold if available (LBPH: lower confidence = better match)
    threshold_path = "./models/threshold.json"
    confidence_threshold = 60.0
    if os.path.exists(threshold_path):
        try:
            with open(threshold_path, 'r', encoding='utf-8') as tf:
                th = json.load(tf)
                # accept either a dict or numeric
                if isinstance(th, dict) and 'threshold' in th:
                    confidence_threshold = float(th['threshold'])
                elif isinstance(th, (int, float)):
                    confidence_threshold = float(th)
        except Exception:
            pass

    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )

    cap = cv2.VideoCapture(0)
    detected_students = set()

    while not stop_event.is_set():
        ret, frame = cap.read()
        if not ret:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.2, 5)

        for (x, y, w, h) in faces:
            face_roi = gray[y:y+h, x:x+w]
            label, confidence = recognizer.predict(face_roi)
            # LBPH: lower confidence value indicates better match
            accepted = False
            try:
                conf_val = float(confidence)
            except Exception:
                conf_val = 9999.0

            if conf_val <= confidence_threshold:
                # retrieve label entry, normalize to a hashable key
                student_entry = labels.get(str(label))
                if isinstance(student_entry, dict):
                    # prefer explicit id, then name
                    student_key = student_entry.get('id') or student_entry.get('name') or str(label)
                    display_name = student_entry.get('name') or str(student_key)
                else:
                    student_key = str(student_entry)
                    display_name = student_key

                if student_key:
                    detected_students.add(student_key)
                    accepted = True

                cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
                cv2.putText(frame, f"{display_name} ({conf_val:.1f})", (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0,255,0), 2)
                if accepted:
                    print(f"Registered: {student_key} (label={label}, conf={conf_val:.2f})")
                else:
                    print(f"Low confidence ({conf_val:.2f}) - not registered")
        cv2.imshow("Attendance", frame)
        
        # optional manual stop
        if cv2.waitKey(1) & 0xFF == ord("q"):
            stop_event.set()

    cap.release()
    cv2.destroyAllWindows()

    # ✅ store result for backend
    result_container.extend(list(detected_students))
