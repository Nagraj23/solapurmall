import React, { useEffect, useState } from "react";
import axios from "axios";
import api from '../utils/api';
import { Link } from "react-router-dom";
import _ from "lodash"; // Ensure lodash is installed: npm install lodash


const FirmListings = () => {
  const [firms, setFirms] = useState([]);
  const [filteredFirms, setFilteredFirms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

   useEffect(()=>{
      console.log("firms list got bro ")
    },[])

  useEffect(() => {
    const fetchFirms = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(`${api}/api/firms`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Sort firms: those with images first, then by firmId descending
        const sortedFirms = res.data.sort((a, b) => {
          const hasImageA = !!a.firmImagePath;
          const hasImageB = !!b.firmImagePath;

          // Firms with image come first
          if (hasImageA && !hasImageB) return -1;
          if (!hasImageA && hasImageB) return 1;

          // If both have or both don't have images, sort by firmId descending
          return b.firmId - a.firmId;
        });

        setFirms(sortedFirms);          // Store the original, sorted list
        setFilteredFirms(sortedFirms);  // Initialize filtered list with all firms
      } catch (err) {
        console.error("Failed to fetch firms 💀", err);
        // Optionally set an error state to display a message to the user
      }
    };

    fetchFirms();
  }, []); // Empty dependency array means this runs once on component mount

  // Debounced search handler for elastic-style filtering
  const handleSearch = _.debounce((val) => {
    const lowerVal = val.toLowerCase();

    const filtered = firms.filter((firm) => {
      const name = firm.firmName?.toLowerCase() || "";
      const mainCat = firm.category?.mainCategoryName?.toLowerCase() || "";
      const subCat = firm.subCategory?.subCategoryName?.toLowerCase() || "";

      return (
        name.includes(lowerVal) ||
        mainCat.includes(lowerVal) ||
        subCat.includes(lowerVal)
      );
    });

    setFilteredFirms(filtered);
  }, 200); // 200ms debounce time

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value); // Trigger the debounced search
  };

  // Dynamic scroll speed calculation
  const minScrollSpeed = 20; // Minimum duration for the animation cycle (seconds)
  const speedPerItem = 2;   // Seconds per unique item
  const calculatedScrollSpeed = Math.max(minScrollSpeed, filteredFirms.length * speedPerItem);

  // Determine if animation should be active
  // Animation is active if there are enough firms AND no search term is active
  const MIN_FIRMS_FOR_ANIMATION = 5; // Adjust this threshold as needed
  const shouldAnimate = filteredFirms.length >= MIN_FIRMS_FOR_ANIMATION && !searchTerm;

  // Helper function to render a single firm card
  const renderFirmCards = (firmList, prefix) => {
    return firmList.map((firm, idx) => (
      <Link
        key={`${prefix}-${firm.firmId || idx}`} // Unique key for React's reconciliation
        to={`/firm/${firm.firmId}`}
        className="h-[30vh] w-[30vh] flex flex-col justify-center items-center text-center bg-white hover:bg-gradient-to-br from-sky-400 to-indigo-600 hover:text-white rounded-xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1 hover:scale-105 p-3 min-w-[180px] text-inherit no-underline"
      >
        <div className="w-full h-[70%] bg-gray-100 rounded-2xl flex items-center justify-center mb-2 overflow-hidden">
          <img
            src={
              firm.firmImagePath
                ? `https://cp.solapurmall.com/${firm.firmImagePath}`
                : null
            }
            alt={firm.firmName || "Firm image"}
            className="w-full h-full object-contain rounded-md"
            onError={(e) => {
              e.target.onerror = null; // Prevents infinite loop if fallback also fails
              e.target.src = "/placeholder.jpg"; // Fallback on image load error
            }}
          />
        </div>
        <div className="text-xs sm:text-sm font-semibold text-indigo-800 truncate w-full">
          {firm.firmName || "Untitled"}
        </div>
      </Link>
    ));
  };

  // Conditional rendering for initial loading state or no firms available
  if (firms.length === 0 && !searchTerm) {
    return (
      <section className="w-full h-[50vh] px-6 py-4 bg-gradient-to-r from-[#e0f7fa] via-[#ccf2ff] to-[#f1f8ff] rounded-2xl shadow-lg flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading firms or no firms available.</p>
      </section>
    );
  }

  return (
    <section className="w-full h-[50vh] px-6 py-4 bg-gradient-to-r from-[#e0f7fa] via-[#ccf2ff] to-[#f1f8ff] rounded-2xl shadow-lg overflow-hidden">
      {/* CSS for the horizontal scrolling animation, rendered only if animating */}
      {shouldAnimate && (
        <style>{`
          @keyframes scrollX {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); } /* Scrolls half the track width for seamless loop */
          }

          /* Class for the animated scrolling track */
          .scrolling-track-animated {
            animation: scrollX ${calculatedScrollSpeed}s linear infinite;
            display: flex;
            white-space: nowrap; /* Prevents items from wrapping to the next line */
            width: max-content; /* Allows the track to expand to fit all content (including duplicates) */
            padding-top: 8px;    /* Equivalent to Tailwind's py-2 */
            padding-bottom: 8px; /* Equivalent to Tailwind's py-2 */
            gap: 16px;           /* Equivalent to Tailwind's gap-4 (1rem) */
          }
        `}</style>
      )}

      {/* Header with search input */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-indigo-800">✨ Firm Listings</h2>
        <input
          type="text"
          placeholder="🔍 Search by name or category..."
          value={searchTerm}
          onChange={handleInputChange}
          className="p-2 text-sm rounded-lg border bg-white border-gray-300 outline-none shadow w-64"
        />
      </div>

      {/* Marquee-style horizontal scroll container (overflow-hidden to clip animation) */}
      <div className="w-full overflow-hidden">
        {filteredFirms.length > 0 ? (
          <div
            // Conditionally apply animation class or manual scroll class
            className={
              shouldAnimate
                ? "scrolling-track-animated"
                : "flex gap-4 py-2 overflow-x-auto whitespace-nowrap"
            }
          >
            {/* Render the first set of firms */}
            {renderFirmCards(filteredFirms, "firm-set-1")}

            {/* Render the duplicate set of firms ONLY if animating */}
            {shouldAnimate && renderFirmCards(filteredFirms, "firm-set-2")}
          </div>
        ) : (
          // Message displayed when search yields no results
          <p className="text-gray-500 w-full text-center py-8">No firms match your search criteria.</p>
        )}
      </div>
    </section>
  );
};

export default FirmListings;