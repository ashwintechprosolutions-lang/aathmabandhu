// Read-only mirror of AdminOfficers' tiles - same GET /agent/getAllAgents, no
// create form, no Remove action.
import React, { useMemo, useState } from 'react';
import { IoPeople } from 'react-icons/io5';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import Spinner from '../../components/Spinner';
import { COLORS } from '../../constants';
import { useStore } from '../../store';
import useApi from '../../hooks/useApi';
import api from '../../api/client';

const AgentTile = ({ agent: a }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="touchable tile-card" onClick={() => setOpen(true)}>
        <div>
          <div className="complaint-id">{a.full_name}</div>
          <div className="complaint-sector">{a.agent_sector}</div>
        </div>
        <div className="tile-notes">{a.officer_level || 'Junior'} officer</div>
        <div className="tile-footer">
          <span className="status-badge" style={{ color: COLORS.navy, borderColor: COLORS.navy }}>
            {a.users_assigned?.length || 0} assigned
          </span>
        </div>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={a.full_name}>
        <div>
          <div className="field-label">Department</div>
          <div className="field-value">{a.agent_sector}</div>
        </div>
        <div>
          <div className="field-label">Officer level</div>
          <div className="field-value">{a.officer_level || 'Junior'}</div>
        </div>
        <div>
          <div className="field-label">Office area</div>
          <div className="field-value">{a.office_pincode || 'Not set'}</div>
        </div>
        <div>
          <div className="field-label">Contact</div>
          <div className="field-value">{a.email}<br />{a.mobile}</div>
        </div>
        <div>
          <div className="field-label">Open complaints assigned</div>
          <div className="field-value">{a.users_assigned?.length || 0}</div>
        </div>
      </Modal>
    </>
  );
};

const SupervisorAgents = () => {
  const { monitorsSector } = useStore();
  const { data: agents, loading } = useApi(async () => (await api.get('/agent/getAllAgents')).data.agents || [], []);

  const scoped = useMemo(() => (monitorsSector ? (agents || []).filter((a) => a.agent_sector === monitorsSector) : agents || []), [agents, monitorsSector]);

  return (
    <div>
      <div className="page-title-row">
        <span className="page-title">Agents</span>
      </div>
      <div className="page-subtitle">{monitorsSector ? `${monitorsSector} department (read-only)` : 'All departments (read-only)'}</div>

      <div className="dash-section" style={{ paddingBottom: 24 }}>
        {loading && <Spinner label="Loading agents…" />}
        {!loading && !scoped.length && <EmptyState Icon={IoPeople} title="No agents here" />}
        {!loading && !!scoped.length && (
          <div className="tile-grid">
            {scoped.map((a) => <AgentTile key={a.agent_id} agent={a} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupervisorAgents;
