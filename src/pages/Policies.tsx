import { useState } from 'react';
import { useI18n, type Lang } from '../i18n';
import { PageHeader, Card, Badge, KpiCard } from '../components/ui';
import { IconBook, IconCheck, IconAlert } from '../components/icons';
import {
  vndAllStats,
  vndDzoList,
  vndPendingItems,
  vndStatsByDzo,
  type VndCategory,
} from '../data/vndCompliance';

interface Doc { name: Record<Lang, string>; type: string; version: string; valid: string; status: 'active' | 'review' | 'draft'; }
const DOCS: Doc[] = [
  { name: { ru: 'Политика в области охраны труда, ПБ и ООС', kz: 'Еңбекті қорғау, ӨҚ және ҚОҚ саласындағы саясат', en: 'OHS, IS & Environmental Policy' }, type: 'Policy', version: 'v4.0', valid: '2027-01-01', status: 'active' },
  { name: { ru: 'Стандарт «Управление подрядчиками по HSE»', kz: '«Мердігерлерді HSE бойынша басқару» стандарты', en: 'Contractor HSE Management Standard' }, type: 'Standard', version: 'v2.1', valid: '2026-09-15', status: 'active' },
  { name: { ru: 'Процедура расследования происшествий', kz: 'Оқиғаларды тергеу рәсімі', en: 'Incident Investigation Procedure' }, type: 'Procedure', version: 'v3.2', valid: '2026-07-01', status: 'review' },
  { name: { ru: 'ВНД «Право остановки работ (Stop Work Authority)»', kz: '«Жұмысты тоқтату құқығы» ІНҚ', en: 'Stop Work Authority Internal Regulation' }, type: 'IR', version: 'v1.5', valid: '2026-12-31', status: 'active' },
  { name: { ru: 'Стандарт управления изменениями (MOC)', kz: 'Өзгерістерді басқару стандарты (MOC)', en: 'Management of Change (MOC) Standard' }, type: 'Standard', version: 'v1.0', valid: '2026-06-30', status: 'draft' },
];

const PDCA: Record<Lang, { k: string; c: string; t: string }[]> = {
  ru: [
    { k: 'P', c: 'Plan', t: 'Разработка политик и ВНД (КЦ КМГ)' },
    { k: 'D', c: 'Do', t: 'Адаптация и внедрение в ДЗО' },
    { k: 'C', c: 'Check', t: 'Аудит и матрица соответствия' },
    { k: 'A', c: 'Act', t: 'Актуализация (за 30 дней до истечения)' },
  ],
  kz: [
    { k: 'P', c: 'Plan', t: 'Саясат пен ІНҚ әзірлеу (ҚМГ КО)' },
    { k: 'D', c: 'Do', t: 'ЕТҰ-да бейімдеу және енгізу' },
    { k: 'C', c: 'Check', t: 'Аудит және сәйкестік матрицасы' },
    { k: 'A', c: 'Act', t: 'Өзектендіру (мерзімге 30 күн қалғанда)' },
  ],
  en: [
    { k: 'P', c: 'Plan', t: 'Develop policies & internal regulations (KMG CC)' },
    { k: 'D', c: 'Do', t: 'Adapt and implement at subsidiaries' },
    { k: 'C', c: 'Check', t: 'Audit & compliance matrix' },
    { k: 'A', c: 'Act', t: 'Update (30 days before expiry)' },
  ],
};

const MATRIX = [
  { dzo: 'АО «Озенмунайгаз»', pct: 96 },
  { dzo: 'АО «Эмбамунайгаз»', pct: 92 },
  { dzo: 'АО «Каражанбасмунай»', pct: 88 },
  { dzo: 'ТОО «ПНХЗ»', pct: 99 },
  { dzo: 'ТОО «Oil Services Company»', pct: 74 },
];

type TabId = 'docs' | 'vnd';
type DrillDown = { dzo: string; category: VndCategory } | null;

