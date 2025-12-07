# attendance_system.py
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
            if confidence > 80:
                student_id = labels[str(label)]
                if student_id:
                    detected_students.add(student_id)
                cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
                cv2.putText(frame, f"ID: {student_id}", (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0,255,0), 2)
        cv2.imshow("Attendance", frame)

        # optional manual stop
        if cv2.waitKey(1) & 0xFF == ord("q"):
            stop_event.set()

    cap.release()
    cv2.destroyAllWindows()

    # ✅ store result for backend
    result_container.extend(list(detected_students))
