// GET /user/getAllComplaints/:id. Only pending/in-progress complaints can ever
// appear here - the backend deletes a complaint the moment it is marked "completed"
// (GovServiceAppBackend/controllers/agentController.js changeStatus), so a resolved
// complaint's only remaining trace is the notification saying it was closed.
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoAddCircle, IoDocumentText } from 'react-icons/io5';
import ComplaintListItem from '../../components/ComplaintListItem';
import ComplaintMap from '../../components/charts/ComplaintMap';
import EmptyState from '../../components/EmptyState';
import Spinner from '../../components/Spinner';
import { ROUTES } from '../../constants';
import { STATUS_META } from '../../constants/viz';
import { jitteredLatLng } from '../../data/pincodeGeo';
import { useStore } from '../../store';
import useApi from '../../hooks/useApi';
import api from '../../api/client';
import { byNewest } from '../../utils/format';

const FILTERS = ['All', 'Pending', 'In Progress'];
const FILTER_STATUS = { Pending: 'pending', 'In Progress': 'in-progress' };
const VIEWS = ['List', 'Map'];

const MyComplaints = () => {
  const navigate = useNavigate();
  const { userId } = useStore();
  const [filter, setFilter] = useState('All');
  const [view, setView] = useState('List');

  const { data: complaints, loading } = useApi(async () => {
    const r = await api.get(`/user/getAllComplaints/${userId}`);
    return (r.data.complaints || []).slice().sort(byNewest);
  }, [userId]);

  const filtered = useMemo(() => {
    if (!complaints) return [];
    if (filter === 'All') return complaints;
    return complaints.filter((c) => c.status === FILTER_STATUS[filter]);
  }, [complaints, filter]);

  // Locations are approximate (pincode-area centroids) - see src/data/pincodeGeo.js.
  const statusPoints = useMemo(
    () =>
      filtered.map((c) => ({
        ...jitteredLatLng(c.complaint_pincode, c.complaint_id),
        complaint_id: c.complaint_id,
        sector: c.sector,
        label: STATUS_META[c.status]?.label || c.status,
        color: STATUS_META[c.status]?.color || '#52514e',
      })),
    [filtered],
  );

  return (
    <div>
      <div className="page-title-row">
        <span className="page-title">My Complaints</span>
      </div>
      <div className="page-subtitle">Resolved complaints move to your notifications once closed.</div>

      <div className="filter-row">
        {FILTERS.map((f) => (
          <button key={f} type="button" className={`filter-chip${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
        <span style={{ flex: 1 }} />
        {VIEWS.map((v) => (
          <button key={v} type="button" className={`filter-chip${view === v ? ' active' : ''}`} onClick={() => setView(v)}>
            {v}
          </button>
        ))}
      </div>

      <div className="dash-section" style={{ paddingBottom: 24 }}>
        {loading && <Spinner label="Loading your complaints…" />}
        {!loading && !filtered.length && (
          <EmptyState Icon={IoDocumentText} title="Nothing here" subtitle="Complaints you raise will appear in this list." />
        )}
        {!loading && !!filtered.length && view === 'List' && (
          <div className="tile-grid">
            {filtered.map((c) => <ComplaintListItem key={c.complaint_id} complaint={c} />)}
          </div>
        )}
        {!loading && !!filtered.length && view === 'Map' && (
          <div className="panel" style={{ padding: 12 }}>
            <ComplaintMap statusPoints={statusPoints} height={320} />
          </div>
        )}
      </div>

      <button
        type="button"
        className="touchable fab"
        aria-label="Raise a new complaint"
        onClick={() => navigate(ROUTES.CITIZEN_NEW_COMPLAINT)}
      >
        <IoAddCircle size={26} />
      </button>
    </div>
  );
};

export default MyComplaints;
