import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "../assets/assets";
import api from '../utils/api';
import BIGFLASH from "../assets/BigFlashImageDefault.png";

const Banner = ({ imageVariable, topAds = [], midLeftAd, rightAd1, rightAd2 }) => {
  const MainImageSrc = assets[imageVariable] || assets.swami;

  const getImageUrl = (path) => (path ? `${api}/${path}` : null);
  const fallback = (src, fallbackImg) => src || fallbackImg;

  const getFinalImage = (src, fallbackImg) => fallback(getImageUrl(src), fallbackImg);

  const [current, setCurrent] = useState(0);
  const hasTopAds = topAds.length > 0;
  const activeTopImage = hasTopAds ? topAds[current] : null;

  useEffect(() => {
    if (!hasTopAds) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % topAds.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [topAds]);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-4">
      {/* 🔝 Top Ad Carousel or Static Fallback */}
      <div className="w-full h-[450px] rounded-lg overflow-hidden shadow-md relative">
        <AnimatePresence mode="wait">
          <motion.img
            key={hasTopAds ? current : "fallback"}
            src={getFinalImage(activeTopImage, BIGFLASH)}
            alt="Top Flash Ad"
            className="w-full h-full object-cover absolute top-0 left-0"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ ease: "easeInOut" }}
          />
        </AnimatePresence>
        {/* <h1>hello</h1> */}
      </div>

      {/* 🧱 Mid Section */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* ⬅️ Mid Left Ad */}
        <div className="w-full md:w-[65%] rounded-lg overflow-hidden shadow-md">
          <img
            src={getFinalImage(midLeftAd, MainImageSrc)}
            alt="Left Mid Ad"
            className="w-full h-full object-cover"
          />
        </div>

        {/* ➡️ Right Ads */}
        <div className="w-full md:w-[35%] flex flex-col gap-4">
          <div className="h-[250px] w-full rounded-lg overflow-hidden shadow-md">
            <img
              src={getFinalImage(rightAd1, assets.ad_here)}
              alt="Right Ad 1"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="h-[250px] w-full rounded-lg overflow-hidden shadow-md">
            <img
              src={getFinalImage(rightAd2, BIGFLASH)}
              alt="Right Ad 2"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
