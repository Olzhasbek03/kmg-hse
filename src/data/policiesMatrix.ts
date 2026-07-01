import * as XLSX from 'xlsx';
import type { Lang } from '../i18n';
import matrixData from './policiesMatrix.json';

export const MATRIX_ALL_ID = 'all';

export type MatrixStatus =
  | 'VN' | 'AKT' | 'RAZ' | 'NR' | 'NES' | 'NP'
  | 'PLUS' | 'MINUS' | 'PLAN26' | 'PLAN27' | 'EMPTY';

export const STATUS_LABEL: Record<MatrixStatus, string> = {
  VN: 'ВН',
  AKT: 'АКТ',
  RAZ: 'РАЗ',
  NR: 'НР',
  NES: 'НЕС',
  NP: 'Н/П',
  PLUS: '+',
  MINUS: '−',
  PLAN26: 'План 2026',
  PLAN27: 'План 2027',
  EMPTY: '—',
};

export interface MatrixRow {
  name: string;
  statuses: MatrixStatus[];
}

export interface BusinessDirection {
  id: string;
  label: Record<Lang, string>;
  columns: string[];
  xlsx: string;
  rows: MatrixRow[];
}

export const BUSINESS_DIRECTIONS = matrixData.directions as BusinessDirection[];

export const LEGEND: { code: MatrixStatus; desc: Record<Lang, string> }[] = [
  { code: 'VN', desc: { ru: 'Внедрено', kz: 'Енгізілген', en: 'Implemented' } },
  { code: 'AKT', desc: { ru: 'Актуализировано в 2023–2025 гг.', kz: '2023–2025 жж. өзектендірілген', en: 'Updated in 2023–2025' } },
  { code: 'RAZ', desc: { ru: 'В разработке', kz: 'Әзірленуде', en: 'In development' } },
  { code: 'NR', desc: { ru: 'Не разработано', kz: 'Әзірленбеген', en: 'Not developed' } },
  { code: 'NES', desc: { ru: 'Не соответствует', kz: 'Сәйкес келмейді', en: 'Non-compliant' } },
  { code: 'NP', desc: { ru: 'Не применимо', kz: 'Қолданылмайды', en: 'Not applicable' } },
];

export function downloadMatrixReport(direction: BusinessDirection) {
  const a = document.createElement('a');
  a.href = direction.xlsx;
  a.download = direction.xlsx.split('/').pop() ?? 'matrix.xlsx';
  a.click();
}

export interface DzoStatusPct {
  code: string;
  done: number;
  notDone: number;
}

export interface DirectionRollup {
  id: string;
  label: Record<Lang, string>;
  done: number;
  notDone: number;
}

export interface NotDoneItem {
  dzo: string;
  document: string;
  status: 'NR' | 'NES';
  directionId: string;
}

const DONE_STATUSES: MatrixStatus[] = ['VN', 'AKT', 'NP'];
const NOT_DONE_STATUSES: MatrixStatus[] = ['NR', 'NES'];

function directionById(directionId: string): BusinessDirection {
  return BUSINESS_DIRECTIONS.find((d) => d.id === directionId) ?? BUSINESS_DIRECTIONS[0];
}

function directionsForFilter(directionId: string): BusinessDirection[] {
  return directionId === MATRIX_ALL_ID ? BUSINESS_DIRECTIONS : [directionById(directionId)];
}

function aggregateDirection(direction: BusinessDirection): { done: number; notDone: number } {
  let total = 0;
  let doneCount = 0;
  let notDone = 0;
  for (let i = 0; i < direction.columns.length; i++) {
    for (const row of direction.rows) {
      const s = row.statuses[i];
      if (s === 'EMPTY') continue;
      total++;
      if (DONE_STATUSES.includes(s)) doneCount++;
      if (NOT_DONE_STATUSES.includes(s)) notDone++;
    }
  }
  return {
    done: total > 0 ? Math.round((doneCount / total) * 100) : 0,
    notDone,
  };
}

function columnDonePct(direction: BusinessDirection, colIndex: number): number {
  let total = 0;
  let done = 0;
  for (const row of direction.rows) {
    const s = row.statuses[colIndex];
    if (s === 'EMPTY') continue;
    total++;
    if (DONE_STATUSES.includes(s)) done++;
  }
  if (total === 0) return 0;
  return Math.round((done / total) * 100);
}

function columnNotDoneCount(direction: BusinessDirection, colIndex: number): number {
  let count = 0;
  for (const row of direction.rows) {
    const s = row.statuses[colIndex];
    if (NOT_DONE_STATUSES.includes(s)) count++;
  }
  return count;
}

export function getDirectionRollups(): DirectionRollup[] {
  return BUSINESS_DIRECTIONS.map((d) => {
    const agg = aggregateDirection(d);
    return { id: d.id, label: d.label, done: agg.done, notDone: agg.notDone };
  });
}

