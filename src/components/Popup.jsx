import React from 'react';

const Popup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[8px] p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative animate-fade-in text-center">
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <p className="text-lg font-semibold text-gray-700">Currently No Data Available...!</p>
      </div>
    </div>
  );
};

export default Popup;
