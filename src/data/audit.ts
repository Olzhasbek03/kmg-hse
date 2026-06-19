import type { Lang } from '../i18n';

export type FindingCategory = 'system' | 'gross' | 'significant';
export type FindingArea = 'ot' | 'pb' | 'env' | 'rta';

export interface AuditFinding {
  no: number;
  text: Record<Lang, string>;
  basis: string;
  recommendation: Record<Lang, string>;
  category: FindingCategory;
  area: FindingArea;
}

export interface Audit {
  id: string;
  dzo: string;
  short: string;
  dates: string;
  scheduled: string;
  status: 'completed' | 'planned';
  level: number;
  total: number;
  system: number;
  gross: number;
  significant: number;
  envCount: number;
  rtaCount: number;
  pdf?: string;
  pages?: number;
  findings: AuditFinding[];
}

// Source: "График проверок" (ДПБ АО НК «КазМунайГаз», 2026) +
// inspection reports "Проверка АО КБМ / ТОО ПНХЗ / ТОО ПКОП / ТОО ККС"
export const AUDITS: Audit[] = [
  {
    id: 'pkop',
    dzo: 'ТОО «ПетроКазахстан Ойл Продактс»',
    short: 'ПКОП',
    dates: '2026-01-19 — 2026-01-23',
    scheduled: '19–23 января',
    status: 'completed',
    level: 2,
    total: 61,
    system: 28,
    gross: 18,
    significant: 15,
    envCount: 14,
    rtaCount: 9,
    pdf: '/audit/proverka-pkop.pdf',
    pages: 31,
    findings: [
      {
        no: 4,
        text: {
          ru: 'Отсутствуют карточки Кодекса лидерства и приверженности у рабочего персонала за 2025 год; не оформлены карточки на 2026 год.',
          kz: '2025 жылға жұмысшы персоналда Көшбасшылық және адалдық Кодексінің карточкалары жоқ; 2026 жылға карточкалар ресімделмеген.',
          en: 'Leadership & Commitment Code cards are missing for 2025 staff; 2026 cards are not issued.',
        },
        basis: 'Кодекс лидерства и приверженности АО НК «КазМунайГаз», решение Совета директоров №8/2020',
        recommendation: {
          ru: 'Разработать карточки Кодекса лидерства и приверженности, вести контроль исполнения по итогам анализа.',
          kz: 'Көшбасшылық Кодексінің карточкаларын әзірлеп, орындалуын бақылау.',
          en: 'Develop Leadership Code cards and control their execution based on analysis.',
        },
        category: 'system',
        area: 'pb',
      },
      {
        no: 5,
        text: {
          ru: 'Работники цеха №3 применяют инструменты кустарного (несертифицированного) производства.',
          kz: '№3 цех жұмысшылары қолдан жасалған (сертификатталмаған) құрал-саймандарды қолданады.',
          en: 'Workshop No.3 employees use homemade (uncertified) tools.',
        },
        basis: 'Статья 182 Трудового кодекса РК от 23.11.2015',
        recommendation: {
          ru: 'Провести анализ соответствия применяемых инструментов, обеспечить персонал инструментом заводского исполнения.',
          kz: 'Қолданылатын құралдардың сәйкестігін талдап, зауыттық құралмен қамтамасыз ету.',
          en: 'Analyse tool compliance and provide staff with factory-made tools.',
        },
        category: 'gross',
        area: 'ot',
      },
      {
        no: 60,
        text: {
          ru: 'На территории ПКОП наблюдается смешивание отходов; контейнеры для накопления отходов не соответствуют требованиям, отсутствует маркировка.',
          kz: 'ПКОП аумағында қалдықтарды араластыру байқалады; қалдық контейнерлері талаптарға сай емес, таңбалау жоқ.',
          en: 'Waste mixing observed on PKOP site; waste containers fail requirements, no marking.',
        },
        basis: 'Статья 320 Экологического кодекса РК; приказ Министра экологии №482 от 02.12.2021',
        recommendation: {
          ru: 'Провести инструктаж по раздельному сбору отходов, обеспечить контейнеры маркировкой и предусмотреть площадку временного хранения.',
          kz: 'Қалдықтарды бөлек жинау бойынша нұсқама өткізіп, контейнерлерді таңбалау.',
          en: 'Brief on separate waste collection, mark containers and arrange temporary storage area.',
        },
        category: 'significant',
        area: 'env',
      },
    ],
  },
  {
    id: 'pnhz',
    dzo: 'ТОО «ПНХЗ»',
    short: 'ПНХЗ',
    dates: '2026-02-09 — 2026-02-13',
    scheduled: '9–13 февраля',
    status: 'completed',
    level: 5,
    total: 45,
    system: 21,
    gross: 12,
    significant: 12,
    envCount: 10,
    rtaCount: 6,
    pdf: '/audit/proverka-pnhz.pdf',
    pages: 24,
    findings: [
      {
        no: 4,
        text: {
          ru: 'Нарушается порядок организации медицинских осмотров при переводе работника на другую должность/работу.',
          kz: 'Жұмысшыны басқа лауазымға ауыстырғанда медициналық тексеру тәртібі бұзылады.',
          en: 'Medical examination procedure is violated when transferring an employee to another position.',
        },
        basis: 'Приказ и.о. Министра здравоохранения РК №131/2020 (параграф 2); ТК РК',
        recommendation: {
          ru: 'Проводить предварительные осмотры при изменении условий труда; обеспечить периодические медосмотры.',
          kz: 'Еңбек жағдайы өзгергенде алдын ала тексеру жүргізу; кезеңдік медтексерулерді қамтамасыз ету.',
          en: 'Conduct preliminary exams on changed conditions; ensure periodic medical checks.',
        },
        category: 'gross',
        area: 'ot',
      },
      {
        no: 5,
        text: {
          ru: 'Отсутствуют группы допуска по электробезопасности у операторов технологических установок в зоне размещения электрооборудования.',
          kz: 'Электр жабдығы аймағындағы технологиялық қондырғы операторларында электр қауіпсіздігі рұқсат топтары жоқ.',
          en: 'Process unit operators lack electrical safety clearance groups in electrical equipment zones.',
        },
        basis: 'Правила технической эксплуатации электроустановок потребителей, п.15, 16',
        recommendation: {
          ru: 'Провести обучение, проверку знаний и оформление групп допуска по электробезопасности.',
          kz: 'Оқыту, білім тексеру өткізіп, электр қауіпсіздігі рұқсат топтарын ресімдеу.',
          en: 'Provide training, knowledge checks and issue electrical safety clearance groups.',
        },
        category: 'system',
        area: 'pb',
      },
      {
        no: 6,
        text: {
          ru: 'План программы оздоровления работников исполнен на 91% — не выполнено 2 пункта из 24.',
          kz: 'Жұмысшыларды сауықтыру бағдарламасы 91%-ға орындалды — 24 тармақтың 2-уі орындалмаған.',
          en: 'Employee wellness programme is 91% complete — 2 of 24 items not done.',
        },
        basis: 'Санитарные правила, приказ МЗ РК №62 от 07.04.2023',
        recommendation: {
          ru: 'Организовать и проводить дезинфекцию систем вентиляции и кондиционирования не менее одного раза в год.',
          kz: 'Желдету және кондиционерлеу жүйелерін жылына кемінде бір рет дезинфекциялау.',
          en: 'Organise disinfection of ventilation/AC systems at least once a year.',
        },
        category: 'significant',
        area: 'env',
      },
    ],
  },
  {
    id: 'kks',
    dzo: 'ТОО «Кен Курылыс Сервис»',
    short: 'ККС',
    dates: '2026-02-25 — 2026-02-27',
    scheduled: '25–27 февраля',
    status: 'completed',
    level: 3,
    total: 45,
    system: 22,
    gross: 13,
    significant: 10,
    envCount: 8,
    rtaCount: 7,
    pdf: '/audit/proverka-kks.pdf',
    pages: 17,
    findings: [
      {
        no: 5,
        text: {
          ru: 'Не проводится оценка рисков перед началом работ повышенной опасности с оформлением наряд-допуска; отсутствует перечень рисков.',
          kz: 'Жоғары қауіпті жұмыс алдында тәуекелді бағалау наряд-рұқсатпен жүргізілмейді; тәуекелдер тізбесі жоқ.',
          en: 'No risk assessment with permit-to-work before high-risk jobs; risk list absent.',
        },
        basis: 'Исх. письмо №13/10677 от 29.12.2023; Регламент по управлению рисками КМГ',
        recommendation: {
          ru: 'Проводить оценку рисков перед началом работ повышенной опасности согласно Правилам.',
          kz: 'Жоғары қауіпті жұмыс алдында Ережелерге сай тәуекелді бағалау жүргізу.',
          en: 'Carry out risk assessment before high-risk works per the rules.',
        },
        category: 'system',
        area: 'pb',
      },
      {
        no: 6,
        text: {
          ru: 'Не проводится внедрение интегрированной системы менеджмента (ИСМ) и получение соответствующего сертификата (ISO 45001).',
          kz: 'Интеграцияланған менеджмент жүйесі (ИМЖ) енгізілмейді және тиісті сертификат (ISO 45001) алынбаған.',
          en: 'Integrated management system (IMS) is not implemented and ISO 45001 not obtained.',
        },
        basis: 'ISO 45001 о планировании, внедрении и поддержке процессов охраны труда',
        recommendation: {
          ru: 'Пересмотреть и актуализировать документацию в соответствии со стандартами ИСМ.',
          kz: 'ИМЖ стандарттарына сай құжаттаманы қайта қарап, өзектендіру.',
          en: 'Review and update documentation in line with IMS standards.',
        },
        category: 'gross',
        area: 'ot',
      },
      {
        no: 7,
        text: {
          ru: 'Не проводятся Комитеты по охране труда, промышленной безопасности и охране окружающей среды.',
          kz: 'Еңбекті қорғау, өнеркәсіптік қауіпсіздік және қоршаған ортаны қорғау комитеттері өткізілмейді.',
          en: 'OHS, industrial safety and environment committees are not held.',
        },
        basis: 'Положение о Комитете по ОТ, ПБ и ООС АО НК «КазМунайГаз»',
        recommendation: {
          ru: 'В обязательном порядке проводить Комитеты по ОТ, ПБ и ООС с протоколированием решений.',
          kz: 'ЕҚ, ӨҚ және ҚОҚ комитеттерін міндетті түрде өткізу.',
          en: 'Mandatorily hold OHS/IS/Env committees with minuted decisions.',
        },
        category: 'system',
        area: 'pb',
      },
    ],
  },
  {
    id: 'kbm',
    dzo: 'АО «Каражанбасмунай»',
    short: 'КБМ',
    dates: '2026-03-11 — 2026-03-13',
    scheduled: '10–13 марта',
    status: 'completed',
    level: 4,
    total: 59,
    system: 30,
    gross: 14,
    significant: 15,
    envCount: 11,
    rtaCount: 14,
    pdf: '/audit/proverka-kbm.pdf',
    pages: 21,
    findings: [
      {
        no: 1,
        text: {
          ru: 'Вновь принятые работники цеха добычи нефти №1 не ознакомлены с инструкциями по безопасности и охране труда по видам работ и профессиям.',
          kz: '№1 мұнай өндіру цехына жаңа қабылданған жұмысшылар жұмыс түрлері мен мамандықтар бойынша қауіпсіздік нұсқаулықтарымен таныстырылмаған.',
          en: 'Newly hired oil production shop No.1 workers were not familiarised with OHS instructions by job type and profession.',
        },
        basis: 'Правила разработки и пересмотра инструкций, приказ МЗ РК №927 от 30.11.2015; Корпоративный стандарт «ЕСУ ОТ КМГ»',
        recommendation: {
          ru: 'Обеспечить ознакомление работников с инструкциями по безопасности и охране труда по видам работ и профессиям.',
          kz: 'Жұмысшыларды жұмыс түрлері мен мамандықтар бойынша нұсқаулықтармен таныстыру.',
          en: 'Ensure workers are briefed on OHS instructions by job type and profession.',
        },
        category: 'gross',
        area: 'ot',
      },
      {
        no: 3,
        text: {
          ru: 'Оценка риска перед началом работ повышенной опасности и оформление наряд-допуска проводится один раз за вахту/смену, что не соответствует Регламенту.',
          kz: 'Жоғары қауіпті жұмыс алдындағы тәуекелді бағалау мен наряд-рұқсат вахта/ауысымына бір рет жүргізіледі, бұл Регламентке сай емес.',
          en: 'Risk assessment and permit before high-risk work is done once per shift/rotation, contrary to the Regulation.',
        },
        basis: 'Письмо №13/10677 от 29.12.2023; Правила обеспечения промбезопасности, приказ №019 от 25.12.2015',
        recommendation: {
          ru: 'Проводить оценку рисков перед началом каждой работы повышенной опасности в соответствии с Регламентом.',
          kz: 'Әрбір жоғары қауіпті жұмыс алдында тәуекелді бағалауды Регламентке сай жүргізу.',
          en: 'Assess risks before each high-risk job in line with the Regulation.',
        },
        category: 'system',
        area: 'pb',
      },
      {
        no: 56,
        text: {
          ru: 'Допускается использование воды для хозяйственно-питьевых нужд скважин без лабораторного исследования качества.',
          kz: 'Ұңғымалардың шаруашылық-ауызсу қажеттіліктеріне су зертханалық сапа тексерусіз пайдаланылады.',
          en: 'Well water is used for domestic/drinking needs without laboratory quality testing.',
        },
        basis: 'Кодекс РК «О здоровье народа», приказ МЗ №360-VI; Санитарные правила',
        recommendation: {
          ru: 'Обеспечить лабораторные анализы воды и периодический отбор проб в соответствии с СанПиН.',
          kz: 'Суға зертханалық талдау мен кезеңдік сынама алуды СанЕжелерге сай қамтамасыз ету.',
          en: 'Ensure laboratory water analysis and periodic sampling per sanitary rules.',
        },
        category: 'significant',
        area: 'env',
      },
      {
        no: 58,
        text: {
          ru: 'В помещении столовой «Береке» отсутствует должный контроль за хранением пищевой продукции; недостаточно холодильного оборудования.',
          kz: '«Береке» асханасында тамақ өнімін сақтауды бақылау жеткіліксіз; тоңазытқыш жабдық жетіспейді.',
          en: 'Canteen "Bereke" lacks proper food storage control; insufficient refrigeration.',
        },
        basis: 'Санитарные правила к объектам общественного питания, приказ МЗ РК №КР ДСМ-16 от 17.02.2022',
        recommendation: {
          ru: 'Обеспечить объекты общественного питания достаточным количеством холодильного оборудования.',
          kz: 'Қоғамдық тамақтану нысандарын жеткілікті тоңазытқыш жабдықпен қамтамасыз ету.',
          en: 'Provide catering facilities with sufficient refrigeration equipment.',
        },
        category: 'significant',
        area: 'env',
      },
    ],
  },
  {
    id: 'emg',
    dzo: 'АО «Эмбамунайгаз»',
    short: 'ЭМГ',
    dates: '',
    scheduled: '6–10 апреля',
    status: 'planned',
    level: 2,
    total: 0,
    system: 0,
    gross: 0,
    significant: 0,
    envCount: 0,
    rtaCount: 0,
    findings: [],
  },
  {
    id: 'omg',
    dzo: 'АО «Озенмунайгаз»',
    short: 'ОМГ',
    dates: '',
    scheduled: '18–22 мая',
    status: 'planned',
    level: 3,
    total: 0,
    system: 0,
    gross: 0,
    significant: 0,
    envCount: 0,
    rtaCount: 0,
    findings: [],
  },
  {
    id: 'koa',
    dzo: 'ТОО «КазахОйл Актобе»',
    short: 'КОА',
    dates: '',
    scheduled: '8–12 июня',
    status: 'planned',
    level: 4,
    total: 0,
    system: 0,
    gross: 0,
    significant: 0,
    envCount: 0,
    rtaCount: 0,
    findings: [],
  },
  {
    id: 'ktm',
    dzo: 'ТОО «КазахТуркМунай»',
    short: 'КТМ',
    dates: '',
    scheduled: '8–12 июня',
    status: 'planned',
    level: 3,
    total: 0,
    system: 0,
    gross: 0,
    significant: 0,
    envCount: 0,
    rtaCount: 0,
    findings: [],
  },
];

