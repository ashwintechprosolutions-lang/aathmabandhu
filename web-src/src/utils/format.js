const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDateTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${formatDate(iso)}, ${h % 12 || 12}:${m} ${h < 12 ? 'AM' : 'PM'}`;
}

// Notifications store date "YYYY-MM-DD" and time "HH:mm" as separate strings.
export function formatNotificationTime(n) {
  return formatDateTime(n.createdAt || `${n.date}T${n.time}:00`);
}

export const nowParts = () => {
  const d = new Date();
  const pad = (x) => String(x).padStart(2, '0');
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
};

export const byNewest = (a, b) => Date.parse(b.createdAt || 0) - Date.parse(a.createdAt || 0);

export const firstName = (full) => String(full || '').split(' ')[0];
