import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from '../utils/api';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const response = await axios.post(
        `${api}/api/auth/register`,
        formData
      );
      console.log("✅ Registration successful:", response.data);
      setSuccess(true);
      navigate("/login", { state: { registrationSuccess: true } });
    } catch (err) {
      console.error("❌ Registration failed:", err);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-full flex py-6 justify-center bg-gradient-to-br from-purple-200 to-blue-100 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white/60 backdrop-blur-md rounded-2xl shadow-xl p-8 w-full h-fit max-w-lg border border-white/30"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Create Your Account
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> Registration successful. Please log in.</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block mb-2 font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
              placeholder="John"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
              placeholder="Doe"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Mobile Number</label>
            <input
              type="tel"
              name="mobileNumber"
              required
              value={formData.mobileNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
              placeholder="9876543210"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register"}
          </motion.button>
        </form>

        <p className="mt-4 text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-purple-500 hover:underline font-medium">
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
