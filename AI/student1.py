import os
import cv2
import numpy as np
import json

# ----------------------------
# CONFIGURATION
# ----------------------------
dataset_path = "./student_attendace_system/dataset"
                # Folder containing student image folders
model_path = "./models/face_recognizer.yml"  # Where the trained model will be saved
face_size = (100, 100)                     # Resize all faces to 100x100

# ----------------------------
# PREPARE FOLDERS
# ----------------------------
os.makedirs("./models", exist_ok=True)

# ----------------------------
# LOAD FACE DETECTOR
# ----------------------------
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
if face_cascade.empty():
    print("Error loading face cascade!")
    exit()

# ----------------------------
# PREPARE DATA
# ----------------------------
faces = []
labels = []
label_dict = {}
current_label = 0

if not os.path.exists(dataset_path):
    print(f"Dataset folder not found: {dataset_path}")
    exit()

for student_folder in os.listdir(dataset_path):
    folder_path = os.path.join(dataset_path, student_folder)
    if not os.path.isdir(folder_path):
        continue

    # Assuming folder name format: Name_ID
    student_id = student_folder.split("_")[-1]
    label_dict[current_label] = student_id

    for img_name in os.listdir(folder_path):
        img_path = os.path.join(folder_path, img_name)
        img = cv2.imread(img_path)
        if img is None:
            print(f"Could not read image: {img_path}")
            continue

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        detected_faces = face_cascade.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=5)

        if len(detected_faces) == 0:
            print(f"No faces detected in: {img_path}")
            continue

        for (x, y, w, h) in detected_faces:
            face_roi = cv2.resize(gray[y:y+h, x:x+w], face_size)
            faces.append(face_roi)
            labels.append(current_label)

    current_label += 1

if len(faces) == 0:
    print("No faces found in the dataset. Cannot train model.")
    exit()

faces = np.array(faces)
labels = np.array(labels)

# ----------------------------
# TRAIN LBPH FACE RECOGNIZER
# ----------------------------
recognizer = cv2.face.LBPHFaceRecognizer_create()
recognizer.train(faces, labels)
recognizer.save(model_path)

# Save label mapping
with open("./models/labels.json", "w") as f:
    json.dump(label_dict, f)

print("✅ Training complete!")
print(f"Model saved at: {model_path}")
print(f"Labels mapping saved at: ./models/labels.json")
print(f"Total faces trained: {len(faces)}")
print(f"Total students: {len(label_dict)}")



import os

dataset_path = "./dataset"

for student_folder in os.listdir(dataset_path):
    folder_path = os.path.join(dataset_path, student_folder)
    if os.path.isdir(folder_path):
        print("Folder:", folder_path)
        for img_name in os.listdir(folder_path):
            print("  Image:", img_name)
