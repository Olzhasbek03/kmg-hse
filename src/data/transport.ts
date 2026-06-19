import type { Lang } from '../i18n';

// Source: "СВОД Информация по ДТП 2020-2024" + "Свод Информация по ДТП за 12 месяцев 2025 года"
// Group companies of JSC NC "KazMunayGas". Counts of road traffic accidents (RTA/ДТП) by year.
export const DTP_YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025];

export interface DtpDzoRow {
  short: string;
  dzo: string;
  y: number[]; // aligned with DTP_YEARS
  total: number;
}

export const DTP_BY_DZO: DtpDzoRow[] = [
  { short: 'КБМ', dzo: 'АО «Каражанбасмунай»', y: [1, 1, 5, 3, 5, 1, 0], total: 16 },
  { short: 'ККС', dzo: 'ТОО «Кен Курылыс Сервис»', y: [0, 2, 0, 0, 0, 0, 1], total: 3 },
  { short: 'КМГ-С', dzo: 'ТОО «KMG-Security»', y: [6, 1, 1, 6, 5, 1, 0], total: 20 },
  { short: 'КОА', dzo: 'ТОО «КазахОйл Актобе»', y: [0, 0, 1, 0, 0, 0, 1], total: 2 },
  { short: 'КТО', dzo: 'АО «КазТрансОйл»', y: [5, 4, 6, 4, 2, 1, 3], total: 25 },
  { short: 'ММГ', dzo: 'АО «Мангистаумунайгаз»', y: [2, 0, 0, 1, 2, 0, 1], total: 6 },
  { short: 'ОМГ', dzo: 'АО «Озенмунайгаз»', y: [4, 1, 4, 3, 3, 3, 3], total: 21 },
  { short: 'ОМС', dzo: 'ТОО «ОзенМунайСервис»', y: [0, 0, 1, 1, 0, 0, 0], total: 2 },
  { short: 'ОСК', dzo: 'ТОО «Oil Services Company»', y: [2, 1, 0, 1, 0, 0, 1], total: 5 },
  { short: 'ОТК', dzo: 'ТОО «Oil Transport Corporation»', y: [4, 2, 3, 2, 2, 0, 2], total: 15 },
  { short: 'КГМ', dzo: 'ТОО СП «КазГерМунай»', y: [0, 0, 0, 0, 0, 0, 1], total: 1 },
  { short: 'Ромпетрол', dzo: 'KMG International', y: [0, 1, 0, 0, 0, 0, 0], total: 1 },
  { short: 'ЭМГ', dzo: 'АО «Эмбамунайгаз»', y: [9, 1, 1, 1, 0, 0, 1], total: 13 },
  { short: 'КТГӨ', dzo: 'ТОО «КазТрансГаз Өнімдері»', y: [9, 1, 0, 0, 0, 0, 0], total: 10 },
  { short: 'КМГӨ', dzo: 'АО «ҚазМұнайГаз Өнімдері»', y: [2, 0, 0, 0, 0, 0, 0], total: 2 },
];

export const DTP_TOTALS = DTP_YEARS.map((_, i) => DTP_BY_DZO.reduce((s, r) => s + r.y[i], 0));

export type DtpClass = 'light' | 'major';
export type DtpFault = 'dzo' | 'third';

export interface Dtp2025 {
  no: number;
  date: string;
  short: string;
  dzo: string;
  line: Record<Lang, string>;
  region: string;
  cls: DtpClass;
  fault: DtpFault;
  desc: string;
}

// Detailed 2025 RTAs involving own (DZO) vehicles
export const DTP_2025: Dtp2025[] = [
  {
    no: 1,
    date: '2025-02-21',
    short: 'ОМГ',
    dzo: 'АО «Озенмунайгаз»',
    line: { ru: 'Добыча', kz: 'Өндіру', en: 'Upstream' },
    region: 'Мангистауская область',
    cls: 'light',
    fault: 'dzo',
    desc: 'На автодороге НГДУ №1 спецтранспорт «Гидромех» УБР столкнулся с автобусом ПАЗ-32054 УТТ при доставке работников. Пострадавших нет.',
  },
  {
    no: 2,
    date: '2025-03-05',
    short: 'ОМГ',
    dzo: 'АО «Озенмунайгаз»',
    line: { ru: 'Добыча', kz: 'Өндіру', en: 'Upstream' },
    region: 'Мангистауская область',
    cls: 'major',
    fault: 'dzo',
    desc: 'На 2 км автодороги Жанаозен—НГДУ-1 водитель служебного «УАЗ Патриот» не справился с управлением, допустил опрокидывание автомашины.',
  },
  {
    no: 3,
    date: '2025-03-19',
    short: 'ОМГ',
    dzo: 'АО «Озенмунайгаз»',
    line: { ru: 'Добыча', kz: 'Өндіру', en: 'Upstream' },
    region: 'Мангистауская область',
    cls: 'light',
    fault: 'dzo',
    desc: 'На 6 км автодороги Жанаозен—НГДУ-1 водитель ПАЗ-32053 на перекрёстке допустил столкновение со спецтранспортом «Камаз». Пострадавших нет.',
  },
  {
    no: 4,
    date: '2025-06-27',
    short: 'ММГ',
    dzo: 'АО «Мангистаумунайгаз»',
    line: { ru: 'Добыча', kz: 'Өндіру', en: 'Upstream' },
    region: 'Мангистауская область',
    cls: 'light',
    fault: 'dzo',
    desc: 'На автодороге Мангышлак—Актау «КамАЗ» (водовоз) Транспортного департамента ММГ столкнулся с Kia Optima у СТО «Кулагер». Пострадавших нет.',
  },
  {
    no: 5,
    date: '2025-12-01',
    short: 'КТО',
    dzo: 'АО «КазТрансОйл»',
    line: { ru: 'Транспортировка', kz: 'Тасымалдау', en: 'Transportation' },
    region: 'Атырауская область',
    cls: 'light',
    fault: 'dzo',
    desc: 'На пересечении трассы А-28 и ул. Г. Бергалиева г. Атырау сторонний «TOYOTA» столкнулся с «Газель» Атырауского НУ АО «КТО». Пострадавших нет.',
  },
  {
    no: 6,
    date: '2025-12-12',
    short: 'КТО',
    dzo: 'АО «КазТрансОйл»',
    line: { ru: 'Транспортировка', kz: 'Тасымалдау', en: 'Transportation' },
    region: 'Мангистауская область',
    cls: 'major',
    fault: 'dzo',
    desc: 'На автодороге «Каламкас—Каражанбас» «КамАЗ-43118» при наезде на обледенелый участок съехал на обочину и опрокинулся на правый бок.',
  },
  {
    no: 7,
    date: '2025-12-28',
    short: 'КТО',
    dzo: 'АО «КазТрансОйл»',
    line: { ru: 'Транспортировка', kz: 'Тасымалдау', en: 'Transportation' },
    region: 'Атырауская область',
    cls: 'major',
    fault: 'third',
    desc: 'На автотрассе «Кульсары—Атырау» сторонний «MAN» столкнулся с «КамАЗ» АНУ АО «КТО». Жертв и пострадавших нет.',
  },
];
