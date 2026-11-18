const NIGERIAN_MOBILE_PATTERN = /^(?:0[789][01]\d{8}|(?:\+?234)[789][01]\d{8})$/;

export function normalizeNigerianPhone(value) {
  if (typeof value !== 'string') return null;

  const compact = value.replace(/[\s-]/g, '');
  if (!NIGERIAN_MOBILE_PATTERN.test(compact)) return null;

  if (compact.startsWith('0')) return `+234${compact.slice(1)}`;
  return compact.startsWith('+') ? compact : `+${compact}`;
}
