import React, { useState } from 'react';
import axios from 'axios';

const EnquiryForm = ({ firmId, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
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
    if (!formData.name || !formData.senderPhone || !formData.message) {
      return alert("Bro, all fields are required 💀");
    }

    try {
      await axios.post('http://localhost:8080/api/enquiries/', {
        ...formData,
        receiverFirmId: firmId,
        mode: 'SENT'
      });

      setStatus("✅ Enquiry sent!");
      setFormData({ name: '', senderPhone: '', message: '' });

      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to send enquiry.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Send Enquiry 📩</h2>

      <input
        name="name"
        placeholder="Your Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-3"
      />
      <input
        name="senderPhone"
        placeholder="Your Phone"
        value={formData.senderPhone}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-3"
      />
      <textarea
        name="message"
        placeholder="Message"
        value={formData.message}
        onChange={handleChange}
        rows={4}
        className="w-full p-2 border rounded mb-3"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Submit Enquiry 🚀
      </button>

      {status && <p className="mt-2 text-center">{status}</p>}
    </div>
  );
};

export default EnquiryForm;
