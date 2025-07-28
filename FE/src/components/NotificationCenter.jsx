import React, { useState, useEffect, useRef, useContext } from 'react';
import { Bell, X, RefreshCw, AlertCircle, Info, Calendar, Heart, Clock, AlertTriangle, Star } from 'lucide-react';
import NotificationService from '../services/NotificationService';
import { UserContext } from '../UserContext';
import { toast } from 'react-toastify';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authError, setAuthError] = useState(false);
  const [justReceived, setJustReceived] = useState(null);
  const { user } = useContext(UserContext);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    if (user && user.userId) {
      loadNotifications();
    }
  }, [user]);

  useEffect(() => {
    if (user && user.userId) {
      const interval = setInterval(() => {
        loadNotifications(true);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifications = async (silent = false) => {
    if (!user || !user.userId) return;
    try {
      if (!silent) setLoading(true);
      setError(null);
      setAuthError(false);

      if (!NotificationService.isTokenValid()) {
        setAuthError(true);
        setError('Phiên đăng nhập đã hết hạn');
        return;
      }

      const apiNotifications = await NotificationService.getUserNotifications(user.userId);
      console.log('API notifications:', apiNotifications);

      const formattedNotifications = apiNotifications.map(notif =>
        NotificationService.formatNotificationForUI(notif)
      );
      console.log('Formatted notifications:', formattedNotifications);

      if (notifications.length > 0 && formattedNotifications[0]?.id !== notifications[0]?.id) {
        setJustReceived(formattedNotifications[0].id);
        setTimeout(() => setJustReceived(null), 2000);
      }
      setNotifications(formattedNotifications);

      if (!silent) {
        console.log('✅ Loaded notifications successfully');
      }
    } catch (error) {
      console.error('❌ Error loading notifications:', error);
      if (error.message?.includes('đăng nhập')) {
        setAuthError(true);
        setError('Vui lòng đăng nhập lại');
      } else {
        setError('Hiện tại chưa có thông báo mới');
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    localStorage.removeItem('jwt_token');
    window.location.href = '/login';
  };

  const markAsRead = async (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, loading: true }
          : notification
      )
    );
    try {
      await NotificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id
            ? { ...notification, isRead: true, loading: false }
            : notification
        )
      );
      toast.success('Đã đánh dấu thông báo là đã đọc');
    } catch (error) {
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id
            ? { ...notification, loading: false }
            : notification
        )
      );
      if (error.message?.includes('đăng nhập')) setAuthError(true);
      toast.error('Đánh dấu thất bại!');
    }
  };

  const markAllAsRead = async () => {
    setLoading(true);
    try {
      await NotificationService.markAllAsRead(user.userId);
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      toast.success('Tất cả thông báo đã được đánh dấu đã đọc!');
    } catch (error) {
      toast.error('Lỗi khi đánh dấu tất cả!');
      loadNotifications();
      if (error.message?.includes('đăng nhập')) setAuthError(true);
    } finally {
      setLoading(false);
    }
  };

  const removeNotification = async (id) => {
    try {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
      await NotificationService.deleteNotification(id);
      toast.success('Đã xóa thông báo');
    } catch (error) {
      toast.error('Xóa thông báo thất bại!');
      loadNotifications();
      if (error.message?.includes('đăng nhập')) setAuthError(true);
    }
  };

  const getNotificationIcon = () => <Info className="w-5 h-5 text-gray-600" />;


  if (!user) return null;

  return (
    <div className="relative">
      {/* Nút chuông thông báo */}
      <button
        ref={buttonRef}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) loadNotifications();
        }}
        className={`relative p-3 rounded-full transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-pink-300 transform hover:scale-110 ${authError
          ? 'hover:bg-red-50 text-red-600 shadow-md hover:shadow-red-200'
          : 'hover:bg-gradient-to-br hover:from-pink-100 hover:to-purple-200 text-gray-700 hover:text-pink-600 shadow-md hover:shadow-pink-300'
          } ${unreadCount > 0 ? 'animate-pulse' : ''}`}
        aria-label="Thông báo"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && !authError && (
          <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-600 via-red-600 to-pink-700 text-white text-xs rounded-full min-w-[22px] h-[22px] flex items-center justify-center font-bold shadow-lg border-2 border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        {authError && (
          <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs rounded-full w-[22px] h-[22px] flex items-center justify-center font-bold shadow-lg border-2 border-white">
            !
          </span>
        )}
      </button>

      {/* Khung thông báo dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-14 w-96 bg-white rounded-3xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-300 backdrop-blur-md"
        >
          {/* Header */}
          <div className={`px-6 py-4 border-b border-gray-200 ${authError
            ? 'bg-gradient-to-r from-red-50 via-orange-50 to-red-50'
            : 'bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50'
            }`}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xl font-semibold text-gray-900 whitespace-nowrap">
                Thông báo
              </h3>
              <div className="flex items-center gap-2 ml-4">
                {authError ? (
                  <button
                    onClick={handleLoginRedirect}
                    className="text-sm text-red-600 hover:text-red-700 font-semibold transition-colors px-4 py-2 rounded-xl hover:bg-red-100"
                  >
                    Đăng nhập lại
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => loadNotifications()}
                      disabled={loading}
                      className="p-2 hover:bg-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                      title="Tải lại"
                    >
                      <RefreshCw className={`w-5 h-5 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
                    </button>

                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        disabled={loading}
                        className="text-xs text-pink-600 hover:text-pink-700 font-semibold transition-colors px-3 py-2 rounded-xl hover:bg-pink-100 whitespace-nowrap"
                      >
                        Đánh dấu tất cả
                      </button>
                    )}
                  </>
                )}

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                  title="Đóng"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Số lượng thông báo chưa đọc, để riêng bên dưới, ẩn khi không có */}
            {unreadCount > 0 && !authError && (
              <p className="text-sm text-gray-600 mt-1 ml-1">
                {unreadCount} chưa đọc
              </p>
            )}

            {error && (
              <p className={`text-sm mt-1 font-medium ${authError ? 'text-red-600' : 'text-red-500'}`}>
                {error}
              </p>
            )}
          </div>


          {/* Danh sách thông báo */}
          <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-gray-100">
            {authError ? (
              <div className="px-6 py-10 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-red-600 mb-4 font-semibold text-lg">Phiên đăng nhập đã hết hạn</p>
                <button
                  onClick={handleLoginRedirect}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Đăng nhập lại
                </button>
              </div>
            ) : loading ? (
              <div className="px-6 py-10 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="w-8 h-8 text-pink-500 animate-spin" />
                </div>
                <p className="text-gray-500 font-medium">Đang tải thông báo...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-4 font-medium">Không có thông báo nào</p>
                
              </div>
            ) : (
              <div>
                {notifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    className={`px-6 py-4 flex items-start gap-4 cursor-pointer group transition-all duration-200 ${!notification.isRead
                      ? 'bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 hover:from-pink-100 hover:via-purple-100 hover:to-indigo-100'
                      : 'hover:bg-gray-50'
                      } ${justReceived === notification.id ? 'animate-pulse' : ''}`}
                    onClick={() => !notification.isRead && !notification.loading && markAsRead(notification.id)}
                  >
                    <div className={`p-2.5 rounded-full flex-shrink-0 shadow-sm ${!notification.isRead
                      ? 'bg-gradient-to-br from-pink-100 to-purple-100'
                      : 'bg-gray-100'
                      }`}>
                      {getNotificationIcon(notification)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1 leading-tight">
                        {notification.title || 'Thông báo'}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed mb-2">
                        {notification.message}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                      disabled={notification.loading}
                      className={`p-2 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 hover:bg-red-100 ${notification.loading ? 'cursor-wait opacity-50' : ''
                        }`}
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>


        </div>
      )}
    </div>
  );
};

export default NotificationCenter;