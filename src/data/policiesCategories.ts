import type { Lang } from '../i18n';

export interface PolicyDoc {
  id: string;
  name: Record<Lang, string>;
  type: Record<Lang, string>;
  code: string;
  date: string;
  approvedBy: Record<Lang, string>;
  file: string;
}

export interface PolicyCategory {
  id: string;
  label: Record<Lang, string>;
  docs: PolicyDoc[];
}

const BY_SD: Record<Lang, string> = { ru: 'СД', kz: 'ДК', en: 'BoD' };
const BY_BOARD: Record<Lang, string> = { ru: 'Правление', kz: 'Басқарма', en: 'Management Board' };

const DOC_TYPE = {
  policy: { ru: 'Политика', kz: 'Саясат', en: 'Policy' },
  code: { ru: 'Кодекс', kz: 'Кодекс', en: 'Code' },
  map: { ru: 'Карта', kz: 'Карта', en: 'Map' },
  charter: { ru: 'Положение', kz: 'Ереже', en: 'Charter' },
  rules: { ru: 'Правила', kz: 'Ережелер', en: 'Rules' },
  appendix: { ru: 'Приложение', kz: 'Қосымша', en: 'Appendix' },
  regulation: { ru: 'Регламент', kz: 'Регламент', en: 'Regulation' },
  protocol: { ru: 'Протокол', kz: 'Хаттама', en: 'Protocol' },
  standard: { ru: 'Стандарт', kz: 'Стандарт', en: 'Standard' },
  guide: { ru: 'Руководство', kz: 'Нұсқаулық', en: 'Guide' },
  program: { ru: 'Программа', kz: 'Бағдарлама', en: 'Program' },
  instruction: { ru: 'Рабочая инструкция', kz: 'Жұмыс нұсқаулығы', en: 'Work instruction' },
} as const;

