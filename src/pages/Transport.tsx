import { useState } from 'react';
import { useI18n } from '../i18n';
import { PageHeader, KpiCard, Card, Badge } from '../components/ui';
import { Bars, Lines } from '../components/charts';
import { IconTruck, IconAlert } from '../components/icons';
import { dzoLabel, regionLabel } from '../labels';
import { DTP_YEARS, DTP_BY_DZO, DTP_TOTALS, DTP_2025 } from '../data/transport';

export function Transport() {
  const { t, lang } = useI18n();
  const [cls, setCls] = useState<'all' | 'light' | 'major'>('all');

  const grand = DTP_TOTALS.reduce((s, v) => s + v, 0);
  const y2025 = DTP_TOTALS[DTP_YEARS.indexOf(2025)];
  const y2024 = DTP_TOTALS[DTP_YEARS.indexOf(2024)];

  const trend = DTP_YEARS.map((yr, i) => ({ name: String(yr), value: DTP_TOTALS[i] }));

  const byDzo = [...DTP_BY_DZO]
    .filter((r) => r.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)
    .map((r) => ({ name: dzoLabel(r.dzo, lang), value: r.total }));

  const list = DTP_2025.filter((d) => cls === 'all' || d.cls === cls);
  const majorShare = Math.round((DTP_2025.filter((d) => d.cls === 'major').length / DTP_2025.length) * 100);
  const dzoFaultShare = Math.round((DTP_2025.filter((d) => d.fault === 'dzo').length / DTP_2025.length) * 100);

  const heatColor = (v: number) => {
    if (v === 0) return 'bg-slate-50 text-slate-300';
    if (v <= 1) return 'bg-emerald-50 text-emerald-700';
    if (v <= 3) return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div>
      <PageHeader title={t('transport.title')} subtitle={t('transport.subtitle')} breadcrumb={t('common.home')} />

      <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label={t('transport.kpi.total')} value={grand} hint="2019–2025" accent="blue" icon={IconTruck} />
        <KpiCard label={t('transport.kpi.y2025')} value={y2025} hint={`2024: ${y2024}`} accent="green" />
        <KpiCard label={t('transport.kpi.fault')} value={`${dzoFaultShare}%`} hint={t('transport.fault.dzo')} accent="amber" />
        <KpiCard label={t('transport.kpi.major')} value={`${majorShare}%`} hint={t('transport.cls.major')} accent="red" icon={IconAlert} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card title={t('transport.trend')}>
          <Lines
            data={trend}
            series={[{ key: 'value', color: '#1559a8', name: t('transport.kpi.total') }]}
            height={280}
          />
          <p className="mt-2 text-xs text-slate-400">{t('transport.trend.note')}</p>
        </Card>
        <Card title={t('transport.accidents')}>
          {byDzo.length ? <Bars data={byDzo} horizontal height={300} color="#e08a1e" /> : null}
          <p className="mt-2 text-xs text-slate-400">{grand} {t('transport.unit')} · 2019–2025</p>
        </Card>
      </div>

      <Card title={t('transport.matrix')} className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-3 py-2.5">{t('transport.col.dzo')}</th>
                {DTP_YEARS.map((y) => (
                  <th key={y} className="px-2 py-2.5 text-center">{y}</th>
                ))}
                <th className="px-3 py-2.5 text-center">{t('common.total')}</th>
              </tr>
            </thead>
            <tbody>
              {[...DTP_BY_DZO].sort((a, b) => b.total - a.total).map((r) => (
                <tr key={r.short} className="border-b border-slate-50 hover:bg-kmg-light/40">
                  <td className="px-3 py-2 font-medium text-slate-700">{dzoLabel(r.dzo, lang)}</td>
                  {r.y.map((v, i) => (
                    <td key={i} className="px-2 py-2 text-center">
                      <span className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${heatColor(v)}`}>{v || ''}</span>
                    </td>
                  ))}
                  <td className="px-3 py-2 text-center font-extrabold text-slate-800">{r.total}</td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-bold text-slate-700">
                <td className="px-3 py-2.5">{t('common.total')}</td>
                {DTP_TOTALS.map((v, i) => (
                  <td key={i} className="px-2 py-2.5 text-center">{v}</td>
                ))}
                <td className="px-3 py-2.5 text-center text-kmg-blue">{grand}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <Card
        title={t('transport.list2025')}
        className="mt-6"
        action={
          <select className="field !w-44" value={cls} onChange={(e) => setCls(e.target.value as typeof cls)}>
            <option value="all">{t('common.all')}</option>
            <option value="light">{t('transport.cls.light')}</option>
            <option value="major">{t('transport.cls.major')}</option>
          </select>
        }
      >
        <div className="space-y-3">
          {list.map((d) => (
            <div key={d.no} className="rounded-xl border border-slate-100 p-3.5 transition-colors hover:bg-kmg-light/30">
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <Badge tone="blue">{dzoLabel(d.dzo, lang)}</Badge>
                <Badge tone={d.cls === 'major' ? 'red' : 'amber'}>{t(`transport.cls.${d.cls}`)}</Badge>
                <Badge tone={d.fault === 'dzo' ? 'slate' : 'green'}>{t(`transport.fault.${d.fault}`)}</Badge>
                <span className="text-xs text-slate-400">{d.date} · {d.line[lang]} · {regionLabel(d.region, lang)}</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">{d.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
