# Smart Attendance System - Frontend

Smart Facial Recognition-Based Attendance Management System Frontend Application

## Project Overview

This is the frontend web interface for the Smart Facial Recognition-Based Attendance Management System. It provides a modern, responsive UI for teachers and administrators to manage student attendance records.

## Features

- **Role-Based Access Control** (Teacher/Admin)
- **User Authentication** with secure login
- **Attendance Dashboard** with real-time statistics
- **Attendance Records Management** - view, verify, and modify attendance
- **Data Export** - CSV export functionality
- **Student Management** - view enrolled students
- **Modern UI** with responsive design
- **Dark Mode Support**

## Tech Stack

- **React 18** - UI Framework
- **React Router** - Navigation
- **Axios** - HTTP Client
- **Tailwind CSS** - Styling
- **Heroicons** - Icons
- **Date-fns** - Date formatting

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Page components
├── contexts/        # React contexts
├── services/        # API service functions
├── utils/           # Utility functions
├── styles/          # Global styles
└── assets/          # Images and static files
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## User Roles

### Admin
- Full access to all features
- View all attendance records
- Manage users and settings
- Export data
- Approve/Modify attendance

### Teacher
- View own class attendance
- Verify attendance records
- Export data for their classes

## API Integration

The frontend expects a backend API at `http://localhost:8000` by default. Configuration can be changed in `src/config/api.js`.

## License

This project is developed for educational purposes by (ASTU) students.

---

**Note:** This is the frontend-only implementation. Backend API and ML components are separate.

