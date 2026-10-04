// Admin/citizen GIS map. Drawn entirely with CircleMarker (pixel radius, not
// meters) - no Leaflet Marker/Icon, so there's no dependency on Leaflet's
// default marker image assets (which Vite doesn't resolve by default), and no
// Circle, because a real-world-metre radius goes sub-pixel at this map's
// region-wide zoom and the bubbles disappear.
// Density = sequential ramp (one hue, light->dark by count), per the dataviz
// skill: magnitude gets one hue, never a rainbow. Hotspots get the reserved
// "critical" status color (never reused elsewhere) plus a dashed ring so
// identity isn't color-alone. A legend is always rendered below the map.
import React, { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { VIZ } from '../../constants/viz';

// Centered/zoomed to GHMC (Greater Hyderabad Municipal Corporation) limits -
// this app's scope - not the whole state.
const DEFAULT_CENTER = [17.414, 78.456];
const DEFAULT_ZOOM = 11;
const HOTSPOT_COLOR = VIZ.status.critical;
const OFFICER_COLOR = '#0B2E86';

function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function mix(hexA, hexB, t) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`;
}

const ComplaintMap = ({ areaPoints = [], hotspots = [], officers = [], statusPoints = [], center = DEFAULT_CENTER, zoom = DEFAULT_ZOOM, height = 360 }) => {
  const maxCount = useMemo(() => Math.max(1, ...areaPoints.map((p) => p.count)), [areaPoints]);
  const statusLegend = useMemo(() => {
    const seen = new Map();
    statusPoints.forEach((p) => seen.set(p.label, p.color));
    return [...seen.entries()];
  }, [statusPoints]);

  return (
    <div className="map-wrap">
      <MapContainer center={center} zoom={zoom} style={{ height, width: '100%', borderRadius: 12 }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {areaPoints.map((p) => {
          const t = Math.min(1, p.count / maxCount);
          const color = mix(VIZ.sequentialOrange.light, '#7a2d0c', t * 0.7);
          return (
            <CircleMarker
              key={`area-${p.pincode}`}
              center={[p.lat, p.lng]}
              radius={10 + Math.sqrt(p.count) * 6}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.55, weight: 2 }}
            >
              <Tooltip>
                <strong>{p.area}</strong>
                <br />
                {p.count} complaint{p.count === 1 ? '' : 's'}
                {p.levels?.High ? (
                  <>
                    <br />
                    {p.levels.High} High urgency
                  </>
                ) : null}
              </Tooltip>
            </CircleMarker>
          );
        })}

        {hotspots.map((h) => (
          <CircleMarker
            key={`hotspot-${h.sector}-${h.pincode}`}
            center={[h.lat, h.lng]}
            radius={26}
            pathOptions={{ color: HOTSPOT_COLOR, fillColor: HOTSPOT_COLOR, fillOpacity: 0.08, weight: 2, dashArray: '6 6' }}
          >
            <Tooltip>
              <strong>Hotspot: {h.sector}</strong>
              <br />
              {h.area}
              <br />
              {h.count} repeated complaints
            </Tooltip>
          </CircleMarker>
        ))}

        {officers.map((o, i) => (
          <CircleMarker key={`officer-${i}`} center={[o.lat, o.lng]} radius={5} pathOptions={{ color: OFFICER_COLOR, fillColor: OFFICER_COLOR, fillOpacity: 0.9, weight: 1 }}>
            <Tooltip>
              <strong>{o.full_name}</strong>
              <br />
              {o.agent_sector} - {o.officer_level}
            </Tooltip>
          </CircleMarker>
        ))}

        {statusPoints.map((p) => (
          <CircleMarker
            key={p.complaint_id}
            center={[p.lat, p.lng]}
            radius={7}
            pathOptions={{ color: p.color, fillColor: p.color, fillOpacity: 0.85, weight: 1.5 }}
          >
            <Tooltip>
              <strong>{p.complaint_id}</strong>
              <br />
              {p.sector}
              <br />
              {p.label}
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>

      <div className="stacked-status-legend" style={{ marginTop: 10 }}>
        {!!areaPoints.length && (
          <>
            <span className="legend-item">
              <span className="legend-swatch" style={{ background: VIZ.sequentialOrange.light }} /> Fewer complaints
            </span>
            <span className="legend-item">
              <span className="legend-swatch" style={{ background: '#7a2d0c' }} /> More complaints
            </span>
          </>
        )}
        {!!hotspots.length && (
          <span className="legend-item">
            <span className="legend-swatch" style={{ background: HOTSPOT_COLOR, borderRadius: '50%' }} /> Recurring hotspot
          </span>
        )}
        {!!officers.length && (
          <span className="legend-item">
            <span className="legend-swatch" style={{ background: OFFICER_COLOR, borderRadius: '50%' }} /> Officer location
          </span>
        )}
        {statusLegend.map(([label, color]) => (
          <span className="legend-item" key={label}>
            <span className="legend-swatch" style={{ background: color, borderRadius: '50%' }} /> {label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ComplaintMap;
