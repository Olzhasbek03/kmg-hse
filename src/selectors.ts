import { incidents, type Incident, countBy } from './data';

export const TOTAL = incidents.length;
export const FATAL = incidents.filter((i) => i.severityNorm === 'fatal').length;
export const SEVERE = incidents.filter((i) => i.severityNorm === 'severe').length;
export const LIGHT = incidents.filter((i) => i.severityNorm === 'light').length;

export const YEARS = Array.from(
  new Set(incidents.map((i) => i.year).filter((y): y is number => !!y))
).sort();

export function byYear(list: Incident[] = incidents) {
  const c = countBy(list, (i) => (i.year ? String(i.year) : null));
  return YEARS.map((y) => ({ name: String(y), value: c[String(y)] ?? 0 }));
}

export function fatalByYear(list: Incident[] = incidents) {
  return YEARS.map((y) => ({
    year: String(y),
    all: list.filter((i) => i.year === y).length,
    fatal: list.filter((i) => i.year === y && i.severityNorm === 'fatal').length,
  }));
}

export function byType(list: Incident[] = incidents) {
  const c = countBy(list, (i) => i.typeNorm);
  return Object.entries(c)
    .map(([k, v]) => ({ key: k, value: v }))
    .sort((a, b) => b.value - a.value);
}

export function bySeverity(list: Incident[] = incidents) {
  return (['fatal', 'severe', 'light'] as const).map((s) => ({
    key: s,
    value: list.filter((i) => i.severityNorm === s).length,
  }));
}

export function byDzo(list: Incident[] = incidents, limit = 10) {
  const c = countBy(list, (i) => i.dzoNorm);
  return Object.entries(c)
    .map(([k, v]) => ({ name: k, value: v }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

export function byBusinessLine(list: Incident[] = incidents) {
  const c = countBy(list, (i) => i.businessLine);
  return Object.entries(c)
    .map(([k, v]) => ({ key: k, value: v }))
    .sort((a, b) => b.value - a.value);
}

export function byRegion(list: Incident[] = incidents, limit = 7) {
  const c = countBy(list, (i) => i.region);
  return Object.entries(c)
    .map(([k, v]) => ({ name: k, value: v }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

export function byMonth(list: Incident[] = incidents) {
  const arr = Array.from({ length: 12 }, () => 0);
  for (const i of list) if (i.month) arr[i.month - 1]++;
  return arr;
}

// Estimated man-hours for KPI illustration (KMG group ~ tens of thousands of employees)
// Using a representative figure to derive LTIR/FAR from real counts.
const MANHOURS = 1_350_000_000; // ~2020-2026 cumulative, illustrative
export const LTIR = ((SEVERE + LIGHT) * 1_000_000) / MANHOURS;
export const FAR = (FATAL * 100_000_000) / MANHOURS;
