import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import api from '../utils/api';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const backendUrl = "http://localhost:8080/";

   useEffect(()=>{
      console.log("category got bro ")
    },[])

  const dummyData = [
    { title: "Automobiles", img: assets.Automobiles || "https://via.placeholder.com/100" },
    { title: "Builders And Developers", img: assets.BuildersAndDevelopers || "https://via.placeholder.com/100" },
    { title: "Apperals/ Garments",        img: assets.ApperalsGarments || "https://via.placeholder.com/100" },
    { title: "Jewellery Shops",   img: assets.JewelleryShops || "https://via.placeholder.com/100" },
    { title: "Beauty Parlors",    img: assets.Beautyparlors || "https://via.placeholder.com/100" },
    { title: "Hospitals/ Medicals", img: assets.HospitalsMedicals || "https://via.placeholder.com/100" },
    { title: "Movies", img: assets.Movies || "https://via.placeholder.com/100" },
    { title: "Photos/ Video Shooting", img: assets.PhotosVideoShooting || "https://via.placeholder.com/100" },
    { title: "Health Care Center", img: assets.HealthCare || "https://via.placeholder.com/100" },
    { title: "Furnitures ", img: assets.Furnitures || "https://via.placeholder.com/100" },
    { title: "Tours And Travels", img: assets.ToursTravels || "https://via.placeholder.com/100" },
    { title: "Electronics/ Electricals", img: assets.ElectronicsElectricals || "https://via.placeholder.com/100" },
    { title: "Mangal Karyalay", img: assets.MangalKaryalay || "https://via.placeholder.com/100" },
    { title: "Caterers", img: assets.Cateres || "https://via.placeholder.com/100" },
  ];
useEffect(() => {
  setCategories(dummyData);
}, []);

  // useEffect(() => {
  //   fetch("http://192.168.1.10:8080/categorycards")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (Array.isArray(data) && data.length > 0) {
  //         setCategories(data);
  //       } else {
  //         setCategories(dummyData);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error("API Error: ", err);
  //       setCategories(dummyData);
  //     });
  // }, []);
 
  

  return (
    <section className="px-6 py-4 bg-gradient-to-r from-[#e0f7fa] via-[#ccf2ff] to-[#f1f8ff] rounded-2xl shadow-lg w-full ">
      <div className="ml-2 mb-4">
        <h2 className="text-xl font-bold text-indigo-800">Browse By Category</h2>
      </div>

      <div className="pr-1 custom-scrollbar">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {categories.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-center items-center text-center text-indigo-800 bg-white hover:bg-gradient-to-br from-sky-400 to-indigo-600 hover:text-white rounded-xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1 hover:scale-105 h-full p-4"
            >
              <Link
  to={`/category-details?mainCategory=${encodeURIComponent(item.title)}`}
  className="w-[10vh] h-[10vh] md:w-[13vh] md:h-[13vh] m-2 bg-gray-100 rounded-2xl flex items-center p-2 justify-center"
>
                <img
                  // src={
                  //   item.img.startsWith("http")
                  //     ? item.img
                  //     : `${backendUrl}${item.img}`
                  // }
                  src={item.img}
                  alt={item.title}
                  className="w-ful h-full object-contain"
                />
              </Link>
              <div className="text-sm font-semibold">{item.title}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Category;