export function getAllTotals(): { done: number; notDone: number } {
  let total = 0;
  let doneCount = 0;
  let notDone = 0;
  for (const d of BUSINESS_DIRECTIONS) {
    for (let i = 0; i < d.columns.length; i++) {
      for (const row of d.rows) {
        const s = row.statuses[i];
        if (s === 'EMPTY') continue;
        total++;
        if (DONE_STATUSES.includes(s)) doneCount++;
        if (NOT_DONE_STATUSES.includes(s)) notDone++;
      }
    }
  }
  return {
    done: total > 0 ? Math.round((doneCount / total) * 100) : 0,
    notDone,
  };
}

export function getDzoSummary(directionId = 'production'): DzoStatusPct[] {
  if (directionId === MATRIX_ALL_ID) return [];
  const direction = directionById(directionId);
  return direction.columns.map((code, i) => ({
    code,
    done: columnDonePct(direction, i),
    notDone: columnNotDoneCount(direction, i),
  }));
}

export function getNotDoneItems(directionId: string, dzoCode?: string, filterDirectionId?: string): NotDoneItem[] {
  const directions = directionsForFilter(directionId).filter(
    (d) => !filterDirectionId || d.id === filterDirectionId,
  );
  const items: NotDoneItem[] = [];
  for (const direction of directions) {
    for (const row of direction.rows) {
      row.statuses.forEach((s, i) => {
        const dzo = direction.columns[i];
        if (dzoCode && dzo !== dzoCode) return;
        if (s === 'NR' || s === 'NES') {
          items.push({ dzo, document: row.name, status: s, directionId: direction.id });
        }
      });
    }
  }
  return items;
}

function sheetName(label: string): string {
  return label.replace(/[\\/*?:[\]]/g, '').slice(0, 31);
}

const EXPORT_LABELS: Record<Lang, Record<string, string>> = {
  ru: {
    summary: 'Сводка',
    matrix: 'Матрица',
    notDone: 'Невыполнено',
    direction: 'Бизнес направление',
    dzo: 'ДЗО',
    requirement: 'Требование',
    status: 'Статус',
    donePct: 'Выполнено %',
    notDoneCount: 'Невыполнено (НР+НЕС)',
    total: 'ИТОГО',
  },
  kz: {
    summary: 'Қорытынды',
    matrix: 'Матрица',
    notDone: 'Орындалмаған',
    direction: 'Бизнес бағыты',
    dzo: 'ЕТҰ',
    requirement: 'Талап',
    status: 'Мәртебе',
    donePct: 'Орындалды %',
    notDoneCount: 'Орындалмаған (НР+НЕС)',
    total: 'БАРЛЫҒЫ',
  },
  en: {
    summary: 'Summary',
    matrix: 'Matrix',
    notDone: 'Not completed',
    direction: 'Business direction',
    dzo: 'Subsidiary',
    requirement: 'Requirement',
    status: 'Status',
    donePct: 'Completed %',
    notDoneCount: 'Not completed (NR+NES)',
    total: 'TOTAL',
  },
};

export function exportMatrixToExcel(directionId: string, lang: Lang = 'ru') {
  const L = EXPORT_LABELS[lang];
  const wb = XLSX.utils.book_new();

  const summaryRows: (string | number)[][] = [
    [L.direction, L.dzo, L.donePct, L.notDoneCount],
  ];

  if (directionId === MATRIX_ALL_ID) {
    for (const r of getDirectionRollups()) {
      summaryRows.push([r.label[lang], '—', r.done, r.notDone]);
      for (const s of getDzoSummary(r.id)) {
        summaryRows.push(['', s.code, s.done, s.notDone]);
      }
    }
    const totals = getAllTotals();
    summaryRows.push([L.total, '—', totals.done, totals.notDone]);
  } else {
    const direction = directionById(directionId);
    const agg = aggregateDirection(direction);
    summaryRows.push([direction.label[lang], '—', agg.done, agg.notDone]);
    for (const s of getDzoSummary(directionId)) {
      summaryRows.push(['', s.code, s.done, s.notDone]);
    }
  }
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summaryRows), sheetName(L.summary));

  for (const d of directionsForFilter(directionId)) {
    const header = [L.requirement, ...d.columns];
    const body = d.rows.map((r) => [
      r.name,
      ...r.statuses.map((s) => STATUS_LABEL[s] ?? s),
    ]);
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.aoa_to_sheet([header, ...body]),
      sheetName(d.label[lang]),
    );
  }

  const notDone = getNotDoneItems(directionId);
  const ndHeader =
    directionId === MATRIX_ALL_ID
      ? [L.direction, L.dzo, L.requirement, L.status]
      : [L.dzo, L.requirement, L.status];
  const ndBody = notDone.map((item) => {
    const dir = directionById(item.directionId);
    const row = [item.dzo, item.document, STATUS_LABEL[item.status]];
    return directionId === MATRIX_ALL_ID ? [dir.label[lang], ...row] : row;
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([ndHeader, ...ndBody]), sheetName(L.notDone));

  const fileStem =
    directionId === MATRIX_ALL_ID
      ? 'matrix-all-directions'
      : `matrix-${directionId}`;
  XLSX.writeFile(wb, `${fileStem}.xlsx`);
}
