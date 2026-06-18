import type { Lang } from '../i18n';

export interface DpbObject {
  no: number;
  code: string;
  name: Record<Lang, string>;
  detail: Record<Lang, string>;
}

export interface DpbSubstance {
  name: Record<Lang, string>;
  tons: number;
}

export interface Declaration {
  id: string;
  org: string;
  orgShort: string;
  field: string;
  year: number;
  pdf: string;
  pages: number;
  hazardClass: 'I' | 'II' | 'III' | 'IV';
  objectsCount: number;
  personnel: number;
  areaHa: number;
  borderKm: number;
  inOperation: number;
  region: string;
  district: string;
  parent: string;
  address: string;
  phone: string;
  email: string;
  legalBasis: Record<Lang, string>;
  workgroupOrder: string;
  declarationDate: string;
  objects: DpbObject[];
  substances: DpbSubstance[];
  climate: { key: string; label: Record<Lang, string>; value: string }[];
}

// Structured data extracted from the official egov declaration (110 pages, 2024).
export const KBM_DECLARATION: Declaration = {
  id: 'kbm-2024',
  org: 'АО «Каражанбасмунай»',
  orgShort: 'АО «КБМ»',
  field: 'Каражанбас',
  year: 2024,
  pdf: '/dpb/kbm-2024.pdf',
  pages: 110,
  hazardClass: 'I',
  objectsCount: 12,
  personnel: 3315,
  areaHa: 15650.7,
  borderKm: 68.7,
  inOperation: 1980,
  region: 'Мангистауская область',
  district: 'Тупкараганский район',
  parent: 'АО НК «КазМунайГаз»',
  address: 'г. Актау, 9а мкр, здание 4, БЦ «Елес»',
  phone: '+7 (7292) 43 36 00',
  email: 'info@kbm.kz',
  workgroupOrder: '№160-П от 31.05.2024',
  declarationDate: '2024',
  legalBasis: {
    ru: 'Закон РК «О гражданской защите» №188-V от 11.04.2014 (ст. 69, 70, 71, 76); приказы Министра по инвестициям и развитию РК №353 и №341 от 30.12.2014',
    kz: 'ҚР «Азаматтық қорғау туралы» №188-V Заңы, 11.04.2014 (69, 70, 71, 76-баптар); ҚР Инвестициялар және даму министрінің №353 және №341 бұйрықтары, 30.12.2014',
    en: 'RK Law “On Civil Protection” No.188-V of 11.04.2014 (art. 69, 70, 71, 76); orders of the RK Minister for Investment & Development No.353 and No.341 of 30.12.2014',
  },
  objects: [
    { no: 1, code: 'ЦДН-1', name: { ru: 'Цех добычи нефти №1', kz: 'Мұнай өндіру цехы №1', en: 'Oil Production Shop No.1' }, detail: { ru: '1112 добывающих скважин, 3 площадки ГЗУ', kz: '1112 өндіру ұңғымасы, 3 ТӨҚ алаңы', en: '1112 production wells, 3 metering stations' } },
    { no: 2, code: 'ЦДН-2', name: { ru: 'Цех добычи нефти №2', kz: 'Мұнай өндіру цехы №2', en: 'Oil Production Shop No.2' }, detail: { ru: '714 добывающих скважин, 2 площадки ГЗУ', kz: '714 өндіру ұңғымасы, 2 ТӨҚ алаңы', en: '714 production wells, 2 metering stations' } },
    { no: 3, code: 'ЦДН-3', name: { ru: 'Цех добычи нефти №3', kz: 'Мұнай өндіру цехы №3', en: 'Oil Production Shop No.3' }, detail: { ru: '1138 добывающих скважин, 3 площадки ГЗУ', kz: '1138 өндіру ұңғымасы, 3 ТӨҚ алаңы', en: '1138 production wells, 3 metering stations' } },
    { no: 4, code: 'ЦППН', name: { ru: 'Цех подготовки и перекачки нефти', kz: 'Мұнайды дайындау және айдау цехы', en: 'Oil Treatment & Pumping Shop' }, detail: { ru: 'Промысловая подготовка нефти, нагрев до t-90°C, подача в парк РВС-10000', kz: 'Кәсіпшілік дайындау, t-90°C дейін қыздыру', en: 'Field oil treatment, heating to 90°C, delivery to RVS-10000 tank farm' } },
    { no: 5, code: 'ЦППД', name: { ru: 'Цех по поддержанию пластового давления', kz: 'Қабат қысымын ұстау цехы', en: 'Reservoir Pressure Maintenance Shop' }, detail: { ru: '895 нагнетательных скважин, 4 БКНС, закачка воды и пара', kz: '895 айдау ұңғымасы, 4 БШАС', en: '895 injection wells, 4 cluster pump stations, water & steam injection' } },
    { no: 6, code: 'ЦПП', name: { ru: 'Цех подготовки пара', kz: 'Бу дайындау цехы', en: 'Steam Generation Shop' }, detail: { ru: 'Парогенераторные установки, 827 тн/час пара', kz: 'Бугенератор қондырғылары, 827 тн/сағ бу', en: 'Steam generator units, 827 t/h of steam' } },
    { no: 7, code: 'ГЦ', name: { ru: 'Газовый цех', kz: 'Газ цехы', en: 'Gas Shop' }, detail: { ru: 'Контроль и подготовка газа с м/р «Каламкас», смешивание с ПНГ', kz: '«Қаламқас» к/о газын бақылау және дайындау', en: 'Gas control & treatment from Kalamkas field, mixing with APG' } },
    { no: 8, code: 'ЭЦ', name: { ru: 'Электроцех', kz: 'Электр цехы', en: 'Electrical Shop' }, detail: { ru: 'Энергоснабжение всех объектов месторождения', kz: 'Кеннің барлық нысандарын энергиямен қамту', en: 'Power supply for all field facilities' } },
    { no: 9, code: 'АЗС', name: { ru: 'Автозаправочная станция', kz: 'Жанармай құю станциясы', en: 'Fuel Station' }, detail: { ru: 'Обеспечение ГСМ автотранспорта месторождения', kz: 'Көлікті ЖЖМ-мен қамтамасыз ету', en: 'Fuel & lubricants supply for field vehicles' } },
    { no: 10, code: 'ПКРС', name: { ru: 'Цех подземного и капитального ремонта скважин №1 и №2', kz: 'Ұңғымаларды жерасты және күрделі жөндеу цехы №1, №2', en: 'Well Workover & Servicing Shop No.1 & No.2' }, detail: { ru: 'Поддержание и восстановление действующего фонда скважин', kz: 'Ұңғымалар қорын қалпына келтіру', en: 'Maintaining & restoring the active well stock' } },
    { no: 11, code: 'БУ', name: { ru: 'Буровая бригада', kz: 'Бұрғылау бригадасы', en: 'Drilling Crew' }, detail: { ru: 'Наращивание фонда скважин бурением новых скважин', kz: 'Жаңа ұңғымалар бұрғылау', en: 'Growing the well stock by drilling new wells' } },
    { no: 12, code: 'БПО', name: { ru: 'База производственного обеспечения №1 и №2', kz: 'Өндірістік қамтамасыз ету базасы №1, №2', en: 'Production Support Base No.1 & No.2' }, detail: { ru: 'Обеспечение бригад ПКРС материалами, инструментом, химреагентами', kz: 'ПКРС бригадаларын материалдармен қамту', en: 'Supplying workover crews with materials, tools, chemicals' } },
  ],
  substances: [
    { name: { ru: 'Нефть', kz: 'Мұнай', en: 'Crude oil' }, tons: 88752 },
    { name: { ru: 'Газ', kz: 'Газ', en: 'Gas' }, tons: 7.4 },
    { name: { ru: 'Дизельное топливо', kz: 'Дизель отыны', en: 'Diesel fuel' }, tons: 253.5 },
    { name: { ru: 'Бензин', kz: 'Бензин', en: 'Gasoline' }, tons: 38 },
  ],
  climate: [
    { key: 'avg', label: { ru: 'Среднегодовая температура', kz: 'Орташа жылдық температура', en: 'Avg. annual temperature' }, value: '+10 °C' },
    { key: 'jan', label: { ru: 'Средняя температура января', kz: 'Қаңтардың орташа температурасы', en: 'Avg. January temperature' }, value: '−25 °C' },
    { key: 'jul', label: { ru: 'Средняя температура июля', kz: 'Шілденің орташа температурасы', en: 'Avg. July temperature' }, value: '+35 °C' },
    { key: 'wind', label: { ru: 'Максимальная скорость ветра', kz: 'Желдің ең жоғары жылдамдығы', en: 'Max wind speed' }, value: '25 м/с' },
    { key: 'relief', label: { ru: 'Рельеф местности', kz: 'Жер бедері', en: 'Terrain' }, value: 'Пустынная равнина' },
    { key: 'seism', label: { ru: 'Сейсмичность', kz: 'Сейсмикалық', en: 'Seismicity' }, value: '—' },
  ],
};

export const DECLARATIONS: Declaration[] = [KBM_DECLARATION];
