import type { Lang } from '../i18n';

export type GroupId = 'production' | 'refining' | 'transport' | 'oilservice';

export interface DzoGroup {
  id: GroupId;
  no: number;
  name: Record<Lang, string>;
}

export interface Dzo {
  id: string;
  group: GroupId;
  name: Record<Lang, string>;
  short: string;
  region: Record<Lang, string>;
  activity: Record<Lang, string>;
  parent: string;
  workers: number;
  manhours: number;
  ntr: number; // НС, связанные с трудовой деятельностью
  fatal: number;
  ltir: number;
  far: number;
  nearMiss: number;
  contractors: number;
  founded?: number;
}

export const GROUPS: DzoGroup[] = [
  { id: 'production', no: 1, name: { ru: 'Добыча', kz: 'Өндіру', en: 'Upstream' } },
  { id: 'refining', no: 2, name: { ru: 'Переработка', kz: 'Өңдеу', en: 'Refining' } },
  { id: 'transport', no: 3, name: { ru: 'Транспортировка', kz: 'Тасымалдау', en: 'Transportation' } },
  { id: 'oilservice', no: 4, name: { ru: 'Нефтесервис', kz: 'Мұнай сервисі', en: 'Oilfield Services' } },
];

const R = (ru: string, kz: string, en: string): Record<Lang, string> => ({ ru, kz, en });

