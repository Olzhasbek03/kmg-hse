import type { Lang } from '../i18n';
import orgsRaw from './contractors_orgs.json';

// Source: KMG-ST-3524.1 register (SDR) + Contractors information by subsidiaries_2025

export interface ContractorOrg {
  id: number;
  dir: string | null;
  dzoShort: string | null;
  name: string;
  activity: string | null;
  ns: number;
  victims: number;
  fatal: number;
  workers: number;
  wh: number;
  km: number;
  dtp: number;
}

export interface ContractorSummary {
  year: number;
  source: string;
  orgs: number;
  workers: number;
  wh: number;
  ns: number;
  victims: number;
  fatal: number;
}

const orgsData = orgsRaw as { summary: ContractorSummary; orgs: ContractorOrg[] };

export const CONTRACTOR_ORGS = orgsData.orgs;
export const CONTRACTOR_SUMMARY = orgsData.summary;

/** Map passport / journal DZO full name → short codes in SDR register */
export const DZO_FULL_TO_SHORT: Record<string, string[]> = {
  'АО «Озенмунайгаз»': ['ОМГ'],
  'АО «Каражанбасмунай»': ['Каражанбасмунай'],
  'АО «Эмбамунайгаз»': ['ЭМГ'],
  'АО «Мангистаумунайгаз»': ['Мангистаумунайгаз'],
  'АО «КазТрансОйл»': ['КазТрансОйл'],
  'ТОО «КазГПЗ»': ['КазГПЗ'],
  'ТОО «ПетроКазахстан Ойл Продактс»': ['ПКОП'],
  'ТОО «ПНХЗ»': ['ПНХЗ'],
  'ТОО «KPI Inc.»': ['KPI'],
  'ТОО «Атырауский НПЗ»': ['АНПЗ'],
  'ТОО «Oil Services Company»': ['Oil Service Company'],
  'ТОО «Oil Transport Corporation»': ['Oil Transport Corporation'],
  'ТОО «КМГ Инжиниринг»': ['KMГ Инжиниринг'],
  'ТОО «KMG EP-Catering»': ['KMG EP-Catering'],
  'ТОО «ОзенМунайСервис»': ['ОзенМунайСервис'],
  'ТОО «Кен Курылыс Сервис»': ['Кен-Курылыс-Сервис'],
  'ТОО «KMG-Security»': ['KMG - Security'],
};

