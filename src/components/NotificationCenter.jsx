import React, { useState, useEffect, useRef, useContext } from 'react';
import { Bell, X, RefreshCw, AlertCircle, Info, Calendar, Heart, Clock, AlertTriangle, Star } from 'lucide-react';
import NotificationService from '../services/NotificationService';
import { UserContext } from '../UserContext';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authError, setAuthError] = useState(false);
  
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
      
      const formattedNotifications = apiNotifications.map(notif => 
        NotificationService.formatNotificationForUI(notif)
      );

      setNotifications(formattedNotifications);
      
      if (!silent) {
        console.log('✅ Loaded notifications successfully');
      }
    } catch (error) {
      console.error('❌ Error loading notifications:', error);
      
      if (error.message.includes('đăng nhập')) {
        setAuthError(true);
        setError('Vui lòng đăng nhập lại');
      } else {
        setError('Không thể tải thông báo');
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
    try {
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, isRead: true }
            : notification
        )
      );

      await NotificationService.markAsRead(id);
    } catch (error) {
      console.error('❌ Error marking as read:', error);
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, isRead: false }
            : notification
        )
      );
      
      if (error.message.includes('đăng nhập')) {
        setAuthError(true);
      }
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );

      await NotificationService.markAllAsRead(user.userId);
    } catch (error) {
      console.error('❌ Error marking all as read:', error);
      loadNotifications();
      
      if (error.message.includes('đăng nhập')) {
        setAuthError(true);
      }
    }
  };

  const removeNotification = async (id) => {
    try {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
      await NotificationService.deleteNotification(id);
    } catch (error) {
      console.error('❌ Error deleting notification:', error);
      loadNotifications();
      
      if (error.message.includes('đăng nhập')) {
        setAuthError(true);
      }
    }
  };

  const getNotificationIcon = (notification) => {
    const iconMap = {
      Clock,
      Heart,
      Calendar,
      Info,
      AlertCircle,
      Star
    };
    
    const IconComponent = iconMap[notification.icon] || Info;
    return <IconComponent className={`w-5 h-5 ${notification.color}`} />;
  };

  if (!user) {
    return null;
  }

  return (
    <div className="relative">
      {/* Notification Button */}
      <button
        ref={buttonRef}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            loadNotifications();
          }
        }}
        className={`relative p-3 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-200 transform hover:scale-110 ${
          authError 
            ? 'hover:bg-red-50 text-red-500 shadow-lg hover:shadow-red-200' 
            : 'hover:bg-gradient-to-br hover:from-pink-50 hover:to-purple-50 text-gray-700 hover:text-pink-600 shadow-lg hover:shadow-pink-200'
        }`}
        aria-label="Thông báo"
      >
        <Bell className="w-6 h-6" />
        
        {/* Unread Count Badge */}
        {unreadCount > 0 && !authError && (
          <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 via-red-500 to-pink-600 text-white text-xs rounded-full min-w-[22px] h-[22px] flex items-center justify-center font-bold shadow-lg animate-pulse border-2 border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        
        {/* Error Indicator */}
        {authError && (
          <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-[22px] h-[22px] flex items-center justify-center font-bold shadow-lg border-2 border-white">
            !
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-16 w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-300 backdrop-blur-lg"
        >
          {/* Header */}
          <div className={`px-6 py-5 border-b border-gray-100 ${
            authError 
              ? 'bg-gradient-to-r from-red-50 via-orange-50 to-red-50' 
              : 'bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Thông báo
                </h3>
                {unreadCount > 0 && !authError && (
                  <p className="text-sm text-gray-600 mt-1">
                    {unreadCount} thông báo chưa đọc
                  </p>
                )}
                {error && (
                  <p className={`text-sm mt-1 font-medium ${authError ? 'text-red-600' : 'text-red-500'}`}>
                    {error}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
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
                        className="text-xs text-pink-600 hover:text-pink-700 font-semibold transition-colors px-3 py-2 rounded-xl hover:bg-pink-100"
                      >
                        Đánh dấu tất cả
                      </button>
                    )}
                  </>
                )}
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
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
                <button
                  onClick={() => loadNotifications()}
                  className="text-sm text-pink-600 hover:text-pink-700 font-semibold px-4 py-2 rounded-xl hover:bg-pink-50 transition-all duration-200"
                >
                  Tải lại
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-6 py-5 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200 cursor-pointer group ${
                      !notification.isRead ? 'bg-gradient-to-r from-pink-25 via-purple-25 to-indigo-25 border-l-4 border-pink-400' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`p-3 rounded-2xl ${notification.bgColor} flex-shrink-0 shadow-sm`}>
                        {getNotificationIcon(notification)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={`text-sm font-bold ${
                              !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-3 flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              {notification.time}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 ml-3">
                            {!notification.isRead && (
                              <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full shadow-sm"></div>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                              }}
                              className="p-2 hover:bg-red-100 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100 transform hover:scale-110"
                            >
                              <X className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && !authError && (
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-100 rounded-b-3xl">
              <button 
                onClick={() => loadNotifications()}
                className="w-full text-center text-sm text-pink-600 hover:text-pink-700 font-semibold transition-colors py-2 rounded-xl hover:bg-white"
              >
                Tải lại thông báo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
