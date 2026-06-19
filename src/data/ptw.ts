import type { Lang } from '../i18n';
import ptwRaw from './ptw.json';

export type PtwStatus = 'closed' | 'rejected' | 'active' | 'pending';
export type PtwRisk = 'high' | 'medium' | 'low';
export type PtwCategory =
  | 'hot_work'
  | 'confined'
  | 'height'
  | 'excavation'
  | 'well_completion'
  | 'paraffin'
  | 'pumping_unit'
  | 'electrical'
  | 'other';

export interface Permit {
  seq: number;
  num: string;
  start: string | null;
  end: string | null;
  issuer: string;
  work: string;
  status: PtwStatus;
  category: PtwCategory;
  risk: PtwRisk;
}

export const permits = ptwRaw as unknown as Permit[];

export const PTW_CATEGORIES: PtwCategory[] = [
  'hot_work',
  'confined',
  'height',
  'excavation',
  'well_completion',
  'paraffin',
  'pumping_unit',
  'electrical',
  'other',
];

export const CATEGORY_LABEL: Record<PtwCategory, Record<Lang, string>> = {
  hot_work: { ru: 'Огневые работы', kz: 'Отты жұмыстар', en: 'Hot work' },
  confined: { ru: 'Замкнутое пространство', kz: 'Тұйық кеңістік', en: 'Confined space' },
  height: { ru: 'Работы на высоте', kz: 'Биіктегі жұмыстар', en: 'Work at height' },
  excavation: { ru: 'Земляные работы', kz: 'Жер жұмыстары', en: 'Excavation' },
  well_completion: { ru: 'Обустройство скважин', kz: 'Ұңғымаларды жайластыру', en: 'Well completion' },
  paraffin: { ru: 'Продувка / парафин', kz: 'Парафинді өту', en: 'Blowdown / paraffin' },
  pumping_unit: { ru: 'Станки-качалки', kz: 'Тербелме станоктары', en: 'Pumping units' },
  electrical: { ru: 'Электромонтаж (LOTO)', kz: 'Электрмонтаж (LOTO)', en: 'Electrical (LOTO)' },
  other: { ru: 'Прочие', kz: 'Басқа', en: 'Other' },
};

export function countByField(items: Permit[], key: keyof Permit): Record<string, number> {
  const out: Record<string, number> = {};
  for (const item of items) {
    const v = String(item[key]);
    out[v] = (out[v] ?? 0) + 1;
  }
  return out;
}

export function topIssuers(limit = 8): { name: string; value: number }[] {
  const counts = countByField(permits, 'issuer');
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, value]) => ({ name: name.split(' ')[0] + ' ' + (name.split(' ')[1] ?? ''), value }));
}
