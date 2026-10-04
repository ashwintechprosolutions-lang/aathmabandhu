// Read-only - ComplaintListItem is given no `right` prop, so no action buttons
// render (it's the same component AdminComplaints/OfficerDashboard use; it only
// shows actions when the caller passes them).
import React, { useMemo, useState } from 'react';
import { IoDocumentText } from 'react-icons/io5';
import ComplaintListItem from '../../components/ComplaintListItem';
import EmptyState from '../../components/EmptyState';
import Spinner from '../../components/Spinner';
import { useStore } from '../../store';
import useApi from '../../hooks/useApi';
import api from '../../api/client';
import { byNewest } from '../../utils/format';

const FILTERS = ['All', 'Pending', 'In Progress'];
const FILTER_STATUS = { Pending: 'pending', 'In Progress': 'in-progress' };

const SupervisorComplaints = () => {
  const { monitorsSector } = useStore();
  const [filter, setFilter] = useState('All');
  const { data: complaints, loading } = useApi(async () => (await api.get('/complaint/getAllComplaints')).data.complaints || [], []);

  const scoped = useMemo(() => {
    const rows = monitorsSector ? (complaints || []).filter((c) => c.sector === monitorsSector) : complaints || [];
    return rows.slice().sort(byNewest);
  }, [complaints, monitorsSector]);

  const filtered = useMemo(() => {
    if (filter === 'All') return scoped;
    return scoped.filter((c) => c.status === FILTER_STATUS[filter]);
  }, [scoped, filter]);

  return (
    <div>
      <div className="page-title-row">
        <span className="page-title">Complaints</span>
      </div>
      <div className="page-subtitle">{monitorsSector ? `${monitorsSector} department (read-only)` : 'All departments (read-only)'}</div>

      <div className="filter-row">
        {FILTERS.map((f) => (
          <button key={f} type="button" className={`filter-chip${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      <div className="dash-section" style={{ paddingBottom: 24 }}>
        {loading && <Spinner label="Loading complaints…" />}
        {!loading && !filtered.length && <EmptyState Icon={IoDocumentText} title="Nothing here" />}
        {!loading && !!filtered.length && (
          <div className="tile-grid">
            {filtered.map((c) => <ComplaintListItem key={c.complaint_id} complaint={c} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupervisorComplaints;
