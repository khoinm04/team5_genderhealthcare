import React from "react";

const ZaloButton = () => {
  const handleZaloClick = () => {
    window.open("https://zalo.me/0945645753", "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleZaloClick}
        className="
          w-14 h-14 bg-white rounded-full shadow-xl border-2 border-blue-200
          flex items-center justify-center transition-all duration-300 group
          hover:scale-110 hover:shadow-2xl relative overflow-visible
          animate-[float_2s_ease-in-out_infinite]
        "
        aria-label="Liên hệ qua Zalo"
      >
        {/* Hiệu ứng glow động */}
        <span className="absolute inset-0 rounded-full pointer-events-none animate-pulse"
          style={{ boxShadow: "0 0 18px 4px rgba(0,143,229,0.12)" }}
        />

        {/* Logo Zalo chuẩn */}
        <img
          src="https://stc-zaloprofile.zdn.vn/pc/v1/images/zalo_sharelogo.png"
          alt="Zalo"
          className="w-8 h-8 z-10 relative"
        />

        {/* Tooltip */}
        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 bg-gray-800 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-lg z-20">
          Liên hệ qua Zalo
          <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
        </div>
      </button>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(-8px);}
        }
      `}</style>
    </div>
  );
};

export default ZaloButton;
