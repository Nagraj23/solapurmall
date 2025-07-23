import React, { useEffect, useState } from "react";

const WeatherPopup = ({ isOpen, onClose }) => {
  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_KEY = "ce526bfc0c3f69303a0a6a945e3e3cdb"; // ✅ Your actual OpenWeatherMap API key

  // ✅ Fetch weather using coordinates
  const fetchWeather = async (lat, lon) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      setWeather(data);
    } catch (error) {
      console.error("❌ Weather API error:", error.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get user's location
  useEffect(() => {
    if (isOpen) {
      setWeather(null);
      setCoords(null);
      setLoading(true);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log("📍 User Coords:", latitude, longitude);
            setCoords({ lat: latitude, lon: longitude });
          },
          (err) => {
            console.error("❌ Geolocation error:", err.message);
            // Fallback to Mumbai
            setCoords({ lat: 19.076, lon: 72.8777 });
          }
        );
      } else {
        console.error("❌ Geolocation not supported");
        setCoords({ lat: 19.076, lon: 72.8777 }); // Fallback to Mumbai
      }
    }
  }, [isOpen]);

  // ✅ Once coords are set, fetch weather
  useEffect(() => {
    if (coords?.lat && coords?.lon) {
      fetchWeather(coords.lat, coords.lon);
    }
  }, [coords]);

  if (!isOpen) return null;

  return (
<div className="fixed inset-0 z-50 flex items-center justify-center  bg-black/40 backdrop-blur-[8px] p-4 ">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative animate-fade-in">
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>

        {loading ? (
          <div className="text-center text-gray-600">Loading weather data...</div>
        ) : weather && weather.main ? (
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-semibold">{weather.name}</h2>
            <div className="text-4xl font-bold">{weather.main.temp}°C</div>
            <div className="capitalize text-gray-600">
              {weather.weather[0].description}
            </div>
            <div className="flex justify-around text-sm text-gray-500 mt-4">
              <div>
                <strong>Humidity:</strong> {weather.main.humidity}%
              </div>
              <div>
                <strong>Wind:</strong> {weather.wind.speed} m/s
              </div>
            </div>
          </div>
        ) : (
          <div className="text-red-500 text-center">Failed to load weather data.</div>
        )}
      </div>
    </div>
  );
};

export default WeatherPopup;
