import api from "./api";

/**
 * Notification Service
 * Connects to notification-service via API Gateway at /api/notifications
 */

/**
 * Get all notifications for the current user (ordered newest first)
 * GET /api/notifications/me
 */
export const getMyNotifications = async () => {
  const response = await api.get("/api/notifications/me");
  return Array.isArray(response.data) ? response.data : [];
};

/**
 * Get unread notifications for the current user
 */
export const getUnreadNotifications = async () => {
  const all = await getMyNotifications();
  return Array.isArray(all)
    ? all.filter((n) => (n.isRead !== undefined ? !n.isRead : !n.read))
    : [];
};

/**
 * Mark a single notification as read
 * PUT /api/notifications/{id}/read
 */
export const markAsRead = async (id) => {
  const response = await api.put(`/api/notifications/${id}/read`);
  return response.data;
};

/**
 * Mark all notifications as read for the current user
 * Iterates unread notification IDs if bulk endpoint is not defined
 */
export const markAllAsRead = async (unreadList = []) => {
  if (Array.isArray(unreadList) && unreadList.length > 0) {
    const unreadIds = unreadList
      .filter((n) => (n.isRead !== undefined ? !n.isRead : !n.read))
      .map((n) => n.id);

    await Promise.allSettled(
      unreadIds.map((id) => api.put(`/api/notifications/${id}/read`))
    );
    return true;
  }

  // Fallback: fetch current unread and mark each as read
  try {
    const unread = await getUnreadNotifications();
    await Promise.allSettled(
      unread.map((n) => api.put(`/api/notifications/${n.id}/read`))
    );
    return true;
  } catch (err) {
    console.error("Failed to mark all notifications as read", err);
    return false;
  }
};

const notificationService = {
  getMyNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
};

export default notificationService;
