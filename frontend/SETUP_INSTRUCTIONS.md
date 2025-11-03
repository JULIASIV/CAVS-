# Smart Attendance System - Setup Instructions

## 🚀 Quick Start Guide

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher) or **yarn**
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Step 1: Navigate to Project Directory

```bash
cd "Smart Attendance System"
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- React 18
- React Router
- Tailwind CSS
- Axios
- Heroicons
- Date-fns

### Step 3: Start Development Server

```bash
npm start
```

The application will open automatically in your browser at `http://localhost:3000`

### Step 4: Access the Application

- **URL**: http://localhost:3000
- **Login Page**: http://localhost:3000/login

## 📝 Demo Credentials

Use these credentials to log in:

### Admin Account
```
Email: admin@astu.edu
Password: password
```

### Teacher Account
```
Email: teacher@astu.edu
Password: password
```

## 🏗 Project Structure Overview

```
Smart Attendance System/
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Page components
│   ├── contexts/      # React contexts
│   ├── config/        # Configuration
│   ├── services/      # API services
│   └── utils/         # Helper functions
├── public/            # Static files
└── package.json       # Dependencies
```

## 🎨 Key Features

### 1. **User Authentication**
- Secure login system
- Role-based access (Admin/Teacher)
- Session management

### 2. **Dashboard**
- Real-time statistics
- Quick actions
- Recent activity

### 3. **Attendance Management**
- View all records
- Search and filter
- Approve/Reject attendance
- Export to CSV

### 4. **Student Management**
- View student profiles
- Search functionality
- Attendance tracking

### 5. **Settings**
- Customize preferences
- Security settings
- Notification controls

## 🛠 Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App (irreversible)
npm run eject
```

## 📦 Building for Production

1. Create production build:
   ```bash
   npm run build
   ```

2. The `build/` folder will contain optimized production files.

3. Deploy the `build/` folder to your hosting service (Netlify, Vercel, etc.)

## 🔧 Configuration

### API Endpoint Configuration

Edit `src/config/api.js` to update the backend API URL:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
```

### Environment Variables

Create a `.env` file in the root directory:

```
REACT_APP_API_URL=http://localhost:8000
```

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🐛 Troubleshooting

### Issue: npm install fails
**Solution**: Clear npm cache and try again
```bash
npm cache clean --force
npm install
```

### Issue: Port 3000 already in use
**Solution**: Use a different port
```bash
PORT=3001 npm start
```

### Issue: Tailwind styles not working
**Solution**: Restart the development server
```bash
npm start
```

### Issue: Module not found errors
**Solution**: Reinstall dependencies
```bash
rm -rf node_modules
npm install
```

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [React Router Docs](https://reactrouter.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Heroicons](https://heroicons.com)

## 🔐 Security Notes

- This is a development build with mock authentication
- For production, implement proper JWT authentication
- Add HTTPS/SSL certificates
- Implement proper session management
- Use environment variables for sensitive data

## 📞 Support

For issues or questions:
- Project Lead: Abenezer Markos
- Frontend Developer: [Your Name Here]
- Institution: Adama Science and Technology University (ASTU)
- Department: Material Science and Engineering

## ✅ Checklist

Before deploying:

- [ ] Update API endpoint URLs
- [ ] Configure environment variables
- [ ] Test all user flows
- [ ] Verify responsive design
- [ ] Check browser compatibility
- [ ] Run production build
- [ ] Test production build locally

---

**Ready to use!** 🎉

Start the development server and begin exploring the Smart Attendance System.

