# 🐍 Smart Attendance System – Django REST Backend (Final Version)

Strict Automated Attendance System with Device-Side Face Recognition

This backend receives only recognized student IDs from devices, manages course-based attendance sessions, and allows teachers to review and edit attendance.

## 📋 Quick Start
### Prerequisites

- Python 3.9+
- pip
- PostgreSQL (Production) / SQLite (Development)
- Docker (Required for deployment)

### Installation (Local Development)

```bash
python -m venv venv
venv\Scripts\activate # Windows
source venv/bin/activate # Linux / Mac

pip install -r requirements.txt

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Server runs at: http://localhost:8000

## 🎯 System Scope

✅ Strictly an attendance system

✅ Face recognition is done on the device

✅ Backend only receives: student_id, date, time

✅ Teacher ID & Device ID are sent only once when a session is created

✅ Attendance is auto-approved (present)

✅ Teacher can later mark permission

✅ Students not scanned → Auto absent

✅ Status values: present, absent, permission

## 🔐 Authentication & Roles

| **Role** | **Permissions**                                    |
| -------- | -------------------------------------------------- |
| Admin    | Full system access                                 |
| Teacher  | Create sessions, edit attendance for their courses |
| Device   | Send recognized attendance                         |

JWT authentication (SimpleJWT) is used.

Devices authenticate using JWT or API key mechanism (to be finalized).

## 🛠 Tech Stack

| Technology            | Purpose                  |
| --------------------- | ------------------------ |
| Django 4.2+           | Backend framework        |
| Django REST Framework | REST API                 |
| PostgreSQL / SQLite   | Database                 |
| SimpleJWT             | Authentication           |
| Docker                | Deployment               |
| Redis + Celery        | Optional background jobs |

## 📁 Project Structure

```
backend/
├── manage.py
├── requirements.txt
│
├── CAV/ # Main Django project (settings)
│  ├── **init**.py
│  ├── settings.py
│  ├── urls.py
│  ├── asgi.py
│  ├── wsgi.py
│  └── app.py
│
├── api/ # Main application
│  ├── **init**.py
│  ├── admin.py
│  ├── apps.py
	├── models.py
	├── permissions.py
	├── serializers.py
	├── views.py
	├── urls.py
	├── tests.py
	└── migrations/
		 └── **init**.py
│
├── db.sqlite3 # Development database
└── .env
```

## 🚀 API Endpoints

### 🔐 Authentication

| Method | Endpoint          | Description              |
| ------ | ----------------- | ------------------------ |
| POST   | /api/auth/login   | Obtain JWT pair          |
| POST   | /api/auth/refresh | Refresh access token     |
| GET    | /api/auth/me      | Get current user details |

### 👨‍🎓 Students

| Method | Endpoint           | Description                         |
| ------ | ------------------ | ----------------------------------- |
| GET    | /api/students      | List all students                   |
| POST   | /api/students      | Create a new student (Admin only)   |
| GET    | /api/students/{id} | Retrieve student details            |
| PUT    | /api/students/{id} | Update student details (Admin only) |
| DELETE | /api/students/{id} | Delete student (Admin only)         |

### 👨‍🏫 Teachers

| Method | Endpoint      | Description                       |
| ------ | ------------- | --------------------------------- |
| GET    | /api/teachers | List all teachers                 |
| POST   | /api/teachers | Create a new teacher (Admin only) |

### 🏫 Department & Sections

| Method | Endpoint       | Description                              |
| ------ | -------------- | ---------------------------------------- |
| GET    | /api/dep-batch | List all department batches              |
| POST   | /api/dep-batch | Create new department batch (Admin only) |
| GET    | /api/sections  | List all sections                        |
| POST   | /api/sections  | Create new section (Admin only)          |

### 📚 Courses

| Method | Endpoint          | Description                      |
| ------ | ----------------- | -------------------------------- |
| GET    | /api/courses      | List all courses                 |
| POST   | /api/courses      | Create a new course (Admin only) |
| GET    | /api/courses/{id} | Retrieve course details          |

### 📆 Attendance Sessions

| Method | Endpoint                 | Description                      |
| ------ | ------------------------ | -------------------------------- |
| POST   | /api/sessions            | Create a new attendance session  |
| GET    | /api/sessions            | List all sessions                |
| GET    | /api/sessions/{id}       | Retrieve session details         |
| POST   | /api/sessions/{id}/close | Manually close an active session |

#### Create Session (Teacher → Backend)

```json
{
  "course_id": 3,
  "teacher_id": 5,
  "device_id": "DEV-01",
  "date": "2025-11-25"
}
```

- ✅ Teacher and Device are bound once.
- ✅ Session becomes is_active=True.

### 📸 Attendance Scan (Sent by Device Every Time)

| Method | Endpoint             | Description                    |
| ------ | -------------------- | ------------------------------ |
| POST   | /api/attendance/scan | Submit a recognized student ID |

Request Payload

```json
{
  "student_id": 120,
  "date": "2025-11-25",
  "time": "08:43:21"
}
```

- ✅ System finds the active session for the bound device_id.
- ✅ Automatically creates a Present record.
- ✅ Duplicate scans for the same student/session are blocked.
- ✅ Teacher & Device are taken from the active session.

## 📝 Attendance Records

| Method | Endpoint                             | Description                              |
| ------ | ------------------------------------ | ---------------------------------------- |
| GET    | /api/attendance                      | List all attendance records (Admin only) |
| GET    | /api/attendance/session/{session_id} | Get records for a specific session       |
| PUT    | /api/attendance/{id}/edit            | Edit a record (e.g., change status)      |
| DELETE | /api/attendance/{id}                 | Delete attendance record (Admin only)    |

### Edit Attendance (Teacher)

```json
{
  "status": "permission"
}
```

## 🧠 Attendance Logic

- Teacher opens a session (binds device).
- Device recognizes face locally.
- Device sends only: student_id, date, time.
- Backend marks status as Present.
- When the session closes (manually or automatically):
  - The system iterates over all students registered for the course's section(s).
  - All students not found in AttendanceRecord for this session are automatically marked Absent.
- Teacher can later change a record's status (e.g., Present → Permission).

## 📊 Final Database Schema

```
Student

