import React, { useState } from "react";

const Navbar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // 🌐 **Handle Search Submission**
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery); // ✅ This triggers the search in Home
    }
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <div style={styles.logo}>🗞️ AnyNews</div>

        {/* 🌐 **Search Form** */}
        <form onSubmit={handleSubmit} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search news by location or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchButton}>
            Search
          </button>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;

const styles = {
  navbar: {
    backgroundColor: "#2c3e50",
    color: "white",
    padding: "15px 0",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  searchForm: {
    display: "flex",
  },
  searchInput: {
    padding: "8px",
    borderRadius: "4px 0 0 4px",
    border: "1px solid #ccc",
    width: "300px",
  },
  searchButton: {
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "0 4px 4px 0",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  searchButtonHover: {
    backgroundColor: "#2980b9",
  },
};