export function Policies() {
  const { t, lang } = useI18n();
  const [tab, setTab] = useState<TabId>('vnd');
  const [drill, setDrill] = useState<DrillDown>(null);

  const tone = (s: Doc['status']) => (s === 'active' ? 'green' : s === 'review' ? 'amber' : 'slate');
  const statusLabel = (s: Doc['status']) => (s === 'active' ? t('st.completed') : s === 'review' ? t('audit.st.results') : 'Draft');

  const tabs: { id: TabId; label: string }[] = [
    { id: 'vnd', label: t('policies.tab.vnd') },
    { id: 'docs', label: t('policies.tab.docs') },
  ];

  const globalStats = vndAllStats();
  const dzoRows = vndDzoList().map((dzo) => vndStatsByDzo(dzo));
  const drillItems = drill ? vndPendingItems(drill.dzo, drill.category) : [];

  const toggleDrill = (dzo: string, category: VndCategory) => {
    setDrill((prev) => (prev?.dzo === dzo && prev?.category === category ? null : { dzo, category }));
  };

  const catTone = (c: VndCategory) => (c === 'nes' ? 'amber' : 'red');
  const areaTone = (a: string) => (a === 'ot' ? 'blue' : a === 'pb' ? 'amber' : a === 'env' ? 'green' : 'slate');

  return (
    <div>
      <PageHeader title={t('policies.title')} subtitle={t('policies.subtitle')} breadcrumb={t('common.home')}
        actions={<button className="btn-green"><IconBook width={16} height={16} />{t('policies.create')}</button>} />

      <Card title={t('policies.pdca')} className="mb-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PDCA[lang].map((p, i) => (
            <div key={i} className="relative rounded-xl border border-slate-100 bg-gradient-to-br from-kmg-light to-white p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-kmg-blue text-base font-extrabold text-white">{p.k}</div>
              <div className="mt-2 text-sm font-bold text-slate-700">{p.c}</div>
              <div className="text-xs text-slate-500">{p.t}</div>
            </div>
          ))}
        </div>
      </Card>

      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            onClick={() => { setTab(tb.id); setDrill(null); }}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 active:scale-95 ${
              tab === tb.id ? 'bg-kmg-blue text-white shadow-soft' : 'bg-white text-slate-500 shadow-card hover:text-kmg-blue'
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {tab === 'vnd' ? (
        <div className="space-y-5">
          <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KpiCard label={t('policies.vnd.total')} value={globalStats.total} accent="blue" icon={IconBook} />
            <KpiCard label={t('policies.vnd.done')} value={globalStats.done} accent="green" icon={IconCheck} />
            <KpiCard label={t('policies.vnd.nes')} value={globalStats.nesPending} accent="amber" icon={IconAlert} />
            <KpiCard label={t('policies.vnd.nr')} value={globalStats.nrPending} accent="red" icon={IconAlert} />
          </div>

          <Card title={t('policies.vnd.matrix')}>
            <p className="mb-4 text-xs text-slate-400">{t('policies.vnd.hint')}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    <th className="px-3 py-2.5">{t('policies.vnd.col.dzo')}</th>
                    <th className="px-3 py-2.5 text-right">{t('policies.vnd.col.total')}</th>
                    <th className="px-3 py-2.5 text-right">{t('policies.vnd.done')}</th>
                    <th className="px-3 py-2.5 text-right">{t('policies.vnd.nes')}</th>
                    <th className="px-3 py-2.5 text-right">{t('policies.vnd.nr')}</th>
                  </tr>
                </thead>
                <tbody>
                  {dzoRows.map((row) => (
                    <tr key={row.dzo} className="border-b border-slate-50 hover:bg-kmg-light/30">
                      <td className="px-3 py-3 font-medium text-slate-700">{row.dzo}</td>
                      <td className="px-3 py-3 text-right text-slate-500">{row.total}</td>
                      <td className="px-3 py-3 text-right font-bold text-kmg-green">{row.done}</td>
                      <td className="px-3 py-3 text-right">
                        {row.nesPending > 0 ? (
                          <button
                            type="button"
                            onClick={() => toggleDrill(row.dzo, 'nes')}
                            className={`font-bold underline-offset-2 hover:underline ${
                              drill?.dzo === row.dzo && drill?.category === 'nes' ? 'text-kmg-amber ring-2 ring-kmg-amber/30 rounded px-1' : 'text-kmg-amber'
                            }`}
                          >
                            {row.nesPending}
                          </button>
                        ) : (
                          <span className="text-slate-300">0</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-right">
                        {row.nrPending > 0 ? (
                          <button
                            type="button"
                            onClick={() => toggleDrill(row.dzo, 'nr')}
                            className={`font-bold underline-offset-2 hover:underline ${
                              drill?.dzo === row.dzo && drill?.category === 'nr' ? 'text-kmg-red ring-2 ring-kmg-red/30 rounded px-1' : 'text-kmg-red'
                            }`}
                          >
                            {row.nrPending}
                          </button>
                        ) : (
                          <span className="text-slate-300">0</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {drill && drillItems.length > 0 && (
            <Card
              title={t('policies.vnd.detailTitle', {
                dzo: drill.dzo,
                category: t(`policies.vnd.cat.${drill.category}`),
              })}
            >
              <div className="space-y-3">
                {drillItems.map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-100 p-4">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge tone={catTone(item.category)}>{t(`policies.vnd.cat.${item.category}`)}</Badge>
                      <Badge tone={areaTone(item.area)}>{t(`audit.area.${item.area}`)}</Badge>
                      <span className="text-xs text-slate-400">{t('policies.vnd.deadline')}: {item.deadline}</span>
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{item.document[lang]}</div>
                    <p className="mt-1 text-sm font-medium text-slate-700">{item.requirement[lang]}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {drill && drillItems.length === 0 && (
            <Card title={t('policies.vnd.detailTitle', { dzo: drill.dzo, category: t(`policies.vnd.cat.${drill.category}`) })}>
              <p className="text-sm text-slate-400">{t('policies.vnd.empty')}</p>
            </Card>
          )}
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-3">
          <Card title={t('policies.title')} className="lg:col-span-2">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    <th className="px-3 py-2.5">{t('policies.col.name')}</th>
                    <th className="px-3 py-2.5">{t('policies.col.type')}</th>
                    <th className="px-3 py-2.5">{t('policies.col.version')}</th>
                    <th className="px-3 py-2.5">{t('policies.col.valid')}</th>
                    <th className="px-3 py-2.5">{t('policies.col.status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {DOCS.map((d, i) => (
                    <tr key={i} className="border-b border-slate-50 hover:bg-kmg-light/40">
                      <td className="px-3 py-3 font-medium text-slate-700">{d.name[lang]}</td>
                      <td className="px-3 py-3"><Badge tone="blue">{d.type}</Badge></td>
                      <td className="px-3 py-3 text-slate-500">{d.version}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-slate-500">{d.valid}</td>
                      <td className="px-3 py-3"><Badge tone={tone(d.status)}>{statusLabel(d.status)}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title={t('policies.matrix')}>
            <div className="space-y-3">
              {MATRIX.map((m) => {
                const stats = vndStatsByDzo(m.dzo);
                const pct = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : m.pct;
                return (
                  <div key={m.dzo}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-slate-600">{m.dzo}</span>
                      <span className={`font-bold ${pct >= 90 ? 'text-kmg-green' : pct >= 80 ? 'text-kmg-amber' : 'text-kmg-red'}`}>{pct}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-full rounded-full ${pct >= 90 ? 'bg-kmg-green' : pct >= 80 ? 'bg-kmg-amber' : 'bg-kmg-red'}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
