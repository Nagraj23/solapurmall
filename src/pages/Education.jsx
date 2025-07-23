import React, { useState, useEffect } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClipboard,
} from "react-icons/fa";
import axios from "axios";
import { assets } from "../assets/assets";
import api from "../utils/api";

export default function EducationList() {
  const [educationCenters, setEducationCenters] = useState([]);

   useEffect(() => {
    const fetchFirms = async () => {
      try {
        const res = await axios.get(`${api}/api/firms`);
        const filtered = res.data.filter(
          (firm) => firm.category?.categoryId === 16
        );
        setEducationCenters(filtered);
        console.log(filtered, "🎓 Filtered Education Firms bro");
      } catch (err) {
        console.error("Failed to fetch firms:", err);
      }
    };

    fetchFirms();
  }, []);

  return (
    <div className="p-6 bg-blue-100 space-y-6">
      {educationCenters.map((center, index) => (
        <section
          key={index}
          className="flex bg-white shadow-md rounded-2xl overflow-hidden"
        >
          {/* Image - 1/4 width */}
          <div className="w-1/4">
            <img
              src={assets.Edu1}
              alt="Education Centre"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Info - 3/4 width */}
          <div className="w-3/4 p-6 space-y-3">
            <div className="items-center">
              <h2 className="text-2xl font-extrabold mb-2 pb-1">
                {center.firmName}
              </h2>
            </div>

            {/* Address */}
            <p className="text-gray-700 flex items-center gap-2">
              <FaMapMarkerAlt className="text-blue-500" />
              <span>
                <strong>Address:</strong> {center.addressLine1}
              </span>
            </p>

            {/* Email (optional) */}
            {/* {center.email && (
              <p className="text-gray-700 flex items-center gap-2">
                <FaEnvelope className="text-green-600" />
                <span>
                  <strong>Email:</strong> {center.contactNo1}
                </span>
              </p>
            )} */}

            {/* Contacts */}
            <p className="text-gray-700 flex items-center gap-2">
              <FaPhone className="text-purple-600" />
              <span>
                <strong>Contacts:</strong> {center.contactNo1}
              </span>
            </p>

            {/* Summary */}
            {center.summary && (
              <p className="text-gray-700 flex items-start gap-2">
                <FaClipboard className="text-orange-500 mt-1" />
                <span>
                  <strong>Summary:</strong> {center.summary.slice(0, 100)}...
                </span>
              </p>
            )}

            {/* Button */}
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Send SMS
            </button>
          </div>
        </section>
      ))}
    </div>
  );
}
