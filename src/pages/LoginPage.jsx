import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from '../utils/api';
import { AuthContext } from "../components/AuthContext"; // Update path if needed

const LoginPage = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await axios.post(`${api}/api/auth/login`, {
        email,
        password,
      });

      const { token, userRole } = res.data;

      if (!token || !userRole) {
        setError("Missing token or role from server.");
        return;
      }

      if (userRole !== "USER") {
        setError("Access denied: Only regular users can log in.");
        return;
      }

      const decoded = JSON.parse(atob(token.split('.')[1]));
      if (Date.now() > decoded.exp * 1000) {
        setError("Token expired. Please login again.");
        return;
      }

      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", userRole);
      authLogin(token);

      console.log("✅ Login successful.");
      navigate("/");
      window.location.reload(); // optional if using context-based auth routing

    } catch (err) {
      console.error("Login failed:", err);
      setError(
        err.response?.data?.message || "Invalid credentials. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-full flex py-6 justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white/60 backdrop-blur-md rounded-2xl shadow-xl p-8 w-full h-fit max-w-md border border-white/30"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Login to Your Account
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block mb-2 font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        <p className="mt-4 text-center text-gray-600 text-sm">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-blue-500 hover:underline font-medium"
          >
            Register
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