export function normContrName(s: string): string {
  return s.toLowerCase().replace(/[«»"'«»\s]+/g, '').replace(/тоо|жшс|ип|ник|чу/g, '');
}

export function findContractorOrg(id: number): ContractorOrg | undefined {
  return CONTRACTOR_ORGS.find((o) => o.id === id);
}

export function contractorsForDzoFull(dzoFull: string): ContractorOrg[] {
  const shorts = DZO_FULL_TO_SHORT[dzoFull] ?? [];
  if (!shorts.length) {
    const key = dzoFull.replace(/[«»]/g, '').toLowerCase();
    return CONTRACTOR_ORGS.filter((o) => o.dzoShort && key.includes(o.dzoShort.toLowerCase().slice(0, 6)));
  }
  return CONTRACTOR_ORGS.filter((o) => o.dzoShort && shorts.includes(o.dzoShort));
}

export function aggregateContractors(list: ContractorOrg[]) {
  return {
    orgs: list.length,
    workers: list.reduce((s, o) => s + o.workers, 0),
    wh: list.reduce((s, o) => s + o.wh, 0),
    ns: list.reduce((s, o) => s + o.ns, 0),
    victims: list.reduce((s, o) => s + o.victims, 0),
    fatal: list.reduce((s, o) => s + o.fatal, 0),
    dtp: list.reduce((s, o) => s + o.dtp, 0),
  };
}

function countContrDtp(dzoFull: string): number {
  const shorts = DZO_FULL_TO_SHORT[dzoFull] ?? [];
  return CONTR_ACCIDENTS_2025.filter(
    (a) => a.dzo === dzoFull || (shorts.length > 0 && shorts.includes(a.short)),
  ).filter((a) => a.type.ru === 'ДТП' || a.type.en === 'RTA').length;
}

/** HSE KPI strip for passport «по подрядным организациям» (2025 contractor register). */
export function computeContractorKpis(
  dzoFull: string,
  companyKpis: { nearMiss: number; workStops: number; nonWorkCoeff: number },
) {
  const list = contractorsForDzoFull(dzoFull);
  const agg = aggregateContractors(list);
  const far = agg.wh > 0 ? (agg.fatal * 100_000_000) / agg.wh : 0;
  const ltir = agg.wh > 0 ? (agg.ns * 1_000_000) / agg.wh : 0;
  const mvcr = agg.dtp > 0 ? agg.dtp : countContrDtp(dzoFull);

  return {
    workers: agg.workers,
    far,
    ltir,
    mvcr,
    nonWorkCoeff: companyKpis.nonWorkCoeff,
    nearMiss: companyKpis.nearMiss,
    workStops: companyKpis.workStops,
  };
}

export function accidentsForContractor(name: string): ContrAccident[] {
  const n = normContrName(name);
  return CONTR_ACCIDENTS_2025.filter((a) => {
    const an = normContrName(a.contractor);
    return an.includes(n.slice(0, 12)) || n.includes(an.slice(0, 12));
  });
}

export function ltirForOrg(o: ContractorOrg): number {
  return o.wh > 0 ? (o.ns * 1_000_000) / o.wh : 0;
}

// Source: "Contractors information by subsidiaries_2025" (Statistics_LTIR_2025,
// Accidents_Contractors_2025) — contractor HSE statistics of the KMG group, 2025.

export type Rating = 'A' | 'B' | 'C' | 'D';

export function ratingFor(ltir: number, ns: number): Rating {
  if (ns === 0 && ltir === 0) return 'A';
  if (ltir < 0.5) return 'A';
  if (ltir < 1.0) return 'B';
  if (ltir < 2.0) return 'C';
  return 'D';
}

export interface ContrDir {
  key: string;
  dir: Record<Lang, string>;
  orgs: number;
  workers: number;
  wh: number;
  ns: number;
  lti: number;
  ltir: number;
}

export const CONTR_DIR_2025: ContrDir[] = [
  { key: 'refining', dir: { ru: 'Переработка', kz: 'Өңдеу', en: 'Refining' }, orgs: 139, workers: 6252, wh: 13024667, ns: 2, lti: 3, ltir: 0.23 },
  { key: 'upstream', dir: { ru: 'Добыча', kz: 'Өндіру', en: 'Upstream' }, orgs: 336, workers: 31002, wh: 44725884, ns: 19, lti: 23, ltir: 0.51 },
  { key: 'transport', dir: { ru: 'Транспортировка', kz: 'Тасымалдау', en: 'Transportation' }, orgs: 162, workers: 4172, wh: 3541361, ns: 1, lti: 1, ltir: 0.28 },
  { key: 'service', dir: { ru: 'Сервис', kz: 'Сервис', en: 'Service' }, orgs: 180, workers: 7719, wh: 15760922, ns: 6, lti: 6, ltir: 0.38 },
];

export const CONTR_TOTAL_2025 = {
  orgs: 817,
  workers: 49146,
  wh: 77052834,
  ns: 28,
  lti: 33,
  ltir: 0.43,
};

export interface ContrDzo {
  dzo: string;
  short: string;
  dir: string; // ContrDir.key
  orgs: number;
  workers: number;
  wh: number;
  ns: number;
  lti: number;
  ltir: number;
}

export const CONTR_BY_DZO_2025: ContrDzo[] = [
  // Refining
  { dzo: 'ТОО «КазГПЗ»', short: 'КазГПЗ', dir: 'refining', orgs: 21, workers: 470, wh: 653479, ns: 1, lti: 1, ltir: 1.53 },
  { dzo: 'ТОО «ПетроКазахстан Ойл Продактс»', short: 'ПКОП', dir: 'refining', orgs: 37, workers: 1750, wh: 3422452, ns: 1, lti: 2, ltir: 0.58 },
  { dzo: 'ТОО «KPI Inc.»', short: 'KPI Inc.', dir: 'refining', orgs: 12, workers: 666, wh: 1475381, ns: 0, lti: 0, ltir: 0 },
  { dzo: 'ТОО «Атырауский НПЗ»', short: 'АНПЗ', dir: 'refining', orgs: 11, workers: 839, wh: 1468628, ns: 0, lti: 0, ltir: 0 },
  { dzo: 'ТОО «ПНХЗ»', short: 'ПНХЗ', dir: 'refining', orgs: 26, workers: 2218, wh: 5409561, ns: 0, lti: 0, ltir: 0 },
  { dzo: 'ТОО «СП Caspi Bitum»', short: 'Каспи Битум', dir: 'refining', orgs: 32, workers: 309, wh: 595166, ns: 0, lti: 0, ltir: 0 },
  // Upstream
  { dzo: 'АО «Эмбамунайгаз»', short: 'ЭМГ', dir: 'upstream', orgs: 119, workers: 5209, wh: 7958034, ns: 6, lti: 6, ltir: 0.75 },
  { dzo: 'ТОО «Урихтау Оперейтинг»', short: 'Урихтау', dir: 'upstream', orgs: 25, workers: 389, wh: 1259022, ns: 0, lti: 0, ltir: 0 },
  { dzo: 'ТОО «KMG Barlau»', short: 'KMG Barlau', dir: 'upstream', orgs: 5, workers: 116, wh: 476106, ns: 0, lti: 0, ltir: 0 },
  { dzo: 'АО «Каражанбасмунай»', short: 'КБМ', dir: 'upstream', orgs: 46, workers: 1109, wh: 4063680, ns: 0, lti: 0, ltir: 0 },
  { dzo: 'ТОО СП «КазГерМунай»', short: 'КГМ', dir: 'upstream', orgs: 17, workers: 399, wh: 841910, ns: 0, lti: 0, ltir: 0 },
  { dzo: 'ТОО «Урал Ойл энд Газ»', short: 'УОГ', dir: 'upstream', orgs: 17, workers: 9976, wh: 1673123, ns: 0, lti: 0, ltir: 0 },
  { dzo: 'АО «Озенмунайгаз»', short: 'ОМГ', dir: 'upstream', orgs: 76, workers: 7501, wh: 15212224, ns: 9, lti: 9, ltir: 0.59 },
  { dzo: 'Компания «Dunga Operating GmbH»', short: 'Dunga', dir: 'upstream', orgs: 53, workers: 858, wh: 2071455, ns: 1, lti: 1, ltir: 0.48 },
  { dzo: 'ТОО «КазахОйл Актобе»', short: 'КОА', dir: 'upstream', orgs: 33, workers: 1176, wh: 3321687, ns: 0, lti: 0, ltir: 0 },
  { dzo: 'ТОО «КазахТуркМунай»', short: 'КТМ', dir: 'upstream', orgs: 33, workers: 371, wh: 1136295, ns: 1, lti: 5, ltir: 4.4 },
  { dzo: 'АО «Мангистаумунайгаз»', short: 'ММГ', dir: 'upstream', orgs: 23, workers: 3757, wh: 6640678, ns: 2, lti: 2, ltir: 0.3 },
  // Transportation
  { dzo: 'АО «КазТрансОйл»', short: 'КТО', dir: 'transport', orgs: 155, workers: 3925, wh: 2945915, ns: 0, lti: 0, ltir: 0 },
  { dzo: 'ТОО «НМСК «КазМорТрансФлот»', short: 'КМТФ', dir: 'transport', orgs: 7, workers: 247, wh: 595446, ns: 1, lti: 1, ltir: 1.68 },
  // Service
  { dzo: 'ТОО «КМГ Кумколь»', short: 'КМГ-Кумколь', dir: 'service', orgs: 8, workers: 373, wh: 746059, ns: 0, lti: 0, ltir: 0 },
  { dzo: 'ТОО «Мангистауэнергомунай»', short: 'МЭМ', dir: 'service', orgs: 17, workers: 414, wh: 1238160, ns: 0, lti: 0, ltir: 0 },
  { dzo: 'ТОО «Oil Services Company»', short: 'ОСК', dir: 'service', orgs: 8, workers: 434, wh: 978829, ns: 2, lti: 2, ltir: 2.04 },
  { dzo: 'ТОО «Кен Курылыс Сервис»', short: 'ККС', dir: 'service', orgs: 27, workers: 2185, wh: 1534238, ns: 0, lti: 0, ltir: 0 },
  { dzo: 'ТОО «ОзенМунайСервис»', short: 'ОМС', dir: 'service', orgs: 6, workers: 504, wh: 1752110, ns: 1, lti: 1, ltir: 0.57 },
  { dzo: 'ТОО «Oil Construction Company»', short: 'ОКК', dir: 'service', orgs: 22, workers: 609, wh: 763166, ns: 0, lti: 0, ltir: 0 },
  { dzo: 'ТОО «KMG Systems & Services»', short: 'КМГ СС', dir: 'service', orgs: 19, workers: 133, wh: 253044, ns: 0, lti: 0, ltir: 0 },
  { dzo: 'ТОО «КМГ Инжиниринг»', short: 'КМГИ', dir: 'service', orgs: 21, workers: 189, wh: 583227, ns: 0, lti: 0, ltir: 0 },
  { dzo: 'ТОО «KMG EP-Catering»', short: 'Кетеринг', dir: 'service', orgs: 11, workers: 540, wh: 1923411, ns: 1, lti: 1, ltir: 0.52 },
  { dzo: 'ТОО «Oil Transport Corporation»', short: 'ОТК', dir: 'service', orgs: 9, workers: 1579, wh: 3050720, ns: 2, lti: 2, ltir: 0.66 },
  { dzo: 'ТОО «УДТВ»', short: 'УДТВ', dir: 'service', orgs: 9, workers: 66, wh: 192468, ns: 0, lti: 0, ltir: 0 },
  { dzo: 'ТОО «Мунайтелеком»', short: 'МТК', dir: 'service', orgs: 12, workers: 411, wh: 1222867, ns: 0, lti: 0, ltir: 0 },
  { dzo: 'ТОО «KMG-Security»', short: 'КМГ-С', dir: 'service', orgs: 9, workers: 124, wh: 410644, ns: 0, lti: 0, ltir: 0 },
];

export type Severity = 'fatal' | 'severe' | 'light';

export interface ContrAccident {
  no: number;
  date: string;
  dzo: string;
  short: string;
  contractor: string;
  victims: number;
  fatal: number;
  severity: Severity;
  type: Record<Lang, string>;
  desc: string;
}

// Contractor work-related incidents, 2025 (28 incidents, 33 injured, 8 fatalities)
export const CONTR_ACCIDENTS_2025: ContrAccident[] = [
  { no: 1, date: '2025-01-07', dzo: 'АО «Озенмунайгаз»', short: 'ОМГ', contractor: 'ТОО «Бұрғылау»', victims: 1, fatal: 0, severity: 'light', type: { ru: 'Падение предметов', kz: 'Заттардың құлауы', en: 'Falling objects' }, desc: 'При сборке ПВО на скв. №8592 падение воронки устья на помощника бурильщика — травма левой руки.' },
  { no: 2, date: '2025-01-18', dzo: 'ТОО «НМСК «КазМорТрансФлот»', short: 'КМТФ', contractor: 'ТОО «Морской Персонал Консалтинг»', victims: 1, fatal: 0, severity: 'light', type: { ru: 'Падение с высоты', kz: 'Биіктен құлау', en: 'Fall from height' }, desc: 'Капитан т/х «Сункар» при качке потерял равновесие и упал с трапа — сотрясение головного мозга.' },
  { no: 3, date: '2025-02-06', dzo: 'ТОО «KMG EP-Catering»', short: 'Кетеринг', contractor: 'ТОО «KazProjectOperating»', victims: 1, fatal: 0, severity: 'light', type: { ru: 'Воздействие температуры', kz: 'Температура әсері', en: 'Temperature exposure' }, desc: 'Опрокидывание чайника с горячей жидкостью — термический ожог 2-й степени левой стопы.' },
  { no: 4, date: '2025-02-11', dzo: 'АО «Озенмунайгаз»', short: 'ОМГ', contractor: 'ТОО «Бұрғылау»', victims: 1, fatal: 0, severity: 'light', type: { ru: 'Движущиеся предметы', kz: 'Қозғалыстағы заттар', en: 'Moving objects' }, desc: 'Выскочил рукав высокого давления — травма левой руки и поясницы помощника бурильщика.' },
  { no: 5, date: '2025-02-15', dzo: 'АО «Озенмунайгаз»', short: 'ОМГ', contractor: 'ТОО «БерАли Мангистау Company»', victims: 1, fatal: 0, severity: 'light', type: { ru: 'Движущиеся предметы', kz: 'Қозғалыстағы заттар', en: 'Moving objects' }, desc: 'Защемление 3 и 4 пальцев правой руки на талевом канате при СПО НКТ.' },
  { no: 6, date: '2025-03-08', dzo: 'АО «Эмбамунайгаз»', short: 'ЭМГ', contractor: 'ТОО «КазТехМунайСервис»', victims: 1, fatal: 0, severity: 'light', type: { ru: 'Разгерметизация', kz: 'Герметизацияның бұзылуы', en: 'Depressurization' }, desc: 'Разгерметизация угольника на выкидной линии скв. №437 — ушиб грудной клетки и ЗЧМТ.' },
  { no: 7, date: '2025-03-13', dzo: 'ТОО «КазГПЗ»', short: 'КазГПЗ', contractor: 'ТОО «СИТ-Строй»', victims: 1, fatal: 0, severity: 'light', type: { ru: 'Падение с высоты', kz: 'Биіктен құлау', en: 'Fall from height' }, desc: 'Альпинист-маляр сорвался с лестницы на высоте ~8 м — перелом обеих кистей рук.' },
  { no: 8, date: '2025-04-05', dzo: 'ТОО «Oil Services Company»', short: 'ОСК', contractor: 'ТОО «FTC WIN»', victims: 1, fatal: 0, severity: 'light', type: { ru: 'Падение предметов', kz: 'Заттардың құлауы', en: 'Falling objects' }, desc: 'При закреплении труб НКТ трубы скатились и прищемили палец правой руки.' },
  { no: 9, date: '2025-04-05', dzo: 'АО «Озенмунайгаз»', short: 'ОМГ', contractor: 'ТОО «Бұрғылау»', victims: 1, fatal: 0, severity: 'severe', type: { ru: 'Движущиеся предметы', kz: 'Қозғалыстағы заттар', en: 'Moving objects' }, desc: 'При погрузке оттяжной тумбы защемил палец руки — перелом пятого пальца (тяжёлая травма).' },
  { no: 10, date: '2025-05-08', dzo: 'АО «Эмбамунайгаз»', short: 'ЭМГ', contractor: 'ТОО НИК «Hua Sheng Da»', victims: 1, fatal: 0, severity: 'severe', type: { ru: 'Движущиеся предметы', kz: 'Қозғалыстағы заттар', en: 'Moving objects' }, desc: 'Сработал ключ АКБ — отрыв ладони и пяти пальцев бурильщика (тяжёлая травма).' },
  { no: 11, date: '2025-05-14', dzo: 'ТОО «Oil Transport Corporation»', short: 'ОТК', contractor: 'ЧУ SBA', victims: 1, fatal: 0, severity: 'severe', type: { ru: 'Ручной инструмент', kz: 'Қол құралы', en: 'Hand tools' }, desc: 'В смотровой яме травма правого глаза отвёрткой — контузия глазного яблока IV ст. (тяжёлая).' },
  { no: 12, date: '2025-05-30', dzo: 'ТОО «ОзенМунайСервис»', short: 'ОМС', contractor: 'ТОО «МунайСпец Снаб»', victims: 1, fatal: 0, severity: 'severe', type: { ru: 'ДТП', kz: 'ЖКО', en: 'RTA' }, desc: 'КамАЗ отклонился от маршрута на спуске, водитель и помбур выпрыгнули — травма спины (тяжёлая).' },
  { no: 13, date: '2025-06-01', dzo: 'АО «Эмбамунайгаз»', short: 'ЭМГ', contractor: 'ТОО «Мейрәлі»', victims: 1, fatal: 0, severity: 'severe', type: { ru: 'Падение пострадавшего', kz: 'Жарақаттанушының құлауы', en: 'Slip & fall' }, desc: 'Вахтёр общежития споткнулась и упала — перелом правого плеча (тяжёлая травма).' },
  { no: 14, date: '2025-06-11', dzo: 'АО «Эмбамунайгаз»', short: 'ЭМГ', contractor: 'ТОО «СБП «КазМунайГаз – Бурение»', victims: 1, fatal: 1, severity: 'fatal', type: { ru: 'Падение предметов', kz: 'Заттардың құлауы', en: 'Falling objects' }, desc: 'Падение фильтра d-114 мм на машиниста на скв. №2784 — смертельный исход.' },
  { no: 15, date: '2025-06-11', dzo: 'АО «Эмбамунайгаз»', short: 'ЭМГ', contractor: 'ТОО НИК «Hua Sheng Da»', victims: 1, fatal: 0, severity: 'severe', type: { ru: 'Движущиеся предметы', kz: 'Қозғалыстағы заттар', en: 'Moving objects' }, desc: 'Соскользнул штроп крюкоблока и ударил помбура — сотрясение мозга, разрыв губы (тяжёлая).' },
  { no: 16, date: '2025-06-12', dzo: 'ТОО «Oil Transport Corporation»', short: 'ОТК', contractor: 'ЧУ SBA', victims: 1, fatal: 0, severity: 'severe', type: { ru: 'Падение с высоты', kz: 'Биіктен құлау', en: 'Fall from height' }, desc: 'Падение с приставной лестницы при ремонте кондиционера автобуса — ушибы тела (тяжёлая).' },
  { no: 17, date: '2025-06-23', dzo: 'АО «Мангистаумунайгаз»', short: 'ММГ', contractor: 'ЮВЗГ', victims: 1, fatal: 0, severity: 'light', type: { ru: 'Падение предметов', kz: 'Заттардың құлауы', en: 'Falling objects' }, desc: 'СБТ-73 мм соскочила с желоба и упала на ногу помбура — травма правой голени.' },
  { no: 18, date: '2025-06-30', dzo: 'АО «Озенмунайгаз»', short: 'ОМГ', contractor: 'ТОО «МунайФилдСервис»', victims: 1, fatal: 1, severity: 'fatal', type: { ru: 'Движущиеся предметы', kz: 'Қозғалыстағы заттар', en: 'Moving objects' }, desc: 'Подъёмный агрегат начал движение назад и наехал на машиниста под ним — смертельный исход.' },
  { no: 19, date: '2025-07-09', dzo: 'АО «Озенмунайгаз»', short: 'ОМГ', contractor: 'ТОО «МунайФилдСервис»', victims: 1, fatal: 0, severity: 'severe', type: { ru: 'Движущиеся предметы', kz: 'Қозғалыстағы заттар', en: 'Moving objects' }, desc: 'Элеватор со штангой выскочил из крюка и ударил помбура по голове — травма головы (тяжёлая).' },
  { no: 20, date: '2025-07-10', dzo: 'Компания «Dunga Operating GmbH»', short: 'Dunga', contractor: 'ТОО «ГРУПП-4»', victims: 1, fatal: 0, severity: 'light', type: { ru: 'ДТП', kz: 'ЖКО', en: 'RTA' }, desc: 'На трассе Актау—Форт-Шевченко Toyota Hilux не уступила дорогу самосвалу Shacman — резаная рана кисти.' },
  { no: 21, date: '2025-07-16', dzo: 'ТОО «КазахТуркМунай»', short: 'КТМ', contractor: 'ИП «Исмагулова»', victims: 5, fatal: 4, severity: 'fatal', type: { ru: 'ДТП', kz: 'ЖКО', en: 'RTA' }, desc: 'Опрокидывание Lexus 460 на контрактной территории — погибли 4 человека, 1 пострадавший.' },
  { no: 22, date: '2025-07-29', dzo: 'АО «Озенмунайгаз»', short: 'ОМГ', contractor: 'ТОО «Кезби»', victims: 1, fatal: 0, severity: 'severe', type: { ru: 'Движущиеся предметы', kz: 'Қозғалыстағы заттар', en: 'Moving objects' }, desc: 'Защемление левой руки шестернями гидравлического трубного ключа — травма 3 пальцев (тяжёлая).' },
  { no: 23, date: '2025-08-05', dzo: 'АО «Мангистаумунайгаз»', short: 'ММГ', contractor: 'ТОО «ARS Oilum LTD»', victims: 1, fatal: 0, severity: 'light', type: { ru: 'Движущиеся предметы', kz: 'Қозғалыстағы заттар', en: 'Moving objects' }, desc: 'Удар НКТ-73 мм в лоб с последующим падением с площадки УПА-60/80 — травма головы.' },
  { no: 24, date: '2025-08-20', dzo: 'ТОО «Oil Services Company»', short: 'ОСК', contractor: 'ТОО «FTC win»', victims: 1, fatal: 0, severity: 'light', type: { ru: 'Движущиеся предметы', kz: 'Қозғалыстағы заттар', en: 'Moving objects' }, desc: 'Прижат колесом прицепа при движении трубовоза задним ходом — закрытый перелом бедра.' },
  { no: 25, date: '2025-08-26', dzo: 'ТОО «ПетроКазахстан Ойл Продактс»', short: 'ПКОП', contractor: 'ТОО «КРС Астана»', victims: 2, fatal: 2, severity: 'fatal', type: { ru: 'Падение с высоты', kz: 'Биіктен құлау', en: 'Fall from height' }, desc: 'Опрокидывание автогидроподъёмника при работах на высоте — погибли 2 изолировщика.' },
  { no: 26, date: '2025-11-27', dzo: 'АО «Озенмунайгаз»', short: 'ОМГ', contractor: 'ТОО «Бургылау»', victims: 1, fatal: 0, severity: 'light', type: { ru: 'Падение предметов', kz: 'Заттардың құлауы', en: 'Falling objects' }, desc: 'При установке бурильной трубы d-114 мм в шурф удар по лицу — травма лица.' },
  { no: 27, date: '2025-11-30', dzo: 'АО «Озенмунайгаз»', short: 'ОМГ', contractor: 'ТОО «Кезби»', victims: 1, fatal: 0, severity: 'light', type: { ru: 'Движущиеся предметы', kz: 'Қозғалыстағы заттар', en: 'Moving objects' }, desc: 'Защемление руки в гидравлическом трубном ключе — травма пальца левой руки.' },
  { no: 28, date: '2025-12-29', dzo: 'АО «Эмбамунайгаз»', short: 'ЭМГ', contractor: 'ТОО «АтырауГидроГеология»', victims: 1, fatal: 0, severity: 'light', type: { ru: 'Движущиеся предметы', kz: 'Қозғалыстағы заттар', en: 'Moving objects' }, desc: 'При СПО НКТ-73 удар по лицу — ушиб мягких тканей и гематома лицевой области.' },
];

// Distribution of contractor incidents by type (sheet "Вид НС")
export interface NsType {
  name: Record<Lang, string>;
  pct: number;
}
export const CONTR_NS_TYPES: NsType[] = [
  { name: { ru: 'Обрушение, падение предметов', kz: 'Заттардың құлауы', en: 'Collapse, falling objects' }, pct: 22.2 },
  { name: { ru: 'Падение пострадавшего', kz: 'Жарақаттанушының құлауы', en: 'Slip & fall' }, pct: 22.2 },
  { name: { ru: 'Воздействие движущихся предметов', kz: 'Қозғалыстағы заттар әсері', en: 'Moving / rotating objects' }, pct: 16.7 },
  { name: { ru: 'Воздействие экстремальных температур (пожар)', kz: 'Экстремалды температура (өрт)', en: 'Extreme temperatures (fire)' }, pct: 16.7 },
  { name: { ru: 'Падение с высоты', kz: 'Биіктен құлау', en: 'Fall from height' }, pct: 11.1 },
  { name: { ru: 'Поражение электрическим током', kz: 'Электр тогының әсері', en: 'Electric shock' }, pct: 11.1 },
];
