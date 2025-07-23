import React, { useState, useEffect } from "react";
import Card from "../components/NewsCard";
import Navbar from "../components/NewsNavbar";

const Home = () => {
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("");
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [nextPage, setNextPage] = useState(null); 
  
  const fetchNews = async (query, pageToken = "") => {
    setLoading(true);
    setError(null);

    let apiUrl = `https://newsdata.io/api/1/news?apikey=pub_8640140c205a4b8f8808b9289f479908532ba&q=${query}&country=in&language=en`;

    
    if (pageToken) {
      apiUrl += `&page=${pageToken}`;
      console.log(`🔎 Fetching next page of news with token: ${pageToken}`);
    } else {
      console.log(`🔎 Fetching initial news for query: ${query}`);
    }

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch news articles");
      }

      const data = await response.json();
      console.log("API Response Data:", data);


      setNewsArticles(data.results.map(mapNews)); 
    
      setNextPage(data.nextPage || null);
    } catch (err) {
      console.error("❌ Error fetching news:", err.message);
      setError("Failed to load news articles. Please try again later.");
      setNewsArticles([]); // Clear articles on error
    } finally {
      setLoading(false);
    }
  };

  // --- Map News Data ---
  const mapNews = (item) => ({
    title: item.title,
    link: item.link,
    pubDate: item.pubDate,
    description: item.description,
    image_url: item.image_url,
    source_name: item.source_name,
    source_icon: item.source_icon,
  });

  // --- Reverse Geocoding to fetch location ---
  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await response.json();

      const state = (data.address.state || "India").toLowerCase();
      console.log("📍 Detected State:", state);
      setLocation(state);

      // Fetch news for the detected location only if no search query is active
      if (!searchQuery) {
        console.log(`🌐 Fetching news for location: ${state}`);
        fetchNews(state);
      }
    } catch (error) {
      console.error("❌ Error reverse geocoding:", error.message);
      setError("Unable to fetch location data. Displaying general news.");
     
      if (!searchQuery && newsArticles.length === 0) {
        fetchNews("latest news"); // Default search if location fails
      }
    }
  };

  // --- Get User's Location on Component Mount ---
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          reverseGeocode(latitude, longitude);
        },
        (err) => {
          console.error("❌ Location error:", err.message);
          setError("Location access denied. Displaying general news.");
          // Fallback to a default search if location is denied
          fetchNews("latest news"); // Default search if location fails
        }
      );
    } else {
      setError("Geolocation is not supported by your browser. Displaying general news.");
      fetchNews("latest news"); // Default search if geolocation isn't supported
    }
  }, []); // Empty dependency array means this runs once on mount

  // --- Handle Search Change (Triggered from Navbar) ---
  const handleSearch = (query) => {
    setSearchQuery(query);
    setNextPage(null); 
    
    fetchNews(query);
  };

  // --- Load More Articles (now effectively "Next Page") ---
  const handleLoadMore = () => {
    // Only load more if there's a nextPage token available and not currently loading
    if (nextPage && !loading) {
      console.log(`🔄 Moving to next page of articles...`);
      fetchNews(searchQuery || location, nextPage); // Use searchQuery if available, else location

      // --- CRITICAL CHANGE: Scroll to top since content is replaced ---
      window.scrollTo({
        top: 0, // Scroll to the very top of the page
        behavior: "smooth",
      });
    }
  };

  // --- Render ---
  return (
    <div>
      <Navbar onSearch={handleSearch} />
      <div style={styles.container}>
        <h1 style={styles.heading}>
          {searchQuery
            ? `News from search: ${searchQuery}`
            : `Top News from ${location}`}
        </h1>

        {error && <div style={styles.error}>{error}</div>}
        {loading && newsArticles.length === 0 ? ( // Only show full "Loading" if no articles are loaded yet
          <div style={styles.loading}>Loading news...</div>
        ) : (
          <>
            <div style={styles.grid}>
              {newsArticles.length > 0 ? (
                newsArticles.map((article, index) => (
                  <Card key={index} article={article} />
                ))
              ) : (
                !loading && <div style={styles.noNews}>No news articles found for this query.</div> // Show "No news" only if not loading
              )}
            </div>

            {/* Pagination Button */}
            {nextPage && ( // Only show button if there's a next page
              <div style={styles.pagination}>
                <button onClick={handleLoadMore} style={styles.loadMoreButton} disabled={loading}>
                  {loading ? 'Loading Next Page...' : 'Next Page'} {/* Changed button text */}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;

// --- Styles (unchanged) ---
const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
  },
  heading: {
    color: "#2c3e50",
    marginBottom: "30px",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "30px",
  },
  loading: {
    textAlign: "center",
    padding: "50px",
    fontSize: "20px",
    color: "#2c3e50",
  },
  noNews: {
    textAlign: "center",
    padding: "50px",
    fontSize: "18px",
    color: "#666",
  },
  error: {
    textAlign: "center",
    color: "red",
    marginBottom: "20px",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  },
  loadMoreButton: {
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    opacity: 0.7,
  },
};