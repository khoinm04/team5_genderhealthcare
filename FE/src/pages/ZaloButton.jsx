import React from 'react';

const ZaloButton = () => {
  const handleZaloClick = () => {
    window.open('https://zalo.me/0945645753', '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleZaloClick}
        className="w-14 h-14 bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
        aria-label="Liên hệ qua Zalo"
      >
        {/* Zalo Logo */}
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <span className="text-blue-500 font-bold text-sm">zalo</span>
        </div>
        
        {/* Tooltip */}
        <div className="absolute right-full mr-3 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Liên hệ qua Zalo
          <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
        </div>
      </button>
    </div>
  );
};

export default ZaloButton;