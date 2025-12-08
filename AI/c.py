
import cv2
print(cv2.__version__)
# Test if the module is available
recognizer = cv2.face.LBPHFaceRecognizer_create()
print("Success! Module is available.")