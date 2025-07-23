import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import api from "../utils/api";
import EnquiryForm from "../components/Enquiry";

export default function DetailsPage() {
  const { firmId } = useParams();
  const{id}=useParams();
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTabs, setShowTabs] = useState(false);
  const [activeTab, setActiveTab] = useState("about");

  const fallbackImg = "https://via.placeholder.com/600x300?text=No+Image";

  useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("authToken");

    try {
      const firmRes = await axios.get(`${api}/api/firms/${firmId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (firmRes.data && firmRes.data.firmId) {
        setData(firmRes.data);
        console.log(firmRes.data,"frim")
      } else {
        throw new Error("Not a firm, trying job...");
      }
    } catch (firmErr) {
      console.warn("Firm not found, trying job...", firmErr.message);
      try {
        const jobRes = await axios.get(`${api}/api/jobs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (jobRes.data && jobRes.data.jobId) {
          setData(jobRes.data);
        } else {
          throw new Error("No matching job data.");
        }
      } catch (jobErr) {
        console.error("🔥 Error loading firm or job:", jobErr.message);
        setError("Couldn't find firm or job with that ID.");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [firmId]);


  if (loading) return <div className="p-6 text-center">⏳ Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;
  if (!data) return null;

  const isFirm = !!data.firmName;
  const isJob = !!data.jobTitle;

 const rawImagePath = data.firmImagePath || data.logoPath || data.imagePath || "";
const imageURL = rawImagePath.startsWith("http")
  ? rawImagePath
  : `https://cp.solapurmall.com/${rawImagePath}`;

  const tabs = [
    { id: "about", label: "About Us" },
    { id: "gallery", label: "Photo Gallery" },
    { id: "video", label: "Video" },
    { id: "contact", label: "Contact Us" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-6 border flex flex-col md:flex-row gap-6 max-w-5xl mx-auto">
        <img
          src={imageURL}
          alt={isFirm ? data.firmName : data.jobTitle}
          className="w-[250px] h-auto object-cover rounded-lg border"
          onError={(e) => (e.target.src = fallbackImg)}
        />
        <div className="flex-1 flex flex-col gap-2">
          <h1 className="text-3xl font-bold mb-2">
            {isFirm ? data.firmName : data.jobTitle}
          </h1>
          {isFirm ? (
            <>
              <p><strong>📍 Address:</strong> {data.addressLine1}, {data.area}, {data.city}, {data.pincode}</p>
              <p><strong>🏷️ Category:</strong> {data.category?.mainCategoryName} / {data.subCategory?.subCategoryName}</p>
              <p><strong>👤 Contact:</strong> {data.contactPerson} | {data.contactNo1}</p>
              <p><strong>📧 Email:</strong> {data.email}</p>
            </>
          ) : (
            <>
              <p><strong>🏢 Company:</strong> {data.companyName}</p>
              <p><strong>📍 Location:</strong> {data.location}</p>
              <p><strong>💼 Experience:</strong> {data.experience}</p>
              <p><strong>🧑‍💻 Skills:</strong> {data.skills}</p>
              <p><strong>🗓️ Date:</strong> {new Date(data.entryDate).toLocaleDateString()}</p>
            </>
          )}

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-2 rounded-xl shadow-md hover:scale-105 active:scale-95 w-full"
            >
              {showForm ? "🙈 Hide Enquiry Form" : "📩 Send Enquiry"}
            </button>

            {data.viewmorests && (
              <button
                onClick={() => setShowTabs(!showTabs)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded-xl shadow-md hover:scale-105 active:scale-95 w-full"
              >
                {showTabs ? "🔽 Hide Details" : "👀 View More"}
              </button>
            )}
          </div>
        </div>
      </div>

      {showForm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
    <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl w-full max-w-lg relative border border-gray-300">
      
      {/* Close Button */}
      <button
        onClick={() => setShowForm(false)}
        className="absolute top-3 right-4 text-gray-700 hover:text-red-600 text-3xl font-bold transition"
        aria-label="Close"
      >
        &times;
      </button>

      {/* Enquiry Form Injected */}
      <EnquiryForm
        firmId={firmId}
        receiverId={data.user.id}
        onClose={() => setShowForm(false)}
      />
    </div>
  </div>
)}


      {showTabs && (
        <div className="mt-8 max-w-6xl mx-auto">
          <div className="flex bg-white rounded-t-xl overflow-hidden shadow-inner">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`flex-1 text-center px-4 py-3 cursor-pointer font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-inner"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </div>
            ))}
          </div>

          <div className="bg-white p-6 shadow-lg border rounded-b-md">
            {activeTab === "about" && (
              <div>
                <h2 className="text-2xl font-bold mb-4">About {isFirm ? data.firmName : data.jobTitle}</h2>
                <p><strong>🧠 Summary:</strong> {data.summary || "Not available"}</p>
                {isFirm && data.websiteUrl && (
                  <p className="mt-2">
                    <strong>🔗 Website:</strong>{" "}
                    <a
                      href={data.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      {data.websiteUrl}
                    </a>
                  </p>
                )}
              </div>
            )}

            {activeTab === "gallery" && (
              <div className="text-center">
                <h2 className="text-xl font-bold mb-4">📸 Photo Gallery</h2>
                {data.galleryImages?.length > 0 ? (
                  <div className="flex flex-wrap justify-center gap-4">
                    {data.galleryImages.map((img, i) => (
                      <img
                        key={i}
                        src={`https://cp.solapurmall.com/${img}`}
                        alt={`Gallery ${i}`}
                        className="w-64 h-40 object-cover rounded-xl border shadow hover:scale-105 transition-transform duration-200 ease-in-out"
                        onError={(e) =>
                          (e.target.src =
                            "https://via.placeholder.com/250x150?text=Image+Not+Found")
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <div>
                    <img
                      src="https://via.placeholder.com/500x300?text=No+Images"
                      alt="No images"
                      className="mx-auto rounded-lg opacity-70"
                    />
                    <p className="text-gray-600 italic mt-2">No images available yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "video" && (
              <div className="text-center">
                <h2 className="text-xl font-bold mb-4">🎥 Video</h2>
                <p className="text-gray-600 italic">No video available yet.</p>
              </div>
            )}

            {activeTab === "contact" && (
              <div>
                <h2 className="text-xl font-bold mb-4">📞 Contact Us</h2>
                <p><strong>Contact Person:</strong> {data.contactPerson}</p>
                <p><strong>Phone:</strong> {data.contactNo1}</p>
                <p><strong>Email:</strong> {data.email}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}