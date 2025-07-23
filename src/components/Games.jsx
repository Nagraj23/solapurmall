import React, { useEffect, useState } from "react";
import api from '../utils/api';

const Games = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(`${api}/api/games`);
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  if (loading) {
    return <div className="text-center text-xl p-5">Loading games...</div>;
  }

  return (
    <div className="flex flex-wrap justify-center gap-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      {games.map((game) => (
        <div
          key={game.id}
          className="w-[190px] h-[360px] bg-white rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 flex flex-col overflow-hidden"
        >
          <img
            src={game.thumbnail}
            alt={game.title}
            className="w-full h-[150px] object-cover rounded-t-2xl"
          />
          <div className="flex flex-col flex-grow p-4 text-gray-700">
            <h2 className="text-base font-semibold mb-1 truncate text-slate-800">
              {game.title}
            </h2>
            <p className="text-xs text-gray-500 mb-1 mt-1 truncate">
              {game.genre} | {game.platform}
            </p>
            <p className="text-xs mt-2 text-gray-600 flex-grow overflow-hidden overflow-ellipsis" style={{ lineHeight: '1.2em', maxHeight: '3.6em' }}>
              {game.short_description}
            </p>
            <button
              onClick={() => window.open(game.game_url, "_blank")}
              className="mt-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-2 rounded-lg font-medium transition duration-200"
            >
              Play Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Games;
