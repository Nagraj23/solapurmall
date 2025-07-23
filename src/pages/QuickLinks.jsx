import React, { useState , useEffect } from "react";
import { assets } from "../assets/assets";
import WeatherPopup from "../components/WeatherPopup"; // ✅ Import WeatherPopup
import Popup from "../components/popup";

const quickLinkItems = [
  { name: "🚑 Ambulance", url: "quicklinklisting.php?quickid=4" },
  { name: "🩸 Blood Bank", url: "quicklinklisting.php?quickid=5" },
  { name: "🚌 Bus", url: "quicklinklisting.php?quickid=6" },
  { name: "🏥 Hospitals", url: "quicklinklisting.php?quickid=7" },
  { name: "⚡ Electricity", url: "quicklinklisting.php?quickid=8" },
  { name: "🛢️ Gas Agency", url: "quicklinklisting.php?quickid=9" },
  { name: "🚆 Trains", url: "quicklinklisting.php?quickid=10" },
  { name: "🏗️ Crain", url: "quicklinklisting.php?quickid=11" },
  { name: "👁️ Eye bank", url: "quicklinklisting.php?quickid=12" },
  { name: "📰 News Paper", url: "quicklinklisting.php?quickid=13" },
  { name: "🚓 Police Station", url: "quicklinklisting.php?quickid=14" },
  { name: "📮 PostOffice", url: "quicklinklisting.php?quickid=15" },
  { name: "🛂 Passport", url: "quicklinklisting.php?quickid=16" },
  { name: "🔥 Fire Brigade", url: "quicklinklisting.php?quickid=17" },
  { name: "🚰 Water Supply", url: "quicklinklisting.php?quickid=18" },
  { name: "⚰️ Vaikunth Rath", url: "quicklinklisting.php?quickid=19" },
  { name: "📦 Courier", url: "quicklinklisting.php?quickid=20" },
  { name: "🏛️ District Collector", url: "quicklinklisting.php?quickid=21" },
  { name: "⚖️ Legal Adviser", url: "quicklinklisting.php?quickid=22" },
  { name: "🗳️ Political Parties", url: "quicklinklisting.php?quickid=23" },
  { name: "🧪 Postmortem", url: "quicklinklisting.php?quickid=24" },
  { name: "🆘 Help", url: "quicklinklisting.php?quickid=25" },
];

const QuickLinks = () => {
  const [showWeather, setShowWeather] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

   useEffect(()=>{
      console.log("quick links  got bro ")
    },[])

  const handleSelect = (e) => {
    const url = e.target.value;
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="bg-teal-50 p-6 rounded-2xl shadow-md w-full h-full max-h-[30rem] overflow-y-auto space-y-4 border border-teal-200">
      {/* Banner Image */}
      <div>
        <img
          src={assets.quicklinksImg1}
          alt="Solapur Jobs"
          className="w-full object-cover rounded shadow-sm"
        />
      </div>

      {/* Dropdown Menu */}
      <div>
        <label htmlFor="quick-links" className="text-xl font-bold mb-2 block text-teal-800">
          Quick Links
        </label>
        <select
          id="quick-links"
          className="w-full p-2 rounded border border-teal-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition duration-200 ease-in-out"
          onChange={handleSelect}
        >
          <option value="">Select a service</option>
          {quickLinkItems.map((item, index) => (
            <option key={index} value={item.url} className="text-gray-600">
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* Static Text Links */}
      <div>
        <ul className="space-y-2 font-medium text-gray-700">
          <li
            className="text-teal-700 hover:text-teal-900 cursor-pointer hover:underline transition duration-150 ease-in-out"
            onClick={() => setShowWeather(true)} // ✅ Open weather popup
          >
            Weather
          </li>
          <li className="text-teal-700 hover:text-teal-900 cursor-pointer hover:underline transition duration-150 ease-in-out"
            onClick={() => setShowPopup(true)}
          >
            Gold Prices
          </li>
          <li className="text-teal-700 hover:text-teal-900 cursor-pointer hover:underline transition duration-150 ease-in-out"
             onClick={() => setShowPopup(true)}
          >
            Sanskrutik Mandal
          </li>
          <li className="text-teal-700 hover:text-teal-900 cursor-pointer hover:underline transition duration-150 ease-in-out"
             onClick={() => setShowPopup(true)}
          >
            Stock Market
          </li>
        </ul>
      </div>

      {/* Online Magazine */}
      <div>
        <h3 className="text-xl font-bold mb-2 text-teal-800">ONLINE MAGAZINE</h3>
        <a
          href="https://museindia.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 text-md block hover:underline hover:text-blue-800 transition duration-150 ease-in-out"
        >
          Muse India
        </a>
        <a
          href="http://www.weeklysadhana.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 text-md block hover:underline hover:text-blue-800 transition duration-150 ease-in-out"
        >
          Sadhana
        </a>
        <a
          href="http://www.chitralekha.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 text-md block hover:underline hover:text-blue-800 transition duration-150 ease-in-out"
        >
          Chitralekha
        </a>
      </div>

      {/* ✅ Weather Popup Component */}
      <WeatherPopup isOpen={showWeather} onClose={() => setShowWeather(false)} />
      <Popup isOpen={showPopup} onClose={() => setShowPopup(false)} />
    </div>
  );
};

export default QuickLinks;
