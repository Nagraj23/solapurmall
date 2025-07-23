import React, { useState, useEffect, useCallback } from "react";
import Input from "../components/CInput";
import ImageCropperModal from "../components/Cropimage";
import { MdAttachEmail, MdPhone } from "react-icons/md";
import { IoIosContact } from "react-icons/io";
import { RiUserLocationFill } from "react-icons/ri";
import { FaCity, FaBuilding, FaRegFileImage, FaPaperPlane, FaCalendarTimes, FaToggleOn, FaAlignLeft, FaPlusCircle } from "react-icons/fa";
import { TbMapPinCode, TbWorldWww } from "react-icons/tb";
import { jwtDecode } from "jwt-decode";
import api from '../utils/api';

const getOneYearFromNow = () => {
  const now = new Date();
  now.setFullYear(now.getFullYear() + 1);
  now.setMinutes(0);
  now.setSeconds(0);
  now.setMilliseconds(0);
  return now.toISOString().slice(0, 16);
};

const initialFormData = {
  date: new Date().toISOString().slice(0, 10),
  mainCategory: "",
  subCategory: "",
  firmName: "",
  contactPersonName: "",
  email: "",
  contactNo1: "",
  address1: "",
  area: "",
  city: "",
  pincode: "",
  website: "",
  summary: "",
  icon: null,
  sendMessage: false,
  expiryDate: getOneYearFromNow(),
  activate: 0,
};

