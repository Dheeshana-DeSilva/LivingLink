import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Bell,
  Calendar,
  CheckCircle2,
  XCircle,
  Sparkles,
  Star,
  CheckCheck,
  Clock,
  ArrowRight,
} from "lucide-react";
import notificationService from "../services/notificationService";
import {
  setNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../features/notifications/notificationSlice";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";

function Notifications() {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector(
    (state) => state.notifications
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // 'all' or 'unread'
  const [markingAll, setMarkingAll] = useState(false);

  const isUnread = (n) => {
    if (n.isRead !== undefined) return !n.isRead;
    if (n.read !== undefined) return !n.read;
    return false;
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await notificationService.getMyNotifications();
      dispatch(setNotifications(Array.isArray(data) ? data : []));
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to load notifications. Please check if notification-service is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      dispatch(markNotificationAsRead(id));
      await notificationService.markAsRead(id);
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAll(true);
      dispatch(markAllNotificationsAsRead());
      await notificationService.markAllAsRead(notifications);
    } catch (err) {
      console.error("Failed to mark all as read", err);
    } finally {
      setMarkingAll(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "VISIT_REQUEST":
        return {
          icon: Calendar,
          color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
          label: "Visit Request",
        };
      case "VISIT_ACCEPTED":
        return {
          icon: CheckCircle2,
          color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          label: "Visit Accepted",
        };
      case "VISIT_REJECTED":
        return {
          icon: XCircle,
          color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
          label: "Visit Declined",
        };
      case "VISIT_CANCELLED":
        return {
          icon: Clock,
          color: "text-slate-400 bg-slate-800 border-slate-700",
          label: "Visit Cancelled",
        };
      case "MATCH_FOUND":
        return {
          icon: Sparkles,
          color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
          label: "New Roommate Match",
        };
      case "REVIEW_RECEIVED":
        return {
          icon: Star,
          color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
          label: "Review Received",
        };
      default:
        return {
          icon: Bell,
          color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
          label: "Notification",
        };
    }
  };

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateStr;
    }
  };

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter(isUnread)
      : notifications;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-slate-800 p-8 sm:p-10 shadow-2xl overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-3">
                <Bell size={14} /> Real-Time Alerts
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
                Notifications
              </h1>
              <p className="text-sm sm:text-base text-slate-300">
                Stay updated on visit schedules, roommate match alerts, and listing activities.
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={markingAll}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-blue-400 border border-blue-500/20 text-xs font-semibold transition-all disabled:opacity-50"
              >
                <CheckCheck size={16} />
                <span>{markingAll ? "Marking..." : "Mark all as read"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-colors ${
                filter === "all"
                  ? "border-b-2 border-blue-500 text-blue-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-t-xl transition-colors ${
                filter === "unread"
                  ? "border-b-2 border-blue-500 text-blue-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>Unread</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 bg-blue-500/20 text-blue-400 text-[10px] rounded-full font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={loadNotifications}
            className="text-xs text-blue-400 hover:underline"
          >
            Refresh
          </button>
        </div>

        {/* Loading State */}
        {loading && <Loading message="Loading notifications..." />}

        {/* Error State */}
        {!loading && error && (
          <ErrorMessage message={error} onRetry={loadNotifications} />
        )}

        {/* Empty State */}
        {!loading && !error && filteredNotifications.length === 0 && (
          <EmptyState
            icon={<Bell size={48} />}
            title={
              filter === "unread"
                ? "No unread notifications"
                : "You have no notifications"
            }
            description={
              filter === "unread"
                ? "You are all caught up! Switch to 'All' to review earlier notifications."
                : "When you receive visit requests or roommate match alerts, they will appear right here."
            }
            action={
              <Link
                to="/accommodations"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                <span>Browse Accommodations</span>
                <ArrowRight size={14} />
              </Link>
            }
          />
        )}

        {/* Notifications List */}
        {!loading && !error && filteredNotifications.length > 0 && (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const unread = isUnread(notification);
              const { icon: TypeIcon, color, label } = getNotificationIcon(
                notification.type
              );

              return (
                <div
                  key={notification.id}
                  onClick={() => unread && handleMarkAsRead(notification.id)}
                  className={`p-5 rounded-2xl border transition-all duration-200 flex items-start gap-4 cursor-pointer ${
                    unread
                      ? "bg-slate-900/90 border-blue-500/30 shadow-lg shadow-blue-500/5 hover:border-blue-500/50"
                      : "bg-slate-900/40 border-slate-800/70 hover:bg-slate-900/70"
                  }`}
                >
                  {/* Notification Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${color}`}
                  >
                    <TypeIcon size={18} />
                  </div>

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-300">
                          {label}
                        </span>
                        {unread && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            NEW
                          </span>
                        )}
                      </div>

                      {notification.createdAt && (
                        <span className="text-[11px] text-slate-500 shrink-0">
                          {formatTimestamp(notification.createdAt)}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-slate-200 mt-1.5 leading-relaxed">
                      {notification.message}
                    </p>
                  </div>

                  {/* Unread indicator dot */}
                  {unread && (
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 mt-1.5 shadow-sm shadow-blue-500" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;