export const DZOS: Dzo[] = [
  // 1 — Добыча
  {
    id: 'tco', group: 'production', short: 'ТШО',
    name: R('АО «Тенгизшевройл»', 'АҚ «Теңізшевройл»', 'Tengizchevroil JSC'),
    region: R('Атырауская область, Тенгиз', 'Атырау облысы, Теңіз', 'Atyrau region, Tengiz'),
    activity: R('Добыча нефти и газа', 'Мұнай және газ өндіру', 'Oil & gas production'),
    parent: 'АО НК «КазМунайГаз»', workers: 22481, manhours: 224810000, ntr: 0, fatal: 0, ltir: 0.0, far: 0.0, nearMiss: 12, contractors: 18, founded: 1993,
  },
  {
    id: 'kpo', group: 'production', short: 'КПО',
    name: R('«Карачаганак Петролеум Оперейтинг»', '«Қарашығанақ Петролеум Оперейтинг»', 'Karachaganak Petroleum Operating'),
    region: R('Западно-Казахстанская область', 'Батыс Қазақстан облысы', 'West Kazakhstan region'),
    activity: R('Добыча нефти и газа', 'Мұнай және газ өндіру', 'Oil & gas production'),
    parent: 'АО НК «КазМунайГаз»', workers: 4200, manhours: 42000000, ntr: 0, fatal: 0, ltir: 0.0, far: 0.0, nearMiss: 8, contractors: 11, founded: 1997,
  },
  {
    id: 'kbm', group: 'production', short: 'КБМ',
    name: R('АО «Каражанбасмунай»', 'АҚ «Қаражанбасмұнай»', 'Karazhanbasmunai JSC'),
    region: R('Мангистауская область, Каражанбас', 'Маңғыстау облысы, Қаражанбас', 'Mangistau region, Karazhanbas'),
    activity: R('Добыча нефти — м/р Каражанбас', 'Мұнай өндіру — Қаражанбас к/о', 'Oil production — Karazhanbas field'),
    parent: 'АО НК «КазМунайГаз»', workers: 3315, manhours: 33150000, ntr: 1, fatal: 0, ltir: 0.067, far: 0.0, nearMiss: 204, contractors: 9, founded: 1981,
  },
  {
    id: 'kmgep', group: 'production', short: 'КМГ ЭП',
    name: R('АО «КМГ Эксплорейшн Продакшн»', 'АҚ «ҚМГ Эксплорейшн Продакшн»', 'KMG Exploration Production JSC'),
    region: R('г. Астана', 'Астана қ.', 'Astana city'),
    activity: R('Разведка и добыча нефти', 'Мұнай барлау және өндіру', 'Oil exploration & production'),
    parent: 'АО НК «КазМунайГаз»', workers: 1840, manhours: 18400000, ntr: 0, fatal: 0, ltir: 0.0, far: 0.0, nearMiss: 6, contractors: 7, founded: 2004,
  },
  {
    id: 'omg', group: 'production', short: 'ОМГ',
    name: R('АО «Озенмунайгаз»', 'АҚ «Өзенмұнайгаз»', 'Ozenmunaygas JSC'),
    region: R('Мангистауская область, г. Жанаозен', 'Маңғыстау облысы, Жаңаөзен қ.', 'Mangistau region, Zhanaozen'),
    activity: R('Добыча нефти — м/р Узень', 'Мұнай өндіру — Өзен к/о', 'Oil production — Uzen field'),
    parent: 'АО «КМГ ЭП»', workers: 8700, manhours: 87000000, ntr: 2, fatal: 0, ltir: 0.046, far: 0.0, nearMiss: 45, contractors: 14, founded: 1964,
  },
  {
    id: 'emg', group: 'production', short: 'ЭМГ',
    name: R('АО «Эмбамунайгаз»', 'АҚ «Ембімұнайгаз»', 'Embamunaygas JSC'),
    region: R('Атырауская область', 'Атырау облысы', 'Atyrau region'),
    activity: R('Добыча нефти', 'Мұнай өндіру', 'Oil production'),
    parent: 'АО «КМГ ЭП»', workers: 5600, manhours: 56000000, ntr: 1, fatal: 0, ltir: 0.036, far: 0.0, nearMiss: 28, contractors: 12, founded: 1922,
  },
  // 2 — Переработка
  {
    id: 'anpz', group: 'refining', short: 'АНПЗ',
    name: R('ТОО «Атырауский НПЗ»', 'ЖШС «Атырау МӨЗ»', 'Atyrau Refinery LLP'),
    region: R('Атырауская область, г. Атырау', 'Атырау облысы, Атырау қ.', 'Atyrau region, Atyrau'),
    activity: R('Переработка нефти', 'Мұнай өңдеу', 'Oil refining'),
    parent: 'АО НК «КазМунайГаз»', workers: 3200, manhours: 32000000, ntr: 1, fatal: 0, ltir: 0.062, far: 0.0, nearMiss: 31, contractors: 10, founded: 1945,
  },
  {
    id: 'pnhz', group: 'refining', short: 'ПНХЗ',
    name: R('ТОО «Павлодарский НХЗ»', 'ЖШС «Павлодар МХЗ»', 'Pavlodar Refinery LLP'),
    region: R('Павлодарская область, г. Павлодар', 'Павлодар облысы, Павлодар қ.', 'Pavlodar region, Pavlodar'),
    activity: R('Переработка нефти', 'Мұнай өңдеу', 'Oil refining'),
    parent: 'АО НК «КазМунайГаз»', workers: 2400, manhours: 24000000, ntr: 0, fatal: 0, ltir: 0.0, far: 0.0, nearMiss: 22, contractors: 8, founded: 1978,
  },
  {
    id: 'pkop', group: 'refining', short: 'ПКОП',
    name: R('ТОО «ПетроКазахстан Ойл Продактс»', 'ЖШС «ПетроҚазақстан Ойл Продактс»', 'PetroKazakhstan Oil Products LLP'),
    region: R('г. Шымкент', 'Шымкент қ.', 'Shymkent city'),
    activity: R('Переработка нефти', 'Мұнай өңдеу', 'Oil refining'),
    parent: 'АО НК «КазМунайГаз»', workers: 1700, manhours: 17000000, ntr: 0, fatal: 0, ltir: 0.0, far: 0.0, nearMiss: 14, contractors: 6, founded: 1985,
  },
  {
    id: 'kpi', group: 'refining', short: 'KPI',
    name: R('ТОО «KPI Inc.»', 'ЖШС «KPI Inc.»', 'KPI Inc. LLP'),
    region: R('Атырауская область', 'Атырау облысы', 'Atyrau region'),
    activity: R('Нефтехимия (полиэтилен)', 'Мұнай-химия (полиэтилен)', 'Petrochemicals (polyethylene)'),
    parent: 'АО НК «КазМунайГаз»', workers: 900, manhours: 9000000, ntr: 0, fatal: 0, ltir: 0.0, far: 0.0, nearMiss: 9, contractors: 5, founded: 2019,
  },
  // 3 — Транспортировка
  {
    id: 'kto', group: 'transport', short: 'КТО',
    name: R('АО «КазТрансОйл»', 'АҚ «ҚазТрансОйл»', 'KazTransOil JSC'),
    region: R('г. Астана', 'Астана қ.', 'Astana city'),
    activity: R('Транспортировка нефти', 'Мұнай тасымалдау', 'Oil transportation'),
    parent: 'АО НК «КазМунайГаз»', workers: 5600, manhours: 56000000, ntr: 1, fatal: 0, ltir: 0.041, far: 0.0, nearMiss: 38, contractors: 13, founded: 1997,
  },
  {
    id: 'qg', group: 'transport', short: 'QazaqGaz',
    name: R('АО «QazaqGaz»', 'АҚ «QazaqGaz»', 'QazaqGaz JSC'),
    region: R('г. Астана', 'Астана қ.', 'Astana city'),
    activity: R('Транспортировка газа', 'Газ тасымалдау', 'Gas transportation'),
    parent: 'АО НК «КазМунайГаз»', workers: 6800, manhours: 68000000, ntr: 1, fatal: 0, ltir: 0.029, far: 0.0, nearMiss: 41, contractors: 15, founded: 2000,
  },
  {
    id: 'kkt', group: 'transport', short: 'ККТ',
    name: R('ТОО «Казахстанско-Китайский Трубопровод»', 'ЖШС «Қазақстан-Қытай Құбыры»', 'Kazakhstan-China Pipeline LLP'),
    region: R('Актюбинская область', 'Ақтөбе облысы', 'Aktobe region'),
    activity: R('Транспортировка нефти', 'Мұнай тасымалдау', 'Oil transportation'),
    parent: 'АО «КазТрансОйл»', workers: 600, manhours: 6000000, ntr: 0, fatal: 0, ltir: 0.0, far: 0.0, nearMiss: 5, contractors: 4, founded: 2004,
  },
  // 4 — Нефтесервис
  {
    id: 'kmgeng', group: 'oilservice', short: 'КМГИ',
    name: R('ТОО «КМГ Инжиниринг»', 'ЖШС «ҚМГ Инжиниринг»', 'KMG Engineering LLP'),
    region: R('г. Астана', 'Астана қ.', 'Astana city'),
    activity: R('Проектирование и НИОКР', 'Жобалау және ҒЗТКЖ', 'Engineering & R&D'),
    parent: 'АО НК «КазМунайГаз»', workers: 2600, manhours: 26000000, ntr: 0, fatal: 0, ltir: 0.0, far: 0.0, nearMiss: 11, contractors: 6, founded: 2017,
  },
  {
    id: 'burgylau', group: 'oilservice', short: 'Бургылау',
    name: R('АО «Бургылау»', 'АҚ «Бұрғылау»', 'Burgylau JSC'),
    region: R('Мангистауская область, г. Жанаозен', 'Маңғыстау облысы, Жаңаөзен қ.', 'Mangistau region, Zhanaozen'),
    activity: R('Бурение и ремонт скважин', 'Ұңғыма бұрғылау және жөндеу', 'Well drilling & workover'),
    parent: 'АО «Озенмунайгаз»', workers: 1900, manhours: 19000000, ntr: 1, fatal: 0, ltir: 0.053, far: 0.0, nearMiss: 17, contractors: 7, founded: 2007,
  },
  {
    id: 'osc', group: 'oilservice', short: 'OSC',
    name: R('ТОО «Oil Services Company»', 'ЖШС «Oil Services Company»', 'Oil Services Company LLP'),
    region: R('Мангистауская область', 'Маңғыстау облысы', 'Mangistau region'),
    activity: R('Сервис добычи нефти', 'Мұнай өндіру сервисі', 'Oil production services'),
    parent: 'АО «Озенмунайгаз»', workers: 3100, manhours: 31000000, ntr: 1, fatal: 0, ltir: 0.048, far: 0.0, nearMiss: 23, contractors: 9, founded: 2010,
  },
  {
    id: 'otc', group: 'oilservice', short: 'OTC',
    name: R('ТОО «Oil Transport Corporation»', 'ЖШС «Oil Transport Corporation»', 'Oil Transport Corporation LLP'),
    region: R('Атырауская область', 'Атырау облысы', 'Atyrau region'),
    activity: R('Транспортно-логистические услуги', 'Көлік-логистика қызметтері', 'Transport & logistics services'),
    parent: 'АО НК «КазМунайГаз»', workers: 2200, manhours: 22000000, ntr: 0, fatal: 0, ltir: 0.0, far: 0.0, nearMiss: 16, contractors: 8, founded: 2001,
  },
];

