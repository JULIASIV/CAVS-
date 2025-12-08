#!/usr/bin/env python3

# Train LBPH face recognizer.
# Dataset folder structure (example):
#  dataset/
#     First_Last_ID/
#        img1.jpg
#        img2.jpg
import os
import cv2
import json
import numpy as np
from datetime import datetime

# -----------------------------
# CONFIG
# -----------------------------
DATASET_DIR = r"C:\Users\j\Desktop\git tutor\student_attendace_system\dataset"
MODEL_PATH = r"C:\Users\j\Desktop\git tutor\student_attendace_system\models\face_recognizer.yml"
LABELS_PATH = r"C:\Users\j\Desktop\git tutor\student_attendace_system\models\labels.json"

# Create model folder if not exists
os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)

# Haar cascade for face detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

# CLAHE for contrast improvement
clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))

# -----------------------------
# LOAD IMAGES
# -----------------------------
faces = []
labels = []
label_dict = {}

print("[train] scanning dataset folder:", DATASET_DIR)

label_id = 0

for person in os.listdir(DATASET_DIR):
    folder_path = os.path.join(DATASET_DIR, person)

    if not os.path.isdir(folder_path):
        continue

    print(f"[train] scanning folder: {person}")
    label_dict[label_id] = person

    found_image = False

    for entry in os.scandir(folder_path):
        if entry.is_file() and entry.name.lower().endswith((".jpg", ".png", ".jpeg")):

            img_path = entry.path
            img = cv2.imread(img_path)

            if img is None:
                print("[train] unreadable image:", img_path)
                continue

            gray_full = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

            # detect faces and pick largest
            dets = face_cascade.detectMultiScale(gray_full, scaleFactor=1.1, minNeighbors=5, minSize=(50,50))
            if len(dets) == 0:
                print("[train] no face detected in:", img_path)
                continue

            # choose largest face
            x,y,w,h = max(dets, key=lambda r: r[2]*r[3])
            face = gray_full[y:y+h, x:x+w]
            face = clahe.apply(face)
            face = cv2.resize(face, (150,150))

            # add original
            faces.append(face)
            labels.append(label_id)
            found_image = True

            # augmentation: horizontal flip
            faces.append(cv2.flip(face, 1))
            labels.append(label_id)

    if not found_image:
        print(f"[train] no images found in {person}")

    label_id += 1

print(f"[train] total samples: {len(faces)}")
print(f"[train] labels found: {label_dict}")

# -----------------------------
# TRAIN MODEL
# -----------------------------
if len(faces) == 0:
    print("[train] ERROR: No training images found!")
    exit()

recognizer = cv2.face.LBPHFaceRecognizer_create()
recognizer.train(faces, np.array(labels))

# Save model & labels
recognizer.save(MODEL_PATH)
with open(LABELS_PATH, "w") as f:
    json.dump(label_dict, f)

# Compute basic confidence stats on training set
confidences = []
for i, face in enumerate(faces):
    lbl, conf = recognizer.predict(face)
    confidences.append(conf)

if len(confidences) > 0:
    mean_conf = float(np.mean(confidences))
    std_conf = float(np.std(confidences))
    threshold = mean_conf + 1.5 * std_conf
    try:
        with open(os.path.join(os.path.dirname(MODEL_PATH), 'threshold.json'), 'w', encoding='utf-8') as tf:
            json.dump({'mean': mean_conf, 'std': std_conf, 'threshold': threshold}, tf, indent=2)
        print(f"[train] Saved threshold.json (threshold={threshold:.2f})")
    except Exception as e:
        print("[train] Could not save threshold.json:", e)

print("[train] model successfully saved!")
print("[train] training completed at", datetime.now())
























# import os
# import cv2
# import numpy as np
# import json

# # Paths
# dataset_path = "./dataset"
# model_path = "./models/face_recognizer.yml"
# labels_json_path = "./models/labels.json"
# os.makedirs("./models", exist_ok=True)

# # Load DNN face detector (OpenCV SSD)
# prototxt = "models/deploy.prototxt"
# caffemodel = "models/res10_300x300_ssd_iter_140000.caffemodel"

# if not os.path.exists(prototxt) or not os.path.exists(caffemodel):
#     raise FileNotFoundError("Please download deploy.prototxt and res10_300x300_ssd_iter_140000.caffemodel in models/")

