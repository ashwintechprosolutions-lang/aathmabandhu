// Read-only monitoring view - same two real endpoints AdminDashboard uses
// (GET /complaint/getAllComplaints, GET /agent/getAllAgents), filtered down to
// this supervisor's monitors_sector when set (null = monitors every department,
// same breadth as Admin's dashboard but still no write actions anywhere here).
import React, { useMemo } from 'react';
import { IoDocumentText, IoPeople } from 'react-icons/io5';
import StatTile from '../../components/StatTile';
import BarChart from '../../components/charts/BarChart';
import DonutChart from '../../components/charts/DonutChart';
import TrendChart from '../../components/charts/TrendChart';
import Spinner from '../../components/Spinner';
import { COLORS, SECTORS } from '../../constants';
import { VIZ, STATUS_META, LEVEL_META } from '../../constants/viz';
import { useStore } from '../../store';
import useApi from '../../hooks/useApi';
import api from '../../api/client';

const TREND_DAYS = 14;
const short = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

const SupervisorDashboard = () => {
  const { monitorsSector } = useStore();
  const { data: allComplaints, loading: loadingComplaints } = useApi(async () => (await api.get('/complaint/getAllComplaints')).data.complaints || [], []);
  const { data: allAgents, loading: loadingAgents } = useApi(async () => (await api.get('/agent/getAllAgents')).data.agents || [], []);
  const loading = loadingComplaints || loadingAgents;

  const complaints = useMemo(() => (monitorsSector ? (allComplaints || []).filter((c) => c.sector === monitorsSector) : allComplaints || []), [allComplaints, monitorsSector]);
  const agents = useMemo(() => (monitorsSector ? (allAgents || []).filter((a) => a.agent_sector === monitorsSector) : allAgents || []), [allAgents, monitorsSector]);

  const statusSegments = useMemo(() => {
    const c = { pending: 0, 'in-progress': 0, completed: 0 };
    complaints.forEach((x) => { c[x.status] = (c[x.status] || 0) + 1; });
    return ['pending', 'in-progress', 'completed'].map((k) => ({ label: STATUS_META[k].label, value: c[k], color: STATUS_META[k].color }));
  }, [complaints]);

  const levelSegments = useMemo(() => {
    const c = { Low: 0, Medium: 0, High: 0, Unclassified: 0 };
    complaints.forEach((x) => { c[x.case_level && LEVEL_META[x.case_level] ? x.case_level : 'Unclassified']++; });
    const segs = ['Low', 'Medium', 'High'].map((k) => ({ label: LEVEL_META[k].label, value: c[k], color: LEVEL_META[k].color }));
    if (c.Unclassified > 0) segs.push({ label: 'Unclassified', value: c.Unclassified, color: VIZ.ink.muted });
    return segs;
  }, [complaints]);

  const trend = useMemo(() => {
    const days = [];
    for (let i = TREND_DAYS - 1; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      days.push({ key: d.toDateString(), label: short(d), value: 0 });
    }
    const byKey = Object.fromEntries(days.map((d) => [d.key, d]));
    complaints.forEach((c) => {
      const key = new Date(c.createdAt).toDateString();
      if (byKey[key]) byKey[key].value += 1;
    });
    return days;
  }, [complaints]);

  const bySector = useMemo(() => {
    if (monitorsSector) return null; // scoped to one department already - a 1-bar chart adds nothing
    const counts = Object.fromEntries(SECTORS.map((s) => [s, 0]));
    complaints.forEach((c) => { counts[c.sector] = (counts[c.sector] || 0) + 1; });
    return Object.entries(counts).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
  }, [complaints, monitorsSector]);

  const agentLoad = useMemo(
    () => agents.map((a) => ({ label: a.full_name, value: a.users_assigned?.length || 0 })).sort((a, b) => b.value - a.value).slice(0, 8),
    [agents],
  );

  return (
    <div>
      <div className="page-title-row">
        <span className="page-title">Supervisor Overview</span>
      </div>
      <div className="page-subtitle">{monitorsSector ? `${monitorsSector} department - monitoring only, no changes made here.` : 'All departments - monitoring only, no changes made here.'}</div>

      {loading ? (
        <Spinner label="Loading dashboard…" />
      ) : (
        <>
          <div className="stat-tile-row">
            <StatTile label="Open Complaints" value={complaints.length} Icon={IoDocumentText} color={COLORS.navy} />
            <StatTile label="Agents" value={agents.length} Icon={IoPeople} color={COLORS.indiaGreen} />
          </div>

          <div className="dash-section-row">
            <div className="dash-section half">
              <div className="dash-section-title">Status Mix</div>
              <div className="panel" style={{ padding: 18 }}>
                <DonutChart segments={statusSegments} centerLabel="complaints" />
              </div>
            </div>
            <div className="dash-section half">
              <div className="dash-section-title">Urgency Mix</div>
              <div className="panel" style={{ padding: 18 }}>
                <DonutChart segments={levelSegments} centerLabel="complaints" />
              </div>
            </div>
          </div>

          <div className="dash-section">
            <div className="dash-section-title">Complaints Raised - last {TREND_DAYS} days</div>
            <div className="panel" style={{ padding: 18 }}>
              <TrendChart points={trend} />
            </div>
          </div>

          {!!bySector && (
            <div className="dash-section">
              <div className="dash-section-title">Complaints by Department</div>
              <div className="panel" style={{ padding: 18 }}>
                <BarChart data={bySector} />
              </div>
            </div>
          )}

          <div className="dash-section" style={{ paddingBottom: 24 }}>
            <div className="dash-section-title">Agent Workload</div>
            <div className="panel" style={{ padding: 18 }}>
              <BarChart data={agentLoad} color={VIZ.sequentialOrange.light} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SupervisorDashboard;
