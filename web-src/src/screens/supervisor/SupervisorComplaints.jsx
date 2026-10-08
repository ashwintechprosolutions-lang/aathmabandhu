// ComplaintListItem's `right` prop renders inside its detail modal. A Supervisor
// gets exactly one action there - reassign to a different officer in the same
// department (POST /supervisor/reassignComplaint) - never a status change.
import React, { useMemo, useState } from 'react';
import { IoDocumentText, IoSwapHorizontal } from 'react-icons/io5';
import ComplaintListItem from '../../components/ComplaintListItem';
import EmptyState from '../../components/EmptyState';
import Spinner from '../../components/Spinner';
import { useAlert } from '../../components/Alert';
import { COLORS } from '../../constants';
import { useStore } from '../../store';
import useApi from '../../hooks/useApi';
import api from '../../api/client';
import { byNewest } from '../../utils/format';

const FILTERS = ['All', 'Pending', 'In Progress'];
const FILTER_STATUS = { Pending: 'pending', 'In Progress': 'in-progress' };

const ReassignControl = ({ complaint, officers, onDone }) => {
  const { alert } = useAlert();
  const [target, setTarget] = useState('');
  const [busy, setBusy] = useState(false);

  const options = officers.filter((o) => o.agent_sector === complaint.sector && o.agent_id !== complaint.agent_id);
  if (!options.length) return null;

  async function reassign() {
    if (!target) {
      alert(' ', 'Pick an officer to reassign to.');
      return;
    }
    setBusy(true);
    try {
      await api.post('/supervisor/reassignComplaint', { complaint_id: complaint.complaint_id, agent_id: Number(target) });
      alert(' ', 'Complaint reassigned.');
      onDone();
    } catch (error) {
      console.log(error);
      alert(' ', error.response?.data?.message || 'Could not reassign this complaint.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="field-label">Reassign to another officer</div>
      <div className="row" style={{ gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
        <select
          className="rn-input"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          style={{ flex: '1 1 160px', borderRadius: 15, height: 45, border: '1px solid #9EB7DF', paddingLeft: 10 }}
        >
          <option value="" disabled>Choose an officer</option>
          {options.map((o) => (
            <option key={o.agent_id} value={o.agent_id}>{o.full_name} ({o.officer_level || 'Junior'})</option>
          ))}
        </select>
        <button type="button" className="pill-btn" style={{ background: COLORS.navy }} disabled={busy} onClick={reassign}>
          <IoSwapHorizontal size={13} style={{ verticalAlign: -2 }} /> {busy ? 'Reassigning…' : 'Reassign'}
        </button>
      </div>
    </div>
  );
};

const SupervisorComplaints = () => {
  const { monitorsSector } = useStore();
  const [filter, setFilter] = useState('All');
  const { data: complaints, loading, reload } = useApi(async () => (await api.get('/complaint/getAllComplaints')).data.complaints || [], []);
  const { data: agents } = useApi(async () => (await api.get('/agent/getAllAgents')).data.agents || [], []);

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
      <div className="page-subtitle">
        {monitorsSector ? `${monitorsSector} department` : 'All departments'} — view and reassign, cannot resolve
      </div>

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
            {filtered.map((c) => (
              <ComplaintListItem
                key={c.complaint_id}
                complaint={c}
                right={<ReassignControl complaint={c} officers={agents || []} onDone={reload} />}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupervisorComplaints;
