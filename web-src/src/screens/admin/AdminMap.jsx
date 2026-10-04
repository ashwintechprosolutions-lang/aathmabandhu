// Built from the same two real endpoints AdminDashboard already uses
// (GET /complaint/getAllComplaints, GET /agent/getAllAgents) - no new backend
// aggregation route exists, so density/hotspot clustering is derived
// client-side (src/utils/geo.js), same pattern as the dashboard's chart data.
import React, { useMemo } from 'react';
import { IoWarning } from 'react-icons/io5';
import ComplaintMap from '../../components/charts/ComplaintMap';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import { aggregateByPincode, findHotspots } from '../../utils/geo';
import { jitteredLatLng } from '../../data/pincodeGeo';
import useApi from '../../hooks/useApi';
import api from '../../api/client';

const HOTSPOT_MIN = 3;

const AdminMap = () => {
  const { data: complaints, loading: loadingComplaints } = useApi(async () => (await api.get('/complaint/getAllComplaints')).data.complaints || [], []);
  const { data: agents, loading: loadingAgents } = useApi(async () => (await api.get('/agent/getAllAgents')).data.agents || [], []);
  const loading = loadingComplaints || loadingAgents;

  const areaPoints = useMemo(() => aggregateByPincode(complaints || []), [complaints]);
  const hotspots = useMemo(() => findHotspots(complaints || [], HOTSPOT_MIN), [complaints]);
  const officerPoints = useMemo(
    () =>
      (agents || [])
        .filter((a) => a.office_pincode)
        .map((a) => ({
          ...jitteredLatLng(a.office_pincode, `officer-${a.agent_id}`),
          full_name: a.full_name,
          agent_sector: a.agent_sector,
          officer_level: a.officer_level,
        })),
    [agents],
  );

  return (
    <div>
      <div className="page-title-row">
        <span className="page-title">Complaint Map</span>
      </div>
      <div className="page-subtitle">Density by area, recurring hotspots and officer coverage - locations are approximate (pincode-area centroids).</div>

      {loading ? (
        <Spinner label="Loading map…" />
      ) : !areaPoints.length ? (
        <EmptyState Icon={IoWarning} title="No complaints yet" />
      ) : (
        <>
          <div className="dash-section">
            <div className="panel" style={{ padding: 12 }}>
              <ComplaintMap areaPoints={areaPoints} hotspots={hotspots} officers={officerPoints} height={360} />
            </div>
          </div>

          {!!hotspots.length && (
            <div className="dash-section" style={{ paddingBottom: 24 }}>
              <div className="dash-section-title">Recurring Hotspots ({hotspots.length})</div>
              <div className="tile-grid">
                {hotspots.map((h) => (
                  <div key={`${h.sector}-${h.pincode}`} className="tile-card">
                    <div>
                      <div className="complaint-id">{h.sector}</div>
                      <div className="complaint-sector">{h.area}</div>
                    </div>
                    <div className="tile-notes">
                      {h.count} complaints reported in this area{h.highCount ? `, ${h.highCount} High urgency` : ''}.
                    </div>
                    <div className="tile-footer">
                      <span className="status-badge" style={{ color: '#d03b3b', borderColor: '#d03b3b' }}>
                        <IoWarning size={11} style={{ verticalAlign: -1 }} /> Hotspot
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminMap;