const FirmsManagement = () => {
  const [mainCategoryOptions, setMainCategoryOptions] = useState([]);
  const [subCategoryOptionsMap, setSubCategoryOptionsMap] = useState({});
  const [areaOptions, setAreaOptions] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [fileName, setFileName] = useState("No file chosen");
  const [errors, setErrors] = useState({});
  const [imageToCrop, setImageToCrop] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [showAddFirmModal, setShowAddFirmModal] = useState(false);

  const [firms, setFirms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingFirms, setLoadingFirms] = useState(false);

  // Set firms per page here
  const FIRMS_PER_PAGE = 25;

  const getUserAreaFromToken = useCallback(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.division) {
          return decoded.division;
        }
      } catch (error) {
        console.error("❌ Error decoding JWT:", error);
        localStorage.removeItem("adminJwtToken");
      }
    }
    return null;
  }, []);

  const fetchInitialData = useCallback(async () => {
    try {
      const [catRes, areaRes] = await Promise.all([
        fetch(`${api}/api/categories`),
        fetch(`${api}/api/areas`)
      ]);
      const catData = await catRes.json();
      const areaData = await areaRes.json();

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
      setAreaOptions(areaData.map(a => ({ value: a.areaName, label: a.areaName })));

    } catch (err) {
      console.error("❌ Error fetching initial data:", err);
    }
  }, []);

  const fetchFirms = useCallback(async (page) => {
    setLoadingFirms(true);
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        alert("Please log in first to fetch firms.");
        setLoadingFirms(false);
        return;
      }
      const res = await fetch(`${api}/api/firms?page=${page}&limit=${FIRMS_PER_PAGE}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch firms: ${res.status}`);
      }
      const data = await res.json();
      setFirms(data);
      console.log(data,"firms")
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error("Error fetching firms:", error);
      alert(`Error fetching firms: ${error.message}`);
    } finally {
      setLoadingFirms(false);
    }
  }, [FIRMS_PER_PAGE]);

  useEffect(() => {
    fetchInitialData();
    fetchFirms(currentPage);
    getUserAreaFromToken();
  }, [fetchInitialData, fetchFirms, currentPage, getUserAreaFromToken]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "mainCategory") {
      setFormData(f => ({
        ...f,
        mainCategory: value,
        subCategory: ""
      }));
    } else if (name === "area") {
      setFormData(f => ({
        ...f,
        [name]: value
      }));
    } else if (type === "file") {
      if (files && files[0]) {
        const file = files[0];
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          setImageToCrop(reader.result);
          setShowCropper(true);
        });
        reader.readAsDataURL(file);
        setFileName(file.name);
      } else {
        setFileName("No file chosen");
        setFormData(f => ({ ...f, [name]: null }));
      }
    } else if (type === "checkbox") {
      setFormData(f => ({ ...f, [name]: checked }));
    } else {
      setFormData(f => ({ ...f, [name]: value }));
    }
    if (errors[name]) setErrors(prevErrors => ({ ...prevErrors, [name]: undefined }));
  };

  const handleImageCropped = (croppedBlob) => {
    if (croppedBlob) {
      setFormData((prev) => ({ ...prev, icon: croppedBlob }));
      setFileName(croppedBlob.name || "cropped_image.png");
    } else {
      setFormData((prev) => ({ ...prev, icon: null }));
      setFileName("No file chosen");
    }
    setShowCropper(false);
    setImageToCrop(null);
  };

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
    if (mainCategory && subCategoryOptionsMap[mainCategory]?.length > 0 && !subCategory) {
      newErrors.subCategory = "Subcategory is required!";
    }
    if (!area) newErrors.area = "Area is required!";
    if (!expiryDate) newErrors.expiryDate = "Expiry Date is required!";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      const formattedExpiryDate = new Date(expiryDate).toISOString();
      const formattedEntryDate = new Date(date).toISOString();

      const payload = {
        dat: formattedEntryDate,
        categoryid: mainCategory,
        subcategoryid: subCategory || null,
        firmname: firmName,
        contactperson: contactPersonName,
        email: email,
        contactno1: contactNo1,
        address1: address1,
        area: area || null,
        city: city,
        pincode: pincode,
        website: website,
        summary: summary,
        expdt: formattedExpiryDate,
        statuss: 1,
        iconstatus: icon ? 1 : 0,
        userid: 1,
        sendmessage: sendMessage ? 1 : 0,
        activate: activate ? 1 : 0
      };

      Object.entries(payload).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          fd.append(key, value);
        }
      });
      if (icon) fd.append("icon", icon);

      const token = localStorage.getItem("adminJwtToken");
      if (!token) {
        alert("Please log in first.");
        return;
      }

      const url = `${api}/api/firms/upload`;
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
      resetFormAndState();
      setShowAddFirmModal(false);
      fetchFirms(currentPage);
    } catch (err) {
      console.error("❌ Submission error:", err);
      alert(`Submission failed. Check console. Error: ${err.message}`);
    }
  };

  const resetFormAndState = () => {
    setFormData(initialFormData);
    setFileName("No file chosen");
    setErrors({});
    setFormData(prev => ({ ...prev, expiryDate: getOneYearFromNow() }));
    setImageToCrop(null);
    setShowCropper(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 font-sans">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl flex flex-col h-full overflow-hidden">
        <div className="relative text-gray-800 p-6 text-center font-bold text-2xl bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl flex-shrink-0 border-b border-blue-200">
          Manage Firms
          <button
            onClick={() => setShowAddFirmModal(true)}
            type="button"
            className="absolute top-5 right-5 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ease-in-out flex items-center"
            title="Add New Firm"
          >
            <FaPlusCircle className="mr-2" /> Add Firm
          </button>
        </div>

        {/* Firms List (Card View) */}
        <div className="p-8 overflow-y-auto flex-grow custom-scrollbar">
          <h3 className="text-xl font-bold mb-4">Existing Firms</h3>
          {loadingFirms ? (
            <p className="text-center text-gray-600">Loading firms...</p>
          ) : firms.length === 0 ? (
            <p className="text-center text-gray-600">No firms found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {firms.map((firm) => (
                <div key={firm.firmid} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg">
                  {firm.icon && (
                    <div className="flex justify-center items-center h-32 bg-gray-100">
                      <img src={`${api}/uploads/${firm.icon}`} alt={`${firm.firmname} icon`} className="max-h-full max-w-full object-contain" />
                    </div>
                  )}
                  <div className="p-5">
                    <h4 className="text-lg font-bold text-gray-900 mb-2 truncate">{firm.firmName}</h4>
                    <p className="text-sm text-gray-600 mb-1 flex items-center"><IoIosContact className="mr-2 text-blue-500" /> {firm.contactPerson}</p>
                    <p className="text-sm text-gray-600 mb-1 flex items-center truncate"><MdAttachEmail className="mr-2 text-blue-500" /> {firm.email}</p>
                    <p className="text-sm text-gray-600 mb-1 flex items-center"><MdPhone className="mr-2 text-blue-500" /> {firm.contactNo1}</p>
                    <p className="text-sm text-gray-600 mb-1 flex items-center"><RiUserLocationFill className="mr-2 text-blue-500" /> {firm.address1}, {firm.area}, {firm.city} - {firm.pincode}</p>
                    {firm.website && <p className="text-sm text-gray-600 mb-1 flex items-center truncate"><TbWorldWww className="mr-2 text-blue-500" /> <a href={firm.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{firm.website}</a></p>}
                    
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || loadingFirms}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-4 py-2 rounded-lg ${currentPage === index + 1 ? 'bg-blue-700 text-white' : 'bg-blue-200 text-blue-800 hover:bg-blue-300'} disabled:opacity-50 disabled:cursor-not-allowed transition duration-150`}
                  disabled={loadingFirms}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || loadingFirms}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Firm Modal */}
      {showAddFirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col h-[90vh]" >
            <div className="relative text-gray-800 p-6 text-center font-bold text-2xl bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl flex-shrink-0 border-b border-blue-200">
              Add New Firm Entry
              <button
                onClick={() => { resetFormAndState(); setShowAddFirmModal(false); }}
                type="button"
                className="absolute top-5 right-5 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
                title="Close and Reset Form"
              >
                Close
              </button>
            </div>

            <div className="p-8 overflow-y-auto flex-grow custom-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input label="Entry Date" id="date" name="date" value={formData.date} onChange={() => { }} type="text" readOnly Icon={FaCalendarTimes} />
                <Input label="Firm Name" id="firmName" name="firmName" placeholder="Enter firm name" value={formData.firmName} onChange={handleChange} error={!!errors.firmName} helperText={errors.firmName} Icon={FaBuilding} />

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
                <Input label="Website" id="website" name="website" type="url" placeholder="https://www.example.com" value={formData.website} onChange={handleChange} Icon={TbWorldWww} />
                <Input label="Summary" id="summary" name="summary" type="text" multiline placeholder="Provide a brief summary of the firm" value={formData.summary} onChange={handleChange} rows={3} Icon={FaAlignLeft} />

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

                <Input
                  label="Expiry Date"
                  id="expiryDate"
                  name="expiryDate"
                  type="datetime-local"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  error={!!errors.expiryDate}
                  helperText={errors.expiryDate}
                  Icon={FaCalendarTimes}
                />

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
        </div>
      )}

      {showCropper && (
        <ImageCropperModal
          src={imageToCrop}
          onDone={handleImageCropped}
        />
      )}
    </div>
  );
};

export default FirmsManagement;