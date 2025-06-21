// src/pages/ReproductiveHealthApp.jsx
import React, { useState, useEffect } from 'react';
import CycleForm from '../components/CycleForm';
import CycleCalendar from '../components/CycleCalendar';
import PillScheduleForm from '../components/PillScheduleForm';
import PillStatusPanel from '../components/PillStatusPanel';
import PillCalendar from '../components/PillCalendar';
import PillStatsPanel from '../components/PillStatsPanel';
import axios from 'axios';


// Mock data, chỉ dùng khi phát triển/test UI
import { mockCycleData, mockPillSchedule, mockPillHistory } from '../mocks/handlers';

const USE_MOCK_DATA = false;; // Đổi true để test UI, false để dùng backend

const ReproductiveHealthApp = () => {
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    const [activeTab, setActiveTab] = useState('cycle');


    // --- Chu kỳ kinh nguyệt
    // Nếu dùng mock thì lấy mock, không thì mặc định là trống để user nhập
    const [cycleData, setCycleData] = useState(
        USE_MOCK_DATA ? mockCycleData : {
            startDate: '',
            cycleLength: 28,
            periodDays: 5,
        }
    );
    // true nếu đã có chu kỳ (FE dùng để cho phép vẽ lịch)
    const [hasCycleData, setHasCycleData] = useState(USE_MOCK_DATA);

    // --- Thuốc tránh thai
    const [pillSchedule, setPillSchedule] = useState(
        USE_MOCK_DATA ? mockPillSchedule : null
    );
    const [pillHistory, setPillHistory] = useState(
        USE_MOCK_DATA ? mockPillHistory : {}
    );

    // --- Quản lý tháng đang xem trên lịch
    const [cycleCalendarMonth, setCycleCalendarMonth] = useState(() => {
        const d = new Date();
        return { year: d.getFullYear(), month: d.getMonth() };
    });

    const [pillCalendarMonth, setPillCalendarMonth] = useState(() => {
        const d = new Date();
        return { year: d.getFullYear(), month: d.getMonth() };
    });

    // ==================== LẤY DỮ LIỆU THẬT TỪ BE ====================
    useEffect(() => {
        if (!USE_MOCK_DATA && userId) {
            // Lấy chu kỳ từ backend
            axios.get(`/api/menstrual-cycles/user/${userId}`)
                .then(res => {
                    if (res.data) {
                        setCycleData(res.data);
                        setHasCycleData(true);
                    }
                })
                .catch(err => {
                    console.error('Lỗi lấy chu kỳ:', err);
                    setHasCycleData(false);
                });
        }
    }, [USE_MOCK_DATA, userId]);

    useEffect(() => {
        if (!USE_MOCK_DATA && userId) {
            const token = localStorage.getItem('token');
            console.log('Token FE đang dùng:', token);
            axios.get(`/api/contraceptive-schedules/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },

            })
                .then(res => {
                    setPillSchedule(res.data.schedule || null);
                    setPillHistory(res.data.history || {});
                })
                .catch(err => {
                    console.error('Lỗi lấy lịch thuốc:', err);
                    setPillSchedule(null);
                    setPillHistory({});
                });
        }
    }, [USE_MOCK_DATA, userId]);


    // ==================== XỬ LÝ SỰ KIỆN, CHUYỂN THÁNG, HÀM TIỆN ÍCH ====================
    const changeCycleMonth = (amount) => {
        setCycleCalendarMonth((prev) => {
            let month = prev.month + amount;
            let year = prev.year;
            if (month < 0) { month = 11; year -= 1; }
            else if (month > 11) { month = 0; year += 1; }
            return { year, month };
        });
    };

    const changePillMonth = (amount) => {
        setPillCalendarMonth((prev) => {
            let month = prev.month + amount;
            let year = prev.year;
            if (month < 0) { month = 11; year -= 1; }
            else if (month > 11) { month = 0; year += 1; }
            return { year, month };
        });
    };

    // Tạo mảng các ngày trong tháng, để render lịch
    const getMonthCalendar = ({ year, month }) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        const days = [];
        for (let i = 0; i < startingDay; i++) days.push(null);
        for (let day = 1; day <= daysInMonth; day++) days.push(day);
        return days;
    };

    // Check ngày có trong chu kỳ hiện tại không
    const isInCurrentCycle = (year, month, day) => {
        if (!hasCycleData || !cycleData.startDate) return false;
        const [sYear, sMonth, sDay] = cycleData.startDate.split('-').map(Number);
        const start = new Date(sYear, sMonth - 1, sDay);
        const current = new Date(year, month, day);
        start.setHours(0, 0, 0, 0);
        current.setHours(0, 0, 0, 0);
        const diff = Math.floor((current - start) / (1000 * 60 * 60 * 24));
        return diff >= 0 && diff < cycleData.cycleLength;
    };

    // Xác định loại ngày cho lịch chu kỳ (để tô màu)
    const getCycleDayType = (year, month, day) => {
        if (!day || !hasCycleData || !cycleData.startDate) return '';
        if (!isInCurrentCycle(year, month, day)) return '';
        const [sYear, sMonth, sDay] = cycleData.startDate.split('-').map(Number);
        const cycleStart = new Date(sYear, sMonth - 1, sDay);
        const currentDate = new Date(year, month, day);
        const daysDiff = Math.floor((currentDate - cycleStart) / (1000 * 60 * 60 * 24));
        const cycleDay = daysDiff + 1;
        if (cycleDay <= cycleData.periodDays) return 'period';
        const ovulationDay = cycleData.cycleLength - 14 + 1;
        if (cycleDay === ovulationDay) return 'ovulation';
        if (Math.abs(cycleDay - ovulationDay) <= 2) return 'high-fertility';
        if (Math.abs(cycleDay - ovulationDay) <= 5) return 'medium-fertility';
        return 'low-fertility';
    };

    // Lịch thuốc: xác định trạng thái ngày
    const getPillDayStatus = (year, month, day) => {
        if (!day || !pillSchedule) return '';
        const pillStart = new Date(pillSchedule.startDate);
        pillStart.setHours(0, 0, 0, 0);
        const targetDate = new Date(year, month, day);
        targetDate.setHours(0, 0, 0, 0);

        const daysDiff = Math.floor((targetDate - pillStart) / (1000 * 60 * 60 * 24));
        const maxDays = pillSchedule.type === '21' ? 21 : 28;
        if (daysDiff < 0 || daysDiff >= maxDays) return '';

        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        if (pillHistory[dateStr] === false) return 'missed';
        if (pillHistory[dateStr] === true) return 'taken';

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (targetDate.getTime() === today.getTime()) return 'today';

        return 'scheduled';
    };

    // Sự kiện lưu chu kỳ: user nhập xong nhấn Lưu
    const handleSaveCycle = () => {
        if (!cycleData.startDate) {
            alert("Thiếu ngày bắt đầu.");
            return;
        }

        console.log('Gửi dữ liệu:', {
            startDate: cycleData.startDate,
            cycleLength: cycleData.cycleLength,
            menstruationDuration: cycleData.periodDays
        });

        setHasCycleData(true);
        const startDate = new Date(cycleData.startDate);
        setCycleCalendarMonth({ year: startDate.getFullYear(), month: startDate.getMonth() });

        const token = localStorage.getItem('token');
        axios.post('/api/menstrual-cycles/track', {
            startDate: cycleData.startDate,
            cycleLength: cycleData.cycleLength,
            menstruationDuration: cycleData.periodDays
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(res => {
                setCycleData(res.data);
                setHasCycleData(true);
            })
            .catch(err => {
                console.error('Lỗi lưu chu kỳ:', err);
                const errorMsg = err?.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.";
                alert("Lỗi lưu chu kỳ: " + errorMsg);
            });
    };



    // Sự kiện xác nhận đã uống thuốc hôm nay
    const handleTakePill = () => {
  if (!pillSchedule?.id) return;

  const token = localStorage.getItem('token');

  axios.patch(`/api/contraceptive-schedules/${pillSchedule.id}/confirm`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
  .then(res => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

    // ✅ Cập nhật local pillHistory để disable nút ngay lập tức
    setPillHistory(prev => ({
      ...prev,
      [todayStr]: true,
    }));

    // ✅ Cập nhật local currentPill nếu muốn hiệu ứng UI
    setPillSchedule(prev => ({
      ...prev,
      currentPill: prev.currentPill < parseInt(prev.type) ? prev.currentPill + 1 : 1,
    }));

    alert(res.data); // "Đã xác nhận bạn đã uống thuốc hôm nay!"
  })
  .catch(err => {
    const msg = err?.response?.data || "Xác nhận thất bại!";
    alert(msg);
  });
};



    // Xóa lịch thuốc
    const handleDeletePillSchedule = () => {
        setPillSchedule(null);
        setPillHistory({});
        // Nếu dùng BE, nên gọi API DELETE ở đây
    };

    // Tạo mới lịch thuốc (khi user nhập từ form)
    const createPillSchedule = (formData) => {
  const newSchedule = {
    type: formData.type,
    startDate: formData.startDate,
pillTime: typeof formData.time === "string" ? formData.time.padEnd(8, ":00") : "00:00:00",
    currentIndex: 0,
    isActive: true,
    breakUntil: null
  };

  const token = localStorage.getItem('token');

  axios.post('/api/contraceptive-schedules', newSchedule, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(() => {
    return axios.get('/api/contraceptive-schedules/current', {
      headers: { Authorization: `Bearer ${token}` }
    });
  })
  .then(res => {
    setPillSchedule(res.data.schedule);          // ✅ chuyển sang giao diện PillStatusPanel
    setPillHistory(res.data.history || {});
    alert("Đăng ký lịch uống thuốc thành công!");
  })
  .catch(err => {
    const msg = err?.response?.data?.message || err?.response?.data?.error || "Lỗi không xác định";
    alert(msg);
    console.error("❌ Lỗi chi tiết:", err);
  });
};



    // Hàm cảnh báo quên uống thuốc
    function getMissedWarning(pillSchedule, pillHistory) {
        if (!pillSchedule) return '';
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let missedCount = 0;
        const start = new Date(pillSchedule.startDate);
        start.setHours(0, 0, 0, 0);
        const days = Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1;

        for (let i = 0; i < days; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
            if (d < today && (pillHistory[key] === false || (pillHistory[key] === undefined && d < today))) {
                missedCount += 1;
            }
        }

        if (pillSchedule.type === '21' && missedCount >= 1) {
            return '⚠️ Bạn đã quên uống thuốc (vỉ 21 viên). Vui lòng ngưng uống và liên hệ bác sĩ để tư vấn!';
        }
        if (pillSchedule.type === '28' && missedCount >= 3) {
            return '⚠️ Bạn đã quên uống thuốc 3 ngày (vỉ 28 viên). Vui lòng ngưng uống và liên hệ bác sĩ để tư vấn!';
        }
        return '';
    }
    const missedWarning = getMissedWarning(pillSchedule, pillHistory);

    // Hàm thống kê thuốc từng tháng
    function getPillStats(pillSchedule, pillHistory, calendarMonth) {
        if (!pillSchedule) return { taken: 0, missed: 0, scheduled: 0 };
        const { year, month } = calendarMonth;
        const pillStart = new Date(pillSchedule.startDate);
        pillStart.setHours(0, 0, 0, 0);
        const maxDays = pillSchedule.type === '21' ? 21 : 28;

        let taken = 0, missed = 0, total = 0;

        for (let i = 0; i < maxDays; i++) {
            const d = new Date(pillStart);
            d.setDate(pillStart.getDate() + i);
            if (d.getMonth() !== month || d.getFullYear() !== year) continue;
            const dateStr = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
            if (pillHistory[dateStr] === true) taken++;
            else if (pillHistory[dateStr] === false) missed++;
            total++;
        }

        const scheduled = total - taken - missed;
        return { taken, missed, scheduled };
    }

    useEffect(() => {
  if (activeTab === 'pills') {
    const token = localStorage.getItem("token");
    axios.get('/api/contraceptive-schedules/current', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setPillSchedule(res.data.schedule);
      setPillHistory(res.data.history || {});
    })
    .catch(err => {
      // Không có lịch thì giữ nguyên pillSchedule = null
      console.warn("🟡 Chưa có lịch thuốc:", err?.response?.data?.message);
    });
  }
}, [activeTab]);

    // ==================== GIAO DIỆN CHÍNH ====================
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
            <div className="container mx-auto px-4 py-6 max-w-4xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Theo Dõi Chu Kỳ Kinh Nguyệt & Uống Thuốc
                    </h1>
                    <p className="text-gray-600">Quản lý sức khỏe sinh sản một cách thông minh</p>
                </div>
                <div className="flex mb-6 bg-white rounded-xl p-1 shadow-lg">
                    <button onClick={() => setActiveTab('cycle')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${activeTab === 'cycle' ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <span role="img" aria-label="calendar">🩸</span> Chu kỳ
                    </button>
                    <button onClick={() => setActiveTab('pills')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${activeTab === 'pills' ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <span role="img" aria-label="pill">💊</span> Uống thuốc
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                    {activeTab === 'cycle' && (
                        <div>
                            {/* Form nhập liệu chu kỳ, user luôn có thể nhập/chỉnh */}
                            <CycleForm
                                cycleData={cycleData}
                                setCycleData={setCycleData}
                                handleSaveCycle={handleSaveCycle}
                            />
                            <CycleCalendar
                                cycleCalendarMonth={cycleCalendarMonth}
                                changeCycleMonth={changeCycleMonth}
                                getMonthCalendar={getMonthCalendar}
                                getCycleDayType={getCycleDayType}
                                hasCycleData={hasCycleData}
                            />
                        </div>
                    )}

                    {activeTab === 'pills' && (
                        <div>
                            {/* Nếu chưa có lịch thuốc thì cho user đăng ký */}
                            {!pillSchedule ? (
                                <PillScheduleForm onSubmit={createPillSchedule} />
                            ) : (
                                <div>
                                    {missedWarning && (
                                        <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-800 font-semibold rounded flex items-center gap-2 animate-pulse">
                                            <span role="img" aria-label="warning">⚠️</span> {missedWarning}
                                        </div>
                                    )}

                                    {console.log("✅ pillSchedule:", pillSchedule)}
                                    {console.log("✅ pillHistory:", pillHistory)}

                                    <PillStatusPanel
                                        pillSchedule={pillSchedule}
                                        pillHistory={pillHistory || {}} // fallback tránh undefined
                                        handleTakePill={handleTakePill}
                                        missedWarning={missedWarning}
                                    />

                                    {/* THỐNG KÊ UỐNG THUỐC */}
                                    <PillStatsPanel
                                        stats={getPillStats(pillSchedule, pillHistory, pillCalendarMonth)}
                                    />

                                    <PillCalendar
                                        pillCalendarMonth={pillCalendarMonth}
                                        changePillMonth={changePillMonth}
                                        getMonthCalendar={getMonthCalendar}
                                        getPillDayStatus={getPillDayStatus}
                                    />
                                    <button
                                        onClick={handleDeletePillSchedule}
                                        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-all"
                                    >
                                        Xóa lịch uống thuốc
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReproductiveHealthApp;
