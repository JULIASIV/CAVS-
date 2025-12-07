import cv2
import numpy as np
import joblib
import json
import pywt

# Load trained model and class dictionary
model = joblib.load(r"C:\Users\j\Desktop\git tutor\student_attendace_system\saved_model.pkl")

with open(r"C:\Users\j\Desktop\git tutor\student_attendace_system\class_dictionary.json", 'r') as f:
    class_dict = json.load(f)

# Reverse class dictionary to get names from labels
inv_class_dict = {v: k for k, v in class_dict.items()}

# Haar cascades
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye_tree_eyeglasses.xml')

# Wavelet transform function
def w2d(img, mode='haar', level=1):
    imArray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    imArray = np.float32(imArray)/255.0
    coeffs = pywt.wavedec2(imArray, mode, level=level)
    coeffs_H = list(coeffs)
    coeffs_H[0] *= 0
    imArray_H = pywt.waverec2(coeffs_H, mode)
    imArray_H *= 255
    return np.uint8(imArray_H)

# Initialize webcam
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    for (x, y, w, h) in faces:
        roi_color = frame[y:y+h, x:x+w]
        roi_gray = gray[y:y+h, x:x+w]
        eyes = eye_cascade.detectMultiScale(roi_gray)
        
        # Only process if 2 eyes are detected
        if len(eyes) >= 2:
            # Wavelet transform
            img_har = w2d(roi_color, 'db1', 5)
            # Resize and flatten images
            raw_img = cv2.resize(roi_color, (32, 32)).reshape(32*32*3, 1)
            har_img = cv2.resize(img_har, (32, 32)).reshape(32*32, 1)
            combined = np.vstack((raw_img, har_img)).reshape(1, 4096)

            # Predict
            pred = model.predict(combined)[0]
            name = inv_class_dict[pred]

            # Draw rectangle and name
            cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
            cv2.putText(frame, name, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0,255,0), 2)

    cv2.imshow("PC Camera Face Recognition", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
