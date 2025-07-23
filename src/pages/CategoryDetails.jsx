import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import api from "../utils/api";

// Import icons
import { MdAttachEmail, MdPhone } from "react-icons/md";
import { IoIosContact } from "react-icons/io";
import { RiUserLocationFill } from "react-icons/ri";
import { TbWorldWww } from "react-icons/tb";
import { FaCalendarTimes, FaBuilding } from "react-icons/fa"; // Added FaBuilding for firm name

const CategoryDetails = () => {
  const [firms, setFirms] = useState([]);
  const [filteredFirms, setFilteredFirms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const categoryId = queryParams.get("categoryId")?.toString();
  const mainCategoryParam = queryParams.get("mainCategory")?.trim().toLowerCase();

  // 🔄 Fetch all firms
  useEffect(() => {
    const fetchFirms = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${api}/api/firms`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFirms(response.data || []);
      } catch (err) {
        console.error("🔥 Error loading firms:", err);
        setMessage("Failed to load firms. Try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchFirms();
  }, []);

  // ✅ Final Filtering Logic
  useEffect(() => {
    if (firms.length === 0) return;

    let matched = [];

    if (categoryId) {
      // ✅ First: check if categoryId matches any firm's MAIN category
      const matchesMainCategory = firms.filter(
        (firm) => firm.category?.categoryId?.toString() === categoryId
      );

      if (matchesMainCategory.length > 0) {
        matched = matchesMainCategory;
        setMessage("");
      } else {
        // 🔍 Else: fallback to match by subcategoryId
        matched = firms.filter(
          (firm) => firm.subCategory?.subCategoryId?.toString() === categoryId
        );
        setMessage(matched.length ? "" : "No firms found with this subcategory ID.");
      }
    } else if (mainCategoryParam) {
      matched = firms.filter((firm) => {
        const mainCatName = firm.category?.mainCategoryName?.toLowerCase();
        const subCatName = firm.subCategory?.subCategoryName?.toLowerCase();
        return mainCatName === mainCategoryParam || subCatName === mainCategoryParam;
      });

      setMessage(matched.length ? "" : "No firms found for this category name.");
    }

    setFilteredFirms(matched);
  }, [firms, categoryId, mainCategoryParam]);

  // 🏷️ Title
  const title = categoryId
    ? `Category ID: ${categoryId}`
    : mainCategoryParam
    ? `Category Name: ${mainCategoryParam}`
    : "All Firms";

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">{title}</h1>

      {loading && <p className="text-center text-lg text-blue-600">⏳ Loading firms...</p>}
      {!loading && message && (
        <p className="text-center text-blue-600 font-medium">{message}</p>
      )}

      {filteredFirms.length > 0 && (
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700 border-b pb-2">
            Firms Matching Your Criteria ({filteredFirms.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredFirms.map((firm) => (
              <div
                key={firm.firmId}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200
                           transform transition duration-300 hover:scale-105 hover:shadow-lg flex flex-col"
              >
                {firm.icon && (
                  <div className="flex justify-center items-center h-24 mb-4 bg-gray-50 rounded-md overflow-hidden">
                    <img
                      src={`${api}/uploads/${firm.icon}`} // Assuming firm.icon is the filename
                      alt={`${firm.firmName} icon`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                  <FaBuilding className="mr-3 text-blue-600" />
                  {firm.firmName}
                </h3>
                <p className="text-sm text-gray-700 mb-1 flex items-center">
                  <IoIosContact className="mr-3 text-purple-600" />
                  <span className="font-medium">Contact Person:</span> {firm.contactPerson}
                </p>
                <p className="text-sm text-gray-700 mb-1 flex items-center">
                  <MdPhone className="mr-3 text-green-600" />
                  <span className="font-medium">Phone:</span> {firm.contactNo1}
                </p>
                {firm.email && (
                  <p className="text-sm text-gray-700 mb-1 flex items-center">
                    <MdAttachEmail className="mr-3 text-red-600" />
                    <span className="font-medium">Email:</span>{" "}
                    <a href={`mailto:${firm.email}`} className="text-blue-500 hover:underline truncate">
                      {firm.email}
                    </a>
                  </p>
                )}
                <p className="text-sm text-gray-700 mb-1 flex items-center">
                  <RiUserLocationFill className="mr-3 text-indigo-600" />
                  <span className="font-medium">Location:</span> {firm.address1}, {firm.area}, {firm.city} -{" "}
                  {firm.pincode}
                </p>
                {firm.website && (
                  <p className="text-sm text-gray-700 mb-1 flex items-center">
                    <TbWorldWww className="mr-3 text-teal-600" />
                    <span className="font-medium">Website:</span>{" "}
                    <a
                      href={firm.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline truncate"
                    >
                      {firm.website}
                    </a>
                  </p>
                )}
                <p className="text-sm text-gray-600 mt-2 flex items-center">
                  <FaCalendarTimes className="mr-3 text-gray-500" />
                  <span className="font-medium">Entry Date:</span>{" "}
                  {new Date(firm.entryDate).toLocaleDateString()}
                </p>
                {firm.summary && (
                  <p className="text-xs text-gray-500 mt-3 italic line-clamp-3">
                    <span className="font-medium">Summary:</span> {firm.summary}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default CategoryDetails;