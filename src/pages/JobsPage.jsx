import React, { useState, useContext, useEffect, useMemo } from "react";
import Input from "../components/CInput"; // Assuming CInput is your custom input component
import { GrOrganization, GrUserWorker } from "react-icons/gr";
import { MdMailLock, MdAddIcCall, MdSearch } from "react-icons/md";
import { IoIosContact } from "react-icons/io";
import { FaImage } from "react-icons/fa"; // Keep FaImage for cropped image indicator
import { AuthContext } from "../components/AuthContext";
import ImageCropperModal from "../components/Cropimage"; // Keep the cropper modal
import { jwtDecode } from "jwt-decode";
// import Logo2 from "../assets/assets/Logo"
import { assets } from "../assets/assets";
// import Logo2 from "../assets/assets";
import { useNavigate } from "react-router-dom";
import api from '../utils/api';

export default function Jobs() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [areas, setAreas] = useState([]);
  const [jobs, setJobs] = useState([]); // This will hold ALL fetched jobs
  const [form, setForm] = useState({
    companyName: "",
    email: "",
    contact: "",
    address: "",
    contactPerson: "",
    jobPost: "",
    summary: "",
    city: "",
    area: "",
    icon: null,
    numberOfVacancies: 1,
    activeStatus: 1,
  });

  const [formMode, setFormMode] = useState("add");
  const [showForm, setShowForm] = useState(false);
  const [fileName, setFileName] = useState("No file chosen");

  // State for the image cropper
  const [cropSrc, setCropSrc] = useState(null);
  const [croppedBlob, setCroppedBlob] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUserId(decoded.userId || decoded.id);
      } catch (error) {
        console.error("❌ Error decoding JWT:", error);
        localStorage.removeItem("adminJwtToken");
      }
    }
  }, []);

  // --- Data Fetching ---
  useEffect(() => {
    fetchAreas();
    fetchJobs(); // Fetch all jobs initially
  }, []);

  const fetchAreas = async () => {
    try {
      const res = await fetch(`${api}/api/areas`);
      if (!res.ok) throw new Error("Failed to fetch areas");
      const data = await res.json();
      setAreas(data);
    } catch (err) {
      console.error("❌ Failed to fetch areas:", err);
      alert("Failed to load areas.");
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${api}/api/jobs/`);
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();
      console.log(data, "job data");
      setJobs(data); // Store all jobs
    } catch (err) {
      console.error("❌ Failed to fetch jobs:", err);
      alert("Failed to load jobs.");
    }
  };

  // UI-level filtering based on searchQuery
  const filteredJobs = useMemo(() => {
    if (!searchQuery) {
      return jobs; // If no search query, show all jobs
    }

    const lowercasedQuery = searchQuery.toLowerCase();
    return jobs.filter(
      (job) =>
        job.companyName.toLowerCase().includes(lowercasedQuery) ||
        job.post.toLowerCase().includes(lowercasedQuery) ||
        job.city.toLowerCase().includes(lowercasedQuery) ||
        job.summary.toLowerCase().includes(lowercasedQuery)
    );
  }, [jobs, searchQuery]); // Recalculate when jobs or searchQuery changes

  const initialFormData = {
    companyName: "",
    email: "",
    contact: "",
    address: "",
    contactPerson: "",
    jobPost: "",
    summary: "",
    city: "",
    area: "",
    icon: null,
    numberOfVacancies: 1,
    activeStatus: 1,
  };

  // --- Form Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setFileName("No file chosen");
      setForm((prev) => ({ ...prev, icon: null }));
      setCroppedBlob(null);
      setCropSrc(null);
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCropSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCropDone = (blob) => {
    if (blob) {
      setForm((prev) => ({ ...prev, icon: blob }));
      setCroppedBlob(blob);
      setFileName("cropped_image.png");
    } else {
      setForm((prev) => ({ ...prev, icon: null }));
      setCroppedBlob(null);
      setFileName("No file chosen");
    }
    setCropSrc(null);
  };

  const handleAddNewJobClick = () => {
    setShowForm(true);
    setFormMode("add"); // Keep this if you plan to have edit mode later
    setForm(initialFormData);
    setFileName("No file chosen");
    setCroppedBlob(null);
    setCropSrc(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUserId) {
      alert("Authentication required. Please log in to post a job.");
      return;
    }

    try {
      const formDataToSend = new FormData();

      const job = {
        companyName: form.companyName,
        email: form.email,
        phone: form.contact,
        address: form.address,
        personName: form.contactPerson,
        post: form.jobPost,
        summary: form.summary,
        numberOfVacancies: parseInt(form.numberOfVacancies, 10),
        activeStatus: form.activeStatus === 1,
        city: form.area, // Mapping area to city as per your form structure
      };

      const request = {
        userId: currentUserId,
      };

      formDataToSend.append(
        "job",
        new Blob([JSON.stringify(job)], { type: "application/json" })
      );
      formDataToSend.append(
        "request",
        new Blob([JSON.stringify(request)], { type: "application/json" })
      );

      if (form.icon) {
        formDataToSend.append("image", form.icon, fileName);
      }

      const token = localStorage.getItem("jwtToken");
      if (!token) {
        alert("Authentication token not found. Please log in.");
        return;
      }

      const response = await fetch(`${api}/api/jobs/upload`, {
        method: "POST",
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Failed to submit job: ${response.status}`;
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.message) errorMessage += ` - ${errorData.message}`;
          else if (errorData.error) errorMessage += ` - ${errorData.error}`;
        } catch (parseError) {
          errorMessage += ` - ${errorText.substring(0, 100)}...`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("✅ Job created:", data);

      setForm(initialFormData);
      setFileName("No file chosen");
      setCroppedBlob(null);
      setShowForm(false);
      await fetchJobs(); // Re-fetch all jobs to update the list

      alert("🎉 Job posted successfully!");
    } catch (err) {
      console.error("❌ Error submitting job:", err.message);
      alert(`Something went wrong: ${err.message}`);
    }
  };

  // Helper for image URLs (assuming job.image holds the filename)
  const cleanImageUrl = (filename) => {
    return filename
      ? `${api}/uploads/jobs/${filename}` // Adjust path if needed
      : assets.Logo2; // Placeholder image for jobs
  };

  return (
    <div className="relative px-4 py-8 max-w-6xl mx-auto font-sans">
      {!showForm ? (
        <>
          {/* Header with Title and Add Button */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">🏢 Job Listings</h2>
            <button
              onClick={handleAddNewJobClick}
              className="bg-green-600 hover:bg-green-700 text-white text-2xl rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-transform hover:scale-110"
              title="Add new job"
            >
              +
            </button>
          </div>

          {/* Search Input Field */}
          <input
            type="text"
            placeholder="🔍 Search jobs by company, post, city, or summary..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full mb-6 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Job Listings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 py-10">
                {searchQuery
                  ? "No jobs found matching your criteria 🤔"
                  : "No jobs found. Add one to get started!"}
              </p>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                 
                  className="cursor-pointer bg-white p-4 shadow-md rounded-xl border border-gray-200 hover:shadow-lg transition flex flex-col hover:scale-[1.01]"
                >
                  <img
                    src={
                      job.image && job.image.trim() !== ""
                        ? cleanImageUrl(job.image)
                        : assets.Logo // Use a generic placeholder for missing images
                    }
                    alt="Company Logo"
                    className="w-full h-48 object-contain p-2 rounded-lg mb-4 bg-gray-50" // `object-contain` for logos
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{job.post}</h3>
                      <p className="text-sm text-gray-600">
                        <strong>Company:</strong> {job.companyName}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Contact:</strong> {job.email} | {job.phone}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Person:</strong> {job.personName}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Location:</strong> {job.city}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Vacancies:</strong> {job.numberOfVacancies}
                      </p>
                      <p className="text-sm text-gray-700 line-clamp-4">
                        {job.summary}
                      </p>
                    </div>
                    <div className="mt-4 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full font-semibold ${job.activeStatus
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                          }`}
                      >
                        {job.activeStatus ? "✅ Active" : "❌ Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        // Form View
        <div className="bg-white shadow-2xl rounded-2xl border border-gray-200 max-w-3xl mx-auto relative h-[90vh] flex flex-col">
          <button
            onClick={() => setShowForm(false)}
            className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-2xl"
            title="Close Form"
          >
            ✖
          </button>

          <h2 className="text-3xl font-extrabold text-center text-gray-800 mt-6 mb-4">
            📝 Post a New Job
          </h2>

          <div
            className="overflow-y-auto px-6 pb-6"
            style={{ maxHeight: "calc(90vh - 120px)" }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Using CInput for standard fields as before */}
              <Input
                label="Organization Name"
                icon={<GrOrganization />}
                id="companyName"
                name="companyName"
                type="text"
                value={form.companyName}
                onChange={handleChange}
                placeholder="Enter Organization / Company Name"
                required
              />
              <Input
                label="Address"
                icon={<MdAddIcCall />}
                id="address"
                name="address"
                type="text"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter Address"
                required
              />
              <Input
                icon={<MdMailLock />}
                label="Email"
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter Email"
                required
              />
              <Input
                label="Contact Number"
                icon={<MdAddIcCall />}
                id="contact"
                name="contact"
                type="text"
                value={form.contact}
                onChange={handleChange}
                placeholder="Enter Contact Number"
                required
              />
              <Input
                icon={<IoIosContact />}
                label="Contact Person Name"
                id="contactPerson"
                name="contactPerson"
                type="text"
                value={form.contactPerson}
                onChange={handleChange}
                placeholder="Enter Contact Person Name"
                required
              />
              <Input
                icon={<GrUserWorker />}
                label="Job Post Title"
                id="jobPost"
                name="jobPost"
                type="text"
                value={form.jobPost}
                onChange={handleChange}
                placeholder="Enter Job Post Title"
                required
              />

              {/* Area Select Field */}
              <div>
                <label className="block font-medium text-gray-700">Area</label>
                <div className="relative flex items-center">
                  {/* Icon for area can be added here if desired, like in CInput */}
                  <select
                    id="area"
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">- Select Area -</option>
                    {areas.map((area) => (
                      <option key={area.id} value={area.areaName}>
                        {area.areaName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Number of Vacancies */}
              <div>
                <label className="block font-medium text-gray-700">
                  Number of Vacancies
                </label>
                <input
                  id="numberOfVacancies"
                  name="numberOfVacancies"
                  type="number"
                  min="1"
                  value={form.numberOfVacancies}
                  onChange={handleChange}
                  placeholder="Enter number of vacancies"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              {/* Job Summary Textarea */}
              <div>
                <label className="block font-medium text-gray-700">
                  Job Description / Summary
                </label>
                <textarea
                  id="summary"
                  name="summary"
                  rows="4"
                  value={form.summary}
                  onChange={handleChange}
                  placeholder="Enter job summary"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 h-28 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                ></textarea>
              </div>

              {/* Image Upload Field */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Upload Company Logo
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    id="icon"
                    name="icon"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
                  />
                  {croppedBlob && ( // Show preview if image is cropped
                    <img
                      src={URL.createObjectURL(croppedBlob)}
                      alt="Logo Preview"
                      className="w-16 h-16 object-cover rounded-lg shadow-md border border-gray-200"
                    />
                  )}
                  {!croppedBlob &&
                    fileName !== "No file chosen" && ( // Show file name if not yet cropped
                      <span className="text-sm italic text-gray-500">
                        {fileName}
                      </span>
                    )}
                </div>
                {croppedBlob && (
                  <div className="mt-2 text-sm text-green-600 flex items-center">
                    <FaImage className="mr-1" /> Image Cropped and Ready!
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="text-center pt-4">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition duration-200"
                >
                  🚀 Submit New Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Cropper Modal */}
      {cropSrc && <ImageCropperModal src={cropSrc} onDone={handleCropDone} />}
    </div>
  );
}
