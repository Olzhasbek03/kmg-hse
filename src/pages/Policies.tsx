import { useI18n, type Lang } from '../i18n';
import { PageHeader, Card, Badge } from '../components/ui';
import { IconBook } from '../components/icons';

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

export function Policies() {
  const { t, lang } = useI18n();
  const tone = (s: Doc['status']) => (s === 'active' ? 'green' : s === 'review' ? 'amber' : 'slate');
  const statusLabel = (s: Doc['status']) => (s === 'active' ? t('st.completed') : s === 'review' ? t('audit.st.results') : 'Draft');

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
            {MATRIX.map((m) => (
              <div key={m.dzo}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-slate-600">{m.dzo}</span>
                  <span className={`font-bold ${m.pct >= 90 ? 'text-kmg-green' : m.pct >= 80 ? 'text-kmg-amber' : 'text-kmg-red'}`}>{m.pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${m.pct >= 90 ? 'bg-kmg-green' : m.pct >= 80 ? 'bg-kmg-amber' : 'bg-kmg-red'}`} style={{ width: `${m.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
