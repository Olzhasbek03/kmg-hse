import type { Lang } from './i18n';
import { MONTHS_RU, MONTHS_KZ, MONTHS_EN } from './data';

export function monthName(m: number, lang: Lang): string {
  const arr = lang === 'kz' ? MONTHS_KZ : lang === 'en' ? MONTHS_EN : MONTHS_RU;
  return arr[m - 1] ?? String(m);
}

const dzoEn: Record<string, string> = {
  'АО «Озенмунайгаз»': 'Ozenmunaygas JSC',
  'АО «Каражанбасмунай»': 'Karazhanbasmunai JSC',
  'ТОО «ОзенМунайСервис»': 'OzenMunaiService LLP',
  'ТОО «Oil Services Company»': 'Oil Services Company LLP',
  'ТОО «Oil Construction Company»': 'Oil Construction Company LLP',
  'АО «КазТрансОйл»': 'KazTransOil JSC',
  'АО «Эмбамунайгаз»': 'Embamunaygas JSC',
  'АО «Мангистаумунайгаз»': 'Mangistaumunaygas JSC',
  'KMG International': 'KMG International',
  'ТОО «KMG-Security»': 'KMG-Security LLP',
  'ТОО «Кен Курылыс Сервис»': 'Ken Kurylys Service LLP',
  'ТОО «КазахОйл Актобе»': 'KazakhOil Aktobe LLP',
  'ТОО «ПетроКазахстан Ойл Продактс»': 'PetroKazakhstan Oil Products LLP',
  'ТОО «KMG EP-Catering»': 'KMG EP-Catering LLP',
  'ТОО «KPI Inc.»': 'KPI Inc. LLP',
  'ТОО «Атырауский НПЗ»': 'Atyrau Refinery LLP',
  'ТОО «ПНХЗ»': 'Pavlodar Refinery LLP',
  'ТОО «ТулпарМунайСервис»': 'TulparMunaiService LLP',
  'ТОО СП «КазГерМунай»': 'KazGerMunai JV LLP',
  'ТОО «КазГПЗ»': 'Kazakh Gas Processing Plant LLP',
  'АО НК «КазМунайГаз»': 'NC KazMunayGas JSC',
  'ТОО «КМГ Инжиниринг»': 'KMG Engineering LLP',
  'ТОО «УДТВ»': 'UDTV LLP',
  'ТОО «Oil Transport Corporation»': 'Oil Transport Corporation LLP',
  'ТОО «ArgymakTransService»': 'ArgymakTransService LLP',
};

const regionEn: Record<string, string> = {
  'Мангистауская область': 'Mangistau region',
  'Атырауская область': 'Atyrau region',
  'Актюбинская область': 'Aktobe region',
  'Западно-Казахстанская область': 'West Kazakhstan region',
  'Карагандинская область': 'Karaganda region',
  'Павлодарская область': 'Pavlodar region',
  'Кызылординская область': 'Kyzylorda region',
  'Улытауская область': 'Ulytau region',
  'г.Астана': 'Astana city',
  'г. Астана': 'Astana city',
  'г.Шымкент': 'Shymkent city',
  'г. Шымкент': 'Shymkent city',
  Румыния: 'Romania',
};

export function dzoLabel(name: string | null, lang: Lang): string {
  if (!name) return '';
  if (lang === 'en' && dzoEn[name]) return dzoEn[name];
  return name;
}

export function regionLabel(name: string | null, lang: Lang): string {
  if (!name) return '';
  if (lang === 'en' && regionEn[name]) return regionEn[name];
  return name;
}
