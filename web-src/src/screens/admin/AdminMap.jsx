// Built from the same two real endpoints AdminDashboard already uses
// (GET /complaint/getAllComplaints, GET /agent/getAllAgents) - no new backend
// aggregation route exists, so density/hotspot clustering is derived
// client-side (src/utils/geo.js), same pattern as the dashboard's chart data.
import React, { useMemo, useState } from 'react';
import { IoClose, IoWarning } from 'react-icons/io5';
import ComplaintMap from '../../components/charts/ComplaintMap';
import ComplaintListItem from '../../components/ComplaintListItem';
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
  const [selected, setSelected] = useState(null); // { key, title, subtitle, complaints }

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
              <ComplaintMap
                areaPoints={areaPoints}
                hotspots={hotspots}
                officers={officerPoints}
                height={360}
                selectedKey={selected?.key}
                onAreaClick={(p) =>
                  setSelected({ key: `area-${p.pincode}`, title: p.area, subtitle: `${p.count} complaint${p.count === 1 ? '' : 's'}`, complaints: p.complaints })
                }
                onHotspotClick={(h) =>
                  setSelected({ key: `hotspot-${h.sector}-${h.pincode}`, title: `${h.sector} - ${h.area}`, subtitle: `${h.count} repeated complaints`, complaints: h.complaints })
                }
              />
            </div>
          </div>

          {!!selected && (
            <div className="dash-section" style={{ paddingBottom: 24 }}>
              <div className="dash-section-title">
                <span>
                  {selected.title} ({selected.complaints.length})
                </span>
                <button type="button" className="touchable link-btn" onClick={() => setSelected(null)} aria-label="Clear selection">
                  <IoClose size={14} style={{ verticalAlign: -2 }} /> Clear
                </button>
              </div>
              <div className="page-subtitle" style={{ margin: '-6px 0 10px' }}>{selected.subtitle}</div>
              <div className="tile-grid">
                {selected.complaints.map((c) => (
                  <ComplaintListItem key={c.complaint_id} complaint={c} />
                ))}
              </div>
            </div>
          )}

          {!!hotspots.length && (
            <div className="dash-section" style={{ paddingBottom: 24 }}>
              <div className="dash-section-title">Recurring Hotspots ({hotspots.length})</div>
              <div className="tile-grid">
                {hotspots.map((h) => (
                  <button
                    type="button"
                    key={`${h.sector}-${h.pincode}`}
                    className="touchable tile-card"
                    onClick={() =>
                      setSelected({ key: `hotspot-${h.sector}-${h.pincode}`, title: `${h.sector} - ${h.area}`, subtitle: `${h.count} repeated complaints`, complaints: h.complaints })
                    }
                  >
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
                  </button>
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
