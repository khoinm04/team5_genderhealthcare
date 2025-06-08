import React from "react";

const MenstrualCycleInfo = ({ cycle }) => {
  if (!cycle) return null;
  return (
    <div className="w-full max-w-lg mx-auto mt-8 bg-violet-50 p-6 rounded-2xl shadow space-y-2">
      <h3 className="text-lg font-semibold mb-3 text-[#8f5ed3]">Thông tin chu kỳ hiện tại</h3>
      <div><span className="font-semibold">Ngày bắt đầu:</span> {cycle.startDate}</div>
      <div><span className="font-semibold">Ngày kết thúc:</span> {cycle.endDate}</div>
      <div><span className="font-semibold">Số ngày giữa 2 chu kỳ:</span> {cycle.cycleLength}</div>
      <div><span className="font-semibold">Số ngày hành kinh:</span> {cycle.menstruationDuration}</div>
      <div><span className="font-semibold">Ngày dự kiến tiếp theo:</span> {cycle.nextPredictedDate}</div>
      <div><span className="font-semibold">Ngày rụng trứng dự kiến:</span> {cycle.predictedOvulationDate}</div>
      <div><span className="font-semibold">Ghi chú:</span> {cycle.notes || "--"}</div>
    </div>
  );
};

export default MenstrualCycleInfo;
