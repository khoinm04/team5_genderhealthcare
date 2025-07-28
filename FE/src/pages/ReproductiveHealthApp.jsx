// src/pages/ReproductiveHealthApp.jsx
import React, { useState, useEffect } from 'react';
import CycleForm from '../components/CycleForm';
import CycleCalendar from '../components/CycleCalendar';
import CycleHistoryManager from '../components/CycleHistoryManager';
import PillScheduleForm from '../components/PillScheduleForm';
import PillStatusPanel from '../components/PillStatusPanel';
import PillCalendar from '../components/PillCalendar';
import PillHistoryManager from '../components/PillHistoryManager';
import { ArrowLeft } from "lucide-react";
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { mockCycleData, mockPillSchedule, mockPillHistory, mockMissedStats } from '../mocks/handlers';
import { AnimatePresence, motion } from 'framer-motion';

const USE_MOCK_DATA = false;

const ReproductiveHealthApp = () => {
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    const useHome = useNavigate();

    // ============================ 1. STATE CHUNG & UI ============================
    const [activeTab, setActiveTab] = useState('cycle');
    const [showCycleForm, setShowCycleForm] = useState(false);
    const [isEditingCycle, setIsEditingCycle] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showPillHistoryModal, setShowPillHistoryModal] = useState(false);
    const [showConfirmSavePill, setShowConfirmSavePill] = useState(false);

    // ============================ 2. CHU KỲ KINH NGUYỆT ============================
    const [cycleData, setCycleData] = useState(
        USE_MOCK_DATA ? mockCycleData : { startDate: '', cycleLength: 28, periodDays: 5 }
    );
    const [hasCycleData, setHasCycleData] = useState(USE_MOCK_DATA);
    const [historyList, setHistoryList] = useState([]);
    const [cycleCalendarMonth, setCycleCalendarMonth] = useState(() => {
        const d = new Date();
        return { year: d.getFullYear(), month: d.getMonth() };
    });

    // Nhập chu kì
    useEffect(() => {
        if (!USE_MOCK_DATA && userId) {
            const token = localStorage.getItem('token');
            axios.get(`/api/menstrual-cycles/customer/${userId}/current`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    if (res.data) {
                        setCycleData({
                            ...res.data,
                            periodDays: res.data.menstruationDuration ?? 5,
                        });
                        setHasCycleData(true);
                    } else {
                        setCycleData({ startDate: "", cycleLength: 28, periodDays: 5, notes: "" });
                        setHasCycleData(false);
                    }
                })
                .catch(() => {
                    setCycleData({ startDate: "", cycleLength: 28, periodDays: 5, notes: "" });
                    setHasCycleData(false);
                });
        }
    }, [USE_MOCK_DATA, userId]);

    // Các hàm tiện ích và CRUD cho Chu kỳ
    const changeCycleMonth = (amount) => {
        setCycleCalendarMonth((prev) => {
            let month = prev.month + amount;
            let year = prev.year;
            if (month < 0) { month = 11; year -= 1; }
            else if (month > 11) { month = 0; year += 1; }
            return { year, month };
        });
    };

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


    const getCycleDayType = (year, month, day) => {
        if (!day || !hasCycleData || !cycleData.startDate) return '';
        const createLocalDate = (str) => {
            if (!str) return null;
            const [y, m, d] = str.split('-').map(Number);
            return new Date(y, m - 1, d);
        };
        const startDate = createLocalDate(cycleData.startDate);
        const endDate = createLocalDate(cycleData.endDate);
        const ovulationDateBE = createLocalDate(cycleData.predictedOvulationDate);
        const fertileStart = createLocalDate(cycleData.predictedFertileWindowStartDate);
        const fertileEnd = createLocalDate(cycleData.predictedFertileWindowEndDate);
        const nextPeriodStart = createLocalDate(cycleData.nextPredictedDate);
        const menstruationDuration = cycleData.menstruationDuration || 5;
        const cycleLength = cycleData.cycleLength || 28;
        const currentDate = new Date(year, month, day);
        const isSameDate = (a, b) =>
            a?.getFullYear() === b?.getFullYear() &&
            a?.getMonth() === b?.getMonth() &&
            a?.getDate() === b?.getDate();
        const isInRange = (date, start, end) =>
            start && end && date >= start && date <= end;
        if (
            startDate &&
            isInRange(
                currentDate,
                startDate,
                new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + menstruationDuration - 1)
            )
        ) return 'period';
        const ovulationDate = ovulationDateBE || (
            startDate ? new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + cycleLength - 14) : null
        );
        if (isSameDate(currentDate, ovulationDate)) return 'ovulation';
        if (
            fertileStart && fertileEnd &&
            isInRange(currentDate, fertileStart, fertileEnd)
        ) return 'fertile';
        if (
            fertileStart &&
            currentDate > new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + menstruationDuration - 1) &&
            currentDate < fertileStart
        ) return 'pre-ovulation';
        if (
            fertileEnd && endDate &&
            currentDate > fertileEnd && currentDate <= endDate
        ) return 'luteal';
        if (
            nextPeriodStart &&
            isInRange(
                currentDate,
                nextPeriodStart,
                new Date(nextPeriodStart.getFullYear(), nextPeriodStart.getMonth(), nextPeriodStart.getDate() + menstruationDuration - 1)
            )
        ) return 'next-period';
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
            headers: { Authorization: `Bearer ${token}` }
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
                const msg = err?.response?.data || "Xóa chu kỳ thất bại!";
                toast.error(msg);
            });
    };

    // Lưu chu kì hiện tại vào lịch sử
    const handleSaveCurrentCycleToHistory = async () => {
        if (!userId) {
            toast.error("Không tìm thấy userId!");
            return;
        }
        if (!window.confirm("Bạn muốn lưu chu kỳ hiện tại vào lịch sử?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.post("/api/menstrual-cycles/history/save-current", null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Đã lưu chu kỳ hiện tại vào lịch sử!");
            const historyRes = await axios.get("/api/menstrual-cycle-history", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistoryList(historyRes.data);
            setShowHistoryModal(true);
        } catch (err) {
            let msg = "Lưu chu kỳ vào lịch sử thất bại!";
            if (err?.response?.data) {
                const backendMsg = typeof err.response.data === "string" ? err.response.data : (err.response.data.message || err.response.data.error || "");
                if (backendMsg.includes("ConstraintViolationImpl") || backendMsg.includes("Validation failed") || backendMsg.includes("Ngày kết thúc chu kỳ không được trong tương Ngày")) {
                    msg = "Chu kì hiện tại chưa kết thúc";
                }
            }
            toast.error(msg);
        }
    };

    // Lưu lịch sử thủ công
    const handleSaveToHistory = async () => {
        if (!cycleData?.startDate || !cycleData?.cycleLength || !cycleData?.periodDays) {
            toast.error("Dữ liệu chu kỳ chưa đầy đủ để lưu lịch sử!");
            return;
        }
        if (!userId) {
            toast.error("Không tìm thấy userId!");
            return;
        }
        if (!window.confirm("Bạn muốn lưu chu kỳ này vào lịch sử?")) return;

        const token = localStorage.getItem("token");
        const startDateObj = new Date(cycleData.startDate);
        const endDateObj = new Date(startDateObj);
        endDateObj.setDate(endDateObj.getDate() + (cycleData.cycleLength - 1));
        const formatDate = (date) => date.toISOString().slice(0, 10);

        try {
            await axios.post(
                "/api/menstrual-cycle-history",
                null,
                {
                    params: {
                        startDate: formatDate(startDateObj),
                        endDate: formatDate(endDateObj),
                        menstruationDuration: cycleData.periodDays,
                        note: cycleData.notes || ""
                    },
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            toast.success("Đã lưu chu kỳ vào lịch sử!");
            const historyRes = await axios.get("/api/menstrual-cycle-history", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistoryList(historyRes.data);
            setHasCycleData(false);
            setShowHistoryModal(true);
        } catch (err) {
            const msg = err.response?.data?.error || "Lưu vào lịch sử thất bại!";
            toast.error(msg);
        }
    };


    // Xem lịch sử
    const handleShowHistory = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get('/api/menstrual-cycle-history', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistoryList(res.data);
            setShowHistoryModal(true);
        } catch {
            toast.error("Lỗi lấy lịch sử chu kỳ!");
        }
    };

    // Lưu khi ấn tính toán
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
        setCycleCalendarMonth({ year: startDateObj.getFullYear(), month: startDateObj.getMonth() });
        const token = localStorage.getItem('token');
        const payload = {
            startDate: cycleData.startDate,
            cycleLength: cycleData.cycleLength,
            menstruationDuration: cycleData.periodDays,
            notes: cycleData.notes ?? ''
        };
        axios.post('/api/menstrual-cycles/track', payload, {
            headers: { Authorization: `Bearer ${token}` },
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
                const errorMsg = err?.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.";
                toast.error(`Lỗi lưu chu kỳ: ${errorMsg}`);
            });
    };

    // ============================ 3. THUỐC TRÁNH THAI ============================
    const [pillSchedule, setPillSchedule] = useState(USE_MOCK_DATA ? mockPillSchedule : null);
    const [pillHistory, setPillHistory] = useState(USE_MOCK_DATA ? mockPillHistory : {});
    const [pillCalendarMonth, setPillCalendarMonth] = useState(() => {
        const d = new Date();
        return { year: d.getFullYear(), month: d.getMonth() };
    });
    const [missedStats, setMissedStats] = useState(USE_MOCK_DATA ? mockMissedStats : null);

    useEffect(() => {
        if (pillSchedule?.id && !USE_MOCK_DATA) {
            const token = localStorage.getItem('token');
            axios.get(`/api/contraceptive-schedules/${pillSchedule.id}/missed-stats`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => setMissedStats(res.data ?? null))
                .catch(() => setMissedStats(null));
        }
    }, [pillSchedule, USE_MOCK_DATA]);

    useEffect(() => {
        if (!USE_MOCK_DATA && activeTab === 'pills') {
            const token = localStorage.getItem("token");
            axios.get('/api/contraceptive-schedules/current', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    setPillSchedule(res.data.schedule);
                    setPillHistory(res.data.history || {});
                })
                .catch(err => {
                    if (err?.response?.status === 404 || err?.response?.status === 500) {
                        setPillSchedule(null);
                        setPillHistory({});
                    }
                });
        }
    }, [activeTab, USE_MOCK_DATA]);

    const changePillMonth = (amount) => {
        setPillCalendarMonth((prev) => {
            let month = prev.month + amount;
            let year = prev.year;
            if (month < 0) { month = 11; year -= 1; }
            else if (month > 11) { month = 0; year += 1; }
            return { year, month };
        });
    };

    const getPillDayStatus = (year, month, day) => {
        if (!day || !pillSchedule) return '';
        const pillStart = new Date(pillSchedule.startDate);
        pillStart.setHours(0, 0, 0, 0);
        const targetDate = new Date(year, month, day);
        targetDate.setHours(0, 0, 0, 0);
        const daysDiff = Math.floor((targetDate - pillStart) / (1000 * 60 * 60 * 24));
        const maxDays = pillSchedule.type === '21' ? 21 : 28;
        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (daysDiff < 0) return '';
        else if (daysDiff >= maxDays) return 'break';
        if (targetDate < today) return pillHistory[dateStr] ? 'taken' : 'missed';
        else if (targetDate.getTime() === today.getTime()) return pillHistory[dateStr] ? 'taken' : 'today';
        else return 'scheduled';
    };


    // Xác nhận đã uống thuốc hôm nay
    const handleTakePill = async () => {
        if (!pillSchedule?.id) return;
        const token = localStorage.getItem("token");
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
        const type = parseInt(pillSchedule.type);
        const pillStart = new Date(pillSchedule.startDate);
        pillStart.setHours(0, 0, 0, 0);
        const daysSinceStart = Math.floor((today - pillStart) / (1000 * 60 * 60 * 24));
        if (type === 21 && daysSinceStart >= 21 && daysSinceStart < 28) {
            toast.info("Bạn đang trong thời gian nghỉ của vỉ thuốc (7 ngày không cần uống). Không cần xác nhận hôm nay!.");
        }
        if (type === 28 && daysSinceStart >= 21 && daysSinceStart < 28) {
            toast.info("Bạn đang uống viên giả dược (không có tác dụng tránh thai, chỉ duy trì thói quen).");
        }
        try {
            await axios.patch(
                `/api/contraceptive-schedules/${pillSchedule.id}/confirm`,
                null,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPillHistory((prev) => {
                const updated = { ...prev, [todayStr]: true };
                localStorage.setItem("pillHistory", JSON.stringify(updated));
                return updated;
            });
            const res = await axios.get('/api/contraceptive-schedules/current', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPillSchedule(res.data.schedule);
            setPillHistory(res.data.history || {});
            toast.success("Đã xác nhận uống thuốc thành công!");
        } catch (err) {
            const msg = err?.response?.data || "Xác nhận thất bại!";
            toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
        }
    };

    // const savePillHistory = async (scheduleId, currentIndex, note = "") => {
    //     const token = localStorage.getItem("token");
    //     try {
    //         const res = await axios.put(
    //             `/api/contraceptive-schedules/${scheduleId}/update-and-save-history`,
    //             null,
    //             { params: { currentIndex, note }, headers: { Authorization: `Bearer ${token}` } }
    //         );
    //         toast.success(res.data.message || "Đã lưu lịch sử thuốc thành công!");
    //         return res.data;
    //     } catch (err) {
    //         toast.error(err?.response?.data?.error || "Lưu lịch sử thất bại!");
    //     }
    // };

    // Lưu thuốc vào lịch sử 
    const handleSaveCurrentPillToHistory = async () => {
        if (!pillSchedule?.id) {
            toast.error("Không tìm thấy ID vỉ thuốc!");
            return;
        }
        const type = parseInt(pillSchedule.type);
        const currentIndex = pillSchedule.currentIndex ?? 0;
        const token = localStorage.getItem("token");
        try {
            const note = `Bạn đã uống tới viên thứ ${currentIndex + 1}/${type} thì ngưng.`;
            await axios.put(
                `/api/contraceptive-schedules/${pillSchedule.id}/update-and-save-history`,
                null,
                { params: { currentIndex, note }, headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Đã lưu vỉ thuốc vào lịch sử!");
            setPillSchedule(null);
            setPillHistory({});
            localStorage.removeItem("pillHistory");
            setShowPillHistoryModal(true);
        } catch (err) {
            const msg = err?.response?.data?.error || "Lưu lịch sử thất bại!";
            toast.error(msg);
        }
    };

    // const handleSavePillHistory = () => {
    //     if (!pillSchedule?.id) return;
    //     const type = parseInt(pillSchedule.type);
    //     const currentIndex = pillSchedule.currentPill ? pillSchedule.currentPill - 1 : -1;
    //     if (currentIndex < 0) {
    //         toast.error("Bạn chưa uống viên nào, không thể lưu lịch sử!");
    //         return;
    //     }
    //     if (!window.confirm("Bạn muốn lưu vỉ thuốc này vào lịch sử?")) return;
    //     savePillHistory(pillSchedule.id, currentIndex, "Hoàn thành vỉ thuốc");
    // };

    // Xóa lịch uống thuốc
    const handleDeletePillSchedule = () => {
        if (!pillSchedule?.id || !userId) {
            toast.error("Không tìm thấy ID lịch thuốc hoặc userId!");
            return;
        }
        localStorage.removeItem("pillHistory");
        if (!window.confirm("Bạn chắc chắn muốn xóa lịch uống thuốc này?")) return;
        const token = localStorage.getItem('token');
        axios.delete(`/api/contraceptive-schedules/delete/${pillSchedule.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                toast.success("Đã xóa thành công lịch uống thuốc!");
                setPillSchedule(null);
                setPillHistory({});
                localStorage.removeItem("pillHistory");
            })
            .catch(err => {
                const msg = err?.response?.data || "Xóa lịch thuốc thất bại!";
                toast.error(msg);
            });
    };
    // Đăng kí lịch uống thuốc mới 
    const createPillSchedule = (formData) => {
        const newSchedule = {
            type: formData.type,
            startDate: formData.startDate,
            pillTime: formData.pillTime,
            medicineName: formData.medicineName,
            currentIndex: 0,
            isActive: true,
            breakUntil: null
        };
        const token = localStorage.getItem('token');
        axios.post('/api/contraceptive-schedules', newSchedule, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(() => {
                return axios.get('/api/contraceptive-schedules/current', {
                    headers: { Authorization: `Bearer ${token}` }
                });
            })
            .then(res => {
                setPillSchedule(res.data.schedule);
                setPillHistory(res.data.history || {});
                localStorage.setItem("pillHistory", JSON.stringify(res.data.history || {}));
                toast.success("Đăng ký lịch uống thuốc thành công!");
            })
            .catch(err => {
                const msg = err?.response?.data?.message || err?.response?.data?.error || "Lỗi không xác định";
                toast.error(msg);
                console.error("❌ Lỗi chi tiết:", err.response?.data || err);
            });
    };

    function getMissedWarning() {
        if (!missedStats) return '';
        if (missedStats.consecutiveMissedCount > missedStats.maxAllowedMissed) {
            if (missedStats.pillType === "21") {
                return "Bạn đã quên uống thuốc (vỉ 21 viên). Vui lòng ngưng uống và liên hệ bác sĩ để tư vấn!";
            }
            if (missedStats.pillType === "28") {
                return "Bạn đã quên uống thuốc quá số ngày cho phép (vỉ 28 viên). Vui lòng ngưng uống và liên hệ bác sĩ để tư vấn!";
            }
        }
        return '';
    }
    const missedWarning = getMissedWarning();

    // ============================ 4. UI & TABS ============================
    const handleBackToHome = () => { useHome("/"); };

    return (
        <>
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
                        <AnimatePresence mode="wait">
                            {activeTab === 'cycle' && (
                                <motion.div
                                    key="cycle"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div>
                                        {/* Nếu chưa có chu kỳ */}
                                        {!hasCycleData ? (
                                            !showCycleForm ? (
                                                <div className="flex flex-col items-center justify-center p-8 bg-blue-50 rounded-xl border border-blue-200 shadow mb-6">
                                                    <h2 className="text-xl font-bold text-blue-700 mb-4">Bạn chưa nhập chu kỳ kinh nguyệt!</h2>
                                                    <button
                                                        onClick={() => setShowCycleForm(true)}
                                                        className="min-w-[250px] mt-8 px-14 py-4 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-xl text-lg font-semibold shadow hover:from-pink-500 hover:to-purple-500 transition-all "
                                                    >
                                                        Theo dõi chu kỳ kinh nguyệt
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center p-8 bg-blue-50 rounded-xl border border-blue-200 shadow mb-6">
                                                    <CycleForm
                                                        cycleData={cycleData}
                                                        setCycleData={setCycleData}
                                                        handleSaveCycle={(...args) => {
                                                            handleSaveCycle(...args);
                                                            setShowCycleForm(false);
                                                        }}
                                                        disabled={false}
                                                        onShowHistory={handleShowHistory}
                                                    />
                                                </div>
                                            )
                                        ) : (
                                            <div>
                                                {(isEditingCycle || !hasCycleData) ? (
                                                    <div className="p-6 bg-blue-50 rounded-xl border border-blue-200 shadow mb-6">
                                                        <CycleForm
                                                            cycleData={cycleData}
                                                            setCycleData={setCycleData}
                                                            handleSaveCycle={(...args) => {
                                                                handleSaveCycle(...args);
                                                                setIsEditingCycle(false);
                                                                setShowCycleForm(false);
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
                                                            onSaveToHistory={handleSaveToHistory}
                                                            onShowHistory={handleShowHistory}
                                                        />
                                                        <div className="flex items-center gap-4">
                                                            <button
                                                                onClick={() => setIsEditingCycle(true)}
                                                                className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-600 transition-all"
                                                            >
                                                                Cập nhật chu kỳ
                                                            </button>
                                                            <button
                                                                onClick={handleDeleteCycle}
                                                                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-all"
                                                            >
                                                                Xóa chu kỳ
                                                            </button>
                                                            <button
                                                                onClick={handleSaveCurrentCycleToHistory}
                                                                className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg text-sm font-semibold shadow hover:bg-yellow-500 transition-all"
                                                            >
                                                                Lưu vào lịch sử
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
                                </motion.div>
                            )}

                            {activeTab === 'pills' && (
                                <motion.div
                                    key="pills"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div>
                                        {!pillSchedule ? (
                                            <PillScheduleForm
                                                onSubmit={createPillSchedule}
                                                onShowHistory={() => setShowPillHistoryModal(true)}
                                            />
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
                                                <div className="flex items-center gap-4 mb-4">
                                                    <button
                                                        onClick={handleDeletePillSchedule}
                                                        className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow hover:bg-red-600 transition-all"
                                                    >
                                                        Xóa lịch uống thuốc
                                                    </button>
                                                    <button
                                                        onClick={() => setShowPillHistoryModal(true)}
                                                        className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg text-sm font-semibold shadow hover:bg-yellow-500 transition-all"
                                                    >
                                                        Xem lịch sử
                                                    </button>
                                                    <button
                                                        onClick={() => setShowConfirmSavePill(true)}
                                                        className="bg-yellow-400 text-orange-600 font-semibold px-4 py-2 rounded-lg text-sm font-semibold shadow hover:bg-yellow-500 transition-all"
                                                    >
                                                        Lưu lịch sử
                                                    </button>
                                                </div>
                                                <PillCalendar
                                                    pillCalendarMonth={pillCalendarMonth}
                                                    changePillMonth={changePillMonth}
                                                    getMonthCalendar={getMonthCalendar}
                                                    getPillDayStatus={getPillDayStatus}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Modal lịch sử chu kỳ */}
            {showHistoryModal && (
                <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-lg p-6 min-w-[350px] max-w-lg max-h-[80vh] overflow-auto">
                        <CycleHistoryManager onClose={() => setShowHistoryModal(false)} />
                    </div>
                </div>
            )}
            {/* Modal lịch sử thuốc */}
            {showPillHistoryModal && (
                <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <PillHistoryManager
                            onClose={() => setShowPillHistoryModal(false)}
                        />
                    </div>
                </div>
            )}
            {showConfirmSavePill && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-lg p-6 min-w-[350px] max-w-sm">
                        <h2 className="text-xl font-bold mb-2 text-gray-800">Xác nhận lưu vỉ thuốc</h2>
                        <div className="mb-3">
                            <span className="text-red-600 font-semibold">
                                Bạn đang uống tới viên thứ {pillSchedule?.currentIndex + 1}/{pillSchedule?.type}
                            </span>
                            <br />
                            <span className="text-gray-700 text-base">Sau khi lưu, vỉ thuốc hiện tại sẽ chuyển vào lịch sử. Bạn có chắc chắn muốn lưu không?</span>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setShowConfirmSavePill(false)}
                                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={async () => {
                                    setShowConfirmSavePill(false);
                                    await handleSaveCurrentPillToHistory();
                                }}
                                className="px-4 py-2 rounded bg-pink-500 text-white hover:bg-pink-600"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default ReproductiveHealthApp;
