import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from '../utils/api';

const FeedbackFormPage = () => {
  const [formData, setFormData] = useState({
    firmnm: "",
    personnm: "",
    address: "",
    mobile: "",
    email: "",
    city: "",
    message: "",
  });

  const [ipAddress, setIpAddress] = useState("");
  const [browserInfo, setBrowserInfo] = useState("");

  useEffect(() => {
    // Get user's IP
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setIpAddress(data.ip))
      .catch((err) => console.error("IP fetch failed:", err));

    // Get browser info
    setBrowserInfo(navigator.userAgent);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const pad = (n) => (n < 10 ? `0${n}` : n);
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(
      now.getHours()
    )}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      ipaddress: ipAddress,
      browser: browserInfo,
      feedbkdt: getCurrentDateTime(),
    };

    try {
      const res = await fetch(`${api}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Feedback submitted successfully!");
        setFormData({
          firmnm: "",
          personnm: "",
          address: "",
          mobile: "",
          email: "",
          city: "",
          message: "",
        });
      } else {
        alert(result?.message || "Submission failed.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="h-full py-6 flex  justify-center bg-gradient-to-br from-purple-200 to-blue-100 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white/60 backdrop-blur-md rounded-2xl shadow-xl p-8 w-full h-fit max-w-2xl border border-white/30"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Feedback Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              name="firmnm"
              value={formData.firmnm}
              onChange={handleChange}
              placeholder="Company Name"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Contact Person Name</label>
            <input
              type="text"
              name="personnm"
              value={formData.personnm}
              onChange={handleChange}
              placeholder="Person Name"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Mobile</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Mobile Number"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Comments</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Type your feedback here..."
              rows="4"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none resize-none"
              required
            ></textarea>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition"
          >
            Submit
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default FeedbackFormPage;
