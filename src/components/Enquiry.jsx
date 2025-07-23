import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../components/AuthContext';

const EnquiryForm = ({ firmId, receiverId, onClose }) => {
  const [formData, setFormData] = useState({
    senderName: '',
    senderPhone: '',
    message: ''
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    const { senderName, senderPhone, message } = formData;

    if (!senderName || !senderPhone || !message) {
      return alert("Bro, all fields are required 💀");
    }

    try {
      await axios.post('http://localhost:8100/api/enquiries/', {
        ...formData,
        firmId: firmId,
        receiver_id: receiverId,
        mode: 'SENT'
      });

      setStatus("✅ Enquiry sent successfully!");
      setFormData({ senderName: '', senderPhone: '', message: '' });

      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to send enquiry. Try again later.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-5 text-blue-700">Send Enquiry 📩</h2>

      <input
        name="senderName"
        placeholder="Your Name"
        value={formData.senderName}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        name="senderPhone"
        placeholder="Your Phone Number"
        value={formData.senderPhone}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <textarea
        name="message"
        placeholder="Type your message..."
        value={formData.message}
        onChange={handleChange}
        rows={4}
        className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-6 py-3 rounded-md w-full hover:bg-blue-700 transition duration-200"
      >
        Submit Enquiry 🚀
      </button>

      {status && (
        <p className="mt-4 text-center font-medium text-gray-700">{status}</p>
      )}
    </div>
  );
};

export default EnquiryForm;
