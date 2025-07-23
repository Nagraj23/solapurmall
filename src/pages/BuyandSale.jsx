import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import assets.Logo from "../assets/logo.png";
import { assets } from "../assets/assets";
import api from '../utils/api';


export default function BuyandSale({ searchKeyword = "" }) {
  const { register, handleSubmit, reset } = useForm();
  const [date, setDate] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [entries, setEntries] = useState([]);
  const [areas, setAreas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchKeyword);

  // Sync prop changes to searchQuery
  useEffect(() => {
    setSearchQuery(searchKeyword);
  }, [searchKeyword]);

  // Fetch entries
  useEffect(() => {
   
    fetch(`${api}/api/buysale`, {
     
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setEntries(data);
      })
      .catch(err => console.error("❌ Error fetching entries:", err));
  }, []);

  // Fetch areas
  useEffect(() => {
    fetch(`${api}/api/areas`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAreas(data);
      })
      .catch(err => console.error("❌ Error fetching areas:", err));
  }, []);

  // Fix image path logic 🔥
  const cleanImageUrl = (filename) => {
    if (!filename || typeof filename !== "string" || filename.trim() === "") {
      return assets.Logo;
    }

    // If full URL from old data (starts with http), fix it
    if (filename.startsWith("http://") || filename.startsWith("https://")) {
      return filename.replace("http://", "https://");
    }

    // Otherwise, assume it's from our API upload path
    return `${api}/uploads/buysale_images/${filename}`;
  };

  // Image preview handler
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selected);
    } else {
      setPreview(null);
    }
  };

  // Form submit
  const onSubmit = async (data) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return alert("❌ You must be logged in to upload.");

    const payload = {
      ...data,
      dat: date ? date.toISOString().split("T")[0] : null,
      actsts: 0,
      soldsts: 0,
      validity: "6 Months",
      userId: 1,
    };

    const formData = new FormData();
    formData.append(
      "request",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );
    if (file) formData.append("image", file);

    try {
      const res = await fetch(`${api}/api/buysale/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        const newEntry = await res.json();
        setEntries((prev) => [...prev, newEntry]);
        reset();
        setDate(null);
        setFile(null);
        setPreview(null);
        setShowForm(false);
        alert("✅ Product listed successfully!");
      } else {
        const errorText = await res.text();
        alert("Failed to list product: " + errorText);
      }
    } catch (err) {
      alert("Network error: Could not connect to server.");
    }
  };

  // Search logic
  const filteredEntries = entries.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.title?.toLowerCase().includes(query) ||
      item.product?.toLowerCase().includes(query) ||
      item.area?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="relative px-4 py-8 max-w-6xl mx-auto">
      {!showForm ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">🛒 Buy & Sale Listings</h2>
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white text-2xl rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-transform hover:scale-110"
            >
              +
            </button>
          </div>

          <input
            type="text"
            placeholder="🔍 Search by title, product, or area"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full mb-6 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEntries.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">
                {searchQuery
                  ? "No results found for your search 🤔"
                  : "No listings found. Add one!"}
              </p>
            ) : (
              filteredEntries.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 shadow-md rounded-xl border border-gray-200 hover:shadow-lg transition"
                >
                  <img
                    src={cleanImageUrl(item.image)}
                    alt={item.title || "Product image"}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = assets.Logo;
                    }}
                  />
                  <h3 className="text-xl font-semibold">
                    {item.title || "Untitled Product"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.product || "N/A"}
                  </p>
                  <p className="text-green-600 font-bold">
                    ₹ {item.rate || "0"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Contact: {item.contact || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Area: {item.area || "N/A"}
                  </p>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="text-center">
          {/* 📝 Add your form UI here if needed */}
          <p>Form Component Here (not shown for brevity)</p>
        </div>
      )}
    </div>
  );
}