id int PK
student_code varchar unique
first_name varchar
last_name varchar
section_id FK

Teacher

id int PK
teacher_code varchar unique
first_name varchar
last_name varchar

DepBatch

id int PK
dep varchar
batch varchar

Section

id int PK
name varchar
dep_batch_id FK

Course

id int PK
name varchar
code varchar unique
teacher_id FK (Teacher)

AttendanceSession

id int PK
course_id FK (Course)
date date
created_by FK (Teacher)
created_at datetime
device_id varchar (Index this field)
is_active boolean

AttendanceRecord

id int PK
session_id FK (AttendanceSession)
student_id FK (Student)
status varchar (Enum: 'present', 'absent', 'permission')
timestamp datetime (Time of device scan/manual edit)
```

## ⚙️ Environment Configuration

`.env` file structure

```ini
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1, [::1]

# Database Configuration

DATABASE_URL=sqlite:///db.sqlite3

# Example PostgreSQL:

# DATABASE_URL=postgresql://user:pass@localhost:5432/attendance_db

# JWT Configuration (Times in minutes)

JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440

# CORS Configuration

CORS_ALLOWED_ORIGINS=http://localhost:3000, [https://your-frontend-domain.com](https://your-frontend-domain.com)
```

## 🔐 Security Rules

- JWT authentication required for all authenticated endpoints.
- Device authentication is required for /api/attendance/scan.
- A device cannot submit a scan unless an active session is bound to its device_id.
- Teachers can only edit attendance records for sessions associated with courses they teach (created_by).
- Devices cannot edit or retrieve any system data; they are strictly for scan submission.
- Attendance records cannot be deleted by teachers (Admin only).
- Admin role has full access to all system resources.

## 👥 Roles Summary

| Role    | Access                                                 |
| ------- | ------------------------------------------------------ |
| Admin   | Full system access                                     |
| Teacher | Session management + Attendance edit for their courses |
| Device  | Scan submission only                                   |

## 🧪 Testing

```bash
python manage.py test
coverage run manage.py test
coverage report
```

- ✅ Unit Tests
- ✅ Integration Tests

## 🐳 Docker Deployment

```bash
docker build -t attendance-backend .
docker run -p 8000:8000 --env-file .env attendance-backend
```

## 📄 License

MIT License

## 👨‍💻 Team

Project Lead: Abenezer Markos

Backend Engineer: Menwuyelet Temesgen
