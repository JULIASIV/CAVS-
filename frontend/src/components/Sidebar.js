import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';
import {
  HomeIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  CameraIcon,
  ChartBarIcon,
  CpuChipIcon,
  WrenchScrewdriverIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, currentPath }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const navigation = [
    { name: 'Dashboard', icon: HomeIcon, path: '/dashboard', roles: ['admin', 'teacher'] },
    { name: 'Camera Capture', icon: CameraIcon, path: '/camera', roles: ['admin', 'teacher'] },
    { name: 'Attendance Records', icon: ClipboardDocumentCheckIcon, path: '/attendance', roles: ['admin', 'teacher'] },
    { name: 'Students', icon: UserGroupIcon, path: '/students', roles: ['admin', 'teacher'] },
    { name: 'Analytics', icon: ChartBarIcon, path: '/analytics', roles: ['admin', 'teacher'] },
    { name: 'IoT Devices', icon: CpuChipIcon, path: '/iot-dashboard', roles: ['admin'] },
    { name: 'Device Settings', icon: WrenchScrewdriverIcon, path: '/device-settings', roles: ['admin'] },
    { name: 'Settings', icon: Cog6ToothIcon, path: '/settings', roles: ['admin', 'teacher'] },
  ];

  // Filter navigation based on user role
  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <aside
      className={`bg-gradient-to-b from-white to-gray-50 shadow-xl transition-all duration-300 ${
        isOpen ? 'w-72' : 'w-0 lg:w-20'
      } overflow-hidden flex flex-col border-r-2 border-primary-100`}
    >
      {/* Logo Section */}
      <div className="p-6 bg-primary-600 text-white">
        {isOpen ? (
          <Logo className="h-12 w-12" textClassName="block" />
        ) : (
          <Logo className="h-10 w-10" />
        )}
      </div>

      {/* Welcome Message */}
      {isOpen && (
        <div className="px-6 py-4 bg-primary-50 border-b border-primary-100">
          <p className="text-sm text-gray-600">Welcome,</p>
          <p className="font-semibold text-gray-900">{user?.name || 'User'}</p>
          <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
            isAdmin 
              ? 'bg-accent-100 text-accent-700 font-medium'
              : 'bg-secondary-100 text-secondary-700'
          }`}>
            {isAdmin ? '👑 Administrator' : '👨‍🏫 Teacher'}
          </span>
        </div>
      )}

      <nav className="flex-1 px-3 py-4 space-y-1">
        {filteredNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary-600 text-white shadow-md transform scale-105'
                  : 'text-gray-700 hover:bg-primary-50 hover:text-primary-700'
              }`}
            >
              <Icon className="h-6 w-6 flex-shrink-0" />
              {isOpen && <span className="font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;

