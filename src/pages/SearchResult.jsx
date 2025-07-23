import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import api from "../utils/api";

// Utility to grab search param ?q=...
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const baseUrl = api;

const SearchResults = () => {
  const query = useQuery().get("q")?.toLowerCase() || "";

  const [allData, setAllData] = useState({ firms: [], jobs: [] });
  const [filteredData, setFilteredData] = useState({ firms: [], jobs: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const headers = {}; // Add auth headers if needed

    async function fetchData() {
      setLoading(true);
      try {
        const [firmsRes, jobsRes] = await Promise.all([
          axios.get(`${baseUrl}/api/firms`, { headers }),
          axios.get(`${baseUrl}/api/jobs/`, { headers }),
        ]);

        const data = {
          firms: firmsRes.data || [],
          jobs: jobsRes.data || [],
        };

        setAllData(data);

        if (!query) {
          setFilteredData(data);
        } else {
          const filterByQuery = (arr) =>
            arr.filter((item) => {
              const searchText = [
                item.firmName,
                item.title,
                item.name,
                item.description,
                typeof item.category === "object"
                  ? item.category?.mainCategoryName
                  : item.category,
                item.location,
                Array.isArray(item.tags) ? item.tags.join(" ") : "",
              ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

              return searchText.includes(query);
            });

          setFilteredData({
            firms: filterByQuery(data.firms),
            jobs: filterByQuery(data.jobs),
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setAllData({ firms: [], jobs: [] });
        setFilteredData({ firms: [], jobs: [] });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [query]);

  if (loading) {
    return (
      <div className="p-4 text-center text-lg animate-pulse">
        Loading your search magic... 🔍✨
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">
        🔍 Results for:{" "}
        <span className="text-blue-600">"{query || "All"}"</span>
      </h2>

      {/* Firms Section */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 border-b pb-2">🏢 Firms</h3>
        {filteredData.firms.length === 0 ? (
          <p className="text-gray-500">No firms found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.firms.map((firm) => (
              <Link
                to={`/firm/${firm.firmId}`}
                key={firm._id || firm.id || firm.firmName}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-4 no-underline text-inherit hover:bg-gradient-to-br from-sky-400 to-indigo-600 hover:text-white"
              >
                <img
                  src={
                    firm.firmImagePath
                      ? `https://cp.solapurmall.com/${firm.firmImagePath}`
                      : "https://via.placeholder.com/150"
                  }
                  alt="Firm Logo"
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h4 className="text-lg font-bold text-gray-800 group-hover:text-white">
                  {firm.firmName || "Unnamed Firm"}
                </h4>
                <p className="text-sm text-gray-500 mb-1">
                  Category:{" "}
                  {typeof firm.category === "object"
                    ? firm.category?.mainCategoryName
                    : firm.category || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  {firm.description || "No description"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Jobs Section */}
      <section>
        <h3 className="text-2xl font-semibold mb-4 border-b pb-2">💼 Jobs</h3>
        {filteredData.jobs.length === 0 ? (
          <p className="text-gray-500">No jobs found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.jobs.map((job) => (
              <div
                key={job._id || job.id || job.title}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4"
              >
                <img
                  src={job.image || "https://via.placeholder.com/150"}
                  alt="Job"
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h4 className="text-lg font-bold text-gray-800">
                  {job.title || job.name || "Unnamed Job"}
                </h4>
                <p className="text-sm text-gray-500 mb-1">
                  {job.location || "Unknown Location"}
                </p>
                <p className="text-sm text-gray-600">
                  {job.description || "No description"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default SearchResults;
