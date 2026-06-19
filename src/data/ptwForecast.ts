import { forecast, type ForecastRow } from './index';
import {
  permits,
  PTW_CATEGORIES,
  CATEGORY_LABEL,
  countByField,
  type PtwCategory,
  type Permit,
} from './ptw';
import type { Lang } from '../i18n';

/** Map forecast risk/work text → PTW work categories used in the END journal. */
const RISK_TO_PTW: { test: RegExp; categories: PtwCategory[] }[] = [
  { test: /обруш|падение предмет|tesilip|порыв|тесіл/i, categories: ['hot_work', 'pumping_unit', 'well_completion', 'paraffin'] },
  { test: /враща|арок|балансир|ск\b|качал|крс|прс|нкт/i, categories: ['pumping_unit', 'paraffin', 'well_completion'] },
  { test: /высот|биікт|падени/i, categories: ['height'] },
  { test: /замкнут|тұйық|ограничен/i, categories: ['confined'] },
  { test: /электр|loto|ток/i, categories: ['electrical'] },
  { test: /огнев|отты|сварк|дәнекер/i, categories: ['hot_work'] },
  { test: /землян|жер /i, categories: ['excavation'] },
];

export type SignalLevel = 'critical' | 'elevated' | 'normal';

export interface PtwSignal {
  categories: PtwCategory[];
  total: number;
  closed: number;
  rejected: number;
  highRisk: number;
  level: SignalLevel;
  /** 0–100 — share of journal volume for matched categories */
  sharePct: number;
}

export interface EnrichedForecast extends ForecastRow {
  ptw: PtwSignal;
  ptwAction: Record<Lang, string>;
}

export const PTW_SUMMARY = {
  total: permits.length,
  closed: permits.filter((p) => p.status === 'closed').length,
  rejected: permits.filter((p) => p.status === 'rejected').length,
  highRisk: permits.filter((p) => p.risk === 'high').length,
  byCategory: countByField(permits, 'category') as Record<PtwCategory, number>,
};

function categoriesForForecast(row: ForecastRow): PtwCategory[] {
  const text = `${row.risk} ${row.work} ${row.action}`;
  const set = new Set<PtwCategory>();
  for (const rule of RISK_TO_PTW) {
    if (rule.test.test(text)) rule.categories.forEach((c) => set.add(c));
  }
  if (set.size === 0) set.add('other');
  return [...set];
}

function permitsForCategories(cats: PtwCategory[]): Permit[] {
  const s = new Set(cats);
  return permits.filter((p) => s.has(p.category));
}

function signalLevel(total: number, rejected: number, highRisk: number, prob: string): SignalLevel {
  const highProb = prob.includes('ВЫСОКАЯ') || prob.includes('🔴');
  if ((highProb && rejected > 0) || (highProb && total >= 10) || rejected >= 3) return 'critical';
  if (highProb || total >= 5 || rejected > 0 || highRisk >= 3) return 'elevated';
  return 'normal';
}

export function ptwSignalForForecast(row: ForecastRow): PtwSignal {
  const categories = categoriesForForecast(row);
  const matched = permitsForCategories(categories);
  const total = matched.length;
  const closed = matched.filter((p) => p.status === 'closed').length;
  const rejected = matched.filter((p) => p.status === 'rejected').length;
  const highRisk = matched.filter((p) => p.risk === 'high').length;
  const catTotal = categories.reduce((s, c) => s + (PTW_SUMMARY.byCategory[c] ?? 0), 0);
  const sharePct = PTW_SUMMARY.total ? Math.round((catTotal / PTW_SUMMARY.total) * 100) : 0;
  return {
    categories,
    total,
    closed,
    rejected,
    highRisk,
    level: signalLevel(total, rejected, highRisk, row.probability),
    sharePct,
  };
}

function ptwAction(row: ForecastRow, sig: PtwSignal): Record<Lang, string> {
  const cats = sig.categories.map((c) => CATEGORY_LABEL[c].ru).join(', ');
  if (sig.level === 'critical') {
    return {
      ru: `ЭНД: ${sig.total} нарядов (${cats}), ${sig.rejected} отклонено — усилить контроль допуска до начала работ`,
      kz: `ЭНД: ${sig.total} наряд (${cats}), ${sig.rejected} қабылданбады — жұмыс алдында рұқсат бақылауын күшейту`,
      en: `END: ${sig.total} permits (${cats}), ${sig.rejected} rejected — tighten permit control before work starts`,
    };
  }
  if (sig.level === 'elevated') {
    return {
      ru: `ЭНД: ${sig.total} нарядов по риску «${row.risk.replace(/[🔴🟠🟡🟢▌]/g, '').trim()}» — проверить оценку рисков в наряде`,
      kz: `ЭНД: «${row.risk.replace(/[🔴🟠🟡🟢▌]/g, '').trim()}» қаупі бойынша ${sig.total} наряд — нарядта тәуекелді бағалауды тексеру`,
      en: `END: ${sig.total} permits for «${row.risk.replace(/[🔴🟠🟡🟢▌]/g, '').trim()}» — verify risk assessment in permit`,
    };
  }
  return {
    ru: `ЭНД: ${sig.total} нарядов — профиль в норме, продолжить мониторинг`,
    kz: `ЭНД: ${sig.total} наряд — профиль қалыпты, бақылауды жалғастыру`,
    en: `END: ${sig.total} permits — profile normal, continue monitoring`,
  };
}

export function enrichedForecast(): EnrichedForecast[] {
  return forecast.map((row) => {
    const ptw = ptwSignalForForecast(row);
    return { ...row, ptw, ptwAction: ptwAction(row, ptw) };
  });
}

/** Forecast rows most relevant to current PTW journal (for PTW module). */
export function forecastForPtw(limit = 6): EnrichedForecast[] {
  return enrichedForecast()
    .filter((r) => r.ptw.total > 0)
    .sort((a, b) => {
      const score = (r: EnrichedForecast) =>
        r.ptw.total * 2 + r.ptw.rejected * 5 + (r.probability.includes('ВЫСОКАЯ') ? 10 : 0);
      return score(b) - score(a);
    })
    .slice(0, limit);
}

/** Chart: PTW volume by category aligned with forecast risk groups. */
export function ptwCategoryChart(lang: Lang): { name: string; permits: number; forecastHits: number }[] {
  const hits: Partial<Record<PtwCategory, number>> = {};
  for (const row of enrichedForecast()) {
    for (const c of row.ptw.categories) {
      hits[c] = (hits[c] ?? 0) + 1;
    }
  }
  return PTW_CATEGORIES.map((c) => ({
    name: CATEGORY_LABEL[c][lang],
    permits: PTW_SUMMARY.byCategory[c] ?? 0,
    forecastHits: hits[c] ?? 0,
  })).filter((d) => d.permits > 0);
}

export function signalTone(level: SignalLevel): 'red' | 'amber' | 'green' {
  return level === 'critical' ? 'red' : level === 'elevated' ? 'amber' : 'green';
}
