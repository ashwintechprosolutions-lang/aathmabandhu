// Frontend copy of GovServiceAppBackend/services/geocode.js - same table, kept in
// sync by hand since the two apps are separate deployables. Approximate
// (pincode-area centroid), not exact-address geocoding - see that file's header
// for why: citizens only ever submit a 6-digit pincode, never coordinates.
// Scoped to GHMC (Greater Hyderabad Municipal Corporation) limits only - this
// app's coverage area - so every entry is a locality inside the city boundary.
export const PINCODE_GEO = {
  500016: { lat: 17.4374, lng: 78.4482, area: 'Ameerpet, Hyderabad' },
  500072: { lat: 17.4849, lng: 78.4138, area: 'Kukatpally, Hyderabad' },
  500003: { lat: 17.4399, lng: 78.4983, area: 'Secunderabad' },
  500032: { lat: 17.4401, lng: 78.3489, area: 'Gachibowli, Hyderabad' },
  500060: { lat: 17.3687, lng: 78.5247, area: 'Dilsukhnagar, Hyderabad' },
  500074: { lat: 17.3527, lng: 78.5497, area: 'LB Nagar, Hyderabad' },
  500049: { lat: 17.4959, lng: 78.3539, area: 'Miyapur, Hyderabad' },
  500028: { lat: 17.3952, lng: 78.4345, area: 'Mehdipatnam, Hyderabad' },
  500034: { lat: 17.4156, lng: 78.4347, area: 'Banjara Hills, Hyderabad' },
  500033: { lat: 17.4325, lng: 78.4071, area: 'Jubilee Hills, Hyderabad' },
  500036: { lat: 17.3745, lng: 78.4983, area: 'Malakpet, Hyderabad' },
  500002: { lat: 17.3616, lng: 78.4747, area: 'Charminar, Hyderabad' },
  500039: { lat: 17.4058, lng: 78.5591, area: 'Uppal, Hyderabad' },
  500047: { lat: 17.4504, lng: 78.5108, area: 'Malkajgiri, Hyderabad' },
  500048: { lat: 17.3745, lng: 78.4215, area: 'Attapur, Hyderabad' },
  500020: { lat: 17.4057, lng: 78.4917, area: 'Musheerabad, Hyderabad' },
};
const FALLBACK = { lat: 17.385, lng: 78.4867, area: 'Hyderabad' };

export function geocode(pincode) {
  return PINCODE_GEO[Number(pincode)] || FALLBACK;
}

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return h;
}

// Deterministic small offset (same seed -> same point every render) so that
// several complaints sharing one pincode don't stack exactly on top of each
// other on the map - spreads them within roughly a 1km radius of the centroid.
export function jitteredLatLng(pincode, seed) {
  const base = geocode(pincode);
  const h = hash(String(seed ?? pincode));
  const a = (Math.abs(h) % 1000) / 1000;
  const b = (Math.abs(h >> 10) % 1000) / 1000;
  const r = 0.011;
  return { lat: base.lat + (a - 0.5) * r, lng: base.lng + (b - 0.5) * r, area: base.area };
}

export function haversineKm(a, b) {
  if (!a || !b) return null;
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}
