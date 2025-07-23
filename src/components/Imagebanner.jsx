import React, { useState, useEffect } from "react";
import axios from "axios";
import api from '../utils/api';

export default function ImageBanner() {
  const [ads, setAds] = useState([]);
  const [ad2, setAd2] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(()=>{
    console.log("image banner got bro ")
  })
  useEffect(() => {
    
    const fetchAds = async () => {
      try {
        const res = await axios.get(`${api}/api/ads`);
        const activeAds = res.data
          .filter(ad => ad.status === "ACTIVE" && ad.position === "Big Flash" && ad.area === "Solapur");
        setAds(activeAds);
        console.log(activeAds, "ads bro ")
      } catch (err) {
        console.error("Failed to fetch ads:", err);
      }
    };

    fetchAds();
  }, []);

  useEffect(() => {
    const fetchAds2 = async () => {
      try {
        const res = await axios.get(`${api}/api/ads`);
        const activeAds = res.data
          .filter(ad => ad.status === "ACTIVE" && ad.position === "Home Flash" && ad.area === "Solapur");
        setAd2(activeAds);
        console.log(activeAds, "ads bro ")
      } catch (err) {
        console.error("Failed to fetch ads:", err);
      }
    };

    fetchAds2();
  }, []);


  useEffect(() => {
    if (ads.length === 0) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % ads.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [ads]);

  if (ads.length === 0) return null;

  return (
    <div className="w-full overflow-hidden bg-white shadow-md p-0 md:p-0 rounded-2xl relative">
      <div className="w-full max-w-screen-xl mx-auto">
        <div
          className="flex transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {ads.map((ad, index) => (
            <img
              key={index}
              src={`${api}/${ad.imagePath}`}
              alt={ad.title || `Slide ${index + 1}`}
              className="w-full h-[180px] md:h-[300px] lg:h-[400px] object-cover p-4 flex-shrink-0 rounded-xl"
              style={{ maxWidth: "100%" }}
            />
          ))}
        </div>
      </div>

      {/* <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {ad2.map((ad, idx) => (
          <div
            key={idx}
            className={`w-3 h-3 rounded-full ${idx === current ? "bg-white" : "bg-gray-400"
              } transition-all duration-300`}
          />
        ))}
      </div> */}
    </div>
  );
}
