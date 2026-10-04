// Shared by citizen, officer and admin - all three hit the same
// GET /notification/getNotifications/:notification_id and
// DELETE /notification/deleteNotification/:id (GovServiceAppBackend/controllers/notificationController.js).
import React from 'react';
import { IoNotifications, IoTrashOutline } from 'react-icons/io5';
import EmptyState from '../../components/EmptyState';
import Spinner from '../../components/Spinner';
import { useAlert } from '../../components/Alert';
import useApi from '../../hooks/useApi';
import api from '../../api/client';
import { byNewest, formatNotificationTime } from '../../utils/format';

const NotificationsScreen = ({ notificationId, title = 'Notifications' }) => {
  const { alert } = useAlert();
  const { data: notifications, loading, reload } = useApi(async () => {
    const r = await api.get(`/notification/getNotifications/${notificationId}`);
    return (r.data.data || []).slice().sort(byNewest);
  }, [notificationId]);

  async function remove(id) {
    try {
      await api.delete(`/notification/deleteNotification/${id}`);
      reload();
    } catch (error) {
      console.log(error);
      alert(' ', 'Could not delete the notification.');
    }
  }

  return (
    <div>
      <div className="page-title-row">
        <span className="page-title">{title}</span>
      </div>

      <div className="dash-section" style={{ paddingBottom: 24 }}>
        {loading && <Spinner label="Loading notifications…" />}
        {!loading && !notifications?.length && <EmptyState Icon={IoNotifications} title="No notifications yet" />}
        {!loading && !!notifications?.length && (
          <div className="panel">
            {notifications.map((n) => (
              <div key={n.id} className="notif-row">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="notif-message">{n.message}</div>
                  <div className="notif-time">{formatNotificationTime(n)}</div>
                </div>
                <button type="button" className="touchable" aria-label="Delete notification" onClick={() => remove(n.id)}>
                  <IoTrashOutline size={17} color="#b3413f" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsScreen;
