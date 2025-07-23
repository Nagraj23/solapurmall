import React from "react";
import { motion } from "framer-motion";
import {
  FaTshirt,
  FaBuilding,
  FaHandsHelping,
  FaHeartbeat,
  FaUserFriends,
  FaShoppingCart,
} from "react-icons/fa";

const categories = {
  Garments: {
    icon: <FaTshirt className="inline-block mr-2 text-pink-400" />,
    items: [
      "Stylo Shirts",
      "Speed Shirts",
      "A to Z Uniforms",
      "K G Fashion",
      "Arihant Garment",
      "Maftlal",
      "Ashwini Garment",
      "Aamran The Cotton Art",
      "Mahaveer Textiles",
      "Darshan Uniforms",
    ],
  },
  "Builders/Developers": {
    icon: <FaBuilding className="inline-block mr-2 text-orange-400" />,
    items: [
      "Pranav Developers",
      "Shri Isha Developers",
      "Gurumaharaj Construction & Developers",
      "Chaitanya Constructions",
      "Furde Constructions",
      "Sai Group",
      "Kruti Group",
    ],
  },
  Foundations: {
    icon: <FaHandsHelping className="inline-block mr-2 text-yellow-400" />,
    items: [
      "Renuka Foundation",
      "Shree Revansiddheshwar Bahu uddeshiya Sanstha",
    ],
  },
  "Health Cares": {
    icon: <FaHeartbeat className="inline-block mr-2 text-red-400" />,
    items: ["TNS Fitness"],
  },
  "Marriage Bureau": {
    icon: <FaUserFriends className="inline-block mr-2 text-purple-400" />,
    items: ["Veershaiva Match"],
  },
  "E-Commerce": {
    icon: <FaShoppingCart className="inline-block mr-2 text-green-400" />,
    items: ["Aamran"],
  },
};

const OurCustomers = () => {
  return (
    <div className="h-full  w-full bg-gradient-to-br from-blue-100 to-purple-200 text-black p-10">
      <h1 className="text-4xl font-extrabold text-center mb-12 tracking-tight text-black">
        Our Customers
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(categories).map(([category, { icon, items }], index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-2xl transition duration-300"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center border-b border-white/30 pb-2">
              {icon}
              {category}
            </h2>
            <ul className="space-y-2">
              {items.map((item, idx) => (
                <li
                  key={idx}
                  className="text-black-200 hover:text-white transition-colors duration-200 pl-2"
                >
                  • {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OurCustomers;
