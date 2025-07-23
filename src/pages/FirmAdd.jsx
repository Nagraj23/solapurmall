import React, { useState, useEffect, useCallback } from "react";
import Input from "../components/CInput"; // Assuming CInput.js is your Input component
import ImageCropperModal from "../components/Cropimage"; // Import the ImageCropperModal component
import { MdAttachEmail, MdPhone } from "react-icons/md";
import { IoIosContact } from "react-icons/io";
import { RiUserLocationFill } from "react-icons/ri";
import { FaCity, FaBuilding, FaRegFileImage, FaPaperPlane, FaCalendarTimes, FaToggleOn, FaAlignLeft } from "react-icons/fa";
import { TbMapPinCode, TbWorldWww } from "react-icons/tb";
import axios from "axios";
import api from '../utils/api';
import { jwtDecode } from "jwt-decode";

const FirmAdd = () => {
  // Helper to get valid date format for datetime-local input
  const getValidDate = (d) => {
    if (d && typeof d === "string" && d.trim() !== "") {
      const dateObj = new Date(d);
      if (!isNaN(dateObj.getTime())) return dateObj.toISOString().slice(0, 16);
    }
    const now = new Date();
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now.toISOString().slice(0, 16); // Format for datetime-local input
  };

  // Calculate 1 year from now for the initial expiry date
  const getOneYearFromNow = () => {
    const now = new Date();
    now.setFullYear(now.getFullYear() + 1);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now.toISOString().slice(0, 16); // Format for datetime-local input
  };

  // Initial form data
  const initialFormData = {
    date: new Date().toISOString().slice(0, 10), // Entry Date (read-only, sent to backend)
    mainCategory: "",
    subCategory: "",
    firmName: "", contactPersonName: "", email: "",
    contactNo1: "", // Only one contact number as per current form fields
    address1: "", // Only one address line as per current form fields
    area: "", // `area` will now hold the selected area name
    city: "", pincode: "", website: "",
    summary: "", icon: null, sendMessage: false, expiryDate: getOneYearFromNow(), activate: 0
  };

  const [mainCategoryOptions, setMainCategoryOptions] = useState([]);
  const [subCategoryOptionsMap, setSubCategoryOptionsMap] = useState({});
  const [areaOptions, setAreaOptions] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [fileName, setFileName] = useState("No file chosen");
  const [errors, setErrors] = useState({});

  // State for image cropping
  const [imageToCrop, setImageToCrop] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  // Fetch user area from JWT token (if needed for display or specific logic)
  const getUserAreaFromToken = useCallback(() => {
    const token = localStorage.getItem("adminJwtToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Assuming 'division' holds the area name
        if (decoded.division) {
          return decoded.division;
        }
      } catch (error) {
        console.error("❌ Error decoding JWT:", error);
        localStorage.removeItem("adminJwtToken"); // Clear invalid token
      }
    }
    return null;
  }, []);

  // Fetch initial data (categories and areas)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [catRes, areaRes] = await Promise.all([
          fetch(`${api}/api/categories`),
          fetch(`${api}/api/areas`)
        ]);
        const catData = await catRes.json();
        const areaData = await areaRes.json();

        // Process categories for dropdowns
        const mainCats = [];
        const subCatsMap = {};

        catData.forEach((mainCat) => {
          mainCats.push({ value: String(mainCat.categoryId), label: mainCat.mainCategoryName });

          if (mainCat.subCategories && mainCat.subCategories.length > 0) {
            subCatsMap[String(mainCat.categoryId)] = mainCat.subCategories.map(subCat => ({
              value: String(subCat.subCategoryId),
              label: subCat.subCategoryName
            }));
          } else {
            subCatsMap[String(mainCat.categoryId)] = [];
          }
        });

        setMainCategoryOptions(mainCats);
        setSubCategoryOptionsMap(subCatsMap);

        // Map Area Options to store NAME as value (as per your backend expectation)
        setAreaOptions(areaData.map(a => ({ value: a.areaName, label: a.areaName })));

      } catch (err) {
        console.error("❌ Error fetching initial data:", err);
      }
    };
    fetchInitialData();
  }, []); // Empty dependency array means this runs once on mount

  // Set initial user area from token
  useEffect(() => {
    const area = getUserAreaFromToken();
    // setUserArea(area); // Only if you need to display it
  }, [getUserAreaFromToken]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "mainCategory") {
      setFormData(f => ({
        ...f,
        mainCategory: value,
        subCategory: "" // Reset subCategory when main category changes
      }));
    } else if (name === "area") {
      setFormData(f => ({
        ...f,
        [name]: value // Store the area NAME directly from the dropdown's value
      }));
    } else if (type === "file") {
      if (files && files[0]) {
        const file = files[0];
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          setImageToCrop(reader.result); // Set image source for cropper
          setShowCropper(true); // Show the cropper modal
        });
        reader.readAsDataURL(file);
        setFileName(file.name); // Display the original file name
      } else {
        setFileName("No file chosen");
        setFormData(f => ({ ...f, [name]: null })); // Clear icon if no file selected
      }
    } else if (type === "checkbox") {
      setFormData(f => ({ ...f, [name]: checked }));
    } else {
      setFormData(f => ({ ...f, [name]: value }));
    }
    // Clear error for the field being changed
    if (errors[name]) setErrors(prevErrors => ({ ...prevErrors, [name]: undefined }));
  };

  // Callback from ImageCropperModal when cropping is done
  const handleImageCropped = (croppedBlob) => {
    if (croppedBlob) {
      setFormData((prev) => ({ ...prev, icon: croppedBlob }));
      setFileName(croppedBlob.name || "cropped_image.png"); // Update filename with cropped file name
      console.log("✅ Image successfully cropped and set in form data.");
    } else {
      // If blob is null, it means cropping was cancelled
      setFormData((prev) => ({ ...prev, icon: null }));
      setFileName("No file chosen");
      console.log("❌ Image cropping cancelled.");
    }
    setShowCropper(false); // Hide the cropper modal
    setImageToCrop(null); // Clear the image source for the cropper
  };

  // Form validation logic
  const validateForm = () => {
    const newErrors = {};
    const { firmName, contactPersonName, email, contactNo1, address1, city, pincode, mainCategory, subCategory, expiryDate, area } = formData;

    if (!firmName.trim()) newErrors.firmName = "Firm Name is required!";
    if (!contactPersonName.trim()) newErrors.contactPersonName = "Contact Person Name is required!";
    if (!email.trim()) newErrors.email = "Email is required!";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid!";
    if (!contactNo1.trim()) newErrors.contactNo1 = "Contact No. is required!";
    if (!address1.trim()) newErrors.address1 = "Address is required!";
    if (!city.trim()) newErrors.city = "City is required!";
    if (!pincode.trim()) newErrors.pincode = "Pincode is required!";
    if (!mainCategory) newErrors.mainCategory = "Main Category is required!";
    // Validate subCategory only if there are subcategories for the selected main category
    if (mainCategory && subCategoryOptionsMap[mainCategory]?.length > 0 && !subCategory) {
      newErrors.subCategory = "Subcategory is required!";
    }
    if (!area) newErrors.area = "Area is required!"; // Validate area selection
    if (!expiryDate) newErrors.expiryDate = "Expiry Date is required!";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (!validateForm()) {
      alert("Please correct the errors in the form before submitting.");
      return;
    }

    try {
      const fd = new FormData();
      const {
        date, mainCategory, subCategory, firmName, contactPersonName, email,
        contactNo1, address1, area, city, pincode,
        website, summary, expiryDate, sendMessage, icon, activate
      } = formData;

      // Format date for backend (ISO string)
      const formattedExpiryDate = new Date(expiryDate).toISOString();
      const formattedEntryDate = new Date(date).toISOString();

      const payload = {
        dat: formattedEntryDate, // Assuming backend expects 'dat' for entry date
        categoryid: mainCategory,
        subcategoryid: subCategory || null,
        firmname: firmName,
        contactperson: contactPersonName,
        email: email,
        contactno1: contactNo1,
        address1: address1,
        area: area || null, // This will now send the area NAME
        city: city,
        pincode: pincode,
        website: website,
        summary: summary,
        expdt: formattedExpiryDate,
        statuss: 1, // Assuming 'statuss' is always 1 for active
        iconstatus: icon ? 1 : 0, // 1 if icon is present, 0 otherwise
        userid: 1, // Placeholder: consider using actual logged-in user's ID
        sendmessage: sendMessage ? 1 : 0, // Backend expects 1 or 0 for boolean
        activate: activate ? 1 : 0 // Backend expects 1 or 0 for boolean
      };

      // Append all payload fields to FormData
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          fd.append(key, value);
        }
      });
      // Append the icon file if it exists
      if (icon) fd.append("icon", icon);

      const token = localStorage.getItem("adminJwtToken"); // Use adminJwtToken as per your code
      if (!token) {
        alert("Please log in first.");
        return;
      }

      const url = `${api}/api/firms/upload`; // Assuming only add functionality for now
      const method = "POST";

      const res = await fetch(url, {
        method,
        body: fd,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to add firm: ${res.status} - ${errorText}`);
      }

      alert("Firm added successfully! 🔥");
      resetFormAndState(); // Reset form after successful submission
    } catch (err) {
      console.error("❌ Submission error:", err);
      alert(`Submission failed. Check console. Error: ${err.message}`);
    }
  };

  // Reset form to initial state
  const resetFormAndState = () => {
    setFormData(initialFormData);
    setFileName("No file chosen");
    setErrors({});
    // Ensure expiry date is reset to 1 year from now
    setFormData(prev => ({ ...prev, expiryDate: getOneYearFromNow() }));
    setImageToCrop(null); // Clear image for cropper
    setShowCropper(false); // Hide cropper
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col h-full" >
        <div className="relative text-gray-800 p-6 text-center font-bold text-2xl bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl flex-shrink-0 border-b border-blue-200">
          Add New Firm Entry
          <button
            onClick={resetFormAndState}
            type="button" // Important: set type="button" to prevent accidental form submission
            className="absolute top-5 right-5 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
            title="Reset Form"
          >
            Reset Form
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-grow custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Entry Date Input (read-only) */}
            <Input label="Entry Date" id="date" name="date" value={formData.date} onChange={() => { }} type="text" readOnly Icon={FaCalendarTimes} />

            <Input label="Firm Name" id="firmName" name="firmName" placeholder="Enter firm name" value={formData.firmName} onChange={handleChange} error={!!errors.firmName} helperText={errors.firmName} Icon={FaBuilding} />

            {/* Main Category Dropdown */}
            <div className="flex flex-col">
              <label htmlFor="mainCategory" className="block text-gray-700 font-bold mb-2">Main Category :</label>
              <div className="relative flex items-center">
                <FaAlignLeft className="absolute left-3 text-gray-400 text-lg" />
                <select
                  id="mainCategory"
                  name="mainCategory"
                  value={formData.mainCategory}
                  onChange={handleChange}
                  className={`w-full p-3 pl-10 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ${errors.mainCategory ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Select Main Category</option>
                  {mainCategoryOptions.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                </select>
                {errors.mainCategory && <p className="text-red-500 text-xs mt-1">{errors.mainCategory}</p>}
              </div>
            </div>

            {/* Subcategory Dropdown (conditionally rendered and populated) */}
            {formData.mainCategory && (
              <div className="flex flex-col">
                <label htmlFor="subCategory" className="block text-gray-700 font-bold mb-2">Subcategory :</label>
                <div className="relative flex items-center">
                  <FaAlignLeft className="absolute left-3 text-gray-400 text-lg" />
                  <select
                    id="subCategory"
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                    className={`w-full p-3 pl-10 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ${errors.subCategory ? "border-red-500" : "border-gray-300"}`}
                    disabled={!subCategoryOptionsMap[formData.mainCategory] || subCategoryOptionsMap[formData.mainCategory].length === 0}
                  >
                    <option value="">
                      {subCategoryOptionsMap[formData.mainCategory]?.length > 0
                        ? "Select Subcategory"
                        : "No Subcategories available"
                      }
                    </option>
                    {subCategoryOptionsMap[formData.mainCategory]?.map(sub => (
                      <option key={sub.value} value={sub.value}>{sub.label}</option>
                    ))}
                  </select>
                  {errors.subCategory && <p className="text-red-500 text-xs mt-1">{errors.subCategory}</p>}
                </div>
              </div>
            )}

            <Input label="Contact Person" id="contactPersonName" name="contactPersonName" placeholder="Enter contact person's name" value={formData.contactPersonName} onChange={handleChange} error={!!errors.contactPersonName} helperText={errors.contactPersonName} Icon={IoIosContact} />
            <Input label="Email" id="email" name="email" type="email" placeholder="Enter email address" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} Icon={MdAttachEmail} />

            <Input label="Contact No." id="contactNo1" name="contactNo1" type="tel" placeholder="Primary phone number" value={formData.contactNo1} onChange={handleChange} error={!!errors.contactNo1} helperText={errors.contactNo1} Icon={MdPhone} />

            <Input label="Address" id="address1" name="address1" placeholder="Street address, P.O. Box" value={formData.address1} onChange={handleChange} error={!!errors.address1} helperText={errors.address1} Icon={RiUserLocationFill} />

            {/* Area Dropdown */}
            <div className="flex flex-col">
              <label htmlFor="area" className="block text-gray-700 font-bold mb-2">Area :</label>
              <div className="relative flex items-center">
                <RiUserLocationFill className="absolute left-3 text-gray-400 text-lg" />
                <select
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className={`w-full p-3 pl-10 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ${errors.area ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Select Area</option>
                  {areaOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
                {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area}</p>}
              </div>
            </div>

            <Input label="City" id="city" name="city" placeholder="Enter city" value={formData.city} onChange={handleChange} error={!!errors.city} helperText={errors.city} Icon={FaCity} />
            <Input label="Pincode" id="pincode" name="pincode" placeholder="Enter pincode" value={formData.pincode} onChange={handleChange} error={!!errors.pincode} helperText={errors.pincode} Icon={TbMapPinCode} />
            <Input label="Website" id="website" name="website" type="url" placeholder="[https://www.example.com](https://www.example.com)" value={formData.website} onChange={handleChange} Icon={TbWorldWww} />

            {/* Summary */}
            <Input label="Summary" id="summary" name="summary" type="text" multiline placeholder="Provide a brief summary of the firm" value={formData.summary} onChange={handleChange} rows={3} Icon={FaAlignLeft} />

            {/* Icon Upload Field */}
            <div className="flex flex-col">
              <label htmlFor="icon" className="block text-gray-700 font-bold mb-2">Icon :</label>
              <div className="relative flex items-center p-3 border border-gray-300 rounded-lg shadow-sm bg-white w-full transition duration-150 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                <FaRegFileImage className="absolute left-3 text-gray-400 text-xl pointer-events-none" />
                <input
                  type="file"
                  id="icon"
                  name="icon"
                  accept="image/*"
                  onChange={handleChange}
                  className="block w-full text-sm text-gray-500 pl-10
                             file:mr-4 file:py-2 file:px-4
                             file:rounded-full file:border-0
                             file:text-sm file:font-semibold
                             file:bg-blue-50 file:text-blue-700
                             hover:file:bg-blue-100 cursor-pointer"
                  aria-label="Upload Firm Icon"
                />
                <span className="ml-2 text-gray-500 text-sm hidden sm:inline-block truncate">{fileName}</span>
              </div>
            </div>

            {/* Expiry Date Field (still using datetime-local) */}
            <Input
              label=""
              id="expiryDate"
              name=""
              type="datetime-local"
              value={formData.expiryDate}
              onChange={handleChange}
              error={!!errors.expiryDate}
              helperText={errors.expiryDate}
              Icon={FaCalendarTimes}
            />

            {/* Send Message & Activate Firm Checkboxes */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mt-4">
              <div className="flex items-center">
                <input type="checkbox" id="sendMessage" name="sendMessage" checked={formData.sendMessage} onChange={handleChange} className="mr-3 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer" />
                <label htmlFor="sendMessage" className="text-gray-700 font-bold flex items-center">
                  <FaPaperPlane className="mr-2 text-blue-500" /> Send Message
                </label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="activate" name="activate" checked={formData.activate === 1} onChange={e => setFormData({ ...formData, activate: e.target.checked ? 1 : 0 })} className="mr-3 h-5 w-5 text-green-600 rounded border-gray-300 focus:ring-green-500 cursor-pointer" />
                <label htmlFor="activate" className="text-gray-700 font-bold flex items-center">
                  <FaToggleOn className="mr-2 text-green-500" /> Activate Firm
                </label>
              </div>
            </div>

            {/* Submit Button (inside the form for proper submission) */}
            <div className="flex justify-center p-4 border-t border-gray-200 bg-white rounded-b-xl flex-shrink-0">
              <button
                type="submit"
                className="w-full md:w-1/2 max-w-xs bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Submit New Firm
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Image Cropper Modal */}
      {showCropper && (
        <ImageCropperModal
          src={imageToCrop}
          onDone={handleImageCropped} // Pass the single onDone handler
        />
      )}
    </div>
  );
};

export default FirmAdd;
