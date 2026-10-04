// Built only from real, existing endpoints: GET /complaint/getAllComplaints,
// GET /agent/getAllAgents, GET /user/getAllUsers. Because the backend deletes a
// complaint the moment it's marked "completed" (see agentController.changeStatus),
// there is no endpoint that returns a historical "resolved" count, so this
// dashboard only reports what's currently open - it doesn't invent a resolved figure.
import React, { useMemo } from 'react';
import { IoBusiness, IoDocumentText, IoPeople, IoPeopleCircle } from 'react-icons/io5';
import StatTile from '../../components/StatTile';
import BarChart from '../../components/charts/BarChart';
import StackedStatusBar from '../../components/charts/StackedStatusBar';
import Spinner from '../../components/Spinner';
import { COLORS, SECTORS } from '../../constants';
import { VIZ } from '../../constants/viz';
import useApi from '../../hooks/useApi';
import api from '../../api/client';

const AdminDashboard = () => {
  const { data: complaints, loading: loadingComplaints } = useApi(async () => (await api.get('/complaint/getAllComplaints')).data.complaints || [], []);
  const { data: agents, loading: loadingAgents } = useApi(async () => (await api.get('/agent/getAllAgents')).data.agents || [], []);
  const { data: citizens, loading: loadingCitizens } = useApi(async () => (await api.get('/user/getAllUsers')).data.users || [], []);

  const bySector = useMemo(() => {
    const counts = Object.fromEntries(SECTORS.map((s) => [s, 0]));
    (complaints || []).forEach((c) => {
      counts[c.sector] = (counts[c.sector] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [complaints]);

  const statusCounts = useMemo(() => {
    const c = { pending: 0, 'in-progress': 0, completed: 0 };
    (complaints || []).forEach((x) => {
      c[x.status] = (c[x.status] || 0) + 1;
    });
    return c;
  }, [complaints]);

  const officerLoad = useMemo(
    () =>
      (agents || [])
        .map((a) => ({ label: a.full_name, value: a.users_assigned?.length || 0 }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8),
    [agents],
  );

  const loading = loadingComplaints || loadingAgents || loadingCitizens;

  return (
    <div>
      <div className="page-title-row">
        <span className="page-title">Administrator Overview</span>
      </div>
      <div className="page-subtitle">Live status across every department</div>

      {loading ? (
        <Spinner label="Loading dashboard…" />
      ) : (
        <>
          <div className="stat-tile-row">
            <StatTile label="Open Complaints" value={complaints.length} Icon={IoDocumentText} color={COLORS.navy} />
            <StatTile label="Departments" value={SECTORS.length} Icon={IoBusiness} color={COLORS.saffron} />
            <StatTile label="Officers" value={agents.length} Icon={IoPeople} color={COLORS.indiaGreen} />
            <StatTile label="Registered Citizens" value={citizens.length} Icon={IoPeopleCircle} color={COLORS.navy} />
          </div>

          <div className="dash-section">
            <div className="dash-section-title">Status Mix</div>
            <div className="panel" style={{ padding: 18 }}>
              <StackedStatusBar counts={statusCounts} />
            </div>
          </div>

          <div className="dash-section">
            <div className="dash-section-title">Complaints by Department</div>
            <div className="panel" style={{ padding: 18 }}>
              <BarChart data={bySector} />
            </div>
          </div>

          <div className="dash-section" style={{ paddingBottom: 24 }}>
            <div className="dash-section-title">Officer Workload (top 8)</div>
            <div className="panel" style={{ padding: 18 }}>
              <BarChart data={officerLoad} color={VIZ.sequentialOrange.light} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
