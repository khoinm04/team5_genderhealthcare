import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit3, X, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const PillHistoryManager = ({ onClose }) => {
    const [historyArr, setHistoryArr] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [noteValue, setNoteValue] = useState('');
    const [loading, setLoading] = useState(false);

    // Phân trang
    const itemsPerPage = 8;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchHistory();
    }, []);


    const fetchHistory = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get(`/api/contraceptive-schedules/history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistoryArr(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            setHistoryArr([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEditNote = (item) => {
        setEditingId(item.id);
        setNoteValue(item.note || "");
    };

    // Luu ghi chú
    const handleSaveNote = async () => {
        if (!editingId) return;
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            await axios.patch(`/api/contraceptive-schedules/${editingId}/note`,
                { note: noteValue },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEditingId(null);
            setNoteValue('');
            fetchHistory();
            toast.success("Đã lưu ghi chú!");
        } catch (e) {
            toast.error('Lưu ghi chú thất bại!');
        } finally {
            setLoading(false);
        }
    };

    // Xóa vỉ thuốc
    const handleDelete = async (scheduleId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xoá vỉ thuốc này khỏi lịch sử?")) return;
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            await axios.delete(`/api/contraceptive-schedules/delete/${scheduleId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchHistory();
            toast.success("Đã xoá vỉ thuốc khỏi lịch sử!");
        } catch (e) {
            alert('Xoá vỉ thuốc thất bại!');
        } finally {
            setLoading(false);
        }
    };

    // Pagination logic
    const totalPages = Math.ceil(historyArr.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = historyArr.slice(startIndex, startIndex + itemsPerPage);

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    const goToPrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const formatDate = (str) => str ? new Date(str).toLocaleDateString('vi-VN') : '';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">Lịch sử các vỉ thuốc</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
                <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                                        Ngày bắt đầu
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                                        Ngày kết thúc
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                                        Loại vỉ
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                                        Tên thuốc
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                                        Ghi chú
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700">
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                                            Đang tải...
                                        </td>
                                    </tr>
                                ) : currentItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                                            Chưa có vỉ thuốc 
                                        </td>
                                    </tr>
                                ) : (
                                    currentItems.map(item => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="border border-gray-300 px-4 py-2 text-sm">{formatDate(item.startDate)}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-sm">{formatDate(item.endDate)}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-sm">{item.type || '-'}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-sm">{item.medicineName || '-'}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-sm whitespace-pre-line">
                                                {(typeof item.currentIndex === "number" && item.type && item.currentIndex + 1 < Number(item.type))
                                                    ? (
                                                        <>
                                                            <span className="text-red-600 font-semibold">
                                                                Bạn đã uống tới viên thứ {item.currentIndex + 1}/{item.type}
                                                            </span>
                                                            {item.note && item.note.trim() !== "" && (
                                                                <><br />{item.note}</>
                                                            )}
                                                        </>
                                                    )
                                                    : (item.note || '-')
                                                }
                                            </td>


                                            <td className="border border-gray-300 px-4 py-2">
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => handleEditNote(item)}
                                                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                                                        title="Chỉnh sửa ghi chú"
                                                        toast
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-4">
                            <button
                                onClick={goToPrevPage}
                                disabled={currentPage === 1}
                                className="p-2 rounded-full bg-pink-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-pink-600 transition-colors"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${page === currentPage
                                            ? 'bg-pink-500 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-full bg-pink-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-pink-600 transition-colors"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
                <div className="p-4 border-t bg-gray-50 flex justify-center items-center gap-4">
                    <button
                        onClick={onClose}
                        className="min-w-[100px] px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium"
                    >
                        Đóng
                    </button>
                </div>
                {/* Modal chỉnh sửa ghi chú */}
                {editingId && (
                    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
                        <div className="bg-white rounded-lg shadow-xl p-6 min-w-[320px] max-w-xs relative">
                            <button
                                onClick={() => setEditingId(null)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                            <h3 className="text-lg font-semibold mb-2">Ghi chú vỉ thuốc</h3>
                            <textarea
                                className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none"
                                rows={3}
                                value={noteValue}
                                onChange={e => setNoteValue(e.target.value)}
                                placeholder="Nhập ghi chú..."
                                maxLength={100}
                            />
                            <button
                                onClick={handleSaveNote}
                                className="w-full bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700 transition"
                                disabled={loading}
                            >
                                Lưu ghi chú
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PillHistoryManager;
