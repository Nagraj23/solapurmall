import React ,{useEffect} from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

const links = [
  { name: 'News', icon: assets.newspaper },
  { name: 'Education', icon: assets.education },
  { name: 'Jobs', icon: assets.job },
  { name: 'Movies / Theaters', icon: assets.movieIcon },
  { name: 'Online Games', icon: assets.onlineGames },
  { name: 'Online Radio', icon: assets.radio },
];



const LinkSection = () => {
   useEffect(()=>{
    console.log("links section  got bro ")
  },[])
  return (
    <section className="w-full px-6 py-3 bg-gradient-to-r from-[#e0f7fa] via-[#ccf2ff] to-[#f1f8ff] rounded-2xl shadow-lg">
      <div className="ml-2 mb-3">
        <h2 className="text-xl font-bold text-indigo-800">Explore</h2>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {links.map((item, idx) => (
          <div
            key={idx}
            className="py-4 flex flex-col items-center text-center bg-white hover:bg-gradient-to-br from-sky-400 to-indigo-600 text-indigo-700 hover:text-white rounded-xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1 hover:scale-105 p-2"
          >
            <Link
              to={item.name.toLowerCase().replace(/\s|\//g, '')}
              className="w-20 h-20 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center mb-3"
            >
              <img
                src={item.icon}
                alt={item.name}
                className="w-12 h-12 sm:w-12 sm:h-12 md:w-16 md:h-16 object-contain"
              />
            </Link>
            <div className="text-xs sm:text-sm font-semibold">{item.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LinkSection;
