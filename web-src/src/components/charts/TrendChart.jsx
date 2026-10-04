// Trend over time: 2px line, round joins, a ~10% opacity area wash under it (not
// a saturated fill), an 8px end-marker with a 2px surface ring, and the endpoint
// value direct-labelled (dataviz: "lines -> value at the end", label selectively -
// not a number on every point). A single hairline baseline, no second axis.
import React from 'react';
import { VIZ } from '../../constants/viz';

const W = 300, H = 120, PAD_L = 6, PAD_R = 6, PAD_T = 16, PAD_B = 18;

const TrendChart = ({ points, color = VIZ.sequentialBlue.light }) => {
  const max = Math.max(1, ...points.map((p) => p.value));
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;
  const stepX = points.length > 1 ? innerW / (points.length - 1) : 0;
  const coords = points.map((p, i) => ({
    ...p,
    x: PAD_L + i * stepX,
    y: PAD_T + innerH - (p.value / max) * innerH,
  }));
  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ');
  const baseY = PAD_T + innerH;
  const areaPath = `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${baseY} L ${coords[0].x.toFixed(1)} ${baseY} Z`;
  const last = coords[coords.length - 1];
  const first = coords[0];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="trend-chart"
      role="img"
      aria-label={`Trend from ${first.label} (${first.value}) to ${last.label} (${last.value})`}
    >
      <line x1={PAD_L} y1={baseY} x2={W - PAD_R} y2={baseY} stroke={VIZ.grid} strokeWidth="1" />
      <path d={areaPath} fill={color} opacity="0.1" stroke="none" />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last.x} cy={last.y} r="4" fill={color} stroke="#fff" strokeWidth="2" />
      <text x={Math.max(last.x - 10, 14)} y={Math.max(last.y - 8, 10)} textAnchor="middle" fontSize="11" fontWeight="700" fill={VIZ.ink.primary}>
        {last.value}
      </text>
      <text x={PAD_L} y={H - 3} textAnchor="start" fontSize="9" fill={VIZ.ink.muted}>{first.label}</text>
      <text x={W - PAD_R} y={H - 3} textAnchor="end" fontSize="9" fill={VIZ.ink.muted}>{last.label}</text>
    </svg>
  );
};

export default TrendChart;
