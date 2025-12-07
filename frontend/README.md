# 🎨 CAVS Frontend - React Application

**Modern Web Interface for Smart Attendance System**

A responsive React-based dashboard for managing facial recognition attendance with real-time IoT device monitoring.

---

## 📋 Quick Start

### Prerequisites

- **Node.js** 16.0 or higher
- **npm** 6.0 or higher (comes with Node.js)
- A running backend API at `http://localhost:8000`

### Installation & Run

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open automatically at **http://localhost:3000**

### Demo Login Credentials

**Admin Account:**
```
Email: admin@astu.edu
Password: password
```

**Teacher Account:**
```
Email: teacher@astu.edu
Password: password
```

---

## ✨ Features

### 🔐 Authentication
- Secure login with JWT tokens
- Role-based access control (Admin/Teacher)
- Session management
- "Remember Me" functionality

### 📊 Dashboard
- Real-time statistics cards
- Today's attendance count
- Pending approvals
- Recent activity feed
- Quick actions menu

### 🤖 IoT Device Management
- Real-time device status monitoring
- CPU, memory, and temperature tracking
- Remote device control (restart, configure)
- Network latency monitoring
- Device uptime statistics

### 📝 Attendance Management
- View all attendance records
- Search and filter by name, ID, course, date
- Approve/reject attendance with reasons
- Image preview for verification
- Export to CSV

### 👥 Student Management
- View enrolled students
- Student profile cards with photos
- Individual attendance rates
- Department and year information

### ⚙️ Settings
- User profile management
- Device configuration
- Notification preferences
- Password change
- Privacy settings

---

## 🛠 Tech Stack

| Technology | Version | Purpose |
|------------|---------|----------|
| React | 18.2.0 | UI Framework |
| React Router | 6.8.0 | Client-side routing |
| Tailwind CSS | 3.2.7 | Utility-first styling |
| Axios | 1.3.0 | HTTP requests |
| Heroicons | 2.0.18 | Icon library |
| Lucide React | 0.263.1 | Additional icons |
| date-fns | 2.29.3 | Date formatting |

---

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html              # HTML template
│   ├── favicon.ico
│   └── manifest.json           # PWA manifest
│
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── Header.js          # Top navigation
│   │   ├── Sidebar.js         # Side menu
│   │   ├── Layout.js          # Page wrapper
│   │   └── PrivateRoute.js    # Protected routes
│   │
│   ├── pages/                  # Page components
│   │   ├── Login.js           # Login page
│   │   ├── Dashboard.js       # Main dashboard
│   │   ├── AttendanceRecords.js  # Attendance table
│   │   ├── Students.js        # Student management
│   │   ├── IoTDashboard.js    # Device monitoring
│   │   ├── DeviceSettings.js  # Device config
│   │   └── Settings.js        # User settings
│   │
│   ├── contexts/               # React contexts
│   │   └── AuthContext.js     # Auth state management
│   │
│   ├── services/               # API services
│   │   └── api.js             # Axios instance & API calls
│   │
│   ├── config/                 # Configuration
│   │   └── api.js             # API base URL
│   │
│   ├── utils/                  # Helper functions
│   │   └── helpers.js         # Utility functions
│   │
│   ├── App.js                  # Main app component
│   ├── index.js                # Entry point
│   └── index.css               # Global styles
│
├── package.json                # Dependencies
├── tailwind.config.js          # Tailwind config
├── postcss.config.js           # PostCSS config
└── README.md                   # This file
```

---

## 🚀 Available Scripts

### Development

```bash
# Start development server (with hot reload)
npm start
```

Runs at **http://localhost:3000**

### Production Build

```bash
# Create optimized production build
npm run build
```

Generates static files in `build/` folder ready for deployment.

### Testing

```bash
# Run test suite
npm test

# Run tests with coverage
npm test -- --coverage
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the frontend root:

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENV=development
```

### API Configuration

Edit `src/config/api.js` to change backend URL:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default API_BASE_URL;
```

### Tailwind Customization

Modify `tailwind.config.js` for custom colors, fonts, etc:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
      },
    },
  },
};
```

---

## 🌐 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ⚠️ IE 11 (not supported)

---

## 🐛 Troubleshooting

### Port 3000 Already in Use

**Solution:** Run on different port
```bash
PORT=3001 npm start
```

### npm install Fails

**Solution:** Clear cache and reinstall
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Tailwind Styles Not Working

**Solution:** Restart dev server
```bash
# Stop server (Ctrl+C)
npm start
```

### Cannot Connect to Backend

**Solution:** Check backend is running and CORS is configured
1. Verify backend at http://localhost:8000
2. Check `CORS_ALLOWED_ORIGINS` in backend settings
3. Verify `REACT_APP_API_URL` in `.env`

### Build Fails

**Solution:** Check for TypeScript errors or missing dependencies
```bash
npm install
npm run build
```

---

## 📦 Deployment

### Deploy to Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy `build/` folder to Netlify

3. Set environment variables in Netlify dashboard:
   ```
   REACT_APP_API_URL=https://your-backend-api.com
   ```

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

### Deploy with Docker

See `../infra/docker-compose.yml` for full-stack deployment.

---

## 🔒 Security Notes

- **Development Mode:** Uses mock authentication (NOT for production)
- **Production:** Ensure backend uses HTTPS and proper JWT validation
- **Secrets:** Never commit `.env` files with real credentials
- **CORS:** Configure backend CORS properly for production domain

---

## 📚 Key Pages

### Login (`/login`)
Authentication page with email/password login

### Dashboard (`/dashboard`)
Main overview with statistics and quick actions

### Attendance Records (`/attendance`)
Table view with search, filter, approve/reject actions

### Students (`/students`)
Grid view of enrolled students with profiles

### IoT Devices (`/iot-dashboard`)
Real-time device monitoring and control

### Settings (`/settings`)
User preferences and system configuration

---

## 🤝 Contributing

See main [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Create feature branch
2. Make changes
3. Test locally
4. Submit PR

---

## 📄 License

MIT License - See [LICENSE](../LICENSE)

---

## 👨‍💻 Team
**Team Name:** Team Alpha
**Project Lead:** Abenezer Markos  
**Frontend Developer:** Melkamu Wako  
**Institution:** ASTU (Adama Science and Technology University)  

---

**For backend setup, see `../backend/README.md`**  
**For full project documentation, see main `../README.md`**

