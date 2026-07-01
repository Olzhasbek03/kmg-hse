import { incidents, korgau, type Incident } from './index';
import type { Dzo } from './passport';
import { rowValue, FORMS } from './passport';
import {
  leadingRowsForDzo,
  leadingLabelKey,
  LEADING_COMPARE_MONTHS,
  LEADING_YEARS,
} from './passportLeading';

export type PassportCategory = 'biot' | 'prombez' | 'fire' | 'health' | 'transport' | 'oos';

export type BodyZone = 'head' | 'chest' | 'armLeft' | 'armRight' | 'legLeft' | 'legRight';

export interface BodyCounts {
  head: number;
  chest: number;
  armLeft: number;
  armRight: number;
  legLeft: number;
  legRight: number;
}

export interface PeriodCompareRow {
  id: string;
  labelKey: string;
  sub?: boolean;
  prev: number;
  curr: number;
  invertTrend?: boolean;
}

export interface LeadingRow {
  id: string;
  labelKey?: string;
  label?: string;
  prev: number;
  curr: number;
  invertTrend?: boolean;
  worseUp?: boolean;
  worseDown?: boolean;
}

export interface PassportStats {
  compareYear: number;
  compareMonths: number;
  workRelated: Incident[];
  categoryLinked: Incident[];
  kpis: {
    workers: number;
    far: number;
    ltir: number;
    mvcr: number;
    nonWorkCoeff: number;
    nearMiss: number;
    workStops: number;
  };
  laggingRows: PeriodCompareRow[];
  leadingRows: LeadingRow[];
  bodyPrev: BodyCounts;
  bodyCurr: BodyCounts;
  severity: { light: number; severe: number; fatal: number };
}

export const COMPARE_MONTHS = 4;

const CATEGORY_FILTER: Record<PassportCategory, (i: Incident) => boolean> = {
  biot: () => true,
  health: () => true,
  prombez: (i) => ['collapse', 'moving_parts', 'electric', 'hazardous', 'fall_height'].includes(i.typeNorm),
  fire: () => false,
  transport: (i) => i.typeNorm === 'vehicle',
  oos: () => false,
};

function inMonthRange(i: Incident, year: number, maxMonth: number): boolean {
  return i.year === year && (i.month ?? 0) >= 1 && (i.month ?? 0) <= maxMonth;
}

export function incidentsForDzo(dzo: Dzo): Incident[] {
  return incidents.filter((i) => i.dzoNorm === dzo.name.ru);
}

export function workRelatedIncidents(list: Incident[]): Incident[] {
  return list.filter((i) => i.production === 'Связан');
}

export function filterByCategory(list: Incident[], category: PassportCategory): Incident[] {
  const pred = CATEGORY_FILTER[category];
  return list.filter(pred);
}

function parseBodyTokens(raw: string | null): Array<'head' | 'chest' | 'arm' | 'leg'> {
  if (!raw || raw === '-') return [];
  const tokens: Array<'head' | 'chest' | 'arm' | 'leg'> = [];
  for (const chunk of raw.split(/[\n,;]+/)) {
    const t = chunk.toLowerCase();
    if (t.includes('голов') || t.includes('глова')) tokens.push('head');
    if (t.includes('тело') || t.includes('груд') || t.includes('торс')) tokens.push('chest');
    if (t.includes('рук')) tokens.push('arm');
    if (t.includes('ног')) tokens.push('leg');
  }
  return tokens;
}

export function bodyCountsFromIncidents(items: Incident[]): BodyCounts {
  const zones: BodyCounts = { head: 0, chest: 0, armLeft: 0, armRight: 0, legLeft: 0, legRight: 0 };
  let armFlip = 0;
  let legFlip = 0;
  for (const inc of items) {
    if (!inc.victim) continue;
    const parts = parseBodyTokens(inc.bodyPart);
    for (const p of parts) {
      if (p === 'head') zones.head++;
      else if (p === 'chest') zones.chest++;
      else if (p === 'arm') {
        if (armFlip++ % 2 === 0) zones.armLeft++;
        else zones.armRight++;
      } else if (p === 'leg') {
        if (legFlip++ % 2 === 0) zones.legLeft++;
        else zones.legRight++;
      }
    }
  }
  return zones;
}

function countVictims(list: Incident[]): number {
  return list.filter((i) => Boolean(i.victim?.trim())).length;
}

function countFatalVictims(list: Incident[]): number {
  return list.filter((i) => Boolean(i.victim?.trim()) && i.severityNorm === 'fatal').length;
}

