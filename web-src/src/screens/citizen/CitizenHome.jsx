// Citizen dashboard: built from what the backend actually exposes for a user -
// GET /user/getAllComplaints/:id (currently open complaints; the backend deletes a
// complaint once it is marked "completed", so there is no "resolved" list here,
// only a notification saying it was resolved) and GET /notification/getNotifications/:id.
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoAddCircle, IoCheckmarkDone, IoDocumentText, IoTime } from 'react-icons/io5';
import StatTile from '../../components/StatTile';
import ComplaintListItem from '../../components/ComplaintListItem';
import EmptyState from '../../components/EmptyState';
import Spinner from '../../components/Spinner';
import { COLORS, ROUTES } from '../../constants';
import { VIZ } from '../../constants/viz';
import { useStore } from '../../store';
import useApi from '../../hooks/useApi';
import api from '../../api/client';
import { byNewest, firstName, formatNotificationTime } from '../../utils/format';

const CitizenHome = () => {
  const navigate = useNavigate();
  const { userId, userFullName, notificationId } = useStore();

  const { data: complaints, loading: loadingComplaints } = useApi(async () => {
    const r = await api.get(`/user/getAllComplaints/${userId}`);
    return r.data.complaints || [];
  }, [userId]);

  const { data: notifications, loading: loadingNotifs } = useApi(async () => {
    const r = await api.get(`/notification/getNotifications/${notificationId}`);
    return (r.data.data || []).slice().sort(byNewest);
  }, [notificationId]);

  const stats = useMemo(() => {
    const list = complaints || [];
    return {
      open: list.length,
      pending: list.filter((c) => c.status === 'pending').length,
      inProgress: list.filter((c) => c.status === 'in-progress').length,
    };
  }, [complaints]);

  return (
    <div>
      <div className="page-title-row" style={{ paddingTop: 20 }}>
        <div>
          <div className="page-title">Hello, {firstName(userFullName)}</div>
          <div className="page-subtitle" style={{ padding: 0, marginTop: 2 }}>
            Track and raise government service complaints
          </div>
        </div>
      </div>

      <div style={{ padding: '10px 20px' }}>
        <button
          type="button"
          className="touchable btn-navy"
          style={{ width: '100%', padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          onClick={() => navigate(ROUTES.CITIZEN_NEW_COMPLAINT)}
        >
          <IoAddCircle size={20} color="#fff" />
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Raise a New Complaint</span>
        </button>
      </div>

      <div className="stat-tile-row" style={{ marginTop: 4 }}>
        <StatTile label="Open Complaints" value={stats.open} Icon={IoDocumentText} color={COLORS.navy} />
        <StatTile label="Pending" value={stats.pending} Icon={IoTime} color={VIZ.status.warning} />
        <StatTile label="In Progress" value={stats.inProgress} Icon={IoCheckmarkDone} color={VIZ.sequentialBlue.light} />
      </div>

      <div className="dash-section">
        <div className="dash-section-title">
          <span>Recent Complaints</span>
          {!!(complaints && complaints.length) && (
            <button type="button" className="touchable link-btn" onClick={() => navigate(ROUTES.CITIZEN_COMPLAINTS)}>
              View all
            </button>
          )}
        </div>
        {loadingComplaints && <Spinner label="Loading your complaints…" />}
        {!loadingComplaints && !complaints?.length && (
          <EmptyState Icon={IoDocumentText} title="No open complaints" subtitle="Raise a complaint and it will show up here." />
        )}
        {!loadingComplaints && complaints?.slice(0, 3).map((c) => <ComplaintListItem key={c.complaint_id} complaint={c} />)}
      </div>

      <div className="dash-section" style={{ paddingBottom: 20 }}>
        <div className="dash-section-title">
          <span>Recent Notifications</span>
          {!!(notifications && notifications.length) && (
            <button type="button" className="touchable link-btn" onClick={() => navigate(ROUTES.CITIZEN_NOTIFICATIONS)}>
              View all
            </button>
          )}
        </div>
        {loadingNotifs && <Spinner label="Loading notifications…" />}
        {!loadingNotifs && !notifications?.length && <EmptyState title="No notifications yet" />}
        <div className="panel">
          {!loadingNotifs &&
            notifications?.slice(0, 3).map((n, i) => (
              <div key={n.id} className="notif-row" style={{ borderTop: i === 0 ? 'none' : undefined }}>
                <div className="notif-message">{n.message}</div>
                <div className="notif-time">{formatNotificationTime(n)}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CitizenHome;
