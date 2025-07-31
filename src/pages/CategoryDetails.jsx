import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import api from "../utils/api";

// Icons
import {
  MdAttachEmail,
  MdPhone,
} from "react-icons/md";
import {
  IoIosContact,
} from "react-icons/io";
import {
  RiUserLocationFill,
} from "react-icons/ri";
import {
  TbWorldWww,
} from "react-icons/tb";
import {
  FaCalendarTimes,
  FaBuilding,
} from "react-icons/fa";
// import fallbackImage from "../assets/smit";
import {assets}from "../assets/assets"

const CategoryDetails = () => {
  const [firms, setFirms] = useState([]);
  const [filteredFirms, setFilteredFirms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const mainCatId = queryParams.get("mainCategoryId")?.toString(); // 🆕
  const subCatId = queryParams.get("subCategoryId")?.toString();   // 🆕
  const mainCatName = queryParams.get("mainCategory")?.trim().toLowerCase();


  // 🔄 Fetch Firms
  useEffect(() => {
    console.log(mainCatId , subCatId , mainCatName ," logs ")
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

  // ✅ Filtering Logic
  useEffect(() => {
    if (firms.length === 0) return;

    let matched = [];

    if (mainCatId && !subCatId) {
      // 1️⃣ Main Category ID ONLY
      matched = firms.filter(
        (firm) => firm.category?.categoryId?.toString() === mainCatId
      );
      setMessage(matched.length ? "" : "No firms found with this main category ID.");
    } else if (mainCatId && subCatId) {
      // 2️⃣ Main + Sub Category ID
      matched = firms.filter(
        (firm) =>
          firm.category?.categoryId?.toString() === mainCatId &&
          firm.subCategory?.subCategoryId?.toString() === subCatId
      );
      setMessage(matched.length ? "" : "No firms found with this main + sub category.");
    } else if (mainCatName) {
      // 3️⃣ Main Category Name (fallback)
      matched = firms.filter((firm) => {
        const catName = firm.category?.mainCategoryName?.toLowerCase();
        const subCatName = firm.subCategory?.subCategoryName?.toLowerCase();
        return catName === mainCatName || subCatName === mainCatName;
      });
      setMessage(matched.length ? "" : "No firms found with this category name.");
    } else {
      setMessage("No filtering parameters provided.");
    }

    setFilteredFirms(matched);
    console.log(matched,"")
  }, [firms, mainCatId, subCatId, mainCatName]);

  // 🏷️ Title
  const title =
    mainCatId && subCatId
      ? `Main ID: ${mainCatId} & Sub ID: ${subCatId}`
      : mainCatId
      ? `Main Category ID: ${mainCatId}`
      : mainCatName
      ? `Category Name: ${mainCatName}`
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
          <div className="grid grid-cols-1 ml-8 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-6">
          {filteredFirms.map((firm) => (
  <div
    key={firm.firmId}
    className="bg-white left-2 w-3/4 h-[250px] rounded-lg shadow-md border border-gray-200 transform transition duration-300 hover:scale-[1.02] hover:shadow-xl flex flex-col md:flex-row overflow-hidden"
  >
    {/* Left - Image */}
    <div className="md:w-1/3 bg-gray-50 flex items-center justify-center p-4">
  <img
    src={
      firm.firmImagePath
        ? `${api}/uploads/${firm.firmImagePath}`
        : assets.Logo
    }
    alt={`${firm.firmName} icon`}
    className="h-full w-full object-contain"
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = fallbackImage;
    }}
  />
</div>

    {/* Right - Firm Details */}
    <div className="flex-1 p-4 space-y-2">
      <h3 className="text-xl font-bold text-gray-800 flex items-center">
        <FaBuilding className="mr-2 text-blue-600" />
        {firm.firmName}
      </h3>

      <div className="text-sm text-gray-700 space-y-1">
        <p className="flex items-center">
          <IoIosContact className="mr-2 text-purple-600" />
          <span className="font-medium">Contact:</span> {firm.contactPerson}
        </p>

        <p className="flex items-center">
          <MdPhone className="mr-2 text-green-600" />
          <span className="font-medium">Phone:</span> {firm.contactNo1}
        </p>

        {firm.email && (
          <p className="flex items-center">
            <MdAttachEmail className="mr-2 text-red-600" />
            <span className="font-medium">Email:</span>{" "}
            <a
              href={`mailto:${firm.email}`}
              className="text-blue-500 hover:underline truncate"
            >
              {firm.email}
            </a>
          </p>
        )}

        <p className="flex items-center">
          <RiUserLocationFill className="mr-2 text-indigo-600" />
          <span className="font-medium">Location:</span> {firm.address1}, {firm.area}, {firm.city} - {firm.pincode}
        </p>

        {firm.website && (
          <p className="flex items-center">
            <TbWorldWww className="mr-2 text-teal-600" />
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

        <p className="flex items-center">
          <FaCalendarTimes className="mr-2 text-gray-500" />
          <span className="font-medium">Entry Date:</span>{" "}
          {new Date(firm.entryDate).toLocaleDateString()}
        </p>

        {firm.summary && (
          <p className="text-xs text-gray-600 mt-1 italic line-clamp-3">
            <span className="font-medium">Summary:</span> {firm.summary}
          </p>
        )}
      </div>
    </div>
  </div>
))}

          </div>
        </section>
      )}
    </div>
  );
};

export default CategoryDetails;