function countNonWorkFatal(all: Incident[], year: number, maxMonth: number): number {
  return all.filter(
    (i) =>
      i.production === 'Не связан' &&
      i.severityNorm === 'fatal' &&
      inMonthRange(i, year, maxMonth)
  ).length;
}

function countDtp(all: Incident[], year: number, maxMonth: number): number {
  return all.filter((i) => i.typeNorm === 'vehicle' && inMonthRange(i, year, maxMonth)).length;
}

function severityBreakdown(list: Incident[]): { light: number; severe: number; fatal: number } {
  const injured = list.filter((i) => Boolean(i.victim?.trim()));
  return {
    light: injured.filter((i) => i.severityNorm === 'light').length,
    severe: injured.filter((i) => i.severityNorm === 'severe').length,
    fatal: injured.filter((i) => i.severityNorm === 'fatal').length,
  };
}

function korgauForDzo(dzo: Dzo) {
  return korgau.find((k) => k.org === dzo.name.ru);
}

function leadingValue(dzo: Dzo, formId: string, code: string): number {
  const form = FORMS.find((f) => f.id === formId);
  const row = form?.rows.find((r) => r.code === code);
  if (!row) return 0;
  const v = rowValue(dzo, formId, row, false);
  return v ?? 0;
}

export function computePassportStats(dzo: Dzo, category: PassportCategory = 'biot'): PassportStats {
  const all = incidentsForDzo(dzo);
  const linked = workRelatedIncidents(all);
  const categoryLinked = filterByCategory(linked, category);

  const years = all.map((i) => i.year).filter((y): y is number => y != null);
  const leadingFromFile = leadingRowsForDzo(dzo);
  const compareYear = leadingFromFile ? LEADING_YEARS.curr : (years.length ? Math.max(...years) : new Date().getFullYear());
  const prevYear = leadingFromFile ? LEADING_YEARS.prev : compareYear - 1;
  const compareMonths = leadingFromFile ? LEADING_COMPARE_MONTHS : COMPARE_MONTHS;

  const prevLinked = categoryLinked.filter((i) => inMonthRange(i, prevYear, compareMonths));
  const currLinked = categoryLinked.filter((i) => inMonthRange(i, compareYear, compareMonths));

  const kg = korgauForDzo(dzo);
  const yearKey = `y${compareYear}` as keyof typeof kg;
  const nmYear = kg && typeof kg[yearKey] === 'number' ? (kg[yearKey] as number) : dzo.nearMiss;

  const leadingRows: LeadingRow[] = leadingFromFile
    ? leadingFromFile.map((r) => ({
        id: r.id,
        labelKey: leadingLabelKey(r.id),
        label: r.label,
        prev: r.prev,
        curr: r.curr,
        worseUp: r.worseUp,
        worseDown: r.id === 'resolved',
      }))
    : [
        { id: 'audits', labelKey: 'pp.lead.audits', prev: Math.round(leadingValue(dzo, 'kmg7', '1') * 0.8), curr: leadingValue(dzo, 'kmg7', '1') + leadingValue(dzo, 'kmg7', '3') },
        { id: 'indepAudits', labelKey: 'pp.lead.indepAudits', prev: 0, curr: leadingValue(dzo, 'kmg7', '4') },
        { id: 'findings', labelKey: 'pp.lead.findings', prev: Math.round(leadingValue(dzo, 'kmg7', '2') * 0.9), curr: leadingValue(dzo, 'kmg7', '2') + leadingValue(dzo, 'kmg6', '18'), worseUp: true },
        { id: 'resolved', labelKey: 'pp.lead.resolved', prev: Math.round(leadingValue(dzo, 'kmg7', '2.1') * 0.85), curr: leadingValue(dzo, 'kmg7', '2.1') + leadingValue(dzo, 'kmg6', '19'), worseDown: true },
        { id: 'nearMiss', labelKey: 'pp.lead.nearMiss', prev: Math.round((kg?.nm ?? nmYear) * 0.7), curr: kg?.nm ?? nmYear },
        { id: 'unsafeActs', labelKey: 'pp.lead.unsafeActs', prev: Math.round((kg?.total ?? 500) * 0.05), curr: Math.round((kg?.total ?? 500) * 0.06), worseUp: true },
        { id: 'unsafeCond', labelKey: 'pp.lead.unsafeCond', prev: Math.round((kg?.total ?? 500) * 0.12), curr: Math.round((kg?.total ?? 500) * 0.14), worseUp: true },
        { id: 'stops', labelKey: 'pp.lead.stops', prev: Math.round(leadingValue(dzo, 'kmg1', '9.3') * 0.8), curr: leadingValue(dzo, 'kmg1', '9.3'), worseUp: true },
        { id: 'medical', labelKey: 'pp.lead.medical', prev: Math.round(leadingValue(dzo, 'kmg1', '10') * 0.9), curr: leadingValue(dzo, 'kmg1', '10'), worseUp: true },
        { id: 'nebosh', labelKey: 'pp.lead.nebosh', prev: 0, curr: Math.max(0, Math.round(dzo.workers / 12000)) },
        { id: 'iosh', labelKey: 'pp.lead.iosh', prev: 0, curr: Math.max(0, Math.round(dzo.workers / 4000)) },
        { id: 'defensive', labelKey: 'pp.lead.defensive', prev: Math.round(leadingValue(dzo, 'kmg2', 'dd') * 0.85), curr: leadingValue(dzo, 'kmg2', 'dd') },
        { id: 'forums', labelKey: 'pp.lead.forums', prev: leadingValue(dzo, 'kmg1', '15'), curr: leadingValue(dzo, 'kmg1', '15') },
        { id: 'meetings', labelKey: 'pp.lead.meetings', prev: Math.round(leadingValue(dzo, 'kmg1', '16') * 0.9), curr: leadingValue(dzo, 'kmg1', '16') },
      ];

  const currFatalWork = countFatalVictims(currLinked);
  const manhours = dzo.manhours || dzo.workers * 2000;
  const far = manhours > 0 ? (currFatalWork * 100_000_000) / manhours : 0;
  const recordable = currLinked.filter((i) => i.severityNorm && i.severityNorm !== 'other').length;
  const ltir = manhours > 0 ? (recordable * 200_000) / manhours : 0;
  const mvcr = countDtp(all, compareYear, compareMonths);
  const nonWorkFatal = countNonWorkFatal(all, compareYear, compareMonths);
  const nonWorkCoeff = dzo.workers > 0 ? (nonWorkFatal * 1000) / dzo.workers : 0;

  const laggingRows: PeriodCompareRow[] = [
    { id: 'workAcc', labelKey: 'pp.ind.workAccidents', prev: prevLinked.length, curr: currLinked.length },
    {
      id: 'injured',
      labelKey: 'pp.ind.injured',
      prev: countVictims(prevLinked),
      curr: countVictims(currLinked),
    },
    {
      id: 'injFatal',
      labelKey: 'pp.ind.injuredFatal',
      sub: true,
      prev: countFatalVictims(prevLinked),
      curr: countFatalVictims(currLinked),
    },
    {
      id: 'nonWorkFatal',
      labelKey: 'pp.ind.nonWorkFatal',
      prev: countNonWorkFatal(all, prevYear, compareMonths),
      curr: countNonWorkFatal(all, compareYear, compareMonths),
    },
    {
      id: 'dtp',
      labelKey: 'pp.ind.dtp',
      prev: countDtp(all, prevYear, compareMonths),
      curr: countDtp(all, compareYear, compareMonths),
      invertTrend: true,
    },
    { id: 'fires', labelKey: 'pp.ind.fires', prev: 0, curr: 0 },
    {
      id: 'lsr',
      labelKey: 'pp.ind.lsr',
      prev: Math.round(leadingValue(dzo, 'kmg1', '12') * 0.15),
      curr: Math.round(leadingValue(dzo, 'kmg1', '12') * 0.2),
    },
  ];

  return {
    compareYear,
    compareMonths,
    workRelated: linked,
    categoryLinked,
    kpis: {
      workers: dzo.workers,
      far,
      ltir,
      mvcr,
      nonWorkCoeff,
      nearMiss: kg?.nm ?? dzo.nearMiss,
      workStops: leadingValue(dzo, 'kmg1', '9.3'),
    },
    laggingRows,
    leadingRows,
    bodyPrev: bodyCountsFromIncidents(prevLinked),
    bodyCurr: bodyCountsFromIncidents(currLinked),
    severity: severityBreakdown(currLinked),
  };
}

export function pctChange(prev: number, curr: number): number | null {
  if (prev === 0 && curr === 0) return 0;
  if (prev === 0) return 100;
  return Math.round(((curr - prev) / prev) * 100);
}

export function liveDzoKpis(dzo: Dzo) {
  const linked = workRelatedIncidents(incidentsForDzo(dzo));
  const year = new Date().getFullYear();
  const ytd = linked.filter((i) => i.year === year);
  return {
    ntr: ytd.length || linked.filter((i) => i.year === year - 1).length,
    nearMiss: korgauForDzo(dzo)?.nm ?? dzo.nearMiss,
    ltir: dzo.ltir,
  };
}
