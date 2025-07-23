import React, { useState, useEffect } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClipboard,
  FaUser,
} from "react-icons/fa";
import { assets } from "../assets/assets";
import api from '../utils/api';

export default function SearchBar({ initialCategory = "" }) {
  const [firms, setFirms] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // search inside category
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🧲 Fetch & filter active firms
  useEffect(() => {
    const fetchFirms = async () => {
      try {
        const response = await fetch(`${api}/api/firms`);
        if (!response.ok) throw new Error("Failed to fetch firms");
        const data = await response.json();
        const activeFirms = data.filter(
          (firm) =>
            firm.isActive === true &&
            firm.category?.mainCategoryName
              ?.toLowerCase()
              .includes(initialCategory.toLowerCase())
        );
        setFirms(activeFirms);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFirms();
  }, [initialCategory]);

  // 🔍 Elastic search within filtered firms
  const visibleFirms = firms.filter((firm) => {
    const keyword = searchTerm.toLowerCase();
    return (
      firm.firmName?.toLowerCase().includes(keyword) ||
      firm.area?.toLowerCase().includes(keyword) ||
      firm.city?.toLowerCase().includes(keyword) ||
      firm.addressLine1?.toLowerCase().includes(keyword) ||
      firm.email?.toLowerCase().includes(keyword) ||
      firm.contactPerson?.toLowerCase().includes(keyword) ||
      firm.contactNo1?.toLowerCase().includes(keyword) ||
      firm.subCategory?.subCategoryName?.toLowerCase().includes(keyword)
    );
  });

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600 font-semibold">
        Loading firms...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 space-y-6 min-h-screen">
      {/* 🏷️ Category Title */}
      <h2 className="text-2xl font-bold text-blue-800 mb-4">
        Results for - {initialCategory}
      </h2>

      {/* 🔍 Search Inside Category */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search within this category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 🧾 Firm Cards */}
      {visibleFirms.length > 0 ? (
        visibleFirms.map((firm, index) => (
          <section
            key={index}
            className="flex bg-white shadow-md rounded-2xl overflow-hidden"
          >
            {/* 📷 Firm Image */}
            <div className="w-1/4 min-w-[150px] bg-gray-200 flex items-center justify-center">
              <img
                src={
                  firm.icon
                    ? `${api}/uploads/${firm.icon}`
                    : assets.Automobiles
                }
                alt={firm.firmName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 📋 Info */}
            <div className="w-3/4 p-5 space-y-2">
              <h2 className="text-2xl font-bold text-blue-900">
                {firm.firmName}
              </h2>

              <p className="text-gray-700 flex gap-2 items-center">
                <FaMapMarkerAlt className="text-blue-500" />
                <span>
                  <strong>Address:</strong> {firm.addressLine1}, {firm.area},{" "}
                  {firm.city} - {firm.pincode}
                </span>
              </p>

              {firm.email && (
                <p className="text-gray-700 flex gap-2 items-center">
                  <FaEnvelope className="text-green-600" />
                  <span>
                    <strong>Email:</strong> {firm.email}
                  </span>
                </p>
              )}

              <p className="text-gray-700 flex gap-2 items-center">
                <FaPhone className="text-purple-600" />
                <span>
                  <strong>Phone:</strong> {firm.contactNo1}
                </span>
              </p>

              <p className="text-gray-700 flex gap-2 items-center">
                <FaUser className="text-yellow-600" />
                <span>
                  <strong>Contact Person:</strong> {firm.contactPerson}
                </span>
              </p>

              <p className="text-gray-700 flex gap-2 items-center">
                <FaClipboard className="text-orange-500" />
                <span>
                  <strong>Category:</strong> {firm.category?.mainCategoryName}{" "}
                  → {firm.subCategory?.subCategoryName}
                </span>
              </p>

              <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                Send SMS
              </button>
            </div>
          </section>
        ))
      ) : (
        <p className="text-center text-gray-500 text-lg font-semibold">
          No firms found in "{initialCategory}" for "{searchTerm}"
        </p>
      )}
    </div>
  );
}