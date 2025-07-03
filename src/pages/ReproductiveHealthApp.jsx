// src/pages/ReproductiveHealthApp.jsx
import React, { useState, useEffect } from 'react';
import CycleForm from '../components/CycleForm';
import CycleCalendar from '../components/CycleCalendar';
import PillScheduleForm from '../components/PillScheduleForm';
import PillStatusPanel from '../components/PillStatusPanel';
import PillCalendar from '../components/PillCalendar';
import { ArrowLeft } from "lucide-react";
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PillConfirmedToast from "../components/PillConfirmedToast";
import { mockCycleData, mockPillSchedule, mockPillHistory } from '../mocks/handlers';


const USE_MOCK_DATA = false; // Đổi true để test UI, false để dùng backend

const ReproductiveHealthApp = () => {
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    const [activeTab, setActiveTab] = useState('cycle');
    const [isEditingCycle, setIsEditingCycle] = useState(false);


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
    // -- QUÊN THUỐC
    const [missedStats, setMissedStats] = useState(null);

    // ==================== LẤY DỮ LIỆU THẬT TỪ BE ====================
    useEffect(() => {
        // Chỉ chạy khi có pillSchedule và scheduleId (id)
        if (pillSchedule?.id && !USE_MOCK_DATA) {
            const token = localStorage.getItem('token');
            axios.get(`/api/contraceptive-schedules/${pillSchedule.id}/missed-stats`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
                .then(res => {
                    if (res.data) {
                        setMissedStats(res.data);
                    } else {
                        setMissedStats(null);
                    }
                })
                .catch(err => {
                    console.error('Lỗi lấy thống kê quên uống thuốc:', err);
                    setMissedStats(null);
                });
        }
    }, [pillSchedule, USE_MOCK_DATA]);


    useEffect(() => {
        if (!USE_MOCK_DATA && userId) {
            const token = localStorage.getItem('token');
            axios.get(`/api/menstrual-cycles/customer/${userId}/current`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
                .then(res => {
                    if (res.data) {
                        setCycleData(res.data);
                        setHasCycleData(true);
                    } else {
                        // Nếu không có dữ liệu chu kỳ (null), set trạng thái là chưa có
                        setCycleData(null);
                        setHasCycleData(false);
                    }
                })
                .catch(err => {
                    console.error('Lỗi lấy chu kỳ:', err);
                    setCycleData(null);
                    setHasCycleData(false);
                });
        }
    }, [USE_MOCK_DATA, userId]);





    useEffect(() => {
        if (!USE_MOCK_DATA && userId) {
            const token = localStorage.getItem('token');
            axios.get(`/api/menstrual-cycles/customer/${userId}/current`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
                .then(res => {
                    if (res.data) {
                        setCycleData({
                            ...res.data,
                            periodDays: res.data.menstruationDuration ?? 5, // ✅ Map rõ ràng
                        });
                        setHasCycleData(true);
                    } else {
                        setCycleData({
                            startDate: "",
                            cycleLength: 28,
                            periodDays: 5,
                            notes: ""
                        });
                        setHasCycleData(false);
                    }
                })

                .catch(err => {
                    console.error('Lỗi lấy chu kỳ:', err);
                    // fallback: vẫn khởi tạo rỗng cho người nhập
                    setCycleData({
                        startDate: "",
                        cycleLength: 28,
                        periodDays: 5,
                        notes: ""
                    });
                    setHasCycleData(false);
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
    // const isInCurrentCycle = (year, month, day) => {
    //     if (!hasCycleData || !cycleData.startDate) return false;
    //     const [sYear, sMonth, sDay] = cycleData.startDate.split('-').map(Number);
    //     const start = new Date(sYear, sMonth - 1, sDay);
    //     const current = new Date(year, month, day);
    //     start.setHours(0, 0, 0, 0);
    //     current.setHours(0, 0, 0, 0);
    //     const diff = Math.floor((current - start) / (1000 * 60 * 60 * 24));
    //     return diff >= 0 && diff < cycleData.cycleLength;
    // };

    // Xác định loại ngày cho lịch chu kỳ (để tô màu)
    const getCycleDayType = (year, month, day) => {
        if (!day || !hasCycleData || !cycleData.startDate) return '';

        // Hàm tạo Date an toàn từ chuỗi "yyyy-MM-dd"
        const createLocalDate = (str) => {
            if (!str) return null;
            const [y, m, d] = str.split('-').map(Number);
            return new Date(y, m - 1, d); // tháng từ 0
        };

        // Dữ liệu từ backend (nếu có)
        const startDate = createLocalDate(cycleData.startDate);
        const endDate = createLocalDate(cycleData.endDate);
        const ovulationDateBE = createLocalDate(cycleData.predictedOvulationDate);
        const fertileStart = createLocalDate(cycleData.predictedFertileWindowStartDate);
        const fertileEnd = createLocalDate(cycleData.predictedFertileWindowEndDate);
        const nextPeriodStart = createLocalDate(cycleData.nextPredictedDate);
        const menstruationDuration = cycleData.menstruationDuration || 5;
        const cycleLength = cycleData.cycleLength || 28;

        // Ngày hiện tại trong lịch
        const currentDate = new Date(year, month, day);

        // Helper so sánh và khoảng
        const isSameDate = (a, b) =>
            a?.getFullYear() === b?.getFullYear() &&
            a?.getMonth() === b?.getMonth() &&
            a?.getDate() === b?.getDate();

        const isInRange = (date, start, end) =>
            start && end && date >= start && date <= end;

        // 1. 🔴 Ngày hành kinh hiện tại
        if (
            startDate &&
            isInRange(
                currentDate,
                startDate,
                new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + menstruationDuration - 1)
            )
        ) return 'period';

        // 2. 🟠 Ngày rụng trứng
        const ovulationDate = ovulationDateBE || (
            startDate ? new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + cycleLength - 14) : null
        );

        if (isSameDate(currentDate, ovulationDate)) return 'ovulation';

        // 3. 🟡 Dễ thụ thai (cửa sổ thụ thai)
        if (
            fertileStart && fertileEnd &&
            isInRange(currentDate, fertileStart, fertileEnd)
        ) return 'fertile';

        // 4. 🌕 Trước rụng trứng
        if (
            fertileStart &&
            currentDate > new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + menstruationDuration - 1) &&
            currentDate < fertileStart
        ) return 'pre-ovulation';

        // 5. 🔵 Giai đoạn hoàng thể
        if (
            fertileEnd && endDate &&
            currentDate > fertileEnd && currentDate <= endDate
        ) return 'luteal';

        // 6. 🟥 Kỳ kinh nguyệt kế tiếp (dự đoán)
        if (
            nextPeriodStart &&
            isInRange(
                currentDate,
                nextPeriodStart,
                new Date(nextPeriodStart.getFullYear(), nextPeriodStart.getMonth(), nextPeriodStart.getDate() + menstruationDuration - 1)
            )
        ) return 'next-period';

        // 7. ❔ Ngày thường
        return 'default';
    };


    // Xóa chu kì
    const handleDeleteCycle = () => {
        const cycleId = cycleData.cycleId;
        if (!cycleId || !userId) {
            toast.error("Không tìm thấy ID chu kỳ hoặc userId!");
            return;
        }

        if (!window.confirm("Bạn chắc chắn muốn xóa chu kỳ kinh nguyệt này?")) return;

        const token = localStorage.getItem('token');
        axios.delete(`/api/menstrual-cycles/customer/${userId}/cycles/${cycleId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(() => {
                toast.success("Đã xóa thành công chu kỳ kinh nguyệt!");
                setCycleData({
                    startDate: '',
                    cycleLength: 28,
                    periodDays: 5,
                    cycleId: null,
                });
                setHasCycleData(false);
            })
            .catch(err => {
                console.error("Xóa chu kỳ thất bại:", err?.response);
                const msg = err?.response?.data || "Xóa chu kỳ thất bại!";
                toast.error(msg);
            });
    };




    // LỊCH THUỐC: xác định trạng thái ngày
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

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (targetDate < today) {
            // Ngày trong quá khứ
            if (pillHistory[dateStr] === true) return 'taken';
            else return 'missed'; // chưa tick là missed
        } else if (targetDate.getTime() === today.getTime()) {
            // Hôm nay
            if (pillHistory[dateStr] === true) return 'taken';
            return 'today';
        } else {
            // Ngày tương lai: không màu
            return '';
        }
    };


    // Sự kiện lưu chu kỳ: user nhập xong nhấn Lưu
    const handleSaveCycle = () => {
        if (!cycleData.startDate) {
            toast.error("Thiếu ngày bắt đầu.");
            return;
        }

        const today = new Date();
        const startDateObj = new Date(cycleData.startDate);
        today.setHours(0, 0, 0, 0);
        startDateObj.setHours(0, 0, 0, 0);

        if (startDateObj > today) {
            toast.warning("Ngày bắt đầu không được sau ngày hiện tại!");
            return;
        }

        const validCycleLength = cycleData.cycleLength ?? 28;
        const minDate = new Date(today);
        minDate.setDate(today.getDate() - validCycleLength);
        if (startDateObj < minDate) {
            toast.warning("Ngày bắt đầu không được cách quá xa ngày hiện tại!");
            return;
        }

        setCycleCalendarMonth({ year: startDateObj.getFullYear(), month: startDateObj.getMonth() });

        const token = localStorage.getItem('token');

        const payload = {
            startDate: cycleData.startDate,
            cycleLength: cycleData.cycleLength,
            menstruationDuration: cycleData.periodDays,
            notes: cycleData.notes ?? ''
        };

        // 👇 Nếu đã có cycleId (chỉnh sửa) thì gọi PUT
        if (cycleData.cycleId) {
            axios.put(`/api/menstrual-cycles/customer/${userId}/cycles/${cycleData.cycleId}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
                .then(res => {
                    setCycleData(prev => ({
                        ...prev,
                        ...res.data
                    }));
                    setHasCycleData(true);
                    toast.success("Đã cập nhật chu kỳ thành công!");
                })
                .catch(err => {
                    console.error("Lỗi cập nhật chu kỳ:", err);
                    const msg = err?.response?.data?.message || "Cập nhật chu kỳ thất bại!";
                    toast.error(msg);
                });
        } else {
            // 👇 Nếu chưa có thì tạo mới
            axios.post('/api/menstrual-cycles/track', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
                .then(res => {
                    setCycleData(prev => ({
                        ...prev,
                        ...res.data
                    }));
                    setHasCycleData(true);
                    toast.success("Đã lưu chu kỳ thành công!");
                })
                .catch(err => {
                    console.error('Lỗi lưu chu kỳ:', err);
                    const errorMsg = err?.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.";
                    toast.error(`Lỗi lưu chu kỳ: ${errorMsg}`);
                });
        }
    };




    // Sự kiện xác nhận đã uống thuốc hôm nay
    const handleTakePill = () => {
        if (!pillSchedule?.id) return;

        const token = localStorage.getItem('token');

        // ✅ Chặn trước khi gửi API, đề phòng WebSocket phản ứng quá nhanh
        window.justConfirmed = true;
        setTimeout(() => {
            window.justConfirmed = false;
        }, 10000); // đủ dài để chặn toast WebSocket

        axios.patch(`/api/contraceptive-schedules/${pillSchedule.id}/confirm`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

                // ✅ Cập nhật state và localStorage
                setPillHistory(prev => {
                    const updated = {
                        ...prev,
                        [todayStr]: true,
                    };
                    localStorage.setItem("pillHistory", JSON.stringify(updated));
                    return updated;
                });

                // ✅ Cập nhật currentPill UI
                setPillSchedule(prev => ({
                    ...prev,
                    currentPill: prev.currentPill < parseInt(prev.type) ? prev.currentPill + 1 : 1,
                }));

                // ✅ Hiển thị toast xác nhận uống
                toast.success(
                    <PillConfirmedToast
                        pillIndex={(pillSchedule.currentPill ?? 0) + 1}
                        pillType={pillSchedule.type}
                    />,
                    {
                        position: "top-right",
                        autoClose: 8000,
                    }
                );
            })
            .catch(err => {
                const msg = err?.response?.data || "Xác nhận thất bại!";
                toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg)); f
            });
    };




    // Xóa lịch thuốc
    const handleDeletePillSchedule = () => {
        if (!pillSchedule?.id || !userId) {
            toast.error("Không tìm thấy ID lịch thuốc hoặc userId!");
            return;
        }

        const token = localStorage.getItem('token');

        axios.delete(`/api/contraceptive-schedules/${pillSchedule.id}`, {
            params: { userId: userId },
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(() => {
                toast.success("Đã xóa thành công lịch uống thuốc!");


                // ✅ Xóa toàn bộ state và localStorage liên quan
                setPillSchedule(null);
                setPillHistory({});
                localStorage.removeItem("pillHistory"); // <<== thêm dòng này

            })
            .catch(err => {
                const msg = err?.response?.data || "Xóa lịch thuốc thất bại!";
                toast.error(msg);

            });
    };



    // Tạo mới lịch thuốc (khi user nhập từ form)
    const createPillSchedule = (formData) => {
        const newSchedule = {
            type: formData.type,
            startDate: formData.startDate,    // "yyyy-MM-dd"
            pillTime: formData.pillTime,      // "HH:mm:ss"
            currentIndex: 0,
            isActive: true,
            breakUntil: null
        };

        console.log("🎯 Dữ liệu gửi:", newSchedule);


        const token = localStorage.getItem('token');

        axios.post('/api/contraceptive-schedules', newSchedule, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(() => {
                return axios.get('/api/contraceptive-schedules/current', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            })
            .then(res => {
                setPillSchedule(res.data.schedule);
                setPillHistory(res.data.history || {});

                // ✅ Lưu vào localStorage để đồng bộ với WebSocket
                localStorage.setItem("pillHistory", JSON.stringify(res.data.history || {}));

                toast.success("Đăng ký lịch uống thuốc thành công!");
            })

            .catch(err => {
                const msg = err?.response?.data?.message || err?.response?.data?.error || "Lỗi không xác định";
                toast.error(msg);
                console.error("❌ Lỗi chi tiết:", err.response?.data || err);
            });
    };



    // Hàm cảnh báo quên uống thuốc
    function getMissedWarning(pillSchedule, pillHistory) {
        if (!missedStats) return '';
        if (missedStats.totalMissedDays > missedStats.maxAllowedMissed) {
            if (missedStats.pillType === "21") {
                return "Bạn đã quên uống thuốc (vỉ 21 viên). Vui lòng ngưng uống và liên hệ bác sĩ để tư vấn!";
            }
            if (missedStats.pillType === "28") {
                return `Bạn đã quên uống thuốc quá số ngày cho phép (vỉ 28 viên). Vui lòng ngưng uống và liên hệ bác sĩ để tư vấn!`;
            }
        }
        return '';
    }
    const missedWarning = getMissedWarning(missedStats);

    <PillStatusPanel
        pillSchedule={pillSchedule}
        pillHistory={pillHistory || {}}
        handleTakePill={handleTakePill}
        missedWarning={missedWarning}
        missedStats={missedStats}
    />

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


    const useHome = useNavigate();

    const handleBackToHome = () => {
        useHome("/"); // Điều hướng về trang chủ
    };
    const [showCycleForm, setShowCycleForm] = useState(false);

    // ==================== GIAO DIỆN CHÍNH ====================
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
            <div className="container mx-auto px-4 py-6 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2">
                        <button
                            onClick={handleBackToHome}
                            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            <span className="text-base font-medium">Trang chủ</span>
                        </button>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Theo Dõi Chu Kỳ Kinh Nguyệt & Uống Thuốc
                    </h1>
                    <p className="text-gray-600">Quản lý sức khỏe sinh sản một cách thông minh</p>
                </div>

                {/* Tabs */}
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

                {/* Main content */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    {activeTab === 'cycle' && (
                        <div>
                            {/* Nếu chưa có chu kỳ */}
                            {!hasCycleData ? (
                                !showCycleForm ? (
                                    // Hiện nút trước, nhấn vào mới hiện form nhập chu kỳ
                                    <div className="flex flex-col items-center justify-center p-8 bg-blue-50 rounded-xl border border-blue-200 shadow mb-6">
                                        <h2 className="text-xl font-bold text-blue-700 mb-4">Bạn chưa nhập chu kỳ kinh nguyệt!</h2>
                                        <button
                                            onClick={() => setShowCycleForm(true)}
                                            className=" mt-8 px-14 py-4 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-xl text-lg font-semibold shadow hover:from-pink-500 hover:to-purple-500 transition-all "
                                        >
                                            Nhập chu kỳ đầu tiên
                                        </button>
                                    </div>
                                ) : (
                                    // Khi đã bấm nút thì mới hiện form
                                    <div className="flex flex-col items-center justify-center p-8 bg-blue-50 rounded-xl border border-blue-200 shadow mb-6">          <CycleForm
                                        cycleData={cycleData}
                                        setCycleData={setCycleData}
                                        handleSaveCycle={(...args) => {
                                            handleSaveCycle(...args);
                                            setShowCycleForm(false); // Ẩn form khi lưu xong
                                        }}
                                        disabled={false}
                                    />
                                    </div>
                                )
                            ) : (
                                // Đã có chu kỳ: cho phép xem lịch, sửa, xóa
                                <div>
                                    {(isEditingCycle || !hasCycleData) ? (
                                        <div className="p-6 bg-blue-50 rounded-xl border border-blue-200 shadow mb-6">
                                            <CycleForm
                                                cycleData={cycleData}
                                                setCycleData={setCycleData}
                                                handleSaveCycle={(...args) => {
                                                    handleSaveCycle(...args);
                                                    setIsEditingCycle(false);
                                                    setShowCycleForm(false); // phòng trường hợp tạo mới
                                                }}
                                                disabled={false}
                                            />
                                        </div>
                                    ) : (
                                        <div className="mb-6">
                                            <CycleForm
                                                cycleData={cycleData}
                                                setCycleData={setCycleData}
                                                handleSaveCycle={handleSaveCycle}
                                                disabled={true}
                                            />
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => setIsEditingCycle(true)}
                                                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-600 transition-all"
                                                >
                                                    Chỉnh sửa chu kỳ
                                                </button>

                                                <button
                                                    onClick={handleDeleteCycle}
                                                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-all"
                                                >
                                                    Xóa chu kỳ
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <CycleCalendar
                                        cycleCalendarMonth={cycleCalendarMonth}
                                        changeCycleMonth={changeCycleMonth}
                                        getMonthCalendar={getMonthCalendar}
                                        getCycleDayType={getCycleDayType}
                                        hasCycleData={hasCycleData}
                                    />
                                </div>

                            )}
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
                                    <PillStatusPanel
                                        pillSchedule={pillSchedule}
                                        pillHistory={pillHistory || {}}
                                        handleTakePill={handleTakePill}
                                        missedWarning={missedWarning}
                                        missedStats={missedStats}
                                    />
                                    <PillCalendar
                                        pillCalendarMonth={pillCalendarMonth}
                                        changePillMonth={changePillMonth}
                                        getMonthCalendar={getMonthCalendar}
                                        getPillDayStatus={getPillDayStatus}
                                    />
                                    <button
                                        onClick={handleDeletePillSchedule}
                                        className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-all"
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
