import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import api from "../utils/api";

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
      <h1 className="text-3xl font-bold text-center mb-6">{title}</h1>

      {loading && <p className="text-center text-lg">⏳ Loading...</p>}
      {!loading && message && (
        <p className="text-center text-blue-600">{message}</p>
      )}

      {filteredFirms.length > 0 && (
        <section className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">
            Firms ({filteredFirms.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFirms.map((firm) => (
              <div key={firm.firmId} className="bg-white p-4 rounded shadow">
                <h3 className="text-xl font-bold mb-2">{firm.firmName}</h3>
                <p className="text-sm text-gray-600">
                  Category: {firm.category?.mainCategoryName} &gt;{" "}
                  {firm.subCategory?.subCategoryName}
                </p>
                <p className="text-sm text-gray-500">
                  Location: {firm.area}, {firm.city}, {firm.pincode}
                </p>
                <p className="text-sm text-gray-500">
                  Contact: {firm.contactPerson} ({firm.contactNo1})
                </p>
                <p className="text-sm text-gray-500">
                  Date: {new Date(firm.entryDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default CategoryDetails;
