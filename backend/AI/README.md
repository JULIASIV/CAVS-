**AI Module**

This folder contains the AI components for the CAVS project: scripts, models, and utilities used for face recognition, attendance tracking, and related experiments.

**Contents**

- **`attendance.py`**: Main attendance recording logic.
- **`attendance_system.py`**: Higher-level orchestrator for attendance workflows.
- **`attendance_session.py`**: Session management and helper utilities for attendance runs.
- **`main.py`**: Example entry point / demo runner for AI features.
- **`student*.py`**, **`student.ipynb`**, **`student1.ipynb`**: Notebooks and scripts for dataset inspection and experimentation.
- **`wavelet_test.py`**: Signal / image preprocessing experiments using wavelets.
- **`class_dictionary.json`**: Mapping of class IDs to labels used by recognition scripts.
- **`models/`**: Model artifacts and label files used by inference (see top-level `models/labels.json`).

**Quick Start**

- **Create a virtual environment**: `python -m venv .venv && source .venv/Scripts/activate` (Windows: use the `Scripts\activate` script).
- **Install dependencies**: If this folder doesn't include a `requirements.txt`, use the repository-level or backend requirements: `pip install -r ../backend/requirements.txt` or check `CelebrityFaceRecognition/FaceRecognition/model/requirements.txt` for model-specific packages.
- **Run a demo**: `python main.py` or `python attendance.py` to start the attendance/recognition pipeline (ensure your camera or test images are available).

**Data & Models**

- **Datasets**: Sample image datasets are stored under `dataset/` in the repo. Use these for training or testing.
- **Model files**: Check `models/` for saved models and `models/labels.json` for label mappings.
- **Face cascades**: The CelebrityFaceRecognition module includes OpenCV cascades under `CelebrityFaceRecognition/FaceRecognition/model/opencv/haarcascades` for legacy detection experiments.

**Common Workflows**

- **Enroll a new person**: Use the camera capture utilities (see `CameraCapture` in the frontend for an example) to collect images, then add entries to `class_dictionary.json` and retrain or update embeddings.
- **Run attendance**: Ensure models are available in `models/`, then run `python attendance.py` to detect faces and log attendance to your configured backend.
- **Experiment**: Open `student.ipynb` or `student1.ipynb` to explore preprocessing and model evaluation steps.

**Notes & Tips**

- **Hardware**: For training large models, prefer a machine with a GPU and appropriate CUDA/cuDNN setup.
- **Camera access**: On Windows, use the correct device index for OpenCV (often `0`) and ensure permissions are granted.
- **Dependencies**: Model folders may include their own `requirements.txt`. Install model-specific requirements when switching experiments.

**Contributing**

- **Add scripts**: Place new AI scripts in `AI/` and update this README with a short description.
- **Document models**: When adding or updating models, include versioning and training metadata (dataset, hyperparameters, date).

**Contact**

- For questions about the AI code, contact the code owner or open an issue in the repository.

---

_This README is intended to help developers and researchers quickly understand and run the AI components of the CAVS project._
