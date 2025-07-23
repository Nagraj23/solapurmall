import React, { useState, useEffect } from 'react';
import LinkSection from '../components/LinkSection';
import ImageBanner from '../components/Imagebanner';
import FirmListings from '../components/FirmListings';
import Category from './Category';
import Sidebar from '../components/Sidebar';
import NotificationBar from '../components/NotificationBar';
import QuickLinks from './QuickLinks';
import axios from 'axios';
import api from '../utils/api';

const Homepage = () => {
  const [topAds, setTopAds] = useState([]);
  const [midLeftAd, setMidLeftAd] = useState(null);
  const [rightAd1, setRightAd1] = useState(null);
  const [rightAd2, setRightAd2] = useState(null);
  const [ads, setAds] = useState([]);
  const [activeAdIndex, setActiveAdIndex] = useState(0);

  useEffect(() => {
    console.log(" home page reached ")
    const fetchAds = async () => {
      try {
        const res = await axios.get(`${api}/api/ads`);
        const cityAds = res.data.filter(
          (ad) =>
            ad.status === 'ACTIVE' &&
            ad.area?.trim().toLowerCase() === 'solapur'
        );

        setAds(res.data);

        const topFlashAds = cityAds
          .filter((ad) => ad.position?.trim().toLowerCase() === 'home flash')
          .map((ad) => ad)
          .filter(Boolean);

        setTopAds(topFlashAds);

        setMidLeftAd(
          cityAds.find((ad) => ad.position?.trim().toLowerCase() === 'mid left')?.imagePath || null
        );
        setRightAd1(
          cityAds.find((ad) => ad.position?.trim().toLowerCase() === 'left flash 1')?.imagePath || null
        );
        setRightAd2(
          cityAds.find((ad) => ad.position?.trim().toLowerCase() === 'left flash 2')?.imagePath || null
        );
      } catch (err) {
        console.error('❌ Failed to fetch ads:', err);
      }
    };

    fetchAds();
  }, []);

  // 🔁 Rotate top ads every 3s
  useEffect(() => {
    if (topAds.length === 0) return;

    const interval = setInterval(() => {
      setActiveAdIndex((prev) => (prev + 1) % topAds.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [topAds]);

  return (
    <div className="min-h-screen flex flex-col gap-4 w-full p-2">
      <NotificationBar area="solapur" />
      <ImageBanner />

      {/* 🔥 Animated Top Ads */}
      {topAds.length > 0 && (
  <div className="relative w-full aspect-[16/9] sm:h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-md">
    {topAds.map((ad, index) => (
      <img
        key={index}
        src={`https://api.solapurmall.com/${ad.imagePath}`}
        alt={ad.title || `Top Ad ${index + 1}`}
        className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
          index === activeAdIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
        }`}
      />
    ))}
  </div>
)}


      {/* Sidebar for Mobile */}
      <div className="block md:hidden">
        <Sidebar />
      </div>

      {/* Main Sections */}
      <div className="px-2">
        <LinkSection />
      </div>

      <div className="px-2">
        <FirmListings />
      </div>

      <div className="px-2 w-full">
        <Category />
      </div>

      {/* Quick Links for Mobile */}
      <div className="block md:hidden px-4 w-full justify-center">
        <div className="w-full md:max-w-sm">
          <QuickLinks />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
