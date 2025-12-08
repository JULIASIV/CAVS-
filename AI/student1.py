#









import cv2
import os
import numpy as np
import json
from datetime import datetime

dataset_path = "./dataset"
model_path = "./models/face_recognizer_enhanced.yml"
os.makedirs("./models", exist_ok=True)

# Use more accurate DNN-based face detector
def load_face_detector():
    # Try to load DNN model (more accurate than Haar cascade)
    prototxt_path = "models/deploy.prototxt"
    model_path = "models/res10_300x300_ssd_iter_140000.caffemodel"
    
    if os.path.exists(prototxt_path) and os.path.exists(model_path):
        print("Using DNN face detector for better accuracy...")
        net = cv2.dnn.readNetFromCaffe(prototxt_path, model_path)
        return "dnn", net
    else:
        print("DNN model not found. Using Haar cascade...")
        # Download DNN model files for better accuracy:
        # https://raw.githubusercontent.com/opencv/opencv/master/samples/dnn/face_detector/deploy.prototxt
        # https://raw.githubusercontent.com/opencv/opencv_3rdparty/dnn_samples_face_detector_20170830/res10_300x300_ssd_iter_140000.caffemodel
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
        return "haar", face_cascade

detector_type, face_detector = load_face_detector()

# Function to detect faces using appropriate detector
def detect_faces(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    if detector_type == "dnn":
        # DNN detection
        (h, w) = image.shape[:2]
        blob = cv2.dnn.blobFromImage(cv2.resize(image, (300, 300)), 1.0, 
                                     (300, 300), (104.0, 177.0, 123.0))
        face_detector.setInput(blob)
        detections = face_detector.forward()
        
        faces = []
        for i in range(0, detections.shape[2]):
            confidence = detections[0, 0, i, 2]
            if confidence > 0.5:  # Confidence threshold
                box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                (x, y, x2, y2) = box.astype("int")
                faces.append((x, y, x2-x, y2-y))
        return faces
    else:
        # Haar cascade detection
        faces = face_detector.detectMultiScale(
            gray, 
            scaleFactor=1.1, 
            minNeighbors=5, 
            minSize=(30, 30),
            flags=cv2.CASCADE_SCALE_IMAGE
        )
        return faces

# Function to preprocess face images
def preprocess_face(face_img):
    # Convert to grayscale if not already
    if len(face_img.shape) == 3:
        gray = cv2.cvtColor(face_img, cv2.COLOR_BGR2GRAY)
    else:
        gray = face_img
    
    # Apply histogram equalization for better contrast
    gray = cv2.equalizeHist(gray)
    
    # Apply Gaussian blur to reduce noise
    gray = cv2.GaussianBlur(gray, (3, 3), 0)
    
    return gray

faces = []
labels = []
label_dict = {}
current_label = 0

print("Starting enhanced face training...")

for student_folder in sorted(os.listdir(dataset_path)):
    folder_path = os.path.join(dataset_path, student_folder)
    if not os.path.isdir(folder_path):
        continue
    
    # Extract student ID and name
    folder_name = student_folder
    if "_" in student_folder:
        student_id = student_folder.split("_")[-1]
        student_name = "_".join(student_folder.split("_")[:-1])
        label_dict[current_label] = {
            "id": student_id,
            "name": student_name,
            "folder": folder_name
        }
    else:
        label_dict[current_label] = {
            "id": student_folder,
            "name": student_folder,
            "folder": folder_name
        }
    
    image_count = 0
    valid_image_count = 0
    
    print(f"Processing {folder_name}...")
    
    for img_name in sorted(os.listdir(folder_path)):
        img_path = os.path.join(folder_path, img_name)
        img = cv2.imread(img_path)
        if img is None:
            continue
        
        image_count += 1
        detected_faces = detect_faces(img)
        
        for (x, y, w, h) in detected_faces:
            # Extract face region with padding
            padding = 20
            x1 = max(0, x - padding)
            y1 = max(0, y - padding)
            x2 = min(img.shape[1], x + w + padding)
            y2 = min(img.shape[0], y + h + padding)
            
            face_roi = img[y1:y2, x1:x2]
            
            # Preprocess and resize
            face_processed = preprocess_face(face_roi)
            face_resized = cv2.resize(face_processed, (150, 150))
            
            # Augment data by creating variations
            # 1. Original
            faces.append(face_resized)
            labels.append(current_label)
            
            # 2. Flipped horizontally (if applicable)
            if "profile" not in img_name.lower():
                face_flipped = cv2.flip(face_resized, 1)
                faces.append(face_flipped)
                labels.append(current_label)
            
            # 3. Slightly rotated versions
            for angle in [-5, 5]:
                M = cv2.getRotationMatrix2D((75, 75), angle, 1.0)
                face_rotated = cv2.warpAffine(face_resized, M, (150, 150))
                faces.append(face_rotated)
                labels.append(current_label)
            
            valid_image_count += 1
    
    print(f"  - Found {valid_image_count} valid faces from {image_count} images")
    current_label += 1

faces = np.array(faces)
labels = np.array(labels)

print(f"\nTotal faces for training: {len(faces)}")
print(f"Total students: {len(label_dict)}")

# Train the recognizer with enhanced parameters
recognizer = cv2.face.LBPHFaceRecognizer_create(
    radius=2,
    neighbors=16,
    grid_x=8,
    grid_y=8,
    threshold=80  # Higher threshold for more confidence
)

# Also try FisherFace for potentially better accuracy
try:
    # FisherFace usually works better when you have multiple samples per person
    if len(label_dict) > 1 and len(faces) > len(label_dict):
        print("\nTraining FisherFace recognizer (often more accurate)...")
        fisher_recognizer = cv2.face.FisherFaceRecognizer_create()
        fisher_recognizer.train(faces, labels)
        fisher_recognizer.save("./models/fisher_face_recognizer.yml")
        print("FisherFace model saved!")
except Exception as e:
    print(f"FisherFace training failed: {e}. Using LBPH only.")

# Train LBPH
recognizer.train(faces, labels)
recognizer.save(model_path)

# Save label dictionary
with open("./models/labels_enhanced.json", "w") as f:
    json.dump(label_dict, f, indent=4)

print("\nTraining complete!")
print(f"Models saved in ./models/")
print(f"LBPH model: {model_path}")
if os.path.exists("./models/fisher_face_recognizer.yml"):
    print("FisherFace model: ./models/fisher_face_recognizer.yml")
print(f"Labels: ./models/labels_enhanced.json")