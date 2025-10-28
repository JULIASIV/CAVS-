import React from 'react';
import { Link } from 'react-router-dom';
import {
  HomeIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, currentPath }) => {
  const navigation = [
    { name: 'Dashboard', icon: HomeIcon, path: '/' },
    { name: 'Attendance Records', icon: ClipboardDocumentCheckIcon, path: '/attendance' },
    { name: 'Students', icon: UserGroupIcon, path: '/students' },
    { name: 'Settings', icon: Cog6ToothIcon, path: '/settings' },
  ];

  return (
    <aside
      className={`bg-white shadow-lg transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-0 lg:w-20'
      } overflow-hidden flex flex-col border-r border-gray-200`}
    >
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">SA</span>
          </div>
          {isOpen && (
            <div>
              <h1 className="text-lg font-bold text-gray-900">Smart Attendance</h1>
              <p className="text-xs text-gray-500">Management System</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-6 w-6 flex-shrink-0" />
              {isOpen && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;

