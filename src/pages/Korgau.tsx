import { useMemo, useState } from 'react';
import { useI18n } from '../i18n';
import { PageHeader, KpiCard, Card } from '../components/ui';
import { Donut, Lines } from '../components/charts';
import { IconShield, IconDownload, IconSearch } from '../components/icons';
import { korgau, korgauSummary, CHART_COLORS } from '../data';
import { dzoLabel } from '../labels';

export function Korgau() {
  const { t, lang } = useI18n();
  const [q, setQ] = useState('');

  const total = Number(korgauSummary['Итого карточек'] ?? 39521);
  const nm = Number(korgauSummary['Near Miss всего'] ?? 1822);

  const sorted = useMemo(
    () =>
      [...korgau]
        .filter((r) => !/итог|всего/i.test(r.org))
        .sort((a, b) => b.total - a.total)
        .filter((r) => dzoLabel(r.org, lang).toLowerCase().includes(q.toLowerCase())),
    [q, lang]
  );

  const byYear = [
    { name: '2023', value: Number(korgauSummary['По годам: 2023'] ?? 0) },
    { name: '2024', value: Number(korgauSummary['По годам: 2024'] ?? 0) },
    { name: '2025', value: Number(korgauSummary['По годам: 2025'] ?? 0) },
    { name: '2026', value: Number(korgauSummary['По годам: 2026'] ?? 0) },
  ];
  const lineData = byYear.map((d) => ({ name: d.name, [t('korgau.kpi.total')]: d.value }));

  const typeDist = [
    { name: t('korgau.type.unsafeCond'), value: 46, color: CHART_COLORS[0] },
    { name: t('korgau.type.unsafeAct'), value: 31, color: CHART_COLORS[1] },
    { name: t('korgau.type.goodPractice'), value: 14, color: CHART_COLORS[2] },
    { name: t('korgau.type.nearMiss'), value: 5, color: CHART_COLORS[3] },
    { name: t('korgau.type.proposal'), value: 4, color: CHART_COLORS[4] },
  ];

  return (
    <div>
      <PageHeader
        title={t('korgau.title')}
        subtitle={t('korgau.subtitle')}
        breadcrumb={t('common.home')}
        actions={<button className="btn-green"><IconShield width={16} height={16} />{t('korgau.create')}</button>}
      />

      <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label={t('korgau.kpi.total')} value={total.toLocaleString()} accent="blue" icon={IconShield} />
        <KpiCard label={t('korgau.kpi.nm')} value={nm.toLocaleString()} accent="amber" />
        <KpiCard label={t('korgau.kpi.unresolved')} value={String(korgauSummary['Неустранение %'] ?? '28.8%')} accent="red" />
        <KpiCard label={t('korgau.kpi.gp')} value={String(korgauSummary['GP %'] ?? '14.3%')} accent="green" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Card title={t('korgau.byYear')} className="lg:col-span-2">
          <Lines data={lineData} series={[{ key: t('korgau.kpi.total'), color: '#1559a8', name: t('korgau.kpi.total') }]} />
        </Card>
        <Card title={t('korgau.types')}>
          <Donut data={typeDist} />
        </Card>
      </div>

      <div className="mt-5">
        <Card
          title={t('korgau.byDzo')}
          action={
            <div className="relative">
              <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                <IconSearch width={16} height={16} />
              </span>
              <input className="field !w-56 !py-1.5 pl-8 text-sm" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('common.search')} />
            </div>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <th className="px-3 py-2.5">{t('korgau.col.org')}</th>
                  <th className="px-3 py-2.5 text-right">{t('korgau.col.total')}</th>
                  <th className="px-3 py-2.5 text-right">{t('korgau.col.nm')}</th>
                  <th className="px-3 py-2.5 text-right">{t('korgau.col.nm1000')}</th>
                  <th className="px-3 py-2.5 text-right">{t('korgau.col.unresolved')}</th>
                  <th className="px-3 py-2.5 text-right">{t('korgau.col.gp')}</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((r) => (
                  <tr key={r.org} className="border-b border-slate-50 hover:bg-kmg-light/40">
                    <td className="px-3 py-2.5 font-medium text-slate-700">{dzoLabel(r.org, lang)}</td>
                    <td className="px-3 py-2.5 text-right font-semibold text-slate-700">{r.total.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-right text-slate-600">{r.nm}</td>
                    <td className="px-3 py-2.5 text-right text-slate-600">{r.nm1000}</td>
                    <td className="px-3 py-2.5 text-right">
                      <span className={r.unresolved > 35 ? 'font-semibold text-kmg-red' : 'text-slate-600'}>{r.unresolved}%</span>
                    </td>
                    <td className="px-3 py-2.5 text-right text-slate-600">{r.gp}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-card">
        <button className="btn-primary"><IconDownload width={16} height={16} />{t('common.export')}</button>
        <span className="text-xs text-slate-400">EBD-Extended v1.0 · {total.toLocaleString()} {t('common.records')}</span>
      </div>
    </div>
  );
}
