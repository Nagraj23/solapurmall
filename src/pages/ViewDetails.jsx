import React, { useState, useEffect } from "react";
import axios from "axios";

export default function FirmTabs({ firmId }) {
  const tabs = [
    { id: "about", label: "About Us" },
    { id: "gallery", label: "Photo Gallery" },
    { id: "video", label: "Video" },
    { id: "contact", label: "Contact Us" },
  ];

  const [activeTab, setActiveTab] = useState("about");
  const [firm, setFirm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fallbackImg = "https://via.placeholder.com/300x200?text=No+Image";

  useEffect(() => {
    const fetchFirm = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(`${api}/api/firms/${firmId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFirm(res.data);
      } catch (err) {
        console.error("Error fetching firm:", err);
        setError("Failed to load firm details.");
      } finally {
        setLoading(false);
      }
    };

    fetchFirm();
  }, [firmId]);

  const renderTabContent = () => {
    if (!firm) return <p>No firm data found.</p>;

    const {
      firmName,
      firmImagePath,
      addressLine1,
      area,
      city,
      pincode,
      contactPerson,
      contactNo1,
      email,
      websiteUrl,
      summary,
    } = firm;

    const imageURL = firmImagePath
      ? `https://cp.solapurmall.com/${firmImagePath}`
      : fallbackImg;

    switch (activeTab) {
      case "about":
        return (
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{firmName}</h2>
            <img src={imageURL} alt={firmName} className="w-full max-w-sm border rounded" />
            <p><strong>📍 Address:</strong> {addressLine1}, {area}, {city}, {pincode}</p>
            <p><strong>👤 Contact:</strong> {contactPerson} | {contactNo1}</p>
            <p><strong>📧 Email:</strong> {email}</p>
            {websiteUrl && (
              <p><strong>🔗 Website:</strong> <a href={websiteUrl} className="text-blue-600 underline" target="_blank" rel="noreferrer">{websiteUrl}</a></p>
            )}
            <p><strong>🧠 Summary:</strong> {summary}</p>
          </div>
        );

      case "gallery":
        return (
          <div className="text-gray-700">
            <p>📸 Gallery will go here. (Add your images)</p>
          </div>
        );

      case "video":
        return (
          <div className="text-gray-700">
            <p>🎥 Video section coming soon...</p>
          </div>
        );

      case "contact":
        return (
          <div className="space-y-2 text-gray-700">
            <p><strong>Contact Person:</strong> {contactPerson}</p>
            <p><strong>Phone:</strong> {contactNo1}</p>
            <p><strong>Email:</strong> {email}</p>
          </div>
        );

      default:
        return <p>Select a tab to view details.</p>;
    }
  };

  if (loading) return <div className="text-center p-6">⏳ Loading firm details...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white w-[800px] border rounded shadow-lg">
        {/* Tabs */}
        <div className="flex border-b">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex-1 text-center py-3 cursor-pointer font-semibold transition-colors ${activeTab === tab.id ? "bg-blue-500 text-white" : "bg-black text-blue-400"
                }`}
              onMouseEnter={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-6 text-gray-700 min-h-[250px]">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
