import leadingRaw from './passportLeading.json';
import type { Dzo } from './passport';

export interface LeadingAnalysisRow {
  id: string;
  label: string;
  prev: number;
  curr: number;
  worseUp?: boolean;
}

interface LeadingPack {
  short: string;
  rows: LeadingAnalysisRow[];
}

const LEAD_LABEL_KEYS: Record<string, string> = {
  audits: 'pp.lead.audits',
  indepAudits: 'pp.lead.indepAudits',
  findings: 'pp.lead.findings',
  resolved: 'pp.lead.resolved',
  pab: 'pp.lead.pab',
  nearMiss: 'pp.lead.nearMiss',
  unsafeActs: 'pp.lead.unsafeActs',
  unsafeCond: 'pp.lead.unsafeCond',
  stops: 'pp.lead.stops',
  medical: 'pp.lead.medical',
  nebosh: 'pp.lead.nebosh',
  iosh: 'pp.lead.iosh',
  defensive: 'pp.lead.defensive',
  forums: 'pp.lead.forums',
  meetings: 'pp.lead.meetings',
};

const data = leadingRaw as {
  source: string;
  compareMonths: number;
  prevYear: number;
  currYear: number;
  byId: Record<string, LeadingPack>;
};

export const LEADING_SOURCE = data.source;
export const LEADING_COMPARE_MONTHS = data.compareMonths;
export const LEADING_YEARS = { prev: data.prevYear, curr: data.currYear };

export function leadingRowsForDzo(dzo: Dzo): LeadingAnalysisRow[] | null {
  const pack = data.byId[dzo.id];
  if (!pack) return null;
  return pack.rows.filter(
    (r) => r.id !== 'опережающие_индикаторы' && !r.label.toLowerCase().startsWith('опережающие индикаторы')
  );
}

export function leadingLabelKey(id: string): string | undefined {
  return LEAD_LABEL_KEYS[id];
}

/** Resolved findings going down is worse */
export function isWorseTrend(
  prev: number,
  curr: number,
  opts?: { invert?: boolean; worseUp?: boolean; worseDown?: boolean }
): boolean {
  const delta = curr - prev;
  if (delta === 0) return false;
  if (opts?.invert) return delta < 0;
  if (opts?.worseDown) return delta < 0;
  if (opts?.worseUp) return delta > 0;
  return delta > 0;
}
