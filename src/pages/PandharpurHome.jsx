import React, { useEffect, useState } from "react";
import axios from "axios";

import LinkSection from "../components/LinkSection";
import FirmListings from "../components/FirmListings";
import QuickLinks from "./QuickLinks";
import Category from "./Category";
import Banner from "../components/Banner";
import NotificationBar from "../components/NotificationBar";
import api from '../utils/api';

const PandharpurHome = () => {
  const [topAd, setTopAd] = useState(null);
  const [midLeftAd, setMidLeftAd] = useState(null);
  const [rightAd1, setRightAd1] = useState(null);
  const [rightAd2, setRightAd2] = useState(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await axios.get(`${api}/api/ads`);
        const cityAds = res.data.filter(
          (ad) =>
            ad.status === "ACTIVE" &&
            ad.area?.trim().toLowerCase() === "pandharpur"
        );

        // Debug log
        console.log("📦 Pandharpur Ads:", cityAds);

        const getImage = (positionName) =>
          cityAds.find(
            (ad) =>
              ad.position?.trim().toLowerCase() ===
              positionName.toLowerCase()
          )?.imagePath || null;

        // 🧠 Assign ads by position
        setTopAd(getImage("Big Flash"));
        setRightAd1(getImage("Left Flash 1"));
        setRightAd2(getImage("Left Flash 2"));

      } catch (err) {
        console.error("❌ Failed to fetch Pandharpur ads:", err);
      }
    };

    fetchAds();
  }, []);

  return (
    <div className="min-h-screen flex flex-col gap-4 w-full p-2">
      <NotificationBar />

      {/* 🖼️ Top Banner with Ads */}
      <Banner
        imageVariable="vitthal"
        topAd={topAd}
        midLeftAd={midLeftAd}
        rightAd1={rightAd1}
        rightAd2={rightAd2}
      />

      {/* 🔗 Links Section */}
      <LinkSection />

      {/* 🏢 Business Listings */}
      <FirmListings />

      {/* 📂 Categories */}
      <div className="w-full">
        <Category />
      </div>

      {/* 📱 Quick Links for Mobile */}
      <div className="block md:hidden px-4 w-full justify-center">
        <div className="w-full max-w-sm">
          <QuickLinks />
        </div>
      </div>
    </div>
  );
};

export default PandharpurHome;
