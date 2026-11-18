function toDate(value) {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (value && typeof value.toDate === 'function') {
    try {
      const date = value.toDate();
      return date instanceof Date && !Number.isNaN(date.getTime()) ? date : null;
    } catch {
      return null;
    }
  }

  if (value && typeof value === 'object' && Number.isFinite(value.seconds)) {
    const date = new Date(value.seconds * 1000 + (Number(value.nanoseconds) || 0) / 1_000_000);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    const date = new Date(Math.abs(value) < 100_000_000_000 ? value * 1000 : value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === 'string' && value.trim()) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
}

export function formatLagosDateTime(value) {
  const date = toDate(value);
  if (!date) return 'Date not recorded';

  const parts = new Intl.DateTimeFormat('en-NG', {
    timeZone: 'Africa/Lagos',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).formatToParts(date);
  const part = (type) => parts.find((entry) => entry.type === type)?.value || '';

  return `${part('day')} ${part('month')} ${part('year')}, ${part('hour')}:${part('minute')} ${part('dayPeriod').toLowerCase()}`;
}