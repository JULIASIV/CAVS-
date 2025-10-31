# 🐍 CAVS Backend - Django REST API

**Django REST Framework Backend for Smart Attendance System**

Robust API server handling facial recognition, authentication, and attendance management.

---

## 📋 Quick Start

### Prerequisites

- **Python** 3.9 or higher
- **pip** (comes with Python)
- **PostgreSQL** (or use SQLite for development)
- **virtualenv** (recommended)

### Installation & Run

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

The API will run at **http://localhost:8000**

---

## ✨ Features

### 🔐 Authentication
- JWT token-based authentication
- Token refresh mechanism
- Role-based permissions (Admin/Teacher)
- User registration and management

### 📸 Image Capture API
- Receive images from IoT devices
- Store metadata (device_id, classroom_id, timestamp)
- Trigger facial recognition pipeline
- Return match confidence and student ID

### 🤖 Facial Recognition
- Face detection using OpenCV
- Embedding generation (FaceNet/InsightFace)
- Similarity matching with enrolled students
- Configurable confidence thresholds

### 📝 Attendance Management
- CRUD operations for attendance records
- Pending/Approved/Rejected status workflow
- Teacher review and approval
- Audit logging for all changes

### 👥 Student Management
- Student enrollment with photos
- Store facial embeddings
- Department and class information
- Attendance history

### 🔌 Device Management
- Register and track IoT devices
- Device status monitoring
- Configuration management
- Device authentication

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|------------|---------|----------|
| Django | 4.2+ | Web framework |
| Django REST Framework | 3.14+ | REST API |
| PostgreSQL | 13+ | Database (production) |
| SQLite | 3 | Database (development) |
| djangorestframework-simplejwt | 5.2+ | JWT authentication |
| OpenCV | 4.7+ | Face detection |
| InsightFace / FaceNet | - | Face embeddings |
| NumPy | 1.24+ | Numerical operations |
| Pillow | 9.5+ | Image processing |
| Celery | 5.2+ | Task queue (optional) |
| Redis | 7.0+ | Cache & queue backend (optional) |

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── settings.py              # Django settings
│   ├── urls.py                  # URL routing
│   ├── wsgi.py                  # WSGI config
│   └── asgi.py                  # ASGI config
│
├── api/
│   ├── views/                   # API views
│   │   ├── auth.py             # Authentication endpoints
│   │   ├── capture.py          # Image capture endpoint
│   │   ├── attendance.py       # Attendance CRUD
│   │   ├── students.py         # Student management
│   │   └── devices.py          # Device management
│   │
│   ├── serializers/             # DRF serializers
│   │   ├── user.py
│   │   ├── attendance.py
│   │   ├── student.py
│   │   └── device.py
│   │
│   ├── models.py                # Database models
│   ├── permissions.py           # Custom permissions
│   ├── urls.py                  # API URL routing
│   └── tests/                   # Test suite
│
├── inference/
│   ├── detector.py              # Face detection
│   ├── embedder.py              # Embedding generation
│   ├── matcher.py               # Similarity matching
│   └── models/                  # Pre-trained models
│
├── uploads/                     # Uploaded images
├── db.sqlite3                   # SQLite database (dev)
├── manage.py                    # Django management script
├── requirements.txt             # Python dependencies
└── README.md                    # This file
```

---

## 🚀 API Endpoints

### Authentication

```
POST   /api/auth/login           # Login and get JWT token
POST   /api/auth/refresh         # Refresh JWT token
POST   /api/auth/register        # Register new user
GET    /api/auth/me              # Get current user info
```

### Capture

```
POST   /api/capture              # Upload image from device
```

**Request:**
- `image` (file) - Captured image
- `device_id` (string) - Device identifier
- `classroom_id` (string) - Classroom identifier
- `timestamp` (datetime) - Capture timestamp

**Response:**
```json
{
  "record_id": "uuid",
  "predicted_student_id": "STU12345",
  "predicted_name": "John Doe",
  "confidence": 0.95,
  "status": "pending"
}
```

### Attendance

```
GET    /api/attendance/pending    # List pending records
GET    /api/attendance?filters    # List all records with filters
POST   /api/attendance/:id/review # Approve/reject attendance
GET    /api/attendance/:id        # Get single record
DELETE /api/attendance/:id        # Delete record (admin)
```

### Students

```
GET    /api/students              # List all students
POST   /api/students              # Enroll new student
GET    /api/students/:id          # Get student details
PUT    /api/students/:id          # Update student
DELETE /api/students/:id          # Remove student
```

### Devices

```
GET    /api/devices               # List all devices
POST   /api/devices               # Register new device
GET    /api/devices/:id           # Get device details
PUT    /api/devices/:id           # Update device
DELETE /api/devices/:id           # Remove device
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the backend root:

```env
# Django
DEBUG=True
SECRET_KEY=your-very-secret-key-here-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost:5432/attendance_db
# Or use SQLite (default):
# DATABASE_URL=sqlite:///db.sqlite3

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# JWT
JWT_ACCESS_TOKEN_LIFETIME=60  # minutes
JWT_REFRESH_TOKEN_LIFETIME=1440  # minutes (1 day)

# File Upload
MAX_UPLOAD_SIZE=10485760  # 10MB in bytes
UPLOAD_DIR=uploads/

# ML Models
MODEL_PATH=inference/models/
FACE_DETECTION_MODEL=haarcascade_frontalface_default.xml
EMBEDDING_MODEL=facenet_keras.h5

# Thresholds
CONFIDENCE_THRESHOLD_HIGH=0.9
CONFIDENCE_THRESHOLD_MEDIUM=0.7

# Celery (optional)
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
```

### Database Setup

#### Using SQLite (Development)
No setup needed - Django creates `db.sqlite3` automatically.

#### Using PostgreSQL (Production)

1. Install PostgreSQL
2. Create database:
   ```bash
   createdb attendance_db
   ```

3. Update `.env` with connection string:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/attendance_db
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
python manage.py test

# Run specific test module
python manage.py test api.tests.test_attendance

# Run with coverage
coverage run --source='.' manage.py test
coverage report
```

### Run Linter

```bash
# Install flake8
pip install flake8

# Run linter
flake8 api/ inference/
```

---

## 📦 Requirements

Create `requirements.txt`:

```txt
Django==4.2.5
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.0
django-cors-headers==4.2.0
Pillow==10.0.0
opencv-python==4.8.0.74
numpy==1.24.3
python-dotenv==1.0.0
psycopg2-binary==2.9.7  # PostgreSQL adapter
celery==5.3.1  # Optional
redis==4.6.0  # Optional
```

Install all:
```bash
pip install -r requirements.txt
```

---

## 🔐 Security Best Practices

### Development
- Use strong `SECRET_KEY`
- Enable `DEBUG=True` only in development
- Use SQLite for local testing

### Production
- Set `DEBUG=False`
- Use PostgreSQL database
- Configure HTTPS/SSL
- Use environment variables for secrets
- Enable CSRF protection
- Configure proper CORS origins
- Implement rate limiting
- Use secure JWT tokens
- Encrypt facial embeddings at rest
- Implement data retention policies

---

## 🚀 Deployment

### Using Gunicorn (Production)

```bash
# Install gunicorn
pip install gunicorn

# Run with gunicorn
gunicorn app.wsgi:application --bind 0.0.0.0:8000 --workers 4
```

### Using Docker

```bash
# Build image
docker build -t cavs-backend .

# Run container
docker run -p 8000:8000 --env-file .env cavs-backend
```

### Using Docker Compose

See `../infra/docker-compose.yml` for full-stack deployment.

---

## 📊 Database Schema

### Students
```sql
id (UUID, PK)
student_number (VARCHAR, UNIQUE)
full_name (VARCHAR)
email (VARCHAR)
department (VARCHAR)
year (INT)
embeddings (JSON)  -- Facial embeddings
created_at (TIMESTAMP)
```

### Devices
```sql
id (UUID, PK)
device_id (VARCHAR, UNIQUE)
classroom_id (VARCHAR)
location (VARCHAR)
status (VARCHAR)  -- active/inactive/error
last_seen (TIMESTAMP)
```

### Attendance Records
```sql
id (UUID, PK)
device_id (FK)
classroom_id (VARCHAR)
captured_image_path (VARCHAR)
predicted_student_id (FK, NULL)
predicted_name (VARCHAR)
confidence (FLOAT)
timestamp (TIMESTAMP)
review_status (VARCHAR)  -- pending/approved/rejected
reviewer_id (FK, NULL)
review_timestamp (TIMESTAMP, NULL)
notes (TEXT)
```

### Audit Logs
```sql
id (UUID, PK)
user_id (FK)
action (VARCHAR)
target_table (VARCHAR)
target_id (VARCHAR)
meta (JSON)
timestamp (TIMESTAMP)
```

---

## 🐛 Troubleshooting

### Port 8000 Already in Use

```bash
# Run on different port
python manage.py runserver 8080
```

### Database Migration Issues

```bash
# Reset database (WARNING: deletes all data)
python manage.py flush
python manage.py migrate

# Or delete db.sqlite3 and migrate again
rm db.sqlite3
python manage.py migrate
```

### Module Import Errors

```bash
# Reinstall dependencies
pip install --upgrade -r requirements.txt
```

### CORS Issues

Check `CORS_ALLOWED_ORIGINS` in settings and `.env`

---

## 👥 Contributing

See main [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT License - See [LICENSE](../LICENSE)

---

## 👨‍💻 Team

**Project Lead:** Abenezer Markos  
**Institution:** ASTU (Adama Science and Technology University)  
**Department:** Material Science & Engineering / Economics

---

**For frontend setup, see `../frontend/README.md`**  
**For full project documentation, see main `../README.md`**

