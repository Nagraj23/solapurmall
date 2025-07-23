import React, { useEffect, useRef, useState } from 'react';
import { FaPlay, FaPause, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import api from '../utils/api';

export default function NotificationBar({ area }) {
  const [notifications, setNotifications] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef(null);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      console.log("notificatons got ")
      try {
        const res = await fetch(`${api}/api/notifications`);
        const data = await res.json();

        // Filter by area
        console.log(area, "aread :")
        console.log(data, "notify data")
        const filtered = data.filter(n => n.area?.toLowerCase() === area?.toLowerCase());
        setNotifications(filtered);
        console.log(notifications, "notifications ")
        setCurrentIndex(0); // reset index on area change
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
        setNotifications([]);
      }
    };

    if (area) fetchNotifications();
  }, [area]);

  const showNext = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % notifications.length);
      setFade(true);
    }, 100);
  };

  const showPrev = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) =>
        prev === 0 ? notifications.length - 1 : prev - 1
      );
      setFade(true);
    }, 100);
  };

  useEffect(() => {
    if (isPlaying && notifications.length > 1) {
      intervalRef.current = setInterval(showNext, 3000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, notifications]);

  const currentNotification =
    notifications.length > 0 ? notifications[currentIndex]?.notification : '📭 No notifications available';

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full rounded-xl bg-white border-2 border-transparent bg-clip-padding shadow-lg [border-image:linear-gradient(to right,indigo,purple,pink)_1] p-3 sm:p-4 flex justify-between items-center">
        {/* Notification Text */}
        <div
          className={`text-sm sm:text-base font-medium text-blue-500 transition-opacity duration-500 ease-in-out ${fade ? 'opacity-100' : 'opacity-0'
            }`}
        >
          {currentNotification}
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 text-indigo-600 ml-4">
          <button onClick={showPrev} title="Previous">
            <FaChevronLeft />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button onClick={showNext} title="Next">
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}