import cv2
import os
import numpy as np
import json

dataset_path = "./dataset"
model_path = "./models/face_recognizer.yml"

os.makedirs("./models", exist_ok=True)

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

faces = []
labels = []
label_dict = {}
current_label = 0

for student_folder in os.listdir(dataset_path):
    folder_path = os.path.join(dataset_path, student_folder)
    if not os.path.isdir(folder_path):
        continue
    student_id = student_folder.split("_")[-1]
    label_dict[current_label] = student_id

    for img_name in os.listdir(folder_path):
        img_path = os.path.join(folder_path, img_name)
        img = cv2.imread(img_path)
        if img is None:
            continue
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        detected_faces = face_cascade.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=5)
        for (x, y, w, h) in detected_faces:
            face_roi = cv2.resize(gray[y:y+h, x:x+w], (100,100))
            faces.append(face_roi)
            labels.append(current_label)

    current_label += 1

faces = np.array(faces)
labels = np.array(labels)

recognizer = cv2.face.LBPHFaceRecognizer_create()
recognizer.train(faces, labels)
recognizer.save(model_path)

with open("./models/labels.json", "w") as f:
    json.dump(label_dict, f)

print("Training complete! Model saved at", model_path)
