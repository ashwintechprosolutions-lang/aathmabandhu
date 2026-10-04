// Horizontal bar chart: one measure (complaint count) across category identities
// (departments). Single sequential hue per dataviz guidance (magnitude -> one hue);
// no legend needed for a single series. Direct value labels, native-title hover.
import React from 'react';
import { VIZ } from '../../constants/viz';

const BarChart = ({ data, valueKey = 'value', labelKey = 'label', color = VIZ.sequentialBlue.light }) => {
  const max = Math.max(1, ...data.map((d) => d[valueKey]));
  return (
    <div className="bar-chart" role="img" aria-label={data.map((d) => `${d[labelKey]}: ${d[valueKey]}`).join(', ')}>
      {data.map((d) => (
        <div className="bar-row" key={d[labelKey]} title={`${d[labelKey]}: ${d[valueKey]}`}>
          <span className="bar-label">{d[labelKey]}</span>
          <span className="bar-track">
            <span
              className="bar-fill"
              style={{ width: `${Math.max((d[valueKey] / max) * 100, 3)}%`, background: color }}
            />
          </span>
          <span className="bar-value">{d[valueKey]}</span>
        </div>
      ))}
    </div>
  );
};

export default BarChart;
