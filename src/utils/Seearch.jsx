// api/search.js
import axios from "axios";

const baseUrl = "http://localhost:8080/api";

export async function searchAll(query) {
  const headers = {};

  try {
    // If no query, fetch unfiltered data
    if (!query) {
      const [firmsRes, jobsRes] = await Promise.all([
        axios.get(`${baseUrl}/firms`, { headers }),
        axios.get(`${baseUrl}/jobs`, { headers }),
      ]);
      return { firms: firmsRes.data || [], jobs: jobsRes.data || [] };
    }

    // Otherwise fallback to API search if implemented
    // Or just fetch all and filter client side
    const [firmsRes, jobsRes] = await Promise.all([
      axios.get(`${baseUrl}/firms?q=${encodeURIComponent(query)}`, { headers }),
      axios.get(`${baseUrl}/jobs?q=${encodeURIComponent(query)}`, { headers }),
    ]);

    return {
      firms: firmsRes.data || [],
      jobs: jobsRes.data || [],
    };
  } catch (error) {
    console.error("Search API failed:", error);
    return { firms: [], jobs: [] };
  }
}
