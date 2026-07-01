import type { Lang } from '../i18n';

/** НЕС — несоответствия; НР — нарушения */
export type VndCategory = 'nes' | 'nr';
export type VndArea = 'ot' | 'pb' | 'env' | 'rta';

export interface VndRequirement {
  id: string;
  dzo: string;
  document: Record<Lang, string>;
  requirement: Record<Lang, string>;
  category: VndCategory;
  area: VndArea;
  status: 'done' | 'pending';
  deadline: string;
}

const R = (ru: string, kz: string, en: string): Record<Lang, string> => ({ ru, kz, en });

export const VND_REQUIREMENTS: VndRequirement[] = [
  // АО «Озенмунайгаз»
  {
    id: 'omg-1', dzo: 'АО «Озенмунайгаз»',
    document: R('Политика в области ОТ, ПБ и ООС', 'Еңбекті қорғау, ӨҚ және ҚОҚ саласындағы саясат', 'OHS, IS & Environmental Policy'),
    requirement: R('Утверждена и доведена до сведения 100% работников', 'Бекітілген және жұмысшылардың 100%-ына жеткізілген', 'Approved and communicated to 100% of employees'),
    category: 'nes', area: 'ot', status: 'done', deadline: '2026-01-15',
  },
  {
    id: 'omg-2', dzo: 'АО «Озенмунайгаз»',
    document: R('ВНД «Право остановки работ»', 'ІНҚ «Жұмысты тоқтату құқығы»', 'Stop Work Authority IR'),
    requirement: R('Обучение персонала по S.W.A. — не охвачены 3 бригады', 'S.W.A. бойынша оқыту — 3 бригада қамтылмаған', 'S.W.A. training — 3 crews not covered'),
    category: 'nes', area: 'pb', status: 'pending', deadline: '2026-04-30',
  },
  {
    id: 'omg-3', dzo: 'АО «Озенмунайгаз»',
    document: R('Стандарт «Управление подрядчиками по HSE»', '«Мердігерлерді HSE бойынша басқару» стандарты', 'Contractor HSE Management Standard'),
    requirement: R('Нарушение: отсутствует оценка рисков у подрядчика OSC', 'Бұзушылық: OSC мердігерінде тәуекел бағалауы жоқ', 'Violation: no risk assessment for OSC contractor'),
    category: 'nr', area: 'ot', status: 'pending', deadline: '2026-03-01',
  },
  {
    id: 'omg-4', dzo: 'АО «Озенмунайгаз»',
    document: R('Процедура расследования происшествий', 'Оқиғаларды тергеу рәсімі', 'Incident Investigation Procedure'),
    requirement: R('Акты расследования оформляются в срок', 'Тергеу актілері мерзімінде ресімделеді', 'Investigation reports filed on time'),
    category: 'nes', area: 'ot', status: 'done', deadline: '2026-02-28',
  },
  // АО «Эмбамунайгаз»
  {
    id: 'emg-1', dzo: 'АО «Эмбамунайгаз»',
    document: R('Политика в области ОТ, ПБ и ООС', 'Еңбекті қорғау, ӨҚ және ҚОҚ саласындағы саясат', 'OHS, IS & Environmental Policy'),
    requirement: R('Политика размещена на информационных стендах', 'Саясат ақпараттық тақталарда орналастырылған', 'Policy posted on information boards'),
    category: 'nes', area: 'ot', status: 'done', deadline: '2026-01-20',
  },
  {
    id: 'emg-2', dzo: 'АО «Эмбамунайгаз»',
    document: R('ВНД «Право остановки работ»', 'ІНҚ «Жұмысты тоқтату құқығы»', 'Stop Work Authority IR'),
    requirement: R('Несоответствие: карточки S.W.A. не обновлены на 2026 год', 'Сәйкессіздік: S.W.A. карточкалары 2026 жылға жаңартылмаған', 'Non-conformity: S.W.A. cards not updated for 2026'),
    category: 'nes', area: 'pb', status: 'pending', deadline: '2026-05-15',
  },
  {
    id: 'emg-3', dzo: 'АО «Эмбамунайгаз»',
    document: R('Стандарт управления изменениями (MOC)', 'Өзгерістерді басқару стандарты (MOC)', 'Management of Change (MOC) Standard'),
    requirement: R('Нарушение: изменение в технологии без MOC-анализа', 'Бұзушылық: MOC-талдаусыз технологиялық өзгеріс', 'Violation: process change without MOC analysis'),
    category: 'nr', area: 'pb', status: 'pending', deadline: '2026-02-10',
  },
  // АО «Каражанбасмунай»
  {
    id: 'kbm-1', dzo: 'АО «Каражанбасмунай»',
    document: R('Политика в области ОТ, ПБ и ООС', 'Еңбекті қорғау, ӨҚ және ҚОҚ саласындағы саясат', 'OHS, IS & Environmental Policy'),
    requirement: R('Ознакомление работников под подпись', 'Жұмысшылардың қол қоюымен таныстыру', 'Employee acknowledgement signatures'),
    category: 'nes', area: 'ot', status: 'done', deadline: '2026-01-10',
  },
  {
    id: 'kbm-2', dzo: 'АО «Каражанбасмунай»',
    document: R('Стандарт «Управление подрядчиками по HSE»', '«Мердігерлерді HSE бойынша басқару» стандарты', 'Contractor HSE Management Standard'),
    requirement: R('Несоответствие: рейтинг подрядчиков не актуализирован', 'Сәйкессіздік: мердігер рейтингі жаңартылмаған', 'Non-conformity: contractor ratings not updated'),
    category: 'nes', area: 'ot', status: 'pending', deadline: '2026-06-01',
  },
  {
    id: 'kbm-3', dzo: 'АО «Каражанбасмунай»',
    document: R('Процедура расследования происшествий', 'Оқиғаларды тергеу рәсімі', 'Incident Investigation Procedure'),
    requirement: R('Нарушение: срок расследования превышен по 2 актам', 'Бұзушылық: 2 акт бойынша тергеу мерзімі асырылған', 'Violation: investigation deadline exceeded for 2 reports'),
    category: 'nr', area: 'ot', status: 'pending', deadline: '2026-01-31',
  },
  {
    id: 'kbm-4', dzo: 'АО «Каражанбасмунай»',
    document: R('ВНД по экологическому мониторингу', 'Экологиялық мониторинг бойынша ІНҚ', 'Environmental monitoring IR'),
    requirement: R('Программа мониторинга выполняется', 'Мониторинг бағдарламасы орындалуда', 'Monitoring programme on track'),
    category: 'nes', area: 'env', status: 'done', deadline: '2026-03-31',
  },
  // ТОО «ПНХЗ»
  {
    id: 'pnhz-1', dzo: 'ТОО «ПНХЗ»',
    document: R('Политика в области ОТ, ПБ и ООС', 'Еңбекті қорғау, ӨҚ және ҚОҚ саласындағы саясат', 'OHS, IS & Environmental Policy'),
    requirement: R('Политика утверждена и действует', 'Саясат бекітілген және қолданылады', 'Policy approved and in force'),
    category: 'nes', area: 'ot', status: 'done', deadline: '2026-01-05',
  },
  {
    id: 'pnhz-2', dzo: 'ТОО «ПНХЗ»',
    document: R('ВНД «Право остановки работ»', 'ІНҚ «Жұмысты тоқтату құқығы»', 'Stop Work Authority IR'),
    requirement: R('Обучение завершено по всем подразделениям', 'Барлық бөлімшелерде оқыту аяқталды', 'Training completed across all departments'),
    category: 'nes', area: 'pb', status: 'done', deadline: '2026-02-01',
  },
  {
    id: 'pnhz-3', dzo: 'ТОО «ПНХЗ»',
    document: R('Стандарт управления изменениями (MOC)', 'Өзгерістерді басқару стандарты (MOC)', 'Management of Change (MOC) Standard'),
    requirement: R('MOC-процедура внедрена', 'MOC рәсімі енгізілген', 'MOC procedure implemented'),
    category: 'nes', area: 'pb', status: 'done', deadline: '2026-03-15',
  },
  // ТОО «Oil Services Company»
  {
    id: 'osc-1', dzo: 'ТОО «Oil Services Company»',
    document: R('Политика в области ОТ, ПБ и ООС', 'Еңбекті қорғау, ӨҚ және ҚОҚ саласындағы саясат', 'OHS, IS & Environmental Policy'),
    requirement: R('Несоответствие: политика не размещена на объектах', 'Сәйкессіздік: саясат нысандарда орналастырылмаған', 'Non-conformity: policy not posted at sites'),
    category: 'nes', area: 'ot', status: 'pending', deadline: '2026-04-01',
  },
  {
    id: 'osc-2', dzo: 'ТОО «Oil Services Company»',
    document: R('Стандарт «Управление подрядчиками по HSE»', '«Мердігерлерді HSE бойынша басқару» стандарты', 'Contractor HSE Management Standard'),
    requirement: R('Несоответствие: нет реестра субподрядчиков', 'Сәйкессіздік: субмердігерлер тізімі жоқ', 'Non-conformity: no subcontractor register'),
    category: 'nes', area: 'ot', status: 'pending', deadline: '2026-05-20',
  },
  {
    id: 'osc-3', dzo: 'ТОО «Oil Services Company»',
    document: R('ВНД «Право остановки работ»', 'ІНҚ «Жұмысты тоқтату құқығы»', 'Stop Work Authority IR'),
    requirement: R('Нарушение: работы без наряда-допуска', 'Бұзушылық: рұқсат-нарядсыз жұмыстар', 'Violation: work without permit'),
    category: 'nr', area: 'pb', status: 'pending', deadline: '2026-02-28',
  },
  {
    id: 'osc-4', dzo: 'ТОО «Oil Services Company»',
    document: R('Стандарт БДД', 'ЖКО стандарты', 'Road Safety Standard'),
    requirement: R('Нарушение: превышение скорости вахтовым транспортом', 'Бұзушылық: вахталық көліктің жылдамдығын асыру', 'Violation: shift transport speed limit exceeded'),
    category: 'nr', area: 'rta', status: 'pending', deadline: '2026-03-15',
  },
  {
    id: 'osc-5', dzo: 'ТОО «Oil Services Company»',
    document: R('Процедура расследования происшествий', 'Оқиғаларды тергеу рәсімі', 'Incident Investigation Procedure'),
    requirement: R('Процедура адаптирована и утверждена', 'Рәсім бейімделген және бекітілген', 'Procedure adapted and approved'),
    category: 'nes', area: 'ot', status: 'done', deadline: '2026-01-25',
  },
];

export interface VndDzoStats {
  dzo: string;
  total: number;
  done: number;
  nesPending: number;
  nrPending: number;
}

export function vndStatsFor(items: VndRequirement[]): { total: number; done: number; nesPending: number; nrPending: number } {
  return {
    total: items.length,
    done: items.filter((i) => i.status === 'done').length,
    nesPending: items.filter((i) => i.status === 'pending' && i.category === 'nes').length,
    nrPending: items.filter((i) => i.status === 'pending' && i.category === 'nr').length,
  };
}

export function vndStatsByDzo(dzo: string): VndDzoStats {
  const items = VND_REQUIREMENTS.filter((i) => i.dzo === dzo);
  const s = vndStatsFor(items);
  return { dzo, ...s };
}

export function vndDzoList(): string[] {
  return [...new Set(VND_REQUIREMENTS.map((i) => i.dzo))];
}

export function vndPendingItems(dzo: string, category: VndCategory): VndRequirement[] {
  return VND_REQUIREMENTS.filter((i) => i.dzo === dzo && i.status === 'pending' && i.category === category);
}

export function vndAllStats(): ReturnType<typeof vndStatsFor> {
  return vndStatsFor(VND_REQUIREMENTS);
}
