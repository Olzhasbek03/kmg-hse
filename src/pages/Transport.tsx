import { useI18n } from '../i18n';
import { PageHeader, KpiCard, Card, Badge } from '../components/ui';
import { Bars } from '../components/charts';
import { IconTruck } from '../components/icons';
import { incidents, countBy } from '../data';
import { dzoLabel } from '../labels';

const DRIVERS = [
  { rating: 'A', pct: 58, color: '#1f9d57' },
  { rating: 'B', pct: 27, color: '#1559a8' },
  { rating: 'C', pct: 11, color: '#e08a1e' },
  { rating: 'D', pct: 4, color: '#d24545' },
];

export function Transport() {
  const { t, lang } = useI18n();

  const vehicle = incidents.filter((i) => i.typeNorm === 'vehicle');
  const byDzo = Object.entries(countBy(vehicle, (i) => i.dzoNorm))
    .map(([k, v]) => ({ name: dzoLabel(k, lang), value: v }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  return (
    <div>
      <PageHeader title={t('transport.title')} subtitle={t('transport.subtitle')} breadcrumb={t('common.home')} />

      <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label={t('transport.kpi.mvcr')} value="0.41" hint="per 1M km · IOGP 0.30" accent="amber" icon={IconTruck} />
        <KpiCard label={t('transport.kpi.vehicles')} value="2 480" accent="blue" />
        <KpiCard label={t('transport.kpi.violations')} value="1 137" accent="red" />
        <KpiCard label={t('transport.kpi.inspections')} value="97%" accent="green" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card title={t('transport.accidents')}>
          {byDzo.length ? <Bars data={byDzo} horizontal height={300} color="#e08a1e" /> : <div className="py-10 text-center text-slate-400">{t('common.noData')}</div>}
          <p className="mt-2 text-xs text-slate-400">{vehicle.length} {t('transport.accidents')} · 2020–2026</p>
        </Card>
        <Card title={t('transport.drivers')}>
          <div className="space-y-4 pt-2">
            {DRIVERS.map((d) => (
              <div key={d.rating}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg text-xs font-extrabold text-white" style={{ background: d.color }}>{d.rating}</span>
                    <span className="text-slate-600">{t('transport.drivers')} {d.rating}</span>
                  </span>
                  <span className="font-bold text-slate-700">{d.pct}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full" style={{ width: `${d.pct}%`, background: d.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-slate-600">
            <Badge tone="amber">MVCR</Badge> <span className="ml-1">{t('transport.kpi.mvcr')} = {t('forecast.prob.medium')} vs IOGP</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