export function dzosByGroup(g: GroupId): Dzo[] {
  return DZOS.filter((d) => d.group === g);
}
export function findDzo(id?: string): Dzo | undefined {
  return DZOS.find((d) => d.id === id);
}
export function groupOf(id: GroupId): DzoGroup {
  return GROUPS.find((g) => g.id === id)!;
}

/* ---------------- KMG reporting forms (directions) ---------------- */

export type RowKind = 'count' | 'money' | 'zero' | 'percent' | 'hours';

export interface FormRow {
  code: string;
  label: string;
  unit?: string;
  kind?: RowKind; // default 'count'
  section?: boolean; // section header row
  sub?: boolean; // indented sub-row
}

export interface FormDef {
  id: string;
  code: string; // e.g. KMG-1
  titleKey: string; // i18n key for tab/heading
  periodicity: 'monthly' | 'quarterly' | 'halfyear' | 'yearly';
  rows: FormRow[];
}

const c = (code: string, label: string, unit?: string, kind?: RowKind, sub?: boolean): FormRow => ({ code, label, unit, kind, sub });
const sec = (label: string): FormRow => ({ code: '', label, section: true });

export const FORMS: FormDef[] = [
  {
    id: 'kmg1', code: 'KMG-1', titleKey: 'pp.form.kmg1', periodicity: 'monthly',
    rows: [
      c('1', 'Количество работников предприятия', 'человек', 'count'),
      c('2', 'Количество отработанного рабочего времени', 'чел-часы', 'hours'),
      c('3', 'НС, связанные с трудовой деятельностью', 'случай', 'zero'),
      c('3.1', 'Одиночных', '', 'zero', true),
      c('3.2', 'Групповых', '', 'zero', true),
      c('4', 'Пострадавших при НС, связанных с трудом', 'человек', 'zero'),
      c('4.2', 'тяжёлая степень тяжести', '', 'zero', true),
      c('4.3', 'смертельный', '', 'zero', true),
      c('9', 'Опасных случаев / Near Miss / остановов', 'случай', 'count'),
      c('9.1', 'Опасных случаев', '', 'count', true),
      c('9.2', 'Потенциально опасных ситуаций', '', 'count', true),
      c('9.3', 'Остановов работы', '', 'count', true),
      c('10', 'Обращения за медицинской помощью', 'единиц', 'count'),
      c('10.2', 'по причине микротравмы', '', 'count', true),
      c('12', 'Привлечено к ответственности за нарушения', 'человек', 'count'),
      c('13', 'Штатная численность по ПБ, ОТиОС', 'человек', 'count'),
      c('13.1', 'Охрана труда', '', 'count', true),
      c('13.2', 'Промышленная безопасность', '', 'count', true),
      c('13.3', 'Пожарная безопасность', '', 'count', true),
      c('15', 'Форумов по безопасности и охране труда', 'шт', 'count'),
      c('16', 'Совещаний по безопасности и охране труда', 'шт', 'count'),
      c('17', 'Дней открытых дверей', 'шт', 'count'),
    ],
  },
  {
    id: 'kmg5', code: 'KMG-5', titleKey: 'pp.form.kmg5', periodicity: 'quarterly',
    rows: [
      sec('Аварийность'),
      c('1', 'Количество аварий', 'случай', 'zero'),
      c('2', 'Материальный ущерб от аварий', 'тыс. тенге', 'money', true),
      c('4', 'Количество инцидентов', 'случай', 'count'),
      c('5', 'Материальный ущерб от инцидентов', 'тыс. тенге', 'money', true),
      sec('Выполнение мероприятий по актам расследования'),
      c('7', 'Мероприятий по актам расследования, всего', 'шт', 'count'),
      c('8', 'выполнено', '', 'count', true),
      c('10', 'не выполнено — срок истёк', '', 'zero', true),
      sec('Готовность к реагированию'),
      c('11', 'Учений, тревог и тренировок, всего', 'шт', 'count'),
      c('12', 'комплексных учений', '', 'count', true),
      c('15', 'объектовых тренировок (ПЛА, ПЛАРН)', '', 'count', true),
      sec('Пожары и возгорания'),
      c('16', 'Зарегистрированных пожаров и возгораний', 'случай', 'zero'),
      c('17', 'Ущерб от пожаров', 'тыс. тенге', 'money', true),
      c('18', 'Пострадавших на пожарах', 'человек', 'zero'),
      c('21', 'Пожарно-тактических учений и занятий', 'шт', 'count'),
    ],
  },
  {
    id: 'kmg3', code: 'KMG-3', titleKey: 'pp.form.kmg3', periodicity: 'halfyear',
    rows: [
      c('1', 'Общее количество работников', 'человек', 'count'),
      c('1.1', 'женщин', '', 'count', true),
      c('1.2', 'мужчин', '', 'count', true),
      c('2', 'Случаев нетрудоспособности, всего', 'случай', 'count'),
      c('2.1', 'связанные с производством', '', 'zero', true),
      c('2.11', 'болезни органов дыхания (J00–J99)', '', 'count', true),
      c('2.10', 'болезни системы кровообращения (I00–I99)', '', 'count', true),
      c('2.14', 'болезни костно-мышечной системы (M00–M99)', '', 'count', true),
      c('rd', 'Количество рабочих дней нетрудоспособности', 'дней', 'count'),
      c('3', 'Профессиональные заболевания', 'случай', 'zero'),
    ],
  },
  {
    id: 'kmg4', code: 'KMG-4', titleKey: 'pp.form.kmg4', periodicity: 'yearly',
    rows: [
      c('1', 'Общее количество работников', 'человек', 'count'),
      c('2', 'Работают с вредными и опасными факторами', 'человек', 'count'),
      c('3', 'Подлежат периодическому медосмотру', 'человек', 'count'),
      c('4', 'Прошли периодический медосмотр', 'человек', 'count'),
      c('6', 'Не прошли периодический медосмотр', 'человек', 'count'),
      c('7', 'Профпригодны к работе', 'человек', 'count'),
      c('11', 'С подозрением на профзаболевание', 'человек', 'zero'),
      c('17', 'Нуждаются в диспансерном наблюдении', 'человек', 'count'),
      c('19', 'Впервые выявленных заболеваний', 'кол-во', 'count'),
    ],
  },
  {
    id: 'kmg2', code: 'KMG-2', titleKey: 'pp.form.kmg2', periodicity: 'monthly',
    rows: [
      c('1', 'Спецтехника и автотранспорт, всего', 'ед.', 'count'),
      c('1.1', 'легковые', '', 'count', true),
      c('1.2', 'автобусы', '', 'count', true),
      c('1.3', 'грузовые', '', 'count', true),
      c('1.4', 'спецтехника', '', 'count', true),
      c('gps', 'Оснащено системами GPS-мониторинга', 'ед.', 'count'),
      c('2', 'Общий пробег ТС', 'км', 'count'),
      c('3', 'Количество водителей', 'человек', 'count'),
      c('dd', 'Прошли «Защитное вождение» (Defensive Driving)', 'человек', 'count'),
      c('6', 'Дорожно-транспортных происшествий (ДТП)', 'случай', 'zero'),
      c('6.5', 'по вине третьей стороны', '', 'zero', true),
    ],
  },
  {
    id: 'kmg6', code: 'KMG-6', titleKey: 'pp.form.kmg6', periodicity: 'monthly',
    rows: [
      c('1', 'Подрядных организаций на территории ДЗО', 'ед.', 'count'),
      c('4', 'Персонала подрядных организаций', 'человек', 'count'),
      c('6', 'Отработано чел-часов подрядчиками', 'чел-часы', 'hours'),
      c('7', 'НС с работниками подрядчиков (с трудом)', 'случай', 'zero'),
      c('8.3', 'смертельный', '', 'zero', true),
      c('15', 'ДТП автотранспорта подрядчиков', 'случай', 'zero'),
      c('17', 'Проверок производственной безопасности', 'шт', 'count'),
      c('18', 'Выявлено несоответствий', 'шт', 'count'),
      c('19', 'Устранено несоответствий', 'шт', 'count'),
      c('20', 'Штрафов за нарушения ОТ, ПБ и ООС', 'шт', 'count'),
    ],
  },
  {
    id: 'kmg7', code: 'KMG-7', titleKey: 'pp.form.kmg7', periodicity: 'quarterly',
    rows: [
      c('1', 'Комплексных проверок внутренними комиссиями', 'шт', 'count'),
      c('2', 'Выявлено несоответствий (комплексные)', 'шт', 'count'),
      c('2.1', 'устранено', '', 'count', true),
      c('3', 'Внутренних целевых проверок', 'шт', 'count'),
      c('4', 'Аудитов независимыми экспертами', 'шт', 'count'),
      c('4.1', 'выявлено несоответствий', '', 'count', true),
      c('4.2', 'устранено несоответствий', '', 'count', true),
      c('6', 'Проверок госорганами (ОТ)', 'шт', 'count'),
      c('8', 'Административных штрафов (ОТ)', 'шт', 'zero'),
      c('9', 'Проверок госорганами (пром. безопасность)', 'шт', 'count'),
    ],
  },
  {
    id: 'kmg9', code: 'KMG-9', titleKey: 'pp.form.kmg9', periodicity: 'halfyear',
    rows: [
      sec('Безопасность и охрана труда'),
      c('bot', 'Обучено работников, всего', 'человек', 'count'),
      c('cult', 'Культура безопасности труда', '', 'count', true),
      c('height', 'Работа на высоте (VR-формат)', '', 'count', true),
      c('bba', 'Поведенческие аудиты безопасности', '', 'count', true),
      sec('Промышленная безопасность'),
      c('pb', 'Обучено работников, всего', 'человек', 'count'),
      c('elec', 'Основы электробезопасности', '', 'count', true),
      c('loto', 'Изоляция источников энергии (LOTO)', '', 'count', true),
      sec('Прочие направления'),
      c('fire', 'Пожарная безопасность', 'человек', 'count'),
      c('dd', 'Defensive Driving (RoSPA)', 'человек', 'count'),
      c('med', 'Первая помощь, дефибриллятор', 'человек', 'count'),
      c('cost', 'Затраты на обучение', 'тыс. тенге', 'money'),
    ],
  },
];

