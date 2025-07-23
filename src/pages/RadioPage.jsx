import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const RadioPage = () => {
  const [stations, setStations] = useState([]);
  const [currentStation, setCurrentStation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  // Using useRef to persist the Audio object across renders
  const audioRef = useRef(new Audio());

  // Effect to fetch radio stations when the component mounts
  useEffect(() => {
    // Fetch top 50 Indian radio stations using the Radio-Browser API
    // Using a specific server for better reliability if 'all.api' becomes slow.
    // 'url_resolved' is typically the best stream URL to use.
    fetch("https://de1.api.radio-browser.info/json/stations/bycountry/India?limit=50")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // Filter out stations without a resolved URL or name for better quality
        const playableStations = data.filter(station => station.url_resolved && station.name);
        setStations(playableStations);
      })
      .catch((error) => {
        console.error("Error fetching radio stations:", error);
        // Optionally, set an error state to display to the user
      });
  }, []); // Empty dependency array means this runs once on mount

  // Function to play a selected station
  const playStation = (station) => {
    // If the same station is clicked, just toggle play/pause
    if (currentStation?.stationuuid === station.stationuuid) {
      togglePlayPause();
      return;
    }

    // Pause the current audio if playing
    if (!audioRef.current.paused) {
      audioRef.current.pause();
    }

    // Set the new station's URL and volume
    audioRef.current.src = station.url_resolved;
    audioRef.current.volume = volume;

    // Attempt to play the new station
    audioRef.current
      .play()
      .then(() => {
        setCurrentStation(station);
        setIsPlaying(true);
      })
      .catch((e) => {
        console.error("Playback error:", e);
        // Inform the user if playback failed (e.g., due to browser autoplay policies)
        alert("Failed to play station. Please try again or allow autoplay.");
        setIsPlaying(false);
      });
  };

  // Function to toggle play/pause for the current station
  const togglePlayPause = () => {
    if (!currentStation) return; // Can't play/pause if no station is selected

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .catch((e) => console.error("Playback error", e));
    }
    setIsPlaying(!isPlaying);
  };

  // Function to handle volume changes from the slider
  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    audioRef.current.volume = vol;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 text-gray-800 p-6">
      <h1 className="text-4xl font-extrabold text-center mb-8">🎙 Live Indian Radio</h1>

      {/* Controls Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        {currentStation ? (
          <>
            <h2 className="text-xl font-semibold mb-2">
              Now Playing: <span className="text-blue-600">{currentStation.name}</span>
            </h2>
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={togglePlayPause}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                {isPlaying ? "Pause" : "Play"}
              </button>

              <label className="flex items-center gap-2">
                Volume:
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-32 accent-blue-600" // Added accent color for the slider thumb
                />
              </label>
            </div>
          </>
        ) : (
          <p className="text-gray-600">Select a station to start listening.</p>
        )}
      </div>

      {/* Station List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {stations.map((station, index) => (
          <motion.div
            key={station.stationuuid} // Unique key for each station
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            // Staggered animation for a nice effect
            transition={{ delay: index * 0.05 }}
            onClick={() => playStation(station)}
            className={`cursor-pointer bg-white p-4 rounded-lg shadow hover:shadow-md transition border ${
              currentStation?.stationuuid === station.stationuuid
                ? "border-blue-600 ring-2 ring-blue-500" // Highlight selected station
                : "border-transparent"
            }`}
          >
            <h3 className="font-semibold text-lg truncate">{station.name}</h3> {/* Truncate long names */}
            <p className="text-sm text-gray-500">
              {station.language} • {station.codec?.toUpperCase() || 'N/A'} • {station.bitrate ? `${station.bitrate} kbps` : 'N/A'}
            </p>
            {/* Show tags, but truncate if too long */}
            <p className="text-sm text-gray-600 mt-1 truncate">
              {station.tags.split(',').slice(0, 3).join(', ')} {/* Show top 3 tags */}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RadioPage;