import React, { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { attendanceAPI } from "../services/api";

const AttendanceRecords = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // --------------------------------------
  // Fetch Data From Backend
  // --------------------------------------
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const response = await attendanceAPI.getAll();

        // Normalize response from backend into the shape the UI expects
        const raw = Array.isArray(response) ? response : response.results || [];

        const data = raw.map((r) => {
          const student = r.student || {};
          const session = r.session || {};
          const course = session.course || {};

          const ts = r.timestamp || session.date || null;
          const dateObj = ts ? new Date(ts) : null;

          return {
            id: r.id,
            student_name: student.first_name || student.last_name ? `${(student.first_name || "").trim()} ${(student.last_name || "").trim()}`.trim() : (student.student_code || 'Unknown'),
            student_id: student.student_code || '',
            course: course.name || course.code || '',
            // prefer record timestamp for date/time, fall back to session date
            date: dateObj ? dateObj.toISOString().split('T')[0] : (session.date || ''),
            time: dateObj ? dateObj.toLocaleTimeString() : '',
            status: r.status,
            // treat AI-generated records as unverified/pending
            verified: !(r.confirmation_method && String(r.confirmation_method).toLowerCase().startsWith('ai')),
            raw: r,
          };
        });

        setAttendanceData(data);
        setError("");
      } catch (err) {
        console.error("Failed to load attendance:", err);
        setError("Could not load attendance. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [refetchTrigger]);

  // --------------------------------------
  // Filtering Logic
  // --------------------------------------
  const filteredData = attendanceData.filter((record) => {
    const matchesSearch =
      (record.student_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (record.student_id || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (record.course || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "pending" && record.verified === false) ||
      (filterStatus === "verified" && record.verified === true);

    return matchesSearch && matchesFilter;
  });

  // --------------------------------------
  // Approve / Reject
  // --------------------------------------
  const handleApprove = async (id) => {
    try {
      await attendanceAPI.verify(id, { verified: true });
      alert("Attendance approved successfully!");
      setRefetchTrigger(prev => prev + 1); // Trigger refetch
    } catch (err) {
      console.error("Failed to approve:", err);
      alert("Failed to approve attendance. Please try again.");
    }
  };

  const handleReject = async (id) => {
    try {
      await attendanceAPI.verify(id, { verified: false });
      alert("Attendance rejected successfully!");
      setRefetchTrigger(prev => prev + 1); // Trigger refetch
    } catch (err) {
      console.error("Failed to reject:", err);
      alert("Failed to reject attendance. Please try again.");
    }
  };

  // --------------------------------------
  // Export CSV
  // --------------------------------------
  const handleExport = () => {
    const headers = [
      "Student Name",
      "Student ID",
      "Course",
      "Date",
      "Time",
      "Status",
      "Verified",
    ];

    const csvData = filteredData.map((r) => [
      r.student_name,
      r.student_id,
      r.course,
      r.date,
      r.time,
      r.status,
      r.verified ? "Yes" : "No",
    ]);

    const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance_${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Records</h1>
          <p className="text-gray-600 mt-1">Manage and verify student attendance</p>
        </div>
        <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
          <ArrowDownTrayIcon className="h-5 w-5" />
          Export CSV
        </button>
      </div>

      {/* Search + Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ID, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field"
          >
            <option value="all">All Records</option>
            <option value="pending">Pending Approval</option>
            <option value="verified">Verified</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading attendance...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{record.student_name}</div>
                        <div className="text-sm text-gray-500">{record.student_id}</div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {record.course}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {format(new Date(record.date), "MMM dd, yyyy")}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {record.time}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            record.status === "present"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {!record.verified ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(record.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(record.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400">Verified</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-12 text-gray-500">No attendance found</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AttendanceRecords;
