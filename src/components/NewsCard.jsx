import React from "react";

const Card = ({ article }) => {
  // Truncate description if it's too long
  const truncatedDescription = article.description
    ? article.description.length > 150
      ? article.description.slice(0, 150) + "..."
      : article.description
    : "No description available";

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div style={styles.card}>
      {/* Displaying Image */}
      {article.image_url ? (
        <img
          src={article.image_url}
          alt={article.title || "news image"}
          style={styles.image}
        />
      ) : (
        <div style={styles.noImage}>No Image Available</div>
      )}

      <div style={styles.content}>
        <h3 style={styles.title}>{article.title.slice(0, 100)}...</h3>

        <p style={styles.description}>{truncatedDescription}</p>

        {/* Displaying Published Date */}
        {article.pubDate && (
          <div style={styles.date}>
            Published on: {formatDate(article.pubDate)}
          </div>
        )}

        <div style={styles.footer}>
          {/* Source (optional, if available) */}
          {article.source_name && (
            <div style={styles.source}>
              <img
                src={article.source_icon}
                alt={article.source_name}
                style={styles.sourceIcon}
              />
              {article.source_name}
            </div>
          )}

          {/* Link to the article */}
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.readMore}
          >
            Read More
          </a>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    margin: "15px 0",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
  },
  noImage: {
    height: "200px",
    backgroundColor: "#f5f5f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#666",
  },
  content: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  title: {
    fontSize: "20px",
    marginTop: 0,
    marginBottom: "5px",
    color: "#2c3e50",
    lineHeight: "1.3",
  },
  description: {
    color: "#666",
    marginBottom: "5px",
    flexGrow: 1,
    lineHeight: "1.5",
  },
  date: {
    fontSize: "14px",
    color: "#888",
    marginTop: "10px",
  },
  footer: {
    flexDirection: "row",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
  },
  source: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    color: "#888",
    fontSize: "14px",
  },
  sourceIcon: {
    width: "16px",
    height: "16px",
    borderRadius: "50%",
  },
  readMore: {
    display: "inline-block",
    padding: "8px 16px",
    backgroundColor: "#2c3e50",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "4px",
    fontWeight: "500",
    transition: "background-color 0.3s ease",
  },
};

export default Card;
