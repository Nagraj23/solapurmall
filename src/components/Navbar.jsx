import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets.js";
import { NavLink, useNavigate } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  const links = [
    { name: "Home", path: "/" },
    { name: "Tuljapur", path: "/tuljapur" },
    { name: "Pandharpur", path: "/pandharpur" },
    { name: "Akkalkot", path: "/akkalkot" },
    { name: "Buy & Sales", path: "/buysandsales" },
    { name: "Jobs", path: "/jobs" },
    { name: "Feedback", path: "/feedback" },
    { name: "Firm-add", path: "/firmadd" },
    { name: "Our Customer", path: "/our-customer" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // Desktop: handle Enter key in search input
  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setMenuOpen(false);
    }
  };

  // Desktop: handle form submit (Go button)
  const onSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      setSearchTerm("");
      setMenuOpen(false);
    }
  };

  // Mobile: handle mobile search form submit
  const onMobileSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = mobileSearchQuery.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      setMobileSearchQuery("");
      setMenuOpen(false);
    }
  };

  return (
    <header className="bg-gradient-to-r from-[#e0f7fa] via-[#ccf2ff] to-[#f1f8ff] shadow-md w-full">
      {/* Top Logo Section */}
      <div className="flex flex-col md:flex-row justify-between items-center px-4 sm:px-6 py-4 bg-white bg-opacity-90 backdrop-blur-lg">
        {/* Left Logo */}
        <img
          src={assets.MNP}
          alt="Left Logo"
          className="hidden md:block w-20 h-20 object-cover rounded-lg shadow"
        />

        {/* Center Title */}
        <div className="text-center md:flex-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-red-600 ">
            Solapur<span className="text-sky-500">Mall</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            The Complete Web Directory
          </p>
        </div>

        {/* Right Logo */}
        <img
          src={assets.siddeshwar}
          alt="Right Logo"
          className="hidden md:block w-32 h-20 object-cover rounded-lg shadow"
        />
      </div>

      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-sky-200 via-teal-100 to-indigo-100 px-4 py-3 relative">
        {/* Mobile Top Row */}
        <div className="md:hidden flex justify-between items-center gap-2">
          <button
            className="text-indigo-700 text-3xl"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
          <form onSubmit={onMobileSearchSubmit} className="flex-1 ml-10">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-3 py-1.5 rounded-full text-sm bg-white border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm"
              value={mobileSearchQuery}
              onChange={(e) => setMobileSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Links + Auth */}
        <div
          className={`${
            menuOpen ? "block" : "hidden"
          } md:flex flex-col md:flex-row md:justify-between items-center gap-4 mt-4 md:mt-0`}
        >
          {/* Navigation Links */}
          <ul className="flex flex-col md:flex-row justify-center md:justify-start gap-2 md:gap-5 w-full md:w-auto">
            {links.map((link, index) => (
              <li key={index}>
                <NavLink
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block text-center transition-all duration-300 ease-in-out px-4 py-2 text-sm rounded-xl font-semibold ${
                      isActive
                        ? "bg-blue-500 text-white shadow"
                        : "text-sky-800 hover:bg-white hover:text-indigo-600"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Desktop Search + Auth Section */}
          <div className="hidden md:flex items-center gap-4 px-4 md:px-0">
            <form onSubmit={onSearchSubmit} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search..."
                className="px-4 py-2 rounded-full text-sm bg-white border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchSubmit}
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Go
              </button>
            </form>

            {!isLoggedIn ? (
              <div className="flex gap-3">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `block text-center transition-all duration-300 ease-in-out px-4 py-2 text-sm rounded-xl font-semibold ${
                      isActive
                        ? "bg-blue-500 text-white shadow"
                        : "text-sky-800 hover:bg-white hover:text-indigo-600"
                    }`
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `block text-center transition-all duration-300 ease-in-out px-4 py-2 text-sm rounded-xl font-semibold ${
                      isActive
                        ? "bg-blue-500 text-white shadow"
                        : "text-sky-800 hover:bg-white hover:text-indigo-600"
                    }`
                  }
                >
                  Register
                </NavLink>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <img
                  src={assets.ad1}
                  alt="Profile"
                  className="w-8 h-8 rounded-full cursor-pointer"
                  onClick={() => navigate("/userprofile")}
                  title="Profile"
                />
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Auth Buttons */}
          <div className="md:hidden flex justify-center gap-6 mt-4">
            {!isLoggedIn ? (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-indigo-600 hover:text-amber-500 font-semibold text-sm"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="text-indigo-600 hover:text-amber-500 font-semibold text-sm"
                >
                  Register
                </NavLink>
              </>
            ) : (
              <>
                <img
                  src={assets.ad1}
                  alt="Profile"
                  className="w-8 h-8 rounded-full cursor-pointer"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/userprofile");
                  }}
                />
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
