import { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import { useI18n } from '../i18n';
import { PageHeader, KpiCard, Card } from '../components/ui';
import { IconDownload, IconAlert, IconShield, IconArrow } from '../components/icons';
import { incidents, type Incident, SEVERITY_COLORS, korgauSummary } from '../data';
import { YEARS, LTIR, FAR } from '../selectors';
import { dzoLabel, monthName } from '../labels';

const tooltipStyle = {
  borderRadius: 12,
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 20px rgba(16,42,90,0.12)',
  fontSize: 13,
};

type FieldId = 'total' | 'fatal' | 'severe' | 'light';
const PRED: Record<FieldId, (i: Incident) => boolean> = {
  total: () => true,
  fatal: (i) => i.severityNorm === 'fatal',
  severe: (i) => i.severityNorm === 'severe',
  light: (i) => i.severityNorm === 'light',
};

// IOGP world benchmarks (from the official KMG OTOS report)
const IOGP = { ltir: 0.21, far: 0.57 };

export function MonthlyReport() {
  const { t, lang } = useI18n();
  const years = YEARS;
  const lastYear = years[years.length - 1];
  const [reportYear, setReportYear] = useState<number>(lastYear);
  const [field, setField] = useState<FieldId>('total');
  const [focusMonth, setFocusMonth] = useState<number>(4);

  const pdf = lang === 'kz' ? '/report/kmg-otos-kz.pdf' : lang === 'en' ? '/report/kmg-otos-en.pdf' : '/report/kmg-otos-ru.pdf';

  const fields: { id: FieldId; label: string }[] = [
    { id: 'total', label: t('rep.field.total') },
    { id: 'fatal', label: t('rep.field.fatal') },
    { id: 'severe', label: t('rep.field.severe') },
    { id: 'light', label: t('rep.field.light') },
  ];

  const count = (y: number, m: number, pred: (i: Incident) => boolean) =>
    incidents.filter((i) => i.year === y && i.month === m && pred(i)).length;
  const cum = (y: number, through: number, pred: (i: Incident) => boolean) =>
    incidents.filter((i) => i.year === y && i.month != null && i.month <= through && pred(i)).length;

  // Monthly trend — current year vs previous year only (clear comparison)
  const prevYear = reportYear - 1;
  const cmpYears = [prevYear, reportYear].filter((y) => years.includes(y));
  const monthlyData = Array.from({ length: 12 }, (_, m) => {
    const row: Record<string, string | number> = { name: monthName(m + 1, lang) };
    cmpYears.forEach((y) => (row[String(y)] = count(y, m + 1, PRED[field])));
    return row;
  });

  // Focus month — compare years for the selected month
  const focusData = years.map((y) => ({
    name: String(y),
    value: count(y, focusMonth, PRED[field]),
    color: y === reportYear ? '#1559a8' : '#c3d2e6',
  }));

  // Key indicators — cumulative Jan..focusMonth, current year vs previous
  const kpiRows: { id: FieldId; label: string }[] = [
    { id: 'total', label: t('rep.ind.total') },
    { id: 'fatal', label: t('rep.ind.fatal') },
    { id: 'severe', label: t('rep.ind.severe') },
    { id: 'light', label: t('rep.ind.light') },
  ];
  const indicators = kpiRows.map((r) => {
    const cur = cum(reportYear, focusMonth, PRED[r.id]);
    const prev = cum(reportYear - 1, focusMonth, PRED[r.id]);
    const delta = cur - prev;
    const pct = prev === 0 ? (cur === 0 ? 0 : 100) : Math.round((delta / prev) * 100);
    return { ...r, cur, prev, delta, pct };
  });

  // 5-year dynamics — total (bars) + fatal (line)
  const dynYears = years.slice(-6);
  const dynamics = dynYears.map((y) => ({
    name: String(y),
    total: incidents.filter((i) => i.year === y).length,
    fatal: incidents.filter((i) => i.year === y && i.severityNorm === 'fatal').length,
  }));

  // Severity by DZO (stacked) for the report year
  const yearInc = incidents.filter((i) => i.year === reportYear);
  const dzoCounts: Record<string, { fatal: number; severe: number; light: number }> = {};
  for (const i of yearInc) {
    const k = i.dzoNorm;
    if (!k) continue;
    dzoCounts[k] ??= { fatal: 0, severe: 0, light: 0 };
    if (i.severityNorm === 'fatal') dzoCounts[k].fatal++;
    else if (i.severityNorm === 'severe') dzoCounts[k].severe++;
    else if (i.severityNorm === 'light') dzoCounts[k].light++;
  }
  const dzoStacked = Object.entries(dzoCounts)
    .map(([k, v]) => ({ name: dzoLabel(k, lang), ...v, sum: v.fatal + v.severe + v.light }))
    .sort((a, b) => b.sum - a.sum)
    .slice(0, 7);

  // Safety pyramid
  const fatalAll = incidents.filter((i) => i.severityNorm === 'fatal').length;
  const lti = incidents.filter((i) => i.severityNorm === 'fatal' || i.severityNorm === 'severe').length;
  const nm = Number(korgauSummary['Near Miss всего'] ?? 1822);
  const korgauTotal = Number(korgauSummary['Итого карточек'] ?? 39521);
  const pyramid = [
    { label: t('rep.pyr.fatal'), value: fatalAll, color: '#b91c1c' },
    { label: t('rep.pyr.lti'), value: lti, color: '#dc2626' },
    { label: t('rep.pyr.all'), value: incidents.length, color: '#e08a1e' },
    { label: t('rep.pyr.hazard'), value: nm, color: '#ca8a04' },
    { label: t('rep.pyr.unsafe'), value: korgauTotal, color: '#1f9d57' },
  ];

  const monthOptions = Array.from({ length: 12 }, (_, m) => m + 1);

  return (
    <div>
      <PageHeader
        title={t('rep.title')}
        subtitle={t('rep.subtitle')}
        backTo="/command"
        breadcrumb={t('nav.command')}
        actions={
          <a href={pdf} target="_blank" rel="noreferrer" className="btn-primary">
            <IconDownload width={16} height={16} />
            {t('rep.download')}
          </a>
        }
      />

      {/* Controls */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-end gap-5">
          <div>
            <div className="label">{t('rep.year')}</div>
            <div className="flex flex-wrap gap-1.5">
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => setReportYear(y)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-all duration-200 active:scale-95 ${
                    reportYear === y ? 'bg-kmg-blue text-white shadow-soft' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="label">{t('rep.field')}</div>
            <div className="flex flex-wrap gap-1.5">
              {fields.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setField(f.id)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-all duration-200 active:scale-95 ${
                    field === f.id ? 'bg-kmg-blue text-white shadow-soft' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="label">{t('rep.month')}</div>
            <select className="field w-44" value={focusMonth} onChange={(e) => setFocusMonth(Number(e.target.value))}>
              {monthOptions.map((m) => (
                <option key={m} value={m}>
                  {monthName(m, lang)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Monthly year-on-year comparison — centerpiece */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2" title={`${t('rep.monthlyTrend')} — ${fields.find((f) => f.id === field)?.label}`}>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={monthlyData} margin={{ top: 8, right: 8, bottom: 4, left: -16 }} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} interval={0} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(21,89,168,0.06)' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              {cmpYears.map((y) => (
                <Bar
                  key={y}
                  dataKey={String(y)}
                  name={String(y)}
                  fill={y === reportYear ? '#1559a8' : '#c3d2e6'}
                  radius={[5, 5, 0, 0]}
                  maxBarSize={20}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title={`${t('rep.monthFocus')}: ${monthName(focusMonth, lang)}`}>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={focusData} margin={{ top: 8, right: 8, bottom: 4, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(21,89,168,0.06)' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={46}>
                {focusData.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Key indicators (period vs same period last year) */}
      <Card className="mt-6" title={`${t('rep.kpi.title')} — ${focusMonth} ${t('rep.kpi.months')} ${reportYear - 1} / ${reportYear}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-3 py-2.5">{t('rep.kpi.indicator')}</th>
                <th className="px-3 py-2.5 text-right">{focusMonth} {t('rep.kpi.months')} {reportYear - 1}</th>
                <th className="px-3 py-2.5 text-right">{focusMonth} {t('rep.kpi.months')} {reportYear}</th>
                <th className="px-3 py-2.5 text-right">{t('rep.kpi.change')}</th>
                <th className="px-3 py-2.5 text-right">%</th>
              </tr>
            </thead>
            <tbody>
              {indicators.map((r) => {
                const bad = r.delta > 0; // more incidents = worse
                return (
                  <tr key={r.id} className="border-b border-slate-50 hover:bg-kmg-light/30">
                    <td className="px-3 py-2.5 font-medium text-slate-700">{r.label}</td>
                    <td className="px-3 py-2.5 text-right text-slate-500">{r.prev}</td>
                    <td className="px-3 py-2.5 text-right font-bold text-slate-800">{r.cur}</td>
                    <td className={`px-3 py-2.5 text-right font-semibold ${r.delta === 0 ? 'text-slate-400' : bad ? 'text-kmg-red' : 'text-kmg-green'}`}>
                      {r.delta > 0 ? '+' : ''}{r.delta}
                    </td>
                    <td className={`px-3 py-2.5 text-right font-semibold ${r.delta === 0 ? 'text-slate-400' : bad ? 'text-kmg-red' : 'text-kmg-green'}`}>
                      {r.delta > 0 ? '+' : ''}{r.pct}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* IOGP benchmark */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label={t('rep.iogp.ltirKmg')} value={LTIR.toFixed(2)} hint={`IOGP ${IOGP.ltir}`} accent={LTIR <= IOGP.ltir ? 'green' : 'red'} icon={IconAlert} />
        <KpiCard label={t('rep.iogp.ltirIogp')} value={IOGP.ltir.toFixed(2)} hint={t('rep.iogp.world')} accent="blue" />
        <KpiCard label={t('rep.iogp.farKmg')} value={FAR.toFixed(2)} hint={`IOGP ${IOGP.far}`} accent={FAR <= IOGP.far ? 'green' : 'red'} icon={IconShield} />
        <KpiCard label={t('rep.iogp.farIogp')} value={IOGP.far.toFixed(2)} hint={t('rep.iogp.world')} accent="blue" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {/* 5-year dynamics */}
        <Card title={t('rep.dynamics')}>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={dynamics} margin={{ top: 8, right: 8, bottom: 4, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(21,89,168,0.06)' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="total" name={t('rep.dynamics.injured')} fill="#2f73c4" radius={[6, 6, 0, 0]} maxBarSize={42} />
              <Line dataKey="fatal" name={t('rep.dynamics.fatal')} stroke="#d24545" strokeWidth={2.5} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        {/* Severity by DZO (stacked) */}
        <Card title={`${t('rep.byDzo')} — ${reportYear}`}>
          {dzoStacked.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dzoStacked} layout="vertical" margin={{ top: 8, right: 12, bottom: 4, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(21,89,168,0.06)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="light" stackId="s" name={t('sev.light')} fill={SEVERITY_COLORS.light} radius={[0, 0, 0, 0]} />
                <Bar dataKey="severe" stackId="s" name={t('sev.severe')} fill={SEVERITY_COLORS.severe} />
                <Bar dataKey="fatal" stackId="s" name={t('sev.fatal')} fill={SEVERITY_COLORS.fatal} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-12 text-center text-sm text-slate-400">{t('rep.noData')}</p>
          )}
        </Card>
      </div>

      {/* Safety pyramid */}
      <Card className="mt-6" title={t('rep.pyramid')}>
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-1.5">
          {pyramid.map((p, i) => {
            const width = 40 + (i * 60) / (pyramid.length - 1);
            return (
              <div
                key={p.label}
                className="flex items-center justify-between rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform duration-200 hover:scale-[1.02]"
                style={{ width: `${width}%`, backgroundColor: p.color }}
              >
                <span className="truncate pr-2">{p.label}</span>
                <span className="shrink-0 text-base font-extrabold">{p.value.toLocaleString('ru-RU')}</span>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">{t('rep.pyramid.note')}</p>
      </Card>

      <div className="mt-6 flex justify-center">
        <a href={pdf} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-kmg-blue hover:underline">
          {t('rep.fullPdf')} <IconArrow width={14} height={14} />
        </a>
      </div>
    </div>
  );
}
