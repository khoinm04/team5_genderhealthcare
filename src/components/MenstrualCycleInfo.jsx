// src/components/MenstrualCycleInfo.jsx
import React, { useEffect, useState } from 'react';
import { getCurrentCycle, getNextPeriod, getOvulationDate } from '../serivces/MenstrualCycleService';

const MenstrualCycleInfo = ({ customerId }) => {
  const [cycleInfo, setCycleInfo] = useState(null);
  const [nextPeriod, setNextPeriod] = useState(null);
  const [ovulationDate, setOvulationDate] = useState(null);

  useEffect(() => {
    const fetchCycleData = async () => {
      try {
        const cycleResponse = await getCurrentCycle(customerId);
        setCycleInfo(cycleResponse.data);
        
        const nextPeriodResponse = await getNextPeriod(customerId);
        setNextPeriod(nextPeriodResponse.data);
        
        const ovulationResponse = await getOvulationDate(customerId);
        setOvulationDate(ovulationResponse.data);
      } catch (error) {
        console.error('Error fetching menstrual cycle data:', error);
      }
    };

    fetchCycleData();
  }, [customerId]);

  if (!cycleInfo) {
    return <div>Đang tải thông tin chu kỳ...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-4">
      <h2 className="text-xl font-bold">Thông tin chu kỳ kinh nguyệt</h2>
      <p><strong>Ngày bắt đầu:</strong> {cycleInfo.startDate}</p>
      <p><strong>Độ dài chu kỳ:</strong> {cycleInfo.cycleLength} ngày</p>
      <p><strong>Số ngày hành kinh:</strong> {cycleInfo.menstruationDuration} ngày</p>
      <p><strong>Dự báo kỳ kinh tiếp theo:</strong> {nextPeriod}</p>
      <p><strong>Ngày rụng trứng:</strong> {ovulationDate}</p>
      <p><strong>Chú thích:</strong> {cycleInfo.notes || 'Không có'}</p>
    </div>
  );
};

export default MenstrualCycleInfo;
