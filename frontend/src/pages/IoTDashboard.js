import React, { useState, useEffect } from 'react';
import { WifiIcon, CpuChipIcon, SignalIcon, BoltIcon, CameraIcon } from '@heroicons/react/24/outline';

const IoTDashboard = () => {
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: 'Raspberry Pi - Room 101',
      type: 'Camera Device',
      status: 'online',
      ip: '192.168.1.100',
      lastSeen: new Date(),
      temperature: 42,
      cpuUsage: 35,
      memoryUsage: 58,
      capturesToday: 145,
      uptime: '5d 12h'
    },
    {
      id: 2,
      name: 'ESP32 - Main Gate',
      type: 'Access Control',
      status: 'online',
      ip: '192.168.1.101',
      lastSeen: new Date(),
      temperature: 38,
      cpuUsage: 22,
      memoryUsage: 45,
      capturesToday: 89,
      uptime: '3d 8h'
    },
    {
      id: 3,
      name: 'Raspberry Pi - Library',
      type: 'Camera Device',
      status: 'offline',
      ip: '192.168.1.102',
      lastSeen: new Date(Date.now() - 3600000),
      temperature: 0,
      cpuUsage: 0,
      memoryUsage: 0,
      capturesToday: 0,
      uptime: '0h'
    }
  ]);

  const [stats, setStats] = useState({
    totalDevices: 3,
    onlineDevices: 2,
    offlineDevices: 1,
    totalCaptures: 234,
    averageUptime: '4d 10h'
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">IoT Device Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor and manage your attendance devices in real-time</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Add Device
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Devices</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalDevices}</p>
            </div>
            <CpuChipIcon className="h-12 w-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Online Devices</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.onlineDevices}</p>
            </div>
            <SignalIcon className="h-12 w-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Offline Devices</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.offlineDevices}</p>
            </div>
            <WifiIcon className="h-12 w-12 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Captures Today</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalCaptures}</p>
            </div>
            <CameraIcon className="h-12 w-12 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Device List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Connected Devices</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Device
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Captures
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {devices.map((device) => (
                <tr key={device.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          device.status === 'online' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <CpuChipIcon className={`h-6 w-6 ${
                            device.status === 'online' ? 'text-green-600' : 'text-red-600'
                          }`} />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{device.name}</div>
                        <div className="text-sm text-gray-500">{device.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      device.status === 'online' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {device.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {device.ip}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <span className="w-16">CPU:</span>
                        <div className="w-full bg-gray-200 rounded-full h-2 ml-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${device.cpuUsage}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs">{device.cpuUsage}%</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-16">Temp:</span>
                        <span className="ml-2 text-xs">{device.temperature}°C</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {device.capturesToday}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    <button className="text-green-600 hover:text-green-900 mr-3">Restart</button>
                    <button className="text-red-600 hover:text-red-900">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IoTDashboard;

