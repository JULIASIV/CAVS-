# 🎓 CAVS - Computer-Aided Attendance Verification System
## Complete Project Documentation

**A Production-Ready Facial Recognition Attendance System with IoT Integration**

---

## 📑 Table of Contents

- [Executive Summary](#executive-summary)
- [System Overview](#system-overview)
- [Complete Hardware Bill of Materials](#complete-hardware-bill-of-materials)
- [Software Architecture](#software-architecture)
- [Frontend Features (Detailed)](#frontend-features-detailed)
- [Backend Features](#backend-features)
- [Hardware Integration](#hardware-integration)
- [Installation & Setup](#installation--setup)
- [Deployment Guide](#deployment-guide)
- [Team & Credits](#team--credits)

---

## 🌟 Executive Summary

CAVS is a comprehensive attendance management system that leverages facial recognition technology, IoT devices, and modern web technologies to automate and streamline student attendance tracking in educational institutions.

### Key Benefits

- ⚡ **Automated Attendance** - No manual roll calls, saves 10-15 minutes per class
- 🎯 **99%+ Accuracy** - Advanced facial recognition with confidence scoring
- 📊 **Real-time Dashboard** - Live attendance monitoring and analytics
- 🔐 **Secure & Compliant** - Role-based access, audit logging, GDPR-ready
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- 🔌 **IoT Integration** - Raspberry Pi with camera modules for capture
- 🔄 **Manual Override** - Teachers can review and approve/reject entries

---

## 🏗 System Overview

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CAVS System Architecture                     │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│  Classroom   │         │   Backend    │         │   Frontend   │
│   Devices    │────────▶│     API      │◀────────│  Dashboard   │
│ (Raspberry   │  POST   │   (Django)   │  REST   │   (React)    │
│     Pi)      │  Image  │              │   API   │              │
└──────────────┘         └──────────────┘         └──────────────┘
       │                        │                         │
       │                        │                         │
       ▼                        ▼                         ▼
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│  HQ Camera   │         │  PostgreSQL  │         │   Admin/     │
│  + Display   │         │   Database   │         │   Teacher    │
│  + LEDs      │         │              │         │              │
│  + Buzzer    │         └──────────────┘         └──────────────┘
└──────────────┘                 │
                                 │
                          ┌──────▼──────┐
                          │  University │
                          │   Portal    │
                          │  (Sync)     │
                          └─────────────┘
```

### Data Flow

1. **Capture**: Raspberry Pi captures student image via HQ camera
2. **Process**: Image sent to Django backend for facial recognition
3. **Match**: Backend compares face embeddings against student database
4. **Store**: Attendance record created with confidence score and status
5. **Review**: Teacher reviews pending records via React dashboard
6. **Approve**: Teacher approves/rejects attendance
7. **Sync**: Approved records synced to university portal

---

## 🛒 Complete Hardware Bill of Materials

### Core Components

| Item | Description | Qty | Purpose | Notes |
|------|-------------|-----|---------|-------|
| **Raspberry Pi 4 Model B** | 4GB RAM | 1 | Main processing unit | Handles image capture, processing, LED/buzzer control |
| **Raspberry Pi HQ Camera Module** | 12.3 MP sensor | 1 | High-quality image capture | Superior to standard Pi Camera v2 |
| **C/CS Mount Lens** | 6mm or 8mm focal length | 1 | Camera optics | 6mm for wider view, 8mm for focused capture |
| **MicroSD Card** | 64GB or 128GB, Class 10 | 1 | Operating system & storage | 64GB minimum, 128GB recommended |
| **Power Supply** | 5V, 3A USB-C | 1 | Power for Raspberry Pi | Official Pi power supply recommended |
| **Micro HDMI to HDMI Cable** | - | 1 | Display connection (setup) | For initial configuration |

### Case & Cooling

| Item | Description | Qty | Purpose | Notes |
|------|-------------|-----|---------|-------|
| **Raspberry Pi Case** | With camera mount & fan | 1 | Protection & cooling | Must support HQ camera module |
| **Cooling Fan** | 5V, 30mm | 1 | Prevent overheating | Included with most cases |
| **Heat Sinks** | Aluminum | 3 | Additional cooling | For CPU, RAM, USB controller |

### Electronics Components

| Item | Description | Qty | Purpose | Notes |
|------|-------------|-----|---------|-------|
| **Red LED** | 5mm, 3V | 1 | Error/reject indicator | Lights when attendance rejected |
| **Green LED** | 5mm, 3V | 1 | Success indicator | Lights when attendance approved |
| **Resistors** | 330Ω, 1/4W | 2 | LED current limiting | One for each LED |
| **Buzzer/Speaker** | 5V active buzzer | 1 | Audio feedback | Beeps on success/error |
| **Push Button** | Momentary switch | 1 | Manual trigger/reset | For manual attendance capture |
| **Breadboard** | 400-point half-size | 1 | Component assembly | Keeps wiring organized |
| **Jumper Wires** | Female-to-Male | 6 | GPIO connections | For LEDs, buzzer, button to Pi |
| **Jumper Wires** | Male-to-Male | 4 | Breadboard connections | For breadboard circuits |

### Display & Storage

| Item | Description | Qty | Purpose | Notes |
|------|-------------|-----|---------|-------|
| **TFT Display** | 3.5" or 5" touchscreen | 1 | Real-time feedback | Shows student name, status, photo |
| **USB External Drive/SSD** | 256GB+ | 1 | Backup & large data storage | Optional but highly recommended |

### Accessories & Maintenance

| Item | Description | Qty | Purpose | Notes |
|------|-------------|-----|---------|-------|
| **Lens Cleaning Kit** | Complete kit | 1 | Camera maintenance | Includes: |
| - Microfiber Cloth | - | 1 | Lens cleaning | Prevents scratches |
| - Cleaning Solution | Alcohol-free | 1 | Remove smudges | Camera-safe formula |
| - Air Blower | Rocket blower | 1 | Remove dust | Before wiping |
| - Lens Brush | Soft bristle | 1 | Gentle dust removal | For delicate surfaces |

### Optional Components

| Item | Description | Qty | Purpose | Notes |
|------|-------------|-----|---------|-------|
| **Tripod/Mount** | Adjustable | 1 | Camera positioning | Only if case doesn't hold camera |
| **Ethernet Cable** | Cat6, 3m | 1 | Wired network | More stable than WiFi |
| **UPS Battery** | 5V output | 1 | Power backup | Prevents data loss during outages |

### Estimated Total Cost

| Category | Estimated Cost (USD) |
|----------|---------------------|
| Core Components | ETB 100-150 |
| Electronics | ETB 15-25 |
| Display | ETB 30-50 |
| Storage | ETB 30-60 |
| Accessories | ETB 10-20 |
| **Total** | **ETB 185-305** |

> **Note**: Prices vary by region and supplier. Bulk purchases for multiple classrooms reduce per-unit cost.

---

## 🖥 Software Architecture

### Technology Stack

#### Frontend (React)
```
React 18.2.0
├── React Router 6.8.0        (Navigation)
├── Tailwind CSS 3.2.7        (Styling)
├── Axios 1.3.0               (HTTP Client)
├── Heroicons 2.0.18          (Icons)
├── Lucide React 0.263.1      (Additional Icons)
└── date-fns 2.29.3           (Date Formatting)
```

#### Backend (Django)
```
Django 4.2+
├── Django REST Framework 3.14+   (REST API)
├── PostgreSQL 13+                (Database)
├── OpenCV 4.8+                   (Image Processing)
├── face-recognition 1.3.0        (Face Recognition)
├── NumPy 1.24+                   (Numerical Computing)
├── Pillow 10.1+                  (Image Handling)
├── JWT                           (Authentication)
└── Celery + Redis (Optional)    (Async Tasks)
```

#### IoT Device (Raspberry Pi)
```
Raspbian OS (64-bit)
├── Python 3.9+
├── picamera2                 (Camera Interface)
├── RPi.GPIO                  (GPIO Control)
├── requests                  (HTTP Client)
├── Pillow                    (Image Processing)
└── systemd                   (Auto-start Service)
```

---

## 🎨 Frontend Features (Detailed)

### 1. Authentication & Authorization

#### Login System
- **Modern UI**: Gradient background, card-based design
- **Form Validation**: Real-time email/password validation
- **Remember Me**: Persistent session option
- **Secure**: JWT token-based authentication
- **Error Handling**: User-friendly error messages

#### Role-Based Access Control (RBAC)
| Feature | Admin | Teacher |
|---------|-------|---------|
| View All Attendance | ✅ | ❌ (Own courses only) |
| Approve/Reject | ✅ | ✅ (Own courses) |
| Manage Students | ✅ | ❌ |
| Manage Devices | ✅ | ❌ |
| System Settings | ✅ | ❌ |
| Export Data | ✅ | ✅ (Own courses) |

### 2. Dashboard

#### Statistics Cards (Real-time)
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Total Students │  │Today's Attend.  │  │Pending Approval │  │Attendance Rate  │
│      1,234      │  │      892        │  │       15        │  │     89.5%       │
│   📚 +5 today   │  │   ✅ 72.3%      │  │   ⏳ Review     │  │   📈 +2.1%     │
└─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘
```

#### Quick Actions
- **View Records**: Navigate to attendance table
- **Mark Attendance**: Manual entry for missed captures
- **Export Data**: Download CSV reports
- **Manage Devices**: Configure IoT devices

#### Recent Activity Feed
- Last 10 attendance records
- Real-time updates
- Student name, ID, course, timestamp
- Status badges (Present/Pending/Absent)

### 3. Attendance Management

#### Data Table Features
- **Sortable Columns**: Name, ID, Course, Date, Status
- **Search**: Real-time search across all fields
- **Filters**:
  - Status: All / Pending / Verified / Rejected
  - Date Range: Custom date picker
  - Course: Dropdown filter
  - Student: Autocomplete search
- **Pagination**: 25/50/100 records per page
- **Export**: CSV with all filtered records

#### Record Actions
```
┌────────────────────────────────────────────────────┐
│ Student: Melkamu Wako (STU12345)                      │
│ Course: CSE301 - Data Structures                  │
│ Time: 2025-01-15 09:15:23                         │
│ Confidence: 95.2%                                  │
│ Status: Pending                                    │
│                                                    │
│ [✅ Approve]  [❌ Reject]  [👁 View Details]      │
└────────────────────────────────────────────────────┘
```

#### Image Preview
- Hover to preview captured image
- Click for full-size modal view
- Zoom in/out functionality
- Download original image

### 4. Student Management

#### Student Cards
```
┌──────────────────────────┐
│   [Student Photo]        │
│                          │
│   Melkamu Wako               │
│   STU12345              │
│   📧 john@astu.edu      │
│   🏫 Computer Science   │
│   📅 Year 3             │
│                          │
│   Attendance: 92.5% ✅   │
│                          │
│   [View Profile] [Edit]  │
└──────────────────────────┘
```

#### Features
- **Grid Layout**: Responsive card grid
- **Search**: By name, ID, email, department
- **Filters**: Department, year, attendance rate
- **Sort**: Name, attendance rate, enrollment date
- **Actions**: View profile, edit info, view attendance history

### 5. IoT Device Dashboard

#### Device Monitoring
```
┌─────────────────────────────────────────────────┐
│ Device: Pi-Classroom-A01                        │
│ Status: 🟢 Online                                │
│ Location: Engineering Block, Room 301           │
│                                                  │
│ Metrics:                                         │
│   CPU: ████████░░ 75%                           │
│   Mem: ██████░░░░ 62%                           │
│   Temp: 🌡 52°C                                  │
│   Uptime: 5d 14h 32m                            │
│                                                  │
│ Today's Captures: 45                            │
│ Success Rate: 93.3%                             │
│                                                  │
│ [🔄 Restart] [⚙ Configure] [📊 Logs]           │
└─────────────────────────────────────────────────┘
```

#### Device Settings
- **Capture Interval**: 1-60 seconds
- **Image Quality**: Low (640x480) / Medium (1280x720) / High (1920x1080)
- **Motion Detection**: On/Off with sensitivity slider
- **Night Mode**: Auto IR activation
- **Network**: Timeout, retry attempts, auto-restart
- **Notifications**: Email/SMS alerts for offline devices

### 6. Camera Capture Interface

#### Live Capture Modal
- **Full-screen Interface**: Distraction-free capture
- **Live Video Preview**: Real-time camera feed
- **Face Detection Guide**: Overlay showing optimal position
- **Capture Button**: Take snapshot
- **Preview**: Review photo before upload
- **Retake Option**: Capture again if needed
- **Course Selection**: Dropdown to select current class
- **Upload Progress**: Loading indicator with percentage

#### Mobile Support
- Touch-optimized interface
- Front/back camera switching
- Portrait/landscape modes
- Responsive layout

### 7. Settings & Configuration

#### Profile Settings
- Update name, email, phone
- Change password
- Profile photo upload
- Notification preferences

#### Notification Settings
```
[x] Email Notifications
    [x] Pending approvals
    [x] Device offline alerts
    [ ] Weekly reports

[x] Push Notifications
    [x] Real-time attendance updates
    [ ] Student login alerts

[ ] SMS Notifications
```

#### Appearance
- **Theme**: Light / Dark / System
- **Language**: English / Amharic
- **Time Format**: 12h / 24h
- **Date Format**: MM/DD/YYYY / DD/MM/YYYY

#### Privacy & Security
- Two-factor authentication (2FA)
- Active sessions management
- Data retention settings
- Privacy policy & consent

---

## 🔧 Backend Features

### Authentication API
- JWT token generation & refresh
- User registration with email verification
- Password reset via email
- Role assignment (Admin/Teacher)
- Session management

### Face Recognition Pipeline
1. **Face Detection**: OpenCV Haar Cascade / MTCNN
2. **Face Alignment**: Normalize face orientation
3. **Embedding Generation**: FaceNet / InsightFace model
4. **Similarity Matching**: Cosine similarity against database
5. **Confidence Scoring**: Percentage match confidence
6. **Threshold Filtering**: High (>90%), Medium (70-90%), Low (<70%)

### Device API
- Register new devices with unique IDs
- Update device status & metrics
- Remote configuration updates
- Health check endpoints
- Log aggregation

### Attendance API
- Create attendance records
- Bulk import/export
- Filter & search endpoints
- Approve/reject workflow
- Audit trail logging

### Student API
- CRUD operations for student profiles
- Facial embedding storage
- Bulk enrollment via CSV
- Attendance history reports

---

## 🔌 Hardware Integration

### GPIO Pin Configuration

```
Raspberry Pi 4 GPIO Pinout

┌─────────────────────────────┐
│  3V3   (1) (2)   5V         │
│  GPIO2 (3) (4)   5V         │
│  GPIO3 (5) (6)   GND        │
│  GPIO4 (7) (8)   GPIO14     │
│  GND   (9) (10)  GPIO15     │
│  GPIO17(11)(12)  GPIO18     │  ← Green LED (via 330Ω)
│  GPIO27(13)(14)  GND        │
│  GPIO22(15)(16)  GPIO23     │  ← Red LED (via 330Ω)
│  3V3  (17)(18)  GPIO24     │  ← Buzzer
│  GPIO10(19)(20)  GND        │
│  GPIO9 (21)(22)  GPIO25     │  ← Push Button
│  GPIO11(23)(24)  GPIO8      │
│  GND  (25)(26)  GPIO7      │
│  ...                        │
└─────────────────────────────┘

Wiring Summary:
- Green LED: GPIO18 → 330Ω → LED+ → LED- → GND
- Red LED:   GPIO23 → 330Ω → LED+ → LED- → GND
- Buzzer:    GPIO24 → Buzzer+ → Buzzer- → GND
- Button:    GPIO25 → Button → GND (with internal pull-up)
```

### Circuit Diagram

```
                    Raspberry Pi 4
                    ┌─────────────┐
                    │   GPIO18    ├─────[330Ω]─────┐
                    │             │                 │
                    │   GPIO23    ├─────[330Ω]────┐│
                    │             │                ││
                    │   GPIO24    ├───────────────┐││
                    │             │               │││
                    │   GPIO25    ├──────┐        │││
                    │             │      │        │││
                    │   GND       ├──────┼────────┼┼┼───┐
                    └─────────────┘      │        │││   │
                                         │        │││   │
                    ┌────────────────────┘        │││   │
                    │  Push Button                │││   │
                    │  [  ]───────────────────────┘││   │
                    │                              ││   │
                    │  Green LED                   ││   │
                    │  ├───(+)──────────────────────┘│   │
                    │  └───(-)────────────────────────┘  │
                    │                                     │
                    │  Red LED                            │
                    │  ├───(+)──────────────────────────┘ │
                    │  └───(-)──────────────────────────┘ │
                    │                                      │
                    │  Buzzer                              │
                    │  ├───(+)───────────────────────────┘ │
                    │  └───(-)───────────────────────────┘ │
                    └──────────────────────────────────────┘
```

### TFT Display Connection

**3.5" TFT SPI Display**
- Connects via GPIO header (pins 1-26)
- Uses SPI interface for communication
- Touchscreen via additional GPIO pins
- Requires display drivers (`fbcp-ili9341` or similar)

---

## 📥 Installation & Setup

### Prerequisites

**Development Machine:**
- Python 3.9+
- Node.js 16+
- PostgreSQL 13+ (or SQLite for dev)
- Git

**Raspberry Pi:**
- Raspberry Pi 4 Model B (4GB RAM)
- Raspbian OS Lite (64-bit recommended)
- MicroSD card (64GB+, Class 10)
- Internet connection (WiFi or Ethernet)

### Step 1: Clone Repository

```bash
git clone https://github.com/your-org/CAVS.git
cd CAVS
```

### Step 2: Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
nano .env  # Configure database, secrets, etc.

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Load sample data (optional)
python manage.py loaddata fixtures/sample_data.json

# Start development server
python manage.py runserver 0.0.0.0:8000
```

**Backend will run at**: `http://localhost:8000`  
**API docs**: `http://localhost:8000/api/docs`

### Step 3: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
nano .env  # Set REACT_APP_API_URL

# Start development server
npm start
```

**Frontend will run at**: `http://localhost:3000`

### Step 4: Raspberry Pi Setup

#### A. Prepare SD Card
```bash
# Download Raspberry Pi Imager
# https://www.raspberrypi.com/software/

# Flash Raspbian OS Lite (64-bit) to SD card
# Enable SSH and WiFi in imager settings
```

#### B. Initial Pi Configuration
```bash
# SSH into Pi (default password: raspberry)
ssh pi@raspberrypi.local

# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Change default password
passwd

# Configure Pi
sudo raspi-config
# - Enable Camera
# - Enable SPI (for TFT display)
# - Enable I2C (optional)
# - Set Timezone
# - Expand Filesystem
```

#### C. Install Dependencies
```bash
# Install Python packages
sudo apt-get install -y python3-pip python3-opencv
sudo pip3 install RPi.GPIO picamera2 requests Pillow

# Install display drivers (for TFT)
git clone https://github.com/juj/fbcp-ili9341.git
cd fbcp-ili9341
mkdir build && cd build
cmake ..
make -j4
sudo ./fbcp-ili9341
```

#### D. Deploy Capture Script
```bash
# Copy capture script from repo
cd ~
git clone https://github.com/your-org/CAVS.git
cd CAVS/devices/pi

# Create config file
cp config.example.json config.json
nano config.json
```

**config.json:**
```json
{
  "device_id": "pi-classroom-a01",
  "api_url": "http://your-backend-server:8000/api/capture",
  "api_key": "your-device-api-key",
  "capture_interval": 5,
  "image_quality": "medium",
  "gpio": {
    "green_led": 18,
    "red_led": 23,
    "buzzer": 24,
    "button": 25
  }
}
```

#### E. Test Capture Script
```bash
python3 capture_script.py
```

#### F. Auto-start on Boot
```bash
# Create systemd service
sudo nano /etc/systemd/system/cavs-capture.service
```

**cavs-capture.service:**
```ini
[Unit]
Description=CAVS Attendance Capture Service
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/CAVS/devices/pi
ExecStart=/usr/bin/python3 capture_script.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl enable cavs-capture.service
sudo systemctl start cavs-capture.service

# Check status
sudo systemctl status cavs-capture.service
```

---

## 🚀 Deployment Guide

### Production Deployment

#### Backend (Django)

**Using Gunicorn + Nginx:**
```bash
# Install Gunicorn
pip install gunicorn

# Create Gunicorn service
sudo nano /etc/systemd/system/cavs-backend.service
```

**cavs-backend.service:**
```ini
[Unit]
Description=CAVS Django Backend
After=network.target

[Service]
Type=notify
User=www-data
WorkingDirectory=/var/www/cavs/backend
ExecStart=/var/www/cavs/backend/venv/bin/gunicorn \
          --workers 4 \
          --bind unix:/run/cavs-backend.sock \
          app.wsgi:application

[Install]
WantedBy=multi-user.target
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location /api {
        proxy_pass http://unix:/run/cavs-backend.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static {
        alias /var/www/cavs/backend/staticfiles;
    }
}
```

#### Frontend (React)

```bash
# Build production bundle
npm run build

# Deploy to Netlify/Vercel
netlify deploy --prod

# Or serve with Nginx
sudo cp -r build/* /var/www/html/cavs-frontend/
```

#### Database (PostgreSQL)

```bash
# Create production database
sudo -u postgres createdb cavs_production

# Create database user
sudo -u postgres psql
postgres=# CREATE USER cavs_user WITH PASSWORD 'strong_password';
postgres=# GRANT ALL PRIVILEGES ON DATABASE cavs_production TO cavs_user;
postgres=# \q

# Update backend .env
DATABASE_URL=postgresql://cavs_user:strong_password@localhost:5432/cavs_production
```

---

## 👥 Team & Credits

### Project Team

**Project Lead**: Abenezer Markos  
**Frontend Developer**: Melkamu Wako  
**Institution**: Adama Science and Technology University (ASTU)  
**Department**: Material Science and Engineering / Economics  

### Acknowledgments

- ASTU Faculty and Staff
- Open-source community
- React, Django, and Raspberry Pi communities

### Contact

For questions, support, or collaboration:
- **Email**: [your-email@astu.edu]
- **GitHub**: [Repository Link]
- **Documentation**: [Full Docs Link]

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔮 Future Enhancements

- [ ] Mobile app (React Native) for teachers
- [ ] Geofencing for location verification
- [ ] Advanced analytics and reporting dashboard
- [ ] Integration with university ERP systems
- [ ] Multi-language support (Amharic, Oromo)
- [ ] Biometric alternatives (fingerprint, iris)
- [ ] Attendance prediction using ML
- [ ] Parent/guardian portal
- [ ] Automated absence notifications

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅

---

**Built with ❤️ at Adama Science and Technology University**


