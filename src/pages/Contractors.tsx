import { useI18n } from '../i18n';
import { PageHeader, KpiCard, Card, Badge } from '../components/ui';
import { IconUsers } from '../components/icons';
import { dzoLabel } from '../labels';

interface C { name: string; bin: string; rating: 'A' | 'B' | 'C' | 'D'; ltir: number; }
const DATA: C[] = [
  { name: 'ТОО «ОзенМунайСервис»', bin: '050340001234', rating: 'B', ltir: 1.2 },
  { name: 'ТОО «Oil Services Company»', bin: '061140004567', rating: 'C', ltir: 2.8 },
  { name: 'ТОО «Oil Construction Company»', bin: '070240007890', rating: 'B', ltir: 1.6 },
  { name: 'ТОО «Кен Курылыс Сервис»', bin: '081040003344', rating: 'A', ltir: 0.4 },
  { name: 'ТОО «ТулпарМунайСервис»', bin: '090540005566', rating: 'C', ltir: 3.1 },
  { name: 'ТОО «ArgymakTransService»', bin: '100640007788', rating: 'D', ltir: 4.5 },
  { name: 'ТОО «KMG EP-Catering»', bin: '110740009900', rating: 'A', ltir: 0.2 },
];

const ratingTone = (r: C['rating']) => (r === 'A' ? 'green' : r === 'B' ? 'blue' : r === 'C' ? 'amber' : 'red');

export function Contractors() {
  const { t, lang } = useI18n();
  return (
    <div>
      <PageHeader title={t('contractors.title')} subtitle={t('contractors.subtitle')} breadcrumb={t('common.home')}
        actions={<button className="btn-green"><IconUsers width={16} height={16} />{t('contractors.create')}</button>} />

      <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        {(['A', 'B', 'C', 'D'] as const).map((r) => (
          <KpiCard
            key={r}
            label={t(`contractors.rating.${r.toLowerCase()}`)}
            value={DATA.filter((c) => c.rating === r).length}
            accent={r === 'A' ? 'green' : r === 'B' ? 'blue' : r === 'C' ? 'amber' : 'red'}
          />
        ))}
      </div>

      <Card title={t('contractors.title')} className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-3 py-2.5">{t('contractors.col.name')}</th>
                <th className="px-3 py-2.5">{t('contractors.col.bin')}</th>
                <th className="px-3 py-2.5 text-right">{t('contractors.col.ltir')}</th>
                <th className="px-3 py-2.5">{t('contractors.col.rating')}</th>
                <th className="px-3 py-2.5">{t('contractors.col.status')}</th>
              </tr>
            </thead>
            <tbody>
              {DATA.map((c, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-kmg-light/40">
                  <td className="px-3 py-3 font-medium text-slate-700">{dzoLabel(c.name, lang)}</td>
                  <td className="px-3 py-3 text-slate-500">{c.bin}</td>
                  <td className="px-3 py-3 text-right font-semibold text-slate-700">{c.ltir.toFixed(1)}</td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-sm font-extrabold ${
                      c.rating === 'A' ? 'bg-emerald-100 text-emerald-700' : c.rating === 'B' ? 'bg-kmg-blue/10 text-kmg-blue' : c.rating === 'C' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>{c.rating}</span>
                  </td>
                  <td className="px-3 py-3"><Badge tone={ratingTone(c.rating)}>{t(`contractors.rating.${c.rating.toLowerCase()}`)}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
