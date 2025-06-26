import React from 'react';
import ConsultingScheduleManager from '../components/ConsultingScheduleManager';
import STITestOrdersInterface from '../components/STITestOrdersInterface';

const HealthcareDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500 rounded-2xl mb-6">
            <div className="text-white text-2xl font-bold">
              <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Healthcare Management System
          </h1>
          <p className="text-xl text-gray-600">
            Select a table to view and manage information
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="space-y-4">
          <ConsultingScheduleCard />
          <STITestOrdersCard />
        </div>
      </div>
    </div>
  );
};

export default HealthcareDashboard;