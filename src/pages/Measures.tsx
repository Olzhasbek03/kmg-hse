import { useI18n, type Lang } from '../i18n';
import { PageHeader, KpiCard, Card, Badge } from '../components/ui';
import { IconClipboard, IconClock } from '../components/icons';
import { dzoLabel } from '../labels';

interface Row { name: Record<Lang, string>; source: string; dzo: string; deadline: string; resp: string; progress: number; status: 'done' | 'inwork' | 'overdue'; }

const ROWS: Row[] = [
  { name: { ru: 'Закрыть 17 Near Miss по технологической безопасности', kz: 'Технологиялық қауіпсіздік бойынша 17 Near Miss жабу', en: 'Close 17 Near Miss on process safety' }, source: 'Қорғау', dzo: 'АО «Озенмунайгаз»', deadline: '2026-04-01', resp: 'Б. Ережепов', progress: 65, status: 'inwork' },
  { name: { ru: 'Ограждение вращающихся частей станков-качалок', kz: 'Шайқауыш станоктардың айналмалы бөліктерін қоршау', en: 'Guard rotating parts of pumping units' }, source: 'Инцидент', dzo: 'АО «Каражанбасмунай»', deadline: '2026-03-15', resp: 'С. Ускенов', progress: 100, status: 'done' },
  { name: { ru: 'GPS-контроль скорости вахтового транспорта', kz: 'Вахталық көліктің жылдамдығын GPS-бақылау', en: 'GPS speed control of shift transport' }, source: 'Транспорт', dzo: 'АО «Эмбамунайгаз»', deadline: '2026-02-20', resp: 'А. Каримов', progress: 40, status: 'overdue' },
  { name: { ru: 'Экспертиза промышленной безопасности сосудов', kz: 'Ыдыстардың өнеркәсіптік қауіпсіздік сараптамасы', en: 'Industrial safety expertise of vessels' }, source: 'ОПО', dzo: 'ТОО «ПНХЗ»', deadline: '2026-06-30', resp: 'Н. Демисинова', progress: 20, status: 'inwork' },
  { name: { ru: 'План улучшений подрядчика (рейтинг C)', kz: 'Мердігердің жақсарту жоспары (C рейтингі)', en: 'Contractor improvement plan (rating C)' }, source: 'Подрядчики', dzo: 'ТОО «Oil Services Company»', deadline: '2026-05-10', resp: 'КЦ КМГ', progress: 80, status: 'inwork' },
  { name: { ru: 'Устранение несоответствий по акту аудита 3 уровня', kz: '3-деңгейлі аудит актісі бойынша сәйкессіздіктерді жою', en: 'Eliminate non-conformities from level-3 audit report' }, source: 'Аудит', dzo: 'ТОО «КМГ Инжиниринг»', deadline: '2026-04-25', resp: 'А. Оршабеков', progress: 100, status: 'done' },
];

const SOURCES: Record<Lang, string[]> = {
  ru: ['Все модули системы (01, 02, 03, 04, 05, 06.1, 08) — авто-создание CAPA', 'Фонд «Самрук-Қазына» / КЦ КМГ — директивные задания', 'Предписания госорганов (КПБ МЧС, Минздрав, Минтруд)'],
  kz: ['Жүйенің барлық модульдері (01, 02, 03, 04, 05, 06.1, 08) — CAPA авто-құру', '«Самұрық-Қазына» қоры / ҚМГ КО — директивалық тапсырмалар', 'Мемлекеттік органдардың нұсқамалары (ТЖМ ӨҚК, Денсаулық сақтау, Еңбек)'],
  en: ['All system modules (01, 02, 03, 04, 05, 06.1, 08) — auto CAPA creation', 'Samruk-Kazyna Fund / KMG Corporate Center — directives', 'State authority orders (EMER, MoH, MoL)'],
};

