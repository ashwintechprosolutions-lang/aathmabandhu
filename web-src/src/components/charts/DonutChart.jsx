// Part-to-whole, low-cardinality only (<=4 segments - status mix, case-urgency
// mix). Built with a CSS conic-gradient, not a library. A 2px surface-color gap
// separates touching segments (dataviz: never a border to separate marks). Legend
// is always shown (>=2 series) with each segment's count - identity never relies
// on color alone.
import React from 'react';

const GAP_PCT = 1.4;

function buildGradient(segments) {
  const visible = segments.filter((s) => s.value > 0);
  const total = visible.reduce((sum, s) => sum + s.value, 0);
  if (total === 0) return '#eceef1';
  const usable = 100 - visible.length * GAP_PCT;
  let pos = 0;
  const stops = [];
  visible.forEach((seg) => {
    const width = (seg.value / total) * usable;
    stops.push(`${seg.color} ${pos}% ${(pos + width).toFixed(3)}%`);
    pos += width;
    stops.push(`transparent ${pos.toFixed(3)}% ${(pos + GAP_PCT).toFixed(3)}%`);
    pos += GAP_PCT;
  });
  return `conic-gradient(${stops.join(', ')})`;
}

const DonutChart = ({ segments, centerValue, centerLabel, size = 140, thickness = 24 }) => {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const hole = size - thickness * 2;
  return (
    <div className="column" style={{ alignItems: 'center' }}>
      <div
        className="donut-ring"
        style={{ width: size, height: size, background: buildGradient(segments) }}
        role="img"
        aria-label={segments.map((s) => `${s.label}: ${s.value}`).join(', ')}
      >
        <div className="donut-hole" style={{ width: hole, height: hole }}>
          <div className="donut-center-value">{centerValue ?? total}</div>
          {centerLabel && <div className="donut-center-label">{centerLabel}</div>}
        </div>
      </div>
      <div className="stacked-status-legend" style={{ marginTop: 14, justifyContent: 'center' }}>
        {segments.map((s) => (
          <span className="legend-item" key={s.label}>
            <span className="legend-swatch" style={{ background: s.color }} />
            {s.label} ({s.value})
          </span>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