export const POLICY_CATEGORIES: PolicyCategory[] = [
  {
    id: 'general',
    label: { ru: 'Общие', kz: 'Жалпы', en: 'General' },
    docs: [
      {
        id: 'leadership-code',
        name: {
          ru: 'Кодекс № KMG-VND-4969.1-13 от 03.09.2020 «Кодекс лидерства и приверженности работников группы компаний KMG»',
          kz: '03.09.2020 № KMG-VND-4969.1-13 «KMG компаниялар тобы қызметкерлерінің көшбасшылық және адалдық кодексі»',
          en: 'Code KMG-VND-4969.1-13 dated 03.09.2020 — Leadership & Commitment Code',
        },
        type: DOC_TYPE.code,
        code: 'KMG-VND-4969.1-13',
        date: '2020-09-03',
        approvedBy: BY_SD,
        file: '/policies/leadership-code-4969.pdf',
      },
      {
        id: 'ohs-policy',
        name: {
          ru: 'Политика № KMG-VND-4065.1-13 от 20.02.2020 «Политика в области охраны труда и промышленной безопасности»',
          kz: '20.02.2020 № KMG-VND-4065.1-13 «Еңбек қауіпсіздігі және өнеркәсіптік қауіпсіздік саясаты»',
          en: 'Policy KMG-VND-4065.1-13 dated 20.02.2020 — OHS & Industrial Safety Policy',
        },
        type: DOC_TYPE.policy,
        code: 'KMG-VND-4065.1-13',
        date: '2020-02-20',
        approvedBy: BY_SD,
        file: '/policies/ohs-policy-4065.pdf',
      },
      {
        id: 'road-map',
        name: {
          ru: 'Карта № KMG-VND-4040.4-13 от 19.02.2025 «Дорожная карта по улучшению состояния производственной безопасности»',
          kz: '19.02.2025 № KMG-VND-4040.4-13 «Өндірістік қауіпсіздік жағдайын жақсарту жол картасы»',
          en: 'Map KMG-VND-4040.4-13 dated 19.02.2025 — Production Safety Improvement Roadmap',
        },
        type: DOC_TYPE.map,
        code: 'KMG-VND-4040.4-13',
        date: '2025-02-19',
        approvedBy: BY_BOARD,
        file: '/policies/road-map-4040.pdf',
      },
      {
        id: 'committee-charter',
        name: {
          ru: 'Приложение. Положение о Комитете по ОТ, ПБ и ООС КМГ к положению № KMG-PL-847.1-13 от 31.03.2018',
          kz: 'Қосымша. 31.03.2018 № KMG-PL-847.1-13 ережесіне ҚМГ ЕҚБЖ, ӨҚ және ҚОҚ комитеті туралы ереже',
          en: 'Appendix. KMG OHS, IS & Environment Committee Charter to KMG-PL-847.1-13 dated 31.03.2018',
        },
        type: DOC_TYPE.charter,
        code: 'KMG-PL-847.1-13',
        date: '2018-03-31',
        approvedBy: BY_BOARD,
        file: '/policies/committee-charter-847.pdf',
      },
      {
        id: 'incident-rules',
        name: {
          ru: 'Правила № KMG-PR-2235.2-13 от 20.12.2023 «Правила о порядке оповещения и расследования происшествий»',
          kz: '20.12.2023 № KMG-PR-2235.2-13 «Оқиғалар туралы хабарлау және тергеу тәртібі ережелері»',
          en: 'Rules KMG-PR-2235.2-13 dated 20.12.2023 — Incident Notification & Investigation Rules',
        },
        type: DOC_TYPE.rules,
        code: 'KMG-PR-2235.2-13',
        date: '2023-12-20',
        approvedBy: BY_BOARD,
        file: '/policies/incident-rules-2235.pdf',
      },
      {
        id: 'kpi-rules',
        name: {
          ru: 'Правила № KMG-PR-2407.2-13 от 23.12.2024 «Правила по предоставлению отчётности по ключевым показателям»',
          kz: '23.12.2024 № KMG-PR-2407.2-13 «Негізгі көрсеткіштер бойынша есептілік ұсыну ережелері»',
          en: 'Rules KMG-PR-2407.2-13 dated 23.12.2024 — KPI Reporting Rules',
        },
        type: DOC_TYPE.rules,
        code: 'KMG-PR-2407.2-13',
        date: '2024-12-23',
        approvedBy: BY_BOARD,
        file: '/policies/kpi-rules-2407.pdf',
      },
      {
        id: 'appendix-rules-2191',
        name: {
          ru: 'Приложение к правилам № KMG-PR-2191.3-13 от 04.01.2021 «Правила о порядке и условиях проведения…»',
          kz: '04.01.2021 № KMG-PR-2191.3-13 ережелеріне қосымша',
          en: 'Appendix to Rules KMG-PR-2191.3-13 dated 04.01.2021',
        },
        type: DOC_TYPE.appendix,
        code: 'KMG-PR-2191.3-13',
        date: '2021-01-04',
        approvedBy: BY_BOARD,
        file: '/policies/appendix-rules-2191.pdf',
      },
      {
        id: 'korgau-regulation',
        name: {
          ru: 'Приложение. Регламент «Қорғау» к регламенту № KMG-RG-3537.1-13 от 03.02.2020',
          kz: 'Қосымша. 03.02.2020 № KMG-RG-3537.1-13 регламентіне «Қорғау» регламенті',
          en: 'Appendix. Korgau Regulation to KMG-RG-3537.1-13 dated 03.02.2020',
        },
        type: DOC_TYPE.regulation,
        code: 'KMG-RG-3537.1-13',
        date: '2020-02-03',
        approvedBy: BY_BOARD,
        file: '/policies/korgau-regulation-3537.pdf',
      },
      {
        id: 'risk-management',
        name: {
          ru: 'Регламент № KMG-RG-2629.2-13 от 20.12.2023 «Регламент по управлению рисками в области производственной безопасности»',
          kz: '20.12.2023 № KMG-RG-2629.2-13 «Өндірістік қауіпсіздік саласындағы тәуекелдерді басқару регламенті»',
          en: 'Regulation KMG-RG-2629.2-13 dated 20.12.2023 — Production Safety Risk Management Regulation',
        },
        type: DOC_TYPE.regulation,
        code: 'KMG-RG-2629.2-13',
        date: '2023-12-20',
        approvedBy: BY_BOARD,
        file: '/policies/risk-management-2629.pdf',
      },
      {
        id: 'esuot-protocol',
        name: {
          ru: 'Приложение. Протокол 14 ЕСУОТ к стандарту № KMG-ST-3669.1-13 от 05.11.2020 «Корпоративный стандарт ЕСУОТ»',
          kz: 'Қосымша. 05.11.2020 № KMG-ST-3669.1-13 стандартына 14 ББЖБЖ хаттамасы',
          en: 'Appendix. ESUOT Protocol 14 to Standard KMG-ST-3669.1-13 dated 05.11.2020',
        },
        type: DOC_TYPE.protocol,
        code: 'KMG-ST-3669.1-13',
        date: '2020-11-05',
        approvedBy: BY_BOARD,
        file: '/policies/esuot-protocol-14.pdf',
      },
      {
        id: 'competencies',
        name: {
          ru: 'Приложение. Стандарт «Компетенции ЭБД ИСУ.002» к стандарту № KMG-ST-3467.1-13 от 20.02.2020',
          kz: 'Қосымша. 20.02.2020 № KMG-ST-3467.1-13 стандартына «ЭБД ИСУ.002 құзыреттері» стандарты',
          en: 'Appendix. Competency Standard EBD ISU.002 to KMG-ST-3467.1-13 dated 20.02.2020',
        },
        type: DOC_TYPE.standard,
        code: 'KMG-ST-3467.1-13',
        date: '2020-02-20',
        approvedBy: BY_BOARD,
        file: '/policies/competencies-ebd-isu.pdf',
      },
      {
        id: 'management-guide',
        name: {
          ru: 'Руководство № KMG-RUK-4051.2-13 от 20.12.2023 «Руководство по системе менеджмента в области производственной безопасности»',
          kz: '20.12.2023 № KMG-RUK-4051.2-13 «Өндірістік қауіпсіздік саласындағы менеджмент жүйесі бойынша нұсқаулық»',
          en: 'Guide KMG-RUK-4051.2-13 dated 20.12.2023 — Production Safety Management System Guide',
        },
        type: DOC_TYPE.guide,
        code: 'KMG-RUK-4051.2-13',
        date: '2023-12-20',
        approvedBy: BY_BOARD,
        file: '/policies/kmg-ruk-4051.pdf',
      },
      {
        id: 'hse-standard',
        name: {
          ru: 'Стандарт № KMG-ST-4039.2-13 от 11.11.2022 «Корпоративный стандарт в области безопасности и охраны труда»',
          kz: '11.11.2022 № KMG-ST-4039.2-13 «Еңбек қауіпсіздігі және қорғау саласындағы корпоративтік стандарт»',
          en: 'Standard KMG-ST-4039.2-13 dated 11.11.2022 — Corporate OHS Standard',
        },
        type: DOC_TYPE.standard,
        code: 'KMG-ST-4039.2-13',
        date: '2022-11-11',
        approvedBy: BY_BOARD,
        file: '/policies/kmg-st-4039.pdf',
      },
    ],
  },
  {
    id: 'bios',
    label: { ru: 'БиОТ', kz: 'БиОТ', en: 'OHS' },
    docs: [
      {
        id: 'bios-policy-4062',
        name: {
          ru: 'Политика № KMG-VND-4062.1-13 от 20.02.2020 «Политика в отношении алкоголя, наркотических средств, психотропных веществ и аналогичных препаратов»',
          kz: '20.02.2020 № KMG-VND-4062.1-13 «Алкоголь, есірткі заттар, психотроптық заттар және ұқсас препараттар туралы саясат»',
          en: 'Policy KMG-VND-4062.1-13 dated 20.02.2020 — Alcohol, Drugs & Psychoactive Substances Policy',
        },
        type: DOC_TYPE.policy,
        code: 'KMG-VND-4062.1-13',
        date: '2020-02-20',
        approvedBy: BY_SD,
        file: '/policies/bios-policy-4062.pdf',
      },
      {
        id: 'bios-rules-2065',
        name: {
          ru: 'Приложение. Правила к правилам № KMG-PR-2065.1-13 от 12.12.2017 «Правила изоляции источников энергии»',
          kz: 'Қосымша. 12.12.2017 № KMG-PR-2065.1-13 «Энергия көздерін оқшаулау ережелері»',
          en: 'Appendix. Rules to KMG-PR-2065.1-13 dated 12.12.2017 — Energy Source Isolation Rules',
        },
        type: DOC_TYPE.rules,
        code: 'KMG-PR-2065.1-13',
        date: '2017-12-12',
        approvedBy: BY_BOARD,
        file: '/policies/bios-rules-2065.pdf',
      },
      {
        id: 'bios-standard-3407',
        name: {
          ru: 'Стандарт № KMG-ST-3407.2-13 от 20.12.2023 «Стандарт по обеспечению специальной одеждой, специальной обувью и другими средствами индивидуальной защиты»',
          kz: '20.12.2023 № KMG-ST-3407.2-13 «Арнайы киім, арнайы аяқ киім және жеке қорғану құралдарымен қамтамасыз ету стандарты»',
          en: 'Standard KMG-ST-3407.2-13 dated 20.12.2023 — PPE Provision Standard',
        },
        type: DOC_TYPE.standard,
        code: 'KMG-ST-3407.2-13',
        date: '2023-12-20',
        approvedBy: BY_BOARD,
        file: '/policies/bios-standard-3407.pdf',
      },
    ],
  },
  {
    id: 'industrial',
    label: { ru: 'Промбез', kz: 'Өнерк. қау.', en: 'Ind. safety' },
    docs: [
      {
        id: 'industrial-protocol-3679',
        name: {
          ru: 'Приложение. Протокол СД/УБПП к стандарту № KMG-ST-3679.2-13 от 10.12.2020 «Корпоративный стандарт по управлению промышленной безопасностью»',
          kz: 'Қосымша. 10.12.2020 № KMG-ST-3679.2-13 стандартына ДК/ӨББП хаттамасы',
          en: 'Appendix. BoD/HSE Protocol to KMG-ST-3679.2-13 dated 10.12.2020 — Industrial Safety Management Standard',
        },
        type: DOC_TYPE.protocol,
        code: 'KMG-ST-3679.2-13',
        date: '2020-12-10',
        approvedBy: BY_SD,
        file: '/policies/industrial-protocol-3679.pdf',
      },
    ],
  },
  {
    id: 'fire',
    label: { ru: 'Пож.Без', kz: 'Өрт қау.', en: 'Fire safety' },
    docs: [
      {
        id: 'fire-rules-2456',
        name: {
          ru: 'Приложение. Правила «ЭБД ИСУ» к правилам № KMG-PR-2456.2-13 от 28.09.2021 «Правила осуществления проверки пожарной безопасности»',
          kz: 'Қосымша. 28.09.2021 № KMG-PR-2456.2-13 ережелеріне «ЭБД ИСУ» ережелері',
          en: 'Appendix. EBD ISU Rules to KMG-PR-2456.2-13 dated 28.09.2021 — Fire Safety Inspection Rules',
        },
        type: DOC_TYPE.rules,
        code: 'KMG-PR-2456.2-13',
        date: '2021-09-28',
        approvedBy: BY_BOARD,
        file: '/policies/fire-rules-2456.pdf',
      },
    ],
  },
  {
    id: 'transport',
    label: { ru: 'Транс.без', kz: 'Көлік қау.', en: 'Trans. safety' },
    docs: [
      {
        id: 'transport-bents-3691',
        name: {
          ru: 'Приложение. Регламент БЭНТС КМГ к регламенту № KMG-RG-3691.1-13 от 25.06.2020 «Регламент безопасной эксплуатации транспортных средств»',
          kz: 'Қосымша. 25.06.2020 № KMG-RG-3691.1-13 регламентіне ҚМГ БЭНТС регламенті',
          en: 'Appendix. KMG BENTS Regulation to KMG-RG-3691.1-13 dated 25.06.2020 — Safe Vehicle Operation Regulation',
        },
        type: DOC_TYPE.regulation,
        code: 'KMG-RG-3691.1-13',
        date: '2020-06-25',
        approvedBy: BY_BOARD,
        file: '/policies/transport-bents-3691.pdf',
      },
    ],
  },
  {
    id: 'health',
    label: { ru: 'Охрана здоровья', kz: 'Денсаулық', en: 'Health' },
    docs: [
      {
        id: 'health-standard-3485',
        name: {
          ru: 'Стандарт № KMG-ST-3485.1-13 от 30.12.2019 «Корпоративный стандарт по охране здоровья»',
          kz: '30.12.2019 № KMG-ST-3485.1-13 «Денсаулық сақтау корпоративтік стандарты»',
          en: 'Standard KMG-ST-3485.1-13 dated 30.12.2019 — Corporate Health Protection Standard',
        },
        type: DOC_TYPE.standard,
        code: 'KMG-ST-3485.1-13',
        date: '2019-12-30',
        approvedBy: BY_BOARD,
        file: '/policies/health-standard-3485.pdf',
      },
      {
        id: 'health-program-4414',
        name: {
          ru: 'Программа № KMG-VND-4414.1-13 от 23.12.2022 «Программа по управлению здоровьем персонала в группе компаний KMG»',
          kz: '23.12.2022 № KMG-VND-4414.1-13 «KMG компаниялар тобында персонал денсаулығын басқару бағдарламасы»',
          en: 'Program KMG-VND-4414.1-13 dated 23.12.2022 — Employee Health Management Program',
        },
        type: DOC_TYPE.program,
        code: 'KMG-VND-4414.1-13',
        date: '2022-12-23',
        approvedBy: BY_BOARD,
        file: '/policies/health-program-4414.pdf',
      },
      {
        id: 'health-standard-4387',
        name: {
          ru: 'Стандарт № KMG-ST-4387.1-13 от 19.07.2023 «Корпоративный стандарт по организации обязательных медицинских осмотров»',
          kz: '19.07.2023 № KMG-ST-4387.1-13 «Міндетті медициналық тексерулерді ұйымдастыру корпоративтік стандарты»',
          en: 'Standard KMG-ST-4387.1-13 dated 19.07.2023 — Mandatory Medical Examinations Standard',
        },
        type: DOC_TYPE.standard,
        code: 'KMG-ST-4387.1-13',
        date: '2023-07-19',
        approvedBy: BY_BOARD,
        file: '/policies/health-standard-4387.pdf',
      },
      {
        id: 'health-regulation-4386',
        name: {
          ru: 'Регламент № KMG-RG-4386.1-13 от 19.07.2023 «Регламент по составлению единой типовой программы производственного контроля»',
          kz: '19.07.2023 № KMG-RG-4386.1-13 «Бірыңғай типтік өндірістік бақылау бағдарламасын әзірлеу регламенті»',
          en: 'Regulation KMG-RG-4386.1-13 dated 19.07.2023 — Unified Production Control Program Regulation',
        },
        type: DOC_TYPE.regulation,
        code: 'KMG-RG-4386.1-13',
        date: '2023-07-19',
        approvedBy: BY_BOARD,
        file: '/policies/health-regulation-4386.pdf',
      },
      {
        id: 'health-regulation-4044',
        name: {
          ru: 'Регламент № KMG-RG-4044.2-13 от 20.12.2023 «Регламент по организации экстренной медицинской помощи в группе компаний KMG»',
          kz: '20.12.2023 № KMG-RG-4044.2-13 «KMG компаниялар тобында шұғыл медициналық көмек ұйымдастыру регламенті»',
          en: 'Regulation KMG-RG-4044.2-13 dated 20.12.2023 — Emergency Medical Care Organization Regulation',
        },
        type: DOC_TYPE.regulation,
        code: 'KMG-RG-4044.2-13',
        date: '2023-12-20',
        approvedBy: BY_BOARD,
        file: '/policies/health-regulation-4044.pdf',
      },
    ],
  },
  {
    id: 'emergency',
    label: { ru: 'ГОиЧС', kz: 'ТЖ', en: 'Civil defense' },
    docs: [
      {
        id: 'emergency-crisis-3313',
        name: {
          ru: 'Регламент № KMG-RG-3313.2-13 от 23.12.2022 «Регламент по управлению кризисными ситуациями АО НК «КазМунайГаз»»',
          kz: '23.12.2022 № KMG-RG-3313.2-13 ««ҚазМұнайГаз» АҚ дағдарыстық жағдайларды басқару регламенті»',
          en: 'Regulation KMG-RG-3313.2-13 dated 23.12.2022 — Crisis Management Regulation',
        },
        type: DOC_TYPE.regulation,
        code: 'KMG-RG-3313.2-13',
        date: '2022-12-23',
        approvedBy: BY_BOARD,
        file: '/policies/emergency-crisis-3313.pdf',
      },
    ],
  },
  {
    id: 'environment',
    label: { ru: 'ПО', kz: 'ҚО', en: 'Env.' },
    docs: [
      {
        id: 'env-policy-emissions-4052',
        name: {
          ru: 'Политика № KMG-VND-4052.1-13 от 28.03.2019 «Политика по управлению выбросами в группе компаний АО НК «КазМунайГаз»»',
          kz: '28.03.2019 № KMG-VND-4052.1-13 ««ҚазМұнайГаз» АҚ компаниялар тобында шығарындыларды басқару саясаты»',
          en: 'Policy KMG-VND-4052.1-13 dated 28.03.2019 — Emissions Management Policy',
        },
        type: DOC_TYPE.policy,
        code: 'KMG-VND-4052.1-13',
        date: '2019-03-28',
        approvedBy: BY_SD,
        file: '/policies/env-policy-emissions-4052.pdf',
      },
      {
        id: 'env-policy-4109',
        name: {
          ru: 'Политика № KMG-VND-4109.1-13 от 09.09.2021 «Экологическая политика АО НК «КазМунайГаз»»',
          kz: '09.09.2021 № KMG-VND-4109.1-13 ««ҚазМұнайГаз» АҚ экологиялық саясаты»',
          en: 'Policy KMG-VND-4109.1-13 dated 09.09.2021 — Environmental Policy',
        },
        type: DOC_TYPE.policy,
        code: 'KMG-VND-4109.1-13',
        date: '2021-09-09',
        approvedBy: BY_SD,
        file: '/policies/env-policy-4109.pdf',
      },
      {
        id: 'env-instruction-1657',
        name: {
          ru: 'Приложение к рабочей инструкции № KMG-RI-1657.3-13 от 01.10.2020 «Рабочая инструкция по идентификации и оценке экологических аспектов»',
          kz: 'Қосымша. 01.10.2020 № KMG-RI-1657.3-13 «Экологиялық аспекттерді анықтау және бағалау жұмыс нұсқаулығы»',
          en: 'Appendix to Work Instruction KMG-RI-1657.3-13 dated 01.10.2020 — Environmental Aspects Identification & Assessment',
        },
        type: DOC_TYPE.instruction,
        code: 'KMG-RI-1657.3-13',
        date: '2020-10-01',
        approvedBy: BY_BOARD,
        file: '/policies/env-instruction-1657.pdf',
      },
      {
        id: 'env-water-standard-3293',
        name: {
          ru: 'Приложение. Корпоративный стандарт по управлению водными ресурсами к стандарту № KMG-ST-3293.1-13 от 20.12.2018',
          kz: 'Қосымша. 20.12.2018 № KMG-ST-3293.1-13 «Су ресурстарын басқару корпоративтік стандарты»',
          en: 'Appendix. Water Resources Management Standard to KMG-ST-3293.1-13 dated 20.12.2018',
        },
        type: DOC_TYPE.standard,
        code: 'KMG-ST-3293.1-13',
        date: '2018-12-20',
        approvedBy: BY_BOARD,
        file: '/policies/env-water-standard-3293.pdf',
      },
    ],
  },
];