// KMG-8 — budget (rendered with a dedicated layout)
export const BUDGET_DIRECTIONS = [
  { id: 'ot', label: { ru: 'Безопасность и охрана труда', kz: 'Қауіпсіздік және еңбекті қорғау', en: 'Safety & occupational health' } },
  { id: 'pb', label: { ru: 'Промышленная безопасность', kz: 'Өнеркәсіптік қауіпсіздік', en: 'Industrial safety' } },
  { id: 'fire', label: { ru: 'Пожарная безопасность', kz: 'Өрт қауіпсіздігі', en: 'Fire safety' } },
  { id: 'go', label: { ru: 'Гражданская оборона и ЧС', kz: 'Азаматтық қорғаныс және ТЖ', en: 'Civil defence & emergencies' } },
  { id: 'transport', label: { ru: 'Транспортная безопасность', kz: 'Көлік қауіпсіздігі', en: 'Transport safety' } },
  { id: 'health', label: { ru: 'Охрана здоровья', kz: 'Денсаулықты сақтау', en: 'Health protection' } },
] as const;

/* ---------------- deterministic value generation ---------------- */

function seeded(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000; // 0..1
}

function scaleFactor(d: Dzo): number {
  return Math.max(0.25, d.workers / 5000);
}

export function rowValue(d: Dzo, formId: string, row: FormRow, prev = false): number | null {
  if (row.section) return null;
  const kind = row.kind ?? 'count';
  const f = scaleFactor(d);
  const s = seeded(`${d.id}|${formId}|${row.code}|${prev ? 'p' : 'c'}`);

  if (row.code === '1' && (formId === 'kmg1' || formId === 'kmg3' || formId === 'kmg4')) {
    return prev ? Math.round(d.workers * 0.98) : d.workers;
  }
  if (row.code === '2' && formId === 'kmg1') {
    return prev ? Math.round(d.manhours * 0.97) : d.manhours;
  }
  switch (kind) {
    case 'zero':
      // safety-critical: overwhelmingly zero, occasional 1
      return s > 0.92 ? 1 : 0;
    case 'money':
      return Math.round((400 + s * 9000) * f) * 10;
    case 'percent':
      return Math.round(40 + s * 55);
    case 'hours':
      return Math.round(d.manhours * (0.02 + s * 0.05));
    case 'count':
    default: {
      const base = Math.round((1 + s * 28) * f);
      return prev ? Math.max(0, Math.round(base * (0.8 + s * 0.3))) : base;
    }
  }
}

export interface BudgetRow {
  id: string;
  plan: number;
  fact: number;
  planPrev: number;
  factPrev: number;
}

export function budgetFor(d: Dzo): BudgetRow[] {
  const f = scaleFactor(d);
  return BUDGET_DIRECTIONS.map((dir) => {
    const s = seeded(`${d.id}|budget|${dir.id}`);
    const plan = Math.round((900 + s * 4200) * f) * 100;
    const fact = Math.round(plan * (0.86 + s * 0.13));
    const sp = seeded(`${d.id}|budgetp|${dir.id}`);
    const planPrev = Math.round((850 + sp * 4000) * f) * 100;
    const factPrev = Math.round(planPrev * (0.82 + sp * 0.15));
    return { id: dir.id, plan, fact, planPrev, factPrev };
  });
}
