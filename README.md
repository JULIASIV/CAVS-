# 🎓 Smart Attendance System (CAVS)

**Computer-Aided Attendance Verification System**

A comprehensive facial recognition-based attendance management system integrating IoT devices, Django backend, and React frontend.

---

## 📋 Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Hardware Integration](#hardware-integration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

The Smart Attendance System automates student attendance tracking using facial recognition technology. Students are identified as they enter classrooms via camera-equipped IoT devices (Raspberry Pi/ESP32-CAM). The system stores attendance records in a temporary database, allowing teachers and administrators to verify, approve, or modify entries through a modern web interface before syncing to the university's main portal.

### Key Highlights

- ✅ **Automated Facial Recognition** - Real-time student identification
- ✅ **IoT Integration** - Raspberry Pi & ESP32-CAM support
- ✅ **Django REST Backend** - Robust API with JWT authentication
- ✅ **React Frontend** - Modern, responsive admin dashboard
- ✅ **Role-Based Access** - Admin and Teacher roles
- ✅ **Manual Review Queue** - Human-in-the-loop verification
- ✅ **Export & Sync** - CSV export and university portal integration

---

## 🏗 System Architecture

```
[IoT Devices]           [Backend]              [Frontend]          [University]
   (Pi/ESP32)              (Django)               (React)             Portal
      │                       │                      │                   │
      │──── POST Image ───────▶│                      │                   │
      │     + Metadata         │                      │                   │
      │                        │                      │                   │
      │                   ┌────▼─────┐                │                   │
      │                   │  Face    │                │                   │
      │                   │  Detection│               │                   │
      │                   │  & Match  │               │                   │
      │                   └────┬─────┘                │                   │
      │                        │                      │                   │
      │                   ┌────▼─────┐                │                   │
      │                   │ Temp DB  │◀───── View ────┤                   │
      │                   │ (SQLite/ │        +       │                   │
      │                   │Postgres) │──── Approve ───▶                   │
      │                   └────┬─────┘                │                   │
      │                        │                      │                   │
      │                        └───── Sync ───────────┼──────────────────▶│
```

---

## ✨ Features

### 🔐 Core Features

- **Facial Recognition Pipeline**
  - Face detection using OpenCV/MTCNN
  - Embedding generation (FaceNet/InsightFace)
  - Similarity matching with configurable thresholds
  
- **IoT Device Management**
  - Real-time device monitoring
  - Remote configuration & control
  - Status tracking (online/offline/error)
  
- **Web Dashboard**
  - Attendance review queue
  - Student management
  - Statistics & analytics
  - CSV export functionality
  
- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (RBAC)
  - Teacher and Admin roles
  
- **Data Management**
  - Temporary attendance storage
  - Audit logging
  - Data retention policies
  - Export to university portal

---

## 🛠 Tech Stack

### Backend
- **Framework:** Django 4.2+ / Django REST Framework
- **Database:** PostgreSQL / SQLite
- **ML/CV:** OpenCV, InsightFace, NumPy
- **Authentication:** JWT (djangorestframework-simplejwt)
- **Task Queue:** Celery + Redis (optional)

### Frontend
- **Framework:** React 18.2
- **Routing:** React Router 6.8
- **Styling:** Tailwind CSS 3.2
- **HTTP Client:** Axios
- **Icons:** Heroicons, Lucide React
- **Date Handling:** date-fns

### Hardware
- **Devices:** Raspberry Pi 4, ESP32-CAM
- **Camera:** Pi Camera v2 / USB Camera
- **Sensors:** PIR motion sensors (optional)

---

## 📁 Project Structure