export const AUDIT_SCHEDULE_PDF = '/audit/grafik-proverok.pdf';

export const COMPLETED_AUDITS = AUDITS.filter((a) => a.status === 'completed');

export const AUDIT_TOTALS = {
  findings: COMPLETED_AUDITS.reduce((s, a) => s + a.total, 0),
  system: COMPLETED_AUDITS.reduce((s, a) => s + a.system, 0),
  gross: COMPLETED_AUDITS.reduce((s, a) => s + a.gross, 0),
  significant: COMPLETED_AUDITS.reduce((s, a) => s + a.significant, 0),
};

// Corrective actions (CAPA) auto-derived from inspection findings →
// connects the Audit module to the Measures module.
export interface AuditMeasure {
  auditId: string;
  dzo: string;
  no: number;
  name: Record<Lang, string>;
  category: FindingCategory;
  area: FindingArea;
  deadline: string;
  progress: number;
  status: 'done' | 'inwork' | 'overdue';
}

function deadlineFor(dates: string, weeks: number): string {
  const end = dates.split('—')[1]?.trim() || dates.trim();
  const d = new Date(end);
  if (isNaN(d.getTime())) return '';
  d.setDate(d.getDate() + weeks * 7);
  return d.toISOString().slice(0, 10);
}

export const AUDIT_MEASURES: AuditMeasure[] = COMPLETED_AUDITS.flatMap((a) =>
  a.findings.map((f, i) => {
    const progress = f.category === 'significant' ? 100 : f.category === 'gross' ? 55 : 25;
    const deadline = deadlineFor(a.dates, f.category === 'significant' ? 4 : f.category === 'gross' ? 8 : 12);
    const status: AuditMeasure['status'] =
      progress === 100 ? 'done' : new Date(deadline) < new Date('2026-06-18') ? 'overdue' : 'inwork';
    return {
      auditId: a.id,
      dzo: a.dzo,
      no: f.no,
      name: f.recommendation,
      category: f.category,
      area: f.area,
      deadline,
      progress: i === 0 && a.id === 'kbm' ? 80 : progress,
      status,
    };
  })
);
