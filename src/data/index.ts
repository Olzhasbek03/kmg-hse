import incidentsRaw from './incidents.json';
import korgauRaw from './korgau.json';
import korgauSummaryRaw from './korgau_summary.json';
import forecastRaw from './forecast.json';
import classifierRaw from './classifier.json';

export interface Incident {
  id: number;
  num: number | string | null;
  status: string | null;
  date: string | null;
  year: number | null;
  month: number | null;
  weekday: string | null;
  time: string | null;
  period: string | null;
  classification: string | null;
  dzo: string | null;
  dzoNorm: string | null;
  businessLine: string | null;
  region: string | null;
  place: string | null;
  type: string | null;
  typeNorm: string;
  description: string | null;
  firstMeasures: string | null;
  prelimCauses: string | null;
  consequences: string | null;
  damage: number | string | null;
  mainCauses: string | null;
  rootCauses: string | null;
  workType: string | null;
  victim: string | null;
  gender: string | null;
  birthYear: number | string | null;
  age: number | string | null;
  ageCategory: string | null;
  position: string | null;
  personnelCategory: string | null;
  severity: string | null;
  severityNorm: 'fatal' | 'severe' | 'light' | 'other' | null;
  diagnosis: string | null;
  bodyPart: string | null;
  tenure: number | string | null;
  production: string | null;
  notifiedBodies: string | null;
  productionImpact: string | null;
}

export interface KorgauOrg {
  org: string;
  total: number;
  nm: number;
  nm1000: number;
  unresolved: number;
  gp: number;
  y2023: number;
  y2024: number;
  y2025: number;
  y2026: number;
}

export interface ForecastRow {
  dzo: string;
  quarter: string;
  risk: string;
  work: string;
  probability: string;
  precursors: string;
  history: string;
  action: string;
}

export const incidents = incidentsRaw as unknown as Incident[];
export const korgau = korgauRaw as unknown as KorgauOrg[];
export const korgauSummary = korgauSummaryRaw as Record<string, number | string>;
export const forecast = forecastRaw as unknown as ForecastRow[];
export const classifier = classifierRaw as { ru: string; kz: string; counts: Record<string, number> }[];

export function uniqueSorted<T>(arr: (T | null | undefined)[]): T[] {
  return Array.from(new Set(arr.filter((v): v is T => v != null && v !== ''))).sort((a, b) =>
    String(a).localeCompare(String(b), 'ru')
  );
}

export function countBy<T>(arr: T[], key: (x: T) => string | null | undefined): Record<string, number> {
  const out: Record<string, number> = {};
  for (const x of arr) {
    const k = key(x);
    if (k == null || k === '') continue;
    out[k] = (out[k] ?? 0) + 1;
  }
  return out;
}

export const MONTHS_RU = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
export const MONTHS_KZ = ['Қаң', 'Ақп', 'Нау', 'Сәу', 'Мам', 'Мау', 'Шіл', 'Там', 'Қыр', 'Қаз', 'Қар', 'Жел'];
export const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const SEVERITY_COLORS: Record<string, string> = {
  fatal: '#d24545',
  severe: '#e08a1e',
  light: '#1f9d57',
  other: '#7a8aa0',
};

export const CHART_COLORS = ['#1559a8', '#2f73c4', '#1f9d57', '#e08a1e', '#d24545', '#7b61ff', '#15a3b3', '#9d6b1f', '#c44ea0', '#5a708f'];
