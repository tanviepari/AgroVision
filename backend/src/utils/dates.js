const STAGES = [
  'Seedling',
  'Vegetative',
  'Flowering',
  'Fruiting',
  'Maturity',
  'Harvest ready',
];

export function stageProgress(stage) {
  const index = STAGES.indexOf(stage);
  if (index < 0) return 0;
  return Math.round(((index + 1) / STAGES.length) * 100);
}

export function formatDateLabel(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const today = new Date();
  const start = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((start(today) - start(date)) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function relativeTime(value) {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 14) return `${days} days ago`;
  return formatDateLabel(date);
}

export { STAGES };