# face_net = cv2.dnn.readNetFromCaffe(prototxt, caffemodel)

# faces = []
# labels = []
# label_dict = {}
# current_label = 0

# print("➡ Processing dataset...")

# for folder_name in os.listdir(dataset_path):
#     folder_path = os.path.join(dataset_path, folder_name)
#     if not os.path.isdir(folder_path):
#         continue

#     parts = folder_name.split("_")
#     if len(parts) >= 3:
#         # Name + Surname + ID
#         name_id = parts[0] + " " + parts[1] + " " + parts[2]
#         label_dict[str(current_label)] = name_id
#     else:
#         print(f"⚠ Skipping folder (invalid format): {folder_name}")
#         continue

#     # Process each image in the folder
#     for img_name in os.listdir(folder_path):
#         img_path = os.path.join(folder_path, img_name)
#         img = cv2.imread(img_path)
#         if img is None:
#             continue

#         h, w = img.shape[:2]
#         blob = cv2.dnn.blobFromImage(cv2.resize(img, (300, 300)), 1.0, (300, 300),
#                                      (104.0, 177.0, 123.0))
#         face_net.setInput(blob)
#         detections = face_net.forward()

#         for i in range(0, detections.shape[2]):
#             confidence = detections[0, 0, i, 2]
#             if confidence < 0.5:
#                 continue

#             box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
#             (x1, y1, x2, y2) = box.astype("int")

#             # Crop face with padding
#             padding = 10
#             x1 = max(0, x1 - padding)
#             y1 = max(0, y1 - padding)
#             x2 = min(w, x2 + padding)
#             y2 = min(h, y2 + padding)

#             face_roi = img[y1:y2, x1:x2]
#             gray = cv2.cvtColor(face_roi, cv2.COLOR_BGR2GRAY)
#             gray = cv2.equalizeHist(gray)
#             gray = cv2.resize(gray, (100, 100))

#             faces.append(gray)
#             labels.append(current_label)

#     current_label += 1

# if len(faces) == 0:
#     raise RuntimeError("⚠ No faces found in dataset. Make sure your dataset contains face images!")

# faces = np.array(faces)
# labels = np.array(labels)

# # Train LBPH recognizer
# print("➡ Training LBPH model...")
# recognizer = cv2.face.LBPHFaceRecognizer_create()
# recognizer.train(faces, labels)
# recognizer.save(model_path)

# # Save JSON labels
# with open(labels_json_path, "w") as f:
#     json.dump(label_dict, f, indent=4)

# print("✅ Training complete!")
# print(f"Total students trained: {len(label_dict)}")












# import cv2
# import os

# # List of students
# students = [
#     {"name": "Sosina_Anteneh_35444"},
#     {"name": "Melkamu_Wako_35402"},
#     {"name": "Liya_Tamru_354001"},
#     {"name": "Arsema_Ayelel_35400"}
# ]

# dataset_path = "./dataset"
# os.makedirs(dataset_path, exist_ok=True)

# # Load Haar cascade
# face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

# for student in students:
#     folder = os.path.join(dataset_path, student["name"])
#     os.makedirs(folder, exist_ok=True)
#     print(f"\n➡ Capturing faces for {student['name']} ... Press 'c' to capture, 'q' to skip.")

#     cap = cv2.VideoCapture(0)
#     count = 0

#     while True:
#         ret, frame = cap.read()
#         if not ret:
#             print("Failed to grab frame")
#             break

#         gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
#         faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

#         for (x, y, w, h) in faces:
#             cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

#         cv2.imshow(f"Capture - {student['name']}", frame)
#         k = cv2.waitKey(1) & 0xFF

#         if k == ord("c") and len(faces) > 0:
#             x, y, w, h = faces[0]
#             face_img = gray[y:y+h, x:x+w]
#             face_img = cv2.resize(face_img, (100, 100))
#             cv2.imwrite(f"{folder}/face_{count}.jpg", face_img)
#             count += 1
#             print(f"Captured {count} face(s)")

#         elif k == ord("q"):
#             break

#         if count >= 10:  # Capture 10 faces per student
#             break

#     cap.release()
#     cv2.destroyAllWindows()

