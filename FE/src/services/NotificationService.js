// NotificationService.js
import axios from "axios";

class NotificationService {
  constructor() {
    // Lấy baseURL từ biến môi trường, fallback nếu chưa config
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/Notifications';
  }

  // Hàm xử lý lỗi tổng quát cho mọi API
  handleError(error, context = '') {
    console.error(`❌ Error ${context}:`, error);
    // Nếu lỗi xác thực thì tự động logout
    if (error?.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    // Ưu tiên lấy message rõ ràng từ backend nếu có
    let msg = error?.response?.data?.message || error.message || "Đã xảy ra lỗi";
    throw new Error(msg);
  }

  // Kiểm tra JWT còn hạn không
  isTokenValid() {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  // Lấy JWT token từ localStorage
  getToken() {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        return parsedUser.token;
      } catch {
        return null;
      }
    }
    return localStorage.getItem('jwt_token');
  }

  // 1. Lấy danh sách thông báo của user
  async getUserNotifications(userId) {
    try {
      const token = this.getToken();
      if (!token) throw new Error('Vui lòng đăng nhập để xem thông báo');
      const response = await axios.get(
        `${this.baseURL}/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      this.handleError(error, "fetching notifications");
    }
  }

  // 2. Đánh dấu một thông báo là đã đọc
  async markAsRead(notificationId) {
    try {
      const token = this.getToken();
      if (!token) throw new Error('Vui lòng đăng nhập để thực hiện thao tác này');
      const response = await axios.patch(
        `${this.baseURL}/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      this.handleError(error, "marking notification as read");
    }
  }

  // 3. Đánh dấu tất cả thông báo là đã đọc
  async markAllAsRead(userId) {
    try {
      const token = this.getToken();
      if (!token) throw new Error('Vui lòng đăng nhập để thực hiện thao tác này');
      const response = await axios.patch(
        `${this.baseURL}/user/${userId}/mark-all-read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      this.handleError(error, "marking all notifications as read");
    }
  }

  // 4. Xóa một thông báo
  async deleteNotification(notificationId) {
    try {
      const token = this.getToken();
      if (!token) throw new Error('Vui lòng đăng nhập để thực hiện thao tác này');
      const response = await axios.delete(
        `${this.baseURL}/${notificationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      this.handleError(error, "deleting notification");
    }
  }

  // 5. (Optional) Xóa tất cả thông báo đã đọc nếu backend hỗ trợ
  async clearAllRead(userId) {
    try {
      const token = this.getToken();
      if (!token) throw new Error('Vui lòng đăng nhập để thực hiện thao tác này');
      const response = await axios.delete(
        `${this.baseURL}/user/${userId}/read-all`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      this.handleError(error, "clearing all read notifications");
    }
  }

  // Hàm format dữ liệu notification cho UI (icon, màu sắc...)
  // NotificationService.js
  formatNotificationForUI(notification) {
    return {
      ...notification,
      id: notification.notificationId,
      icon: 'Info',             // icon mặc định
      color: 'text-gray-600',   // màu mặc định
      bgColor: 'bg-gray-100',   // nền mặc định
      title: notification.title || 'Thông báo',  // dùng title từ backend hoặc 'Thông báo'
      time: this.formatTime(notification.createdAt)
    };
  }





  // Hàm định dạng thời gian cho thông báo
  formatTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInMinutes < 1) {
      return 'Vừa xong';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else if (diffInDays < 7) {
      return `${diffInDays} ngày trước`;
    } else {
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  }

  // 6. Hàm đếm số lượng thông báo (tổng và chưa đọc)
  async getNotificationCount(userId) {
    try {
      const notifications = await this.getUserNotifications(userId);
      return {
        total: notifications.length,
        unread: notifications.filter(n => !n.isRead).length
      };
    } catch (error) {
      this.handleError(error, "getting notification count");
      return { total: 0, unread: 0 };
    }
  }
}

export default new NotificationService();
