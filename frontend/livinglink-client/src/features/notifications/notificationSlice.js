import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  unreadCount: 0,
};

const isNotificationUnread = (n) => {
  if (n.isRead !== undefined) return !n.isRead;
  if (n.read !== undefined) return !n.read;
  return true;
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      const list = Array.isArray(action.payload) ? action.payload : [];
      state.notifications = list;
      state.unreadCount = list.filter(isNotificationUnread).length;
    },

    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (isNotificationUnread(action.payload)) {
        state.unreadCount += 1;
      }
    },

    markNotificationAsRead: (state, action) => {
      const id = action.payload;
      const notification = state.notifications.find((item) => item.id === id);
      if (notification && isNotificationUnread(notification)) {
        notification.isRead = true;
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach((n) => {
        n.isRead = true;
        n.read = true;
      });
      state.unreadCount = 0;
    },

    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
