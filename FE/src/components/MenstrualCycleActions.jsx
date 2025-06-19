import React from "react";

const MenstrualCycleActions = ({ onDelete, onEdit, cycle }) => {
  if (!cycle) return null;
  return (
    <div className="flex justify-end mt-4 space-x-2">
      <button
        onClick={onEdit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Sửa
      </button>
      <button
        onClick={onDelete}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Xóa
      </button>
    </div>
  );
};

export default MenstrualCycleActions;