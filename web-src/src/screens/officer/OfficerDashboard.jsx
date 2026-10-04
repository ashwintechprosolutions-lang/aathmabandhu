// GET /agent/getAgentComplaints/:id returns {agent}, whose users_assigned array IS
// the officer's complaint queue (GovServiceAppBackend/controllers/agentController.js).
// Status moves forward only, exactly as POST /agent/changeStatus supports it:
// pending -> in-progress -> completed (which deletes the complaint server-side).
import React, { useMemo, useState } from 'react';
import { IoAlertCircle, IoCheckmarkDone, IoDocumentText, IoTime } from 'react-icons/io5';
import StatTile from '../../components/StatTile';
import ComplaintListItem from '../../components/ComplaintListItem';
import EmptyState from '../../components/EmptyState';
import Spinner from '../../components/Spinner';
import { useAlert } from '../../components/Alert';
import { COLORS } from '../../constants';
import { VIZ } from '../../constants/viz';
import { useStore } from '../../store';
import useApi from '../../hooks/useApi';
import api from '../../api/client';
import { byNewest } from '../../utils/format';

const OfficerDashboard = () => {
  const { alert } = useAlert();
  const { agentId, userId } = useStore();
  const [busyId, setBusyId] = useState(null);

  const { data: agent, loading, reload } = useApi(async () => {
    const r = await api.get(`/agent/getAgentComplaints/${agentId}`);
    return r.data.agent;
  }, [agentId]);

  const { data: citizens } = useApi(async () => {
    const r = await api.get('/user/getAllUsers');
    return r.data.users || [];
  }, []);

  const citizenName = (uid) => citizens?.find((u) => u.user_id === uid)?.full_name;

  const complaints = useMemo(() => (agent?.users_assigned || []).slice().sort(byNewest), [agent]);
  const stats = useMemo(
    () => ({
      total: complaints.length,
      pending: complaints.filter((c) => c.status === 'pending').length,
      inProgress: complaints.filter((c) => c.status === 'in-progress').length,
    }),
    [complaints],
  );

  async function setStatus(complaint, status) {
    if (status === 'completed' && !window.confirm(`Mark ${complaint.complaint_id} as resolved? This closes the complaint.`)) return;
    setBusyId(complaint.complaint_id);
    try {
      await api.post('/agent/changeStatus', {
        complaint_id: complaint.complaint_id,
        agent_id: agentId,
        user_id: complaint.user_id ?? userId,
        status,
      });
      reload();
    } catch (error) {
      console.log(error);
      alert(' ', 'Could not update the complaint status.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="page-title-row">
        <span className="page-title">Assigned Complaints</span>
      </div>
      <div className="page-subtitle">{agent?.agent_sector} department</div>

      <div className="stat-tile-row">
        <StatTile label="Total Assigned" value={stats.total} Icon={IoDocumentText} color={COLORS.navy} />
        <StatTile label="Pending" value={stats.pending} Icon={IoTime} color={VIZ.status.warning} />
        <StatTile label="In Progress" value={stats.inProgress} Icon={IoAlertCircle} color={VIZ.sequentialBlue.light} />
      </div>

      <div className="dash-section" style={{ paddingBottom: 24 }}>
        {loading && <Spinner label="Loading your queue…" />}
        {!loading && !complaints.length && <EmptyState Icon={IoCheckmarkDone} title="Queue clear" subtitle="No complaints assigned to you right now." />}
        {!loading &&
          complaints.map((c) => (
            <ComplaintListItem
              key={c.complaint_id}
              complaint={c}
              subtitle={citizenName(c.user_id) ? `Raised by ${citizenName(c.user_id)}` : undefined}
              right={
                <div className="complaint-actions">
                  {c.status === 'pending' && (
                    <button type="button" className="pill-btn" style={{ background: COLORS.navy }} disabled={busyId === c.complaint_id} onClick={() => setStatus(c, 'in-progress')}>
                      {busyId === c.complaint_id ? 'Updating…' : 'Start Work'}
                    </button>
                  )}
                  {c.status === 'in-progress' && (
                    <button type="button" className="pill-btn" style={{ background: COLORS.indiaGreen }} disabled={busyId === c.complaint_id} onClick={() => setStatus(c, 'completed')}>
                      {busyId === c.complaint_id ? 'Updating…' : 'Mark Resolved'}
                    </button>
                  )}
                </div>
              }
            />
          ))}
      </div>
    </div>
  );
};

export default OfficerDashboard;