```
CAVS/
├── 📁 backend/                 # Django REST API backend
│   ├── app/
│   │   ├── api/               # API endpoints
│   │   ├── models/            # Database models
│   │   ├── serializers/       # DRF serializers
│   │   ├── views/             # API views
│   │   └── settings.py        # Django settings
│   ├── requirements.txt
│   └── manage.py
│
├── 📁 inference/              # ML inference engine
│   ├── models/               # Pre-trained models
│   ├── embedder.py           # Face embedding
│   ├── detector.py           # Face detection
│   └── matcher.py            # Similarity matching
│
├── 📁 frontend/              # React web application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   └── services/
│   ├── package.json
│   └── README.md
│
├── 📁 devices/               # IoT device scripts
│   ├── pi/                   # Raspberry Pi
│   │   └── capture_script.py
│   └── esp32/                # ESP32-CAM
│       └── capture.ino
│
├── 📁 infra/                 # Infrastructure
│   ├── docker-compose.yml
│   └── nginx.conf
│
├── 📁 docs/                  # Documentation
│   ├── architecture.md
│   ├── api.md
│   └── privacy_policy.md
│
├── README.md                 # This file
├── LICENSE
└── .gitignore
```

---

## 🚀 Quick Start

### Prerequisites

Ensure you have installed:
- **Python 3.9+**
- **Node.js 16+** and npm
- **PostgreSQL** (or use SQLite for development)
- **Git**

### Clone Repository

```bash
git clone https://github.com/your-org/CAVS.git
cd CAVS
```

### Backend Setup (Django)

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

Backend will run at `http://localhost:8000`

### Frontend Setup (React)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will open at `http://localhost:3000`

### Test the System

1. Open browser to `http://localhost:3000`
2. Login with credentials:
   - **Admin:** `admin@astu.edu` / `password`
   - **Teacher:** `teacher@astu.edu` / `password`
3. Explore dashboard, attendance records, and device management

---

## 📖 Detailed Setup

### Backend Configuration

1. **Environment Variables** - Create `backend/.env`:

```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/attendance_db
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

2. **Database Setup**:

```bash
# PostgreSQL
createdb attendance_db

# Or use SQLite (default for development)
# No setup needed
```

3. **Run Tests**:

```bash
python manage.py test
```

### Frontend Configuration

1. **Environment Variables** - Create `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:8000
```

2. **Build for Production**:

```bash
npm run build
```

### Hardware Setup

See [devices/pi/README.md](devices/pi/README.md) and [devices/esp32/README.md](devices/esp32/README.md) for device-specific instructions.

---

## 🔌 Hardware Integration

### Raspberry Pi Setup

1. **Install Raspbian OS** on microSD card
2. **Install dependencies**:
   ```bash
   sudo apt-get update
   sudo apt-get install python3-opencv python3-pip
   pip3 install requests Pillow
   ```
3. **Configure capture script**:
   ```bash
   cd devices/pi
   nano config.json  # Add API endpoint and device credentials
   ```
4. **Run capture script**:
   ```bash
   python3 capture_script.py
   ```

### ESP32-CAM Setup

1. Open Arduino IDE
2. Install ESP32 board support
3. Upload `devices/esp32/capture.ino`
4. Configure WiFi and API endpoint in code

---

## 🐳 Deployment

### Using Docker Compose

```bash
cd infra
docker-compose up -d
```

This starts:
- Django backend on port 8000
- React frontend on port 3000
- PostgreSQL database
- Nginx reverse proxy (optional)

### Production Checklist

- [ ] Set `DEBUG=False` in Django settings
- [ ] Use strong `SECRET_KEY`
- [ ] Configure HTTPS/SSL certificates
- [ ] Set up PostgreSQL with secure credentials
- [ ] Configure CORS properly
- [ ] Set up backup and data retention policies
- [ ] Review privacy policy and obtain student consent
- [ ] Enable logging and monitoring

---

## 👥 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add some feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Team

**Project Lead:** Abenezer Markos  
**Institution:** Adama Science and Technology University (ASTU)  
**Department:** Material Science and Engineering / Economics

---

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Contact: [your-email@astu.edu]

---

**Built with ❤️ at ASTU**
