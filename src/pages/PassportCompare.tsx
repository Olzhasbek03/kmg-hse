import { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
} from 'recharts';
import { useI18n } from '../i18n';
import { PageHeader, Card } from '../components/ui';
import { IconUsers } from '../components/icons';
import { GROUPS, DZOS, budgetFor, type Dzo } from '../data/passport';
import { CHART_COLORS } from '../data';

const tooltipStyle = {
  borderRadius: 12,
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 20px rgba(16,42,90,0.12)',
  fontSize: 13,
};

type MetricId = 'workers' | 'ltir' | 'nearMiss' | 'ntr' | 'budget';

const budgetTotal = (d: Dzo) => budgetFor(d).reduce((s, r) => s + r.fact, 0);

function metricValue(d: Dzo, m: MetricId): number {
  switch (m) {
    case 'workers': return d.workers;
    case 'ltir': return d.ltir;
    case 'nearMiss': return d.nearMiss;
    case 'ntr': return d.ntr;
    case 'budget': return budgetTotal(d);
  }
}

export function PassportCompare() {
  const { t, lang } = useI18n();
  const [selected, setSelected] = useState<string[]>(['tco', 'omg', 'kbm', 'anpz']);
  const [metric, setMetric] = useState<MetricId>('ltir');

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length >= 6 ? s : [...s, id]));

  const chosen = DZOS.filter((d) => selected.includes(d.id));
  const colorOf = (id: string) => CHART_COLORS[selected.indexOf(id) % CHART_COLORS.length];

  const metrics: { id: MetricId; label: string }[] = [
    { id: 'ltir', label: 'LTIR' },
    { id: 'ntr', label: t('pp.kpi.ntr') },
    { id: 'nearMiss', label: 'Near Miss' },
    { id: 'workers', label: t('pp.kpi.workers') },
    { id: 'budget', label: t('pp.compare.budget') },
  ];

  const barData = chosen.map((d) => ({ name: d.short, value: metricValue(d, metric), id: d.id }));

  // Radar: normalized 0..100 safety profile across selected DZOs
  const radarDims: { key: string; label: string; raw: (d: Dzo) => number; invert?: boolean }[] = [
    { key: 'safety', label: t('pp.compare.dim.safety'), raw: (d) => d.ltir, invert: true },
    { key: 'culture', label: t('pp.compare.dim.culture'), raw: (d) => (d.nearMiss / d.workers) * 1000 },
    { key: 'budget', label: t('pp.compare.dim.budget'), raw: (d) => budgetTotal(d) / d.workers },
    { key: 'contractors', label: t('pp.compare.dim.contractors'), raw: (d) => d.contractors },
    { key: 'incidents', label: t('pp.compare.dim.incidents'), raw: (d) => d.ntr, invert: true },
  ];

  const radarData = radarDims.map((dim) => {
    const vals = chosen.map((d) => dim.raw(d));
    const max = Math.max(...vals, 0.0001);
    const row: Record<string, string | number> = { dim: dim.label };
    chosen.forEach((d) => {
      const norm = (dim.raw(d) / max) * 100;
      const score = dim.invert ? 100 - norm : norm;
      row[d.id] = Math.max(0, Math.min(100, Math.round(score)));
    });
    return row;
  });

  const fmtMetric = (v: number) =>
    metric === 'ltir' ? v.toFixed(3) : v.toLocaleString('ru-RU');

  return (
    <div>
      <PageHeader
        title={t('pp.compare.title')}
        subtitle={t('pp.compare.subtitle')}
        backTo="/passport"
        breadcrumb={t('nav.passport')}
      />

      {/* Selector */}
      <Card className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-slate-700">{t('pp.compare.select')}</h3>
          <span className="text-xs font-medium text-slate-400">{selected.length}/6</span>
        </div>
        <div className="space-y-3">
          {GROUPS.map((g) => (
            <div key={g.id}>
              <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-300">
                {g.no}. {g.name[lang]}
              </div>
              <div className="flex flex-wrap gap-2">
                {DZOS.filter((d) => d.group === g.id).map((d) => {
                  const on = selected.includes(d.id);
                  return (
                    <button
                      key={d.id}
                      onClick={() => toggle(d.id)}
                      className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold transition-all duration-200 active:scale-95 ${
                        on ? 'text-white shadow-soft' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                      style={on ? { backgroundColor: colorOf(d.id) } : undefined}
                    >
                      {on && <span className="h-2 w-2 rounded-full bg-white/80" />}
                      {d.short}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {chosen.length < 2 ? (
        <Card>
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <IconUsers width={36} height={36} className="text-slate-300" />
            <p className="text-sm text-slate-400">{t('pp.compare.min')}</p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Metric bar chart */}
          <Card>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-[15px] font-bold text-slate-700">{t('pp.compare.byMetric')}</h3>
              <div className="flex flex-wrap gap-1.5">
                {metrics.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMetric(m.id)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all duration-200 active:scale-95 ${
                      metric === m.id ? 'bg-kmg-blue text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} interval={0} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(21,89,168,0.06)' }} formatter={(v) => [fmtMetric(Number(v)), '']} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={56}>
                  {barData.map((d) => (
                    <Cell key={d.id} fill={colorOf(d.id)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Radar profile */}
          <Card>
            <h3 className="mb-4 text-[15px] font-bold text-slate-700">{t('pp.compare.profile')}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData} outerRadius="72%">
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="dim" tick={{ fontSize: 11, fill: '#475569' }} />
                {chosen.map((d) => (
                  <Radar key={d.id} name={d.short} dataKey={d.id} stroke={colorOf(d.id)} fill={colorOf(d.id)} fillOpacity={0.18} strokeWidth={2} />
                ))}
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                <Tooltip contentStyle={tooltipStyle} />
              </RadarChart>
            </ResponsiveContainer>
            <p className="mt-1 text-center text-xs text-slate-400">{t('pp.compare.profileNote')}</p>
          </Card>

          {/* Comparison table */}
          <Card className="lg:col-span-2">
            <h3 className="mb-4 text-[15px] font-bold text-slate-700">{t('pp.compare.table')}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    <th className="px-3 py-2.5">{t('pp.col.indicator')}</th>
                    {chosen.map((d) => (
                      <th key={d.id} className="px-3 py-2.5 text-right">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colorOf(d.id) }} />
                          {d.short}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {([
                    { label: t('pp.kpi.workers'), get: (d: Dzo) => d.workers.toLocaleString('ru-RU') },
                    { label: t('pp.kpi.ntr'), get: (d: Dzo) => String(d.ntr) },
                    { label: 'LTIR', get: (d: Dzo) => d.ltir.toFixed(3) },
                    { label: 'FAR', get: (d: Dzo) => d.far.toFixed(3) },
                    { label: 'Near Miss', get: (d: Dzo) => String(d.nearMiss) },
                    { label: t('pp.info.contractors'), get: (d: Dzo) => String(d.contractors) },
                    { label: t('pp.compare.budget'), get: (d: Dzo) => budgetTotal(d).toLocaleString('ru-RU') },
                  ] as const).map((row) => (
                    <tr key={row.label} className="border-b border-slate-50 hover:bg-kmg-light/30">
                      <td className="px-3 py-2.5 font-medium text-slate-700">{row.label}</td>
                      {chosen.map((d) => (
                        <td key={d.id} className="px-3 py-2.5 text-right font-semibold text-slate-700">{row.get(d)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
