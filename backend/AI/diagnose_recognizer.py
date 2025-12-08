import os
import cv2
import json
import csv
import numpy as np

DATASET = "./student_attendace_system/dataset"
MODEL = "./student_attendace_system/models/face_recognizer.yml"
LABELS = "./student_attendace_system/models/labels.json"
OUTPUT = "./student_attendace_system/diagnosis.csv"

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

if not os.path.exists(MODEL):
    print("Model not found:", MODEL)
    raise SystemExit

recognizer = cv2.face.LBPHFaceRecognizer_create()
recognizer.read(MODEL)

with open(LABELS, 'r', encoding='utf-8') as f:
    labels_map = json.load(f)

# Normalize label map to id->name (labels may be stored as {id: {"name":..., "id":...}})
id_to_name = {}
for k, v in labels_map.items():
    if isinstance(v, dict):
        id_to_name[str(k)] = v.get('name') or v.get('id') or str(k)
    else:
        id_to_name[str(k)] = str(v)

# Build reverse mapping: various normalized forms -> id
name_to_id = {}
for k, v in id_to_name.items():
    # original as-is
    name_to_id[v] = k
    # underscore and space variants
    name_to_id[v.replace(' ', '_')] = k
    name_to_id[v.replace('_', ' ')] = k
    # lowercase variants
    name_to_id[v.lower()] = k
    name_to_id[v.lower().replace(' ', '_')] = k

rows = []
counts = {}

for student_folder in sorted(os.listdir(DATASET)):
    folder_path = os.path.join(DATASET, student_folder)
    if not os.path.isdir(folder_path):
        continue
    # Determine true_id by matching folder name with labels (handle underscores/spaces)
    true_id = None
    # try reverse mapping first
    if student_folder in name_to_id:
        true_id = name_to_id[student_folder]
    else:
        sf_lower = student_folder.lower()
        if sf_lower in name_to_id:
            true_id = name_to_id[sf_lower]
        else:
            # try replacing underscores/spaces
            alt = student_folder.replace('_', ' ')
            if alt in name_to_id:
                true_id = name_to_id[alt]
            else:
                alt2 = student_folder.replace(' ', '_')
                if alt2 in name_to_id:
                    true_id = name_to_id[alt2]

    for img_name in sorted(os.listdir(folder_path)):
        img_path = os.path.join(folder_path, img_name)
        img = cv2.imread(img_path)
        if img is None:
            continue
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=5)
        if len(faces) == 0:
            rows.append([student_folder, img_name, 'NO_FACE', '', ''])
            continue
        # take largest face
        x,y,w,h = max(faces, key=lambda r: r[2]*r[3])
        face = gray[y:y+h, x:x+w]
        try:
            # resize to training size (150x150 used by train.py)
            face_resized = cv2.resize(face, (150,150))
        except Exception:
            rows.append([student_folder, img_name, 'BAD_FACE', '', ''])
            continue
        label, conf = recognizer.predict(face_resized)
        pred_name = id_to_name.get(str(label), id_to_name.get(label, 'UNKNOWN'))
        rows.append([student_folder, img_name, str(true_id) if true_id is not None else '', str(label), float(conf)])
        counts.setdefault((str(true_id), str(label)), 0)
        counts[(str(true_id), str(label))] += 1

# write csv
with open(OUTPUT, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['folder','image','true_id','pred_id','confidence'])
    writer.writerows(rows)

print('Diagnosis written to', OUTPUT)

# print simple confusion summary
print('\nConfusion summary (true_id, pred_id): count')
for k,v in sorted(counts.items(), key=lambda kv: -kv[1]):
    print(k, v)

# print label map
print('\nLabel map:')
for k,v in id_to_name.items():
    print(k, '->', v)
