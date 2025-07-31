import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import QuickLinks from '../pages/QuickLinks.jsx';

const Sidebar = () => {
  const [categories, setCategories] = useState([]);
  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState('');
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('');
  const [subCategories, setSubCategories] = useState([]);

  const [adsFlash1, setAdsFlash1] = useState([]);
  const [adsFlash2, setAdsFlash2] = useState([]);
  const [currentAd1, setCurrentAd1] = useState(0);
  const [currentAd2, setCurrentAd2] = useState(0);

  //const API_BASE = "http://localhost:8080/api";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${api}/api/categories`);
        setCategories(res.data);
        console.log("📦 Categories loaded:", res.data);
      } catch (err) {
        console.error("❌ Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleMainCategoryChange = (e) => {
    const selectedId = e.target.value;
    setSelectedMainCategoryId(selectedId);
    setSelectedSubCategoryId('');
    const selected = categories.find(cat => String(cat.categoryId) === selectedId);
    setSubCategories(selected?.subCategories || []);
  };

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await axios.get(`${api}/api/ads`);
        const activeAds = res.data.filter(ad => ad.status === "ACTIVE");
        setAdsFlash1(activeAds.filter(ad => ad.position === "Right Flash 1"));
        setAdsFlash2(activeAds.filter(ad => ad.position === "Right Flash 2"));
      } catch (err) {
        console.error("❌ Failed to fetch ads bro:", err);
      }
    };
    fetchAds();
  }, []);

  useEffect(() => {
    if (adsFlash1.length === 0) return;
    const timer = setInterval(() => {
      setCurrentAd1(prev => (prev + 1) % adsFlash1.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [adsFlash1]);

  useEffect(() => {
    if (adsFlash2.length === 0) return;
    const timer = setInterval(() => {
      setCurrentAd2(prev => (prev + 1) % adsFlash2.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [adsFlash2]);

  const selectedMainCategory = categories.find(cat => String(cat.categoryId) === selectedMainCategoryId);
  const selectedSubCategory = subCategories.find(sub => String(sub.subCategoryId) === selectedSubCategoryId);

 const handleNavigate = () => {
  if (!selectedMainCategoryId) {
    alert("Please select a Main Category.");
    return;
  }

  const url = selectedSubCategoryId
    ? `/category-details?mainCategoryId=${selectedMainCategoryId}&subCategoryId=${selectedSubCategoryId}`
    : `/category-details?mainCategoryId=${selectedMainCategoryId}`;

  navigate(url, {
    state: {
      mainCategory: selectedMainCategory,
      subCategory: selectedSubCategory || null,
    }
  });
};
;

  return (
    <aside className="w-full h-full bg-gray-100 border-t md:border-t-0 md:border-l border-gray-200 p-0 flex flex-col ">

      {/* 🔽 Category Dropdowns */}
      <div className="space-y-2">
        {/* Main Category */}
        <div>
          <label className="block text-sm m-2  p-2 font-medium text-gray-700 ">Category</label>
          <select
            value={selectedMainCategoryId}
            onChange={handleMainCategoryChange}
            className="w-full border rounded-md p-2"
          >
            <option value="">-- Select Main Category --</option>
            {categories.map(cat => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.mainCategoryName}
              </option>
            ))}
          </select>
        </div>

        {/* Sub Category (only if available) */}
        {subCategories.length > 0 && (
          <div>
            {/* <label className="block text-sm font-medium text-gray-700 m-2 p-2">Sub Category</label> */}
            <select
              value={selectedSubCategoryId}
              onChange={(e) => setSelectedSubCategoryId(e.target.value)}
              className="w-full border rounded-md p-2"
            >
              <option value="">-- Select Sub Category --</option>
              {subCategories.map(sub => (
                <option key={sub.subCategoryId} value={sub.subCategoryId}>
                  {sub.subCategoryName.trim()}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Selected Display */}
        {/* {selectedMainCategory && (
          <div className="p-2 bg-black rounded text-sm text-gray-800">
            ✅ Selected: <strong>{selectedMainCategory.mainCategoryName}</strong>
            {selectedSubCategory && <> → <strong>{selectedSubCategory.subCategoryName}</strong></>}
          </div>
        )} */}

        {/* View Details Button */}
        {selectedMainCategory && (
          <button
            onClick={handleNavigate}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 m-2 px-4 rounded"
          >
            {selectedSubCategory ? "View SubCategory Details" : "View Main Category"}
          </button>
        )}
      </div>

      {/* 🟡 Right Flash 1 Ads */}
      <div className="relative w-full m-2 h-[450px] p-2 flex justify-center items-center overflow-hidden">
        {adsFlash1.map((ad, i) => (
          <img
            key={i}
            src={`${api}/${ad.imagePath}`}
            alt={ad.title || `Ad ${i + 1}`}
            className={`transition-opacity  duration-1000 ease-in-out absolute ${i === currentAd1 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        ))}
      </div>

      {/* 🔵 Right Flash 2 Ads */}
      <div className="relative w-full h-[450px] p-2 flex justify-center items-center overflow-hidden">
        {adsFlash2.map((ad, i) => (
          <img
            key={i}
            src={`${api}/${ad.imagePath}`}
            alt={ad.title || `Ad ${i + 1}`}
            className={`transition-opacity p-0 m-0 duration-1000 ease-in-out absolute ${i === currentAd2 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            style={{ maxWidth: '100%', height: 'auto' }}
            loading="lazy"
          />
        ))}
      </div>

      {/* 🔗 Quick Links */}
      <div className="hidden md:block px-4 w-full justify-center">
        <div className="w-full max-w-sm">
          <QuickLinks />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
