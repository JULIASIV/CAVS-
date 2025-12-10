// src/pages/Register.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    role: "",
    teacher_code: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear validation error on input
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: "" });
    }
  };

  const useMyCode = async () => {
    // Try localStorage -> URL param -> clipboard
    const stored = localStorage.getItem('teacher_code');
    if (stored) {
      setFormData(prev => ({ ...prev, teacher_code: stored }));
      setValidationErrors(prev => ({ ...prev, teacher_code: '' }));
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get('code') || params.get('teacher_code');
    if (codeParam) {
      setFormData(prev => ({ ...prev, teacher_code: codeParam }));
      setValidationErrors(prev => ({ ...prev, teacher_code: '' }));
      return;
    }

    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setFormData(prev => ({ ...prev, teacher_code: text.trim() }));
          setValidationErrors(prev => ({ ...prev, teacher_code: '' }));
          return;
        }
      }
    } catch (err) {
      // ignore clipboard errors
    }

    setValidationErrors(prev => ({ ...prev, teacher_code: 'No teacher code found in localStorage, URL or clipboard' }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.first_name.trim()) {
      errors.first_name = "First name is required";
    }

    if (!formData.last_name.trim()) {
      errors.last_name = "Last name is required";
    }

    if (!formData.role) {
      errors.role = "Please select a role";
    }

    // Require teacher_code for both teacher and admin roles
    if (formData.role === "teacher" || formData.role === "admin") {
      if (!formData.teacher_code.trim()) {
        errors.teacher_code = "Teacher code is required for teacher/admin registration";
      }
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;

      const response = await authAPI.register(registerData);
      console.log("Registration success:", response);

      // remember teacher code locally for easy reuse
      try {
        if (registerData.teacher_code) localStorage.setItem('teacher_code', registerData.teacher_code);
      } catch (e) {}

      setSuccess("Registration successful! Redirecting...");
      setFormData({
        email: "",
        first_name: "",
        last_name: "",
        role: "",
        teacher_code: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Error:", err);
      // Check for field-specific errors first
      if (err.response?.data && typeof err.response.data === 'object') {
        const fieldErrors = err.response.data;
        let errorMsg = '';
        
        // Build error message from field errors
        for (const [field, messages] of Object.entries(fieldErrors)) {
          const message = Array.isArray(messages) ? messages[0] : messages;
          errorMsg += `${field}: ${message}\n`;
        }
        
        if (errorMsg) {
          setError(errorMsg);
        } else {
          setError('Registration failed. Please check all fields.');
        }
      } else {
        const errorMessage =
          err.response?.data?.detail ||
          err.response?.data?.email?.[0] ||
          err.response?.data?.non_field_errors?.[0] ||
          "Registration failed. Try again.";
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">

          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
            Create Account
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Join CAVS - Smart Attendance System
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="user@astu.edu"
                className={`w-full px-3 py-2 border rounded-lg ${
                  validationErrors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {validationErrors.email && (
                <p className="text-red-600 text-xs mt-1">
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${
                  validationErrors.first_name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {validationErrors.first_name && (
                <p className="text-red-600 text-xs mt-1">{validationErrors.first_name}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${
                  validationErrors.last_name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {validationErrors.last_name && (
                <p className="text-red-600 text-xs mt-1">{validationErrors.last_name}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${
                  validationErrors.role ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Role</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>

              {validationErrors.role && (
                <p className="text-red-600 text-xs mt-1">{validationErrors.role}</p>
              )}
            </div>

            {/* Teacher Code For Teacher or Admin */}
            {(formData.role === "teacher" || formData.role === "admin") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teacher Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="teacher_code"
                    value={formData.teacher_code}
                    onChange={handleChange}
                    placeholder="Enter teacher verification code"
                    className={`flex-1 px-3 py-2 border rounded-lg ${
                      validationErrors.teacher_code ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={useMyCode}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Use my code
                  </button>
                </div>
                {validationErrors.teacher_code && (
                  <p className="text-red-600 text-xs mt-1">
                    {validationErrors.teacher_code}
                  </p>
                )}
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${
                  validationErrors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {validationErrors.password && (
                <p className="text-red-600 text-xs mt-1">{validationErrors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${
                  validationErrors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              {validationErrors.confirmPassword && (
                <p className="text-red-600 text-xs mt-1">
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>

            {/* Show Password Toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="h-4 w-4"
              />
              <label className="ml-2 text-sm text-gray-600">Show password</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-600 font-semibold">
              Sign In
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;