const ESCALATION: Record<Lang, { d: string; a: string }[]> = {
  ru: [
    { d: '−7 раб. дней', a: 'Email-напоминание исполнителю' },
    { d: '−3 раб. дня', a: 'Email + push, уведомление руководителю' },
    { d: 'День дедлайна', a: 'Статус → «at_risk», предупреждение HSE-менеджеру' },
    { d: '+1 день', a: 'Статус → «overdue», уведомление директору ДЗО' },
    { d: '+7 дней', a: 'Эскалация на уровень КЦ, отображение в Command Center' },
  ],
  kz: [
    { d: '−7 жұмыс күні', a: 'Орындаушыға email-еске салу' },
    { d: '−3 жұмыс күні', a: 'Email + push, басшыға хабарлама' },
    { d: 'Мерзім күні', a: 'Мәртебе → «at_risk», HSE-менеджерге ескерту' },
    { d: '+1 күн', a: 'Мәртебе → «overdue», ЕТҰ директорына хабарлама' },
    { d: '+7 күн', a: 'КО деңгейіне эскалация, Command Center-де көрсету' },
  ],
  en: [
    { d: '−7 work days', a: 'Email reminder to assignee' },
    { d: '−3 work days', a: 'Email + push, notify manager' },
    { d: 'Deadline day', a: 'Status → “at_risk”, warn HSE manager' },
    { d: '+1 day', a: 'Status → “overdue”, notify subsidiary director' },
    { d: '+7 days', a: 'Escalate to Corporate Center, show in Command Center' },
  ],
};

export function Measures() {
  const { t, lang } = useI18n();
  const tone = (s: Row['status']) => (s === 'done' ? 'green' : s === 'overdue' ? 'red' : 'amber');
  const statusLabel = (s: Row['status']) => t(s === 'done' ? 'measures.kpi.done' : s === 'overdue' ? 'measures.kpi.overdue' : 'measures.kpi.inwork');

  return (
    <div>
      <PageHeader
        title={t('measures.title')}
        subtitle={t('measures.subtitle')}
        breadcrumb={t('common.home')}
        actions={<button className="btn-green"><IconClipboard width={16} height={16} />{t('measures.create')}</button>}
      />

      <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label={t('measures.kpi.total')} value={ROWS.length * 47} accent="blue" icon={IconClipboard} />
        <KpiCard label={t('measures.kpi.done')} value="58%" accent="green" />
        <KpiCard label={t('measures.kpi.inwork')} value="31%" accent="amber" />
        <KpiCard label={t('measures.kpi.overdue')} value="11%" accent="red" icon={IconClock} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title={t('measures.title')}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    <th className="px-3 py-2.5">{t('measures.col.name')}</th>
                    <th className="px-3 py-2.5">{t('measures.col.source')}</th>
                    <th className="px-3 py-2.5">{t('measures.col.deadline')}</th>
                    <th className="px-3 py-2.5">{t('measures.col.progress')}</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r, i) => (
                    <tr key={i} className="border-b border-slate-50 align-top hover:bg-kmg-light/40">
                      <td className="px-3 py-3">
                        <div className="font-medium text-slate-700">{r.name[lang]}</div>
                        <div className="text-xs text-slate-400">{dzoLabel(r.dzo, lang)} · {r.resp}</div>
                      </td>
                      <td className="px-3 py-3"><Badge tone="blue">{r.source}</Badge></td>
                      <td className="px-3 py-3 whitespace-nowrap text-slate-500">{r.deadline}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                            <div className={`h-full rounded-full ${tone(r.status) === 'green' ? 'bg-kmg-green' : tone(r.status) === 'red' ? 'bg-kmg-red' : 'bg-kmg-amber'}`} style={{ width: `${r.progress}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-slate-500">{r.progress}%</span>
                        </div>
                        <div className="mt-1"><Badge tone={tone(r.status)}>{statusLabel(r.status)}</Badge></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card title={t('measures.sources')}>
            <ul className="space-y-2.5 text-sm text-slate-600">
              {SOURCES[lang].map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-kmg-blue" />
                  {s}
                </li>
              ))}
            </ul>
          </Card>
          <Card title={t('measures.escalation')}>
            <ol className="space-y-2">
              {ESCALATION[lang].map((e, i) => (
                <li key={i} className="flex items-start gap-3 rounded-lg bg-slate-50 p-2.5">
                  <span className="shrink-0 rounded-md bg-kmg-blue/10 px-2 py-0.5 text-xs font-bold text-kmg-blue">{e.d}</span>
                  <span className="text-sm text-slate-600">{e.a}</span>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}
