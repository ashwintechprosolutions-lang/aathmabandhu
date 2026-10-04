// 100%-stacked single bar showing the pending / in-progress / resolved mix.
// >=2 series -> a legend is always shown (dataviz), with a 2px surface gap between segments.
import React from 'react';
import { STATUS_META } from '../../constants/viz';

const ORDER = ['pending', 'in-progress', 'completed'];

const StackedStatusBar = ({ counts }) => {
  const total = Math.max(1, ORDER.reduce((s, k) => s + (counts[k] || 0), 0));
  return (
    <div className="stacked-status">
      <div className="stacked-status-track">
        {ORDER.map((key) => {
          const n = counts[key] || 0;
          if (!n) return null;
          return (
            <span
              key={key}
              style={{ width: `${(n / total) * 100}%`, background: STATUS_META[key].color }}
              title={`${STATUS_META[key].label}: ${n}`}
            />
          );
        })}
      </div>
      <div className="stacked-status-legend">
        {ORDER.map((key) => (
          <span className="legend-item" key={key}>
            <span className="legend-swatch" style={{ background: STATUS_META[key].color }} />
            {STATUS_META[key].label} ({counts[key] || 0})
          </span>
        ))}
      </div>
    </div>
  );
};

export default StackedStatusBar;
