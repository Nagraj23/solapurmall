import React, { useState, useEffect } from "react";
import axios from "axios";

import NotificationBar from "../components/NotificationBar";
import LinkSection from "../components/LinkSection";
import FirmListings from "../components/FirmListings";
import QuickLinks from "./QuickLinks";
import Category from "./Category";
import Banner from "../components/Banner";
import api from "../utils/api";

const AkkalkotHome = () => {
  const [topAds, setTopAds] = useState([]); // 👉 Changed to array for carousel
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
            ad.area?.trim().toLowerCase() === "akkalkot"
        );

        // 📦 Collect all Big Flash ads for carousel
        const topFlashAds = cityAds
          .filter((ad) => ad.position?.trim().toLowerCase() === "big flash")
          .map((ad) => ad.imagePath)
          .filter(Boolean); // Remove null/undefined

        setTopAds(topFlashAds);

        setMidLeftAd(
          cityAds.find((ad) => ad.position?.trim().toLowerCase() === "mid left")?.imagePath || null
        );
        setRightAd1(
          cityAds.find((ad) => ad.position?.trim().toLowerCase() === "left flash 1")?.imagePath || null
        );
        setRightAd2(
          cityAds.find((ad) => ad.position?.trim().toLowerCase() === "left flash 2")?.imagePath || null
        );
      } catch (err) {
        console.error("❌ Failed to fetch Akkalkot ads:", err);
      }
    };

    fetchAds();
  }, []);

  return (
    <div className="min-h-screen flex flex-col gap-4 w-full p-2">
      <NotificationBar area="akkalkot" />

      {/* 🎯 Updated to support topAds array for carousel */}
      <Banner
        imageVariable="swami"
        topAds={topAds}
        midLeftAd={midLeftAd}
        rightAd1={rightAd1}
        rightAd2={rightAd2}
      />

      <LinkSection />
      <FirmListings />

      <div className="w-full">
        <Category />
      </div>

      <div className="block md:hidden px-4 w-full justify-center">
        <div className="w-full max-w-sm">
          <QuickLinks />
        </div>
      </div>
    </div>
  );
};

export default AkkalkotHome;
