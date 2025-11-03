# 🎓 CAVS - Smart Attendance System Frontend

**Computer-Aided Attendance Verification System with IoT Integration**

A modern, full-featured React-based web application for managing facial recognition-based attendance with real-time IoT device monitoring and control.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [IoT Integration](#iot-integration)
- [User Roles & Permissions](#user-roles--permissions)
- [API Configuration](#api-configuration)
- [Available Pages](#available-pages)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 🌟 Overview

CAVS Frontend is a comprehensive web interface for the Computer-Aided Attendance Verification System. It provides administrators and teachers with powerful tools to monitor attendance, manage students, and control IoT devices (Raspberry Pi, ESP32) used for facial recognition capture.

### Key Highlights

- ✅ **Real-time IoT Device Monitoring** - Monitor Raspberry Pi and ESP32 devices
- ✅ **Facial Recognition Integration** - Process and verify attendance from camera feeds
- ✅ **Role-Based Access Control** - Admin and Teacher roles with different permissions
- ✅ **Interactive Dashboard** - Statistics, charts, and real-time updates
- ✅ **Device Management** - Configure, restart, and troubleshoot IoT devices remotely
- ✅ **Attendance Management** - View, approve, reject, and export attendance records
- ✅ **Student Profiles** - Manage student information and track attendance rates
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

---

## ✨ Features

### 🎯 Core Features

#### 1. **Authentication & Authorization**
- Secure login system with JWT token support
- Role-based access (Admin/Teacher)
- Protected routes and session management
- "Remember Me" functionality
- Password reset capability

#### 2. **Dashboard**
- **Statistics Cards:**
  - Total students enrolled
  - Today's attendance count
  - Pending approvals
  - Overall attendance rate
- **Quick Actions:**
  - View records
  - Mark attendance manually
  - Export data
  - Manage devices
- **Recent Activity Feed:**
  - Latest attendance records
  - Device status updates
  - System notifications

#### 3. **IoT Device Dashboard** 🆕
- **Real-time Monitoring:**
  - Device online/offline status
  - CPU and memory usage
  - Temperature monitoring
  - Network latency
  - Uptime tracking
- **Device Statistics:**
  - Total devices count
  - Online/offline breakdown
  - Daily capture counts
  - Average uptime
- **Device Control:**
  - Remote restart
  - Configuration updates
  - Add/remove devices
  - View live camera feeds

#### 4. **Attendance Records Management**
- **Data Table with:**
  - Student name, ID, course
  - Timestamp and status
  - Verification actions
  - Image preview
- **Search & Filter:**
  - Search by name, ID, or course
  - Filter by status (All/Pending/Verified/Rejected)
  - Date range filtering
- **Actions:**
  - Approve attendance
  - Reject with reason
  - View full details
  - Export to CSV

#### 5. **Student Management**
- View all enrolled students
- Student profile cards with photos
- Department and year information
- Individual attendance rates
- Search functionality

#### 6. **Device Settings** 🆕
- **Capture Configuration:**
  - Capture interval adjustment
  - Image quality settings (Low/Medium/High)
  - Motion detection toggle
  - Night mode (IR) support
- **Network Settings:**
  - Connection timeout
  - Retry attempts
  - Auto-restart on failure
- **Notifications:**
  - Device offline alerts
  - Capture failure notifications

#### 7. **System Settings**
- User profile management
- Notification preferences
- Password change
- Privacy settings
- Appearance customization

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | UI Framework |
| **React Router** | 6.8.0 | Client-side routing |
| **Tailwind CSS** | 3.2.7 | Styling framework |
| **Heroicons** | 2.0.18 | Icon library |
| **Axios** | 1.3.0 | HTTP client for API calls |
| **Date-fns** | 2.29.3 | Date formatting |
| **Lucide React** | 0.263.1 | Additional icons |

### Development Tools
- **React Scripts** 5.0.1 - Build tooling
- **PostCSS** 8.4.21 - CSS processing
- **Autoprefixer** 10.4.14 - CSS vendor prefixes

---

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html              # Main HTML file
│   └── manifest.json           # PWA manifest
│
├── src/
│   ├── assets/                 # Images, fonts, static files
│   │   └── .gitkeep
│   │
│   ├── components/             # Reusable UI components
│   │   ├── Header.js          # Top navigation bar
│   │   ├── Sidebar.js         # Side navigation menu
│   │   ├── Layout.js          # Page layout wrapper
│   │   └── PrivateRoute.js    # Protected route wrapper
│   │
│   ├── pages/                  # Page components
│   │   ├── Login.js           # Login page
│   │   ├── Dashboard.js       # Main dashboard
│   │   ├── AttendanceRecords.js  # Attendance table
│   │   ├── Students.js        # Student management
│   │   ├── IoTDashboard.js    # IoT device monitoring 🆕
│   │   ├── DeviceSettings.js  # Device configuration 🆕
│   │   └── Settings.js        # User settings
│   │
│   ├── contexts/               # React Context providers
│   │   └── AuthContext.js     # Authentication state
│   │
│   ├── services/               # API service functions
│   │   └── api.js             # Axios instance & API calls
│   │
│   ├── config/                 # Configuration files
│   │   └── api.js             # API base URL config
│   │
│   ├── utils/                  # Utility functions
│   │   └── helpers.js         # Helper functions
│   │
│   ├── App.js                  # Main app component
│   ├── index.js                # Entry point
│   └── index.css               # Global styles
│
├── package.json                # Dependencies
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
└── README.md                   # Documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** v16.0 or higher
- **npm** v8.0 or higher (or **yarn** v1.22+)
- **Git** (for version control)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/JULIASIV/CAVS-.git
   cd CAVS-/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API endpoint:**
   
   Edit `src/config/api.js`:
   ```javascript
   const API_BASE_URL = 'http://your-backend-url:8000';
   export default API_BASE_URL;
   ```

4. **Start development server:**
   ```bash
   npm start
   ```

5. **Open in browser:**
   Navigate to `http://localhost:3000`

### Default Login Credentials

**Admin Account:**
- Email: `admin@astu.edu`
- Password: `password`

**Teacher Account:**
- Email: `teacher@astu.edu`
- Password: `password`

> ⚠️ **Important:** Change these credentials in production!

---

## 🌐 IoT Integration

### Supported Devices

1. **Raspberry Pi with Camera Module**
   - Purpose: High-quality facial capture
   - Communication: REST API over WiFi
   - Features: Motion detection, night vision (IR), adjustable quality

2. **ESP32 Microcontroller**
   - Purpose: Access control points, low-cost deployment
   - Communication: MQTT/HTTP
   - Features: Power-efficient, compact design

### Device API Endpoints

The frontend communicates with devices through the backend API:

```javascript
// Get all devices
GET /api/devices

// Get device details
GET /api/devices/:deviceId

// Update device settings
PUT /api/devices/:deviceId/settings

// Restart device
POST /api/devices/:deviceId/restart

// Get device metrics
GET /api/devices/:deviceId/metrics
```

### Real-time Updates

The IoT Dashboard supports WebSocket connections for real-time device status updates:

```javascript
const ws = new WebSocket('ws://backend-url:8000/ws/devices');
ws.onmessage = (event) => {
  const deviceUpdate = JSON.parse(event.data);
  // Update UI with device status
};
```

### Device Configuration

Configure devices through the **Device Settings** page:

- **Capture Settings:**
  - Interval: 1-60 seconds
  - Quality: Low (640x480), Medium (1280x720), High (1920x1080)
  - Motion detection sensitivity
  - Night mode threshold

- **Network Settings:**
  - Connection timeout: 10-120 seconds
  - Max retries: 1-10 attempts
  - Auto-restart on failure

---

## 👥 User Roles & Permissions

### Admin Role

**Full Access:**
- ✅ View all attendance records (all courses)
- ✅ Approve/reject attendance
- ✅ Manage all students
- ✅ Add/remove/configure IoT devices
- ✅ View system analytics
- ✅ Export all data
- ✅ Manage user accounts
- ✅ System settings

### Teacher Role

**Limited Access:**
- ✅ View own course attendance
- ✅ Verify attendance for assigned courses
- ✅ View enrolled students
- ✅ Export own course data
- ❌ Cannot manage devices
- ❌ Cannot access other courses
- ❌ Cannot modify system settings

---

## ⚙️ API Configuration

### Backend Integration

Configure the backend API URL in `src/config/api.js`:

```javascript
// Development
const API_BASE_URL = 'http://localhost:8000';

// Production
// const API_BASE_URL = 'https://api.yourdomain.com';

export default API_BASE_URL;
```

### API Service Structure

The `src/services/api.js` file contains all API calls:

```javascript
import axios from 'axios';
import API_BASE_URL from '../config/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

## 📄 Available Pages

### 1. Login (`/login`)
- Email/password authentication
- Remember me checkbox
- Forgot password link

### 2. Dashboard (`/dashboard`)
- Overview statistics
- Recent activity
- Quick actions

### 3. Attendance Records (`/attendance`)
- Searchable table
- Filter by status
- Approve/reject actions
- CSV export

### 4. Students (`/students`)
- Student cards grid
- Search functionality
- Individual attendance rates

### 5. IoT Dashboard (`/iot-dashboard`) 🆕
- Device monitoring
- Performance metrics
- Remote control

### 6. Device Settings (`/device-settings`) 🆕
- Capture configuration
- Network settings
- Notifications

### 7. Settings (`/settings`)
- Profile management
- Preferences
- Security

---

## 📦 Available Commands

```bash
# Development
npm start                # Start dev server (port 3000)
npm run build           # Build for production
npm test                # Run tests
npm run eject           # Eject from Create React App (⚠️ irreversible)

# Installation
npm install             # Install dependencies
npm install --legacy-peer-deps  # If dependency conflicts

# Linting & Formatting (if configured)
npm run lint            # Run ESLint
npm run format          # Run Prettier
```

---

## 🚢 Deployment

### Production Build

1. **Create optimized build:**
   ```bash
   npm run build
   ```

2. **Build output:**
   - Creates `build/` folder
   - Optimized and minified files
   - Ready for static hosting

### Deployment Options

#### Option 1: Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

#### Option 2: Vercel
```bash
npm install -g vercel
vercel --prod
```

#### Option 3: Traditional Hosting
Upload the `build/` folder contents to your web server.

#### Option 4: Docker
```dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Port 3000 Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Use different port
set PORT=3001 && npm start
```

#### 2. Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

#### 3. Tailwind Styles Not Loading
```bash
# Restart dev server
npm start
```

#### 4. API Connection Failed
- Check `src/config/api.js` for correct backend URL
- Ensure backend is running
- Check CORS settings on backend

#### 5. Build Fails
```bash
# Clear cache
npm cache clean --force
rm -rf node_modules build
npm install
npm run build
```

---

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes and commit:**
   ```bash
   git add .
   git commit -m "Add: your feature description"
   ```

4. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**

### Coding Standards

- Use functional components with hooks
- Follow ESLint rules
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add comments for complex logic

---

## 📞 Support & Contact

**Project Lead:** Abenezer Markos  
**Frontend Developer:** [Your Name Here]  
**Institution:** Adama Science and Technology University (ASTU)  
**Department:** Material Science and Engineering

**Repository:** https://github.com/JULIASIV/CAVS-

---

## 📄 License

This project is developed for educational purposes.

---

## 🎉 Acknowledgments

- ASTU Faculty and Staff
- Open-source contributors
- React and Tailwind CSS communities

---

## 🔮 Future Enhancements

- [ ] Multi-language support (i18n)
- [ ] Dark mode
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and reporting
- [ ] Integration with university ERP systems
- [ ] Biometric alternatives (fingerprint, iris)
- [ ] Attendance prediction using ML
- [ ] Geofencing for location verification

---

**Made with ❤️ by ASTU Students**

*Last Updated: October 2025*

