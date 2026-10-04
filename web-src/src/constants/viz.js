// Values straight from the dataviz skill's validated reference palette
// (references/palette.md) - CVD-safe as documented there. Do not tweak by eye;
// if these ever change, re-run scripts/validate_palette.js.
export const VIZ = {
  sequentialBlue: { light: '#2a78d6', dark: '#3987e5' },
  // Second/third simultaneous magnitude context on the same dashboard takes the
  // next categorical slot's hue, per the dataviz skill's palette.md.
  sequentialOrange: { light: '#eb6834', dark: '#d95926' },
  sequentialAqua: { light: '#1baf7a', dark: '#199e70' },
  status: {
    good: '#0ca30c', // resolved / completed
    warning: '#fab219', // pending
    serious: '#ec835a', // case_level: High
    critical: '#d03b3b', // reserved
  },
  ink: { primary: '#0b0b0b', secondary: '#52514e', muted: '#898781' },
  grid: '#e1e0d9',
  surface: '#fcfcfb',
};

export const STATUS_META = {
  pending: { label: 'Pending', color: VIZ.status.warning, icon: 'time' },
  'in-progress': { label: 'In Progress', color: VIZ.sequentialBlue.light, icon: 'sync' },
  completed: { label: 'Resolved', color: VIZ.status.good, icon: 'check' },
};

// Case urgency, set by the backend's Claude-based triage (or its keyword
// fallback) at complaint registration - see GovServiceAppBackend/services/
// caseLevelClassifier.js. Distinct from STATUS_META (that's workflow state).
export const LEVEL_META = {
  Low: { label: 'Low', color: VIZ.status.good, icon: 'low' },
  Medium: { label: 'Medium', color: VIZ.status.warning, icon: 'medium' },
  High: { label: 'High', color: VIZ.status.serious, icon: 'high' },
};
