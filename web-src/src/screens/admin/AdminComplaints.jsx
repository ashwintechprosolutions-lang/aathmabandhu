// GET /complaint/getAllComplaints - every open complaint in the system. The backend
// has no auth middleware on /agent/changeStatus (a gap noted in the agent brief), so
// an admin can move any complaint along exactly like the assigned officer can.
import React, { useMemo, useState } from 'react';
import { IoDocumentText } from 'react-icons/io5';
import ComplaintListItem from '../../components/ComplaintListItem';
import EmptyState from '../../components/EmptyState';
import Spinner from '../../components/Spinner';
import Select from '../../components/Select';
import { useAlert } from '../../components/Alert';
import { COLORS, SECTORS } from '../../constants';
import useApi from '../../hooks/useApi';
import api from '../../api/client';
import { byNewest } from '../../utils/format';

const STATUS_FILTERS = ['All', 'Pending', 'In Progress'];
const STATUS_MAP = { Pending: 'pending', 'In Progress': 'in-progress' };

const AdminComplaints = () => {
  const { alert } = useAlert();
  const [sector, setSector] = useState('');
  const [status, setStatus] = useState('All');
  const [busyId, setBusyId] = useState(null);

  const { data: complaints, loading, reload } = useApi(async () => (await api.get('/complaint/getAllComplaints')).data.complaints || [], []);
  const { data: agents } = useApi(async () => (await api.get('/agent/getAllAgents')).data.agents || [], []);

  const filtered = useMemo(() => {
    let list = (complaints || []).slice().sort(byNewest);
    if (sector) list = list.filter((c) => c.sector === sector);
    if (status !== 'All') list = list.filter((c) => c.status === STATUS_MAP[status]);
    return list;
  }, [complaints, sector, status]);

  async function markResolved(c) {
    if (!window.confirm(`Mark ${c.complaint_id} as resolved? This closes the complaint.`)) return;
    setBusyId(c.complaint_id);
    try {
      await api.post('/agent/changeStatus', { complaint_id: c.complaint_id, agent_id: c.agent_id, user_id: c.user_id, status: 'completed' });
      reload();
    } catch (error) {
      console.log(error);
      alert(' ', 'Could not update the complaint.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="page-title-row">
        <span className="page-title">All Complaints</span>
      </div>
      <div className="page-subtitle">{complaints?.length ?? 0} open across every department</div>

      <div className="filter-row" style={{ flexWrap: 'wrap' }}>
        {STATUS_FILTERS.map((f) => (
          <button key={f} type="button" className={`filter-chip${status === f ? ' active' : ''}`} onClick={() => setStatus(f)}>
            {f}
          </button>
        ))}
      </div>
      <div style={{ padding: '10px 20px 0' }}>
        <Select value={sector} onChange={setSector} options={SECTORS} placeholder="All departments" style={{ width: '100%' }} />
      </div>

      <div className="dash-section" style={{ paddingBottom: 24 }}>
        {loading && <Spinner label="Loading complaints…" />}
        {!loading && !filtered.length && <EmptyState Icon={IoDocumentText} title="No complaints match this filter" />}
        {!loading && !!filtered.length && (
          <div className="tile-grid">
            {filtered.map((c) => (
              <ComplaintListItem
                key={c.complaint_id}
                complaint={c}
                subtitle={agents?.find((a) => a.agent_id === c.agent_id)?.full_name ? `Assigned to ${agents.find((a) => a.agent_id === c.agent_id).full_name}` : undefined}
                right={
                  <div className="complaint-actions">
                    <button
                      type="button"
                      className="pill-btn"
                      style={{ background: COLORS.indiaGreen }}
                      disabled={busyId === c.complaint_id}
                      onClick={() => markResolved(c)}
                    >
                      {busyId === c.complaint_id ? 'Updating…' : 'Mark Resolved'}
                    </button>
                  </div>
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComplaints;
