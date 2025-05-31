export default function ServiceCard({ title, description, icon, className }) {
  return (
    <div
      className={`bg-white rounded-lg p-6 shadow-md hover:shadow-lg hover:scale-[1.03] transition-transform cursor-pointer flex flex-col items-center text-center ${className}`}
    >
      {/* Nếu icon là emoji */}
      {typeof icon === "string" && icon.length <= 2 ? (
        <div className="text-6xl mb-4 select-none">{icon}</div>
      ) : (
        <img
          src={icon}
          alt={`${title} icon`}
          className="w-14 h-14 mb-4 object-contain"
        />
      )}

      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <button
        className="mt-auto bg-[#E5195B] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#c4124a] transition-colors"
        onClick={() => alert(`Xem chi tiết dịch vụ: ${title}`)}
      >
        Xem chi tiết
      </button>
    </div>
  );
}
