import importlib
import os
checks = [
    ('cv2', 'cv2'),
    ('numpy', 'numpy'),
    ('pywt', 'pywt'),
    ('joblib', 'joblib')
]
for name, mod in checks:
    try:
        m = importlib.import_module(mod)
        v = getattr(m, '__version__', 'unknown')
        print(f'{name} OK {v}')
    except Exception as e:
        print(f'{name} import failed: {e!r}')

# Check model files
model_paths = [
    os.path.join('.', 'models', 'face_recognizer.yml'),
    os.path.join('.', 'models', 'labels.json'),
    os.path.join('..', 'models', 'face_recognizer.yml'),
    os.path.join('..', 'models', 'labels.json'),
    os.path.join('..', '..', 'models', 'face_recognizer.yml'),
]
for p in model_paths:
    print(p, 'exists' if os.path.exists(p) else 'missing')

# Check camera
try:
    import cv2
    cap = cv2.VideoCapture(0)
    ret, frame = cap.read()
    print('camera read OK' if ret else 'camera read failed or no camera')
    cap.release()
except Exception as e:
    print('camera check failed:', e)
