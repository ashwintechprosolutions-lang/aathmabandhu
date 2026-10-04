// GIS aggregations for the admin map - pure client-side derivation from
// GET /complaint/getAllComplaints, same pattern as AdminDashboard's useMemo
// blocks (no backend aggregation endpoint exists, so this mirrors that choice).
import { jitteredLatLng } from '../data/pincodeGeo';

// One point per pincode with its complaint count and case-level breakdown -
// feeds the density layer on the map.
export function aggregateByPincode(complaints) {
  const byPincode = new Map();
  (complaints || []).forEach((c) => {
    const key = c.complaint_pincode;
    if (!byPincode.has(key)) byPincode.set(key, []);
    byPincode.get(key).push(c);
  });
  return [...byPincode.entries()].map(([pincode, rows]) => {
    const { lat, lng, area } = jitteredLatLng(pincode, `area-${pincode}`);
    const levels = { Low: 0, Medium: 0, High: 0, Unclassified: 0 };
    rows.forEach((c) => {
      const key = c.case_level && levels[c.case_level] !== undefined ? c.case_level : 'Unclassified';
      levels[key]++;
    });
    return { pincode, area, lat, lng, count: rows.length, levels };
  });
}

// A "recurring hotspot" = the same department seeing repeated complaints in the
// same pincode area - a real signal of an underlying infrastructure issue
// (same pothole, same burst pipe) rather than scattered one-off reports.
export function findHotspots(complaints, minCount = 3) {
  const grouped = new Map();
  (complaints || []).forEach((c) => {
    const key = `${c.sector}__${c.complaint_pincode}`;
    if (!grouped.has(key)) grouped.set(key, { sector: c.sector, pincode: c.complaint_pincode, rows: [] });
    grouped.get(key).rows.push(c);
  });
  return [...grouped.values()]
    .filter((g) => g.rows.length >= minCount)
    .map((g) => {
      const { lat, lng, area } = jitteredLatLng(g.pincode, `hotspot-${g.sector}-${g.pincode}`);
      return {
        sector: g.sector,
        pincode: g.pincode,
        area,
        lat,
        lng,
        count: g.rows.length,
        highCount: g.rows.filter((c) => c.case_level === 'High').length,
      };
    })
    .sort((a, b) => b.count - a.count);
}
