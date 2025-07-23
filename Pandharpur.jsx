import React from "react";

// Replace these with your actual asset paths
import MainImage from "../assets/vitthal.jpg";
import AdImage1 from "../assets/ad_here.jpg";
import AdImage2 from "../assets/ad2.jpg";

const Pandharpur = () => {
  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-4 flex flex-col md:flex-row gap-4">
      {/* Left - Main Image */}
      <div className="w-full md:w-[65%] h-[400px] overflow-hidden rounded-lg shadow-md">
        <img
          src={MainImage}
          alt="Main Visual"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right - Stacked Ads */}
      <div className="w-full md:w-[35%] flex flex-col justify-between gap-4">
        <div className="h-[165px] w-full overflow-hidden rounded-lg shadow-md">
          <img
            src={AdImage1}
            alt="Ad 1"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="h-[165px] w-full overflow-hidden rounded-lg shadow-md">
          <img
            src={AdImage2}
            alt="Ad 2"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Pandharpur;
