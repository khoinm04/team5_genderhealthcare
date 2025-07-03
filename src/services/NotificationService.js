import axios from "axios";

class NotificationService {
  constructor() {
    this.baseURL = 'http://localhost:8080/gender-health-care';
  }

  // Check if token is valid (giữ nguyên)
  isTokenValid() {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  getToken() {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        return parsedUser.token;
      } catch (error) {
        return null;
      }
    }
    return localStorage.getItem('jwt_token');
  }

  // 1. Lấy danh sách thông báo
  async getUserNotifications(userId) {
    try {
      const token = this.getToken();
      if (!token) throw new Error('Vui lòng đăng nhập để xem thông báo');

      const response = await axios.get(
        `${this.baseURL}/notifications/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Nếu trả về dạng List<Notification>, FE sẽ nhận được response.data là array
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  // 2. Đánh dấu 1 thông báo là đã đọc
  async markAsRead(notificationId) {
    try {
      const token = this.getToken();
      if (!token) throw new Error('Vui lòng đăng nhập để thực hiện thao tác này');

      const response = await axios.put(
        `${this.baseURL}/notifications/${notificationId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // 3. Đánh dấu tất cả là đã đọc
  async markAllAsRead(userId) {
    try {
      const token = this.getToken();
      if (!token) throw new Error('Vui lòng đăng nhập để thực hiện thao tác này');

      const response = await axios.put(
        `${this.baseURL}/notifications/user/${userId}/read-all`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // 4. Xóa notification
  async deleteNotification(notificationId) {
    try {
      const token = this.getToken();
      if (!token) throw new Error('Vui lòng đăng nhập để thực hiện thao tác này');

      const response = await axios.delete(
        `${this.baseURL}/notifications/${notificationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Các hàm format UI giữ nguyên
  formatNotificationForUI(notification) {
    const typeConfig = {
      appointment: {
        icon: 'Calendar',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      },
      result: {
        icon: 'Heart',
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      },
      reminder: {
        icon: 'Clock',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100'
      },
      info: {
        icon: 'Info',
        color: 'text-purple-600',
        bgColor: 'bg-purple-100'
      },
      promotion: {
        icon: 'Star',
        color: 'text-pink-600',
        bgColor: 'bg-pink-100'
      },
      default: {
        icon: 'Info',
        color: 'text-gray-600',
        bgColor: 'bg-gray-100'
      }
    };

    const config = typeConfig[notification.type] || typeConfig.default;
    return {
      ...notification,
      ...config,
      time: this.formatTime(notification.createdAt)
    };
  }

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

  // FE có thể tự đếm số lượng notification từ array trả về
  async getNotificationCount(userId) {
    try {
      const notifications = await this.getUserNotifications(userId);
      return {
        total: notifications.length,
        unread: notifications.filter(n => !n.isRead).length
      };
    } catch (error) {
      console.error('Error getting notification count:', error);
      return { total: 0, unread: 0 };
    }
  }
}

export default new NotificationService();
