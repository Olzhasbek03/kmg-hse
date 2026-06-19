import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useI18n } from '../i18n';
import { PageHeader, KpiCard, Card, Badge } from '../components/ui';
import { IconSpark, IconAlert, IconDoc } from '../components/icons';
import { forecast, uniqueSorted } from '../data';
import {
  enrichedForecast,
  PTW_SUMMARY,
  ptwCategoryChart,
  signalTone,
} from '../data/ptwForecast';
import { CATEGORY_LABEL } from '../data/ptw';

function probTone(p: string): 'red' | 'amber' | 'green' {
  if (p.includes('ВЫСОКАЯ') || p.includes('🔴')) return 'red';
  if (p.includes('СРЕДНЯЯ') || p.includes('🟠')) return 'amber';
  return 'green';
}
function probLabel(p: string, t: (k: string) => string) {
  if (p.includes('ВЫСОКАЯ')) return t('forecast.prob.high');
  if (p.includes('СРЕДНЯЯ')) return t('forecast.prob.medium');
  return t('forecast.prob.moderate');
}
const clean = (s: string) => s.replace(/[🔴🟠🟡🟢▌]/g, '').trim();

const tooltipStyle = {
  borderRadius: 12,
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 20px rgba(16,42,90,0.12)',
  fontSize: 13,
};

export function Forecast() {
  const { t, lang } = useI18n();
  const [dzo, setDzo] = useState('');
  const [quarter, setQuarter] = useState('');

  const all = useMemo(() => enrichedForecast(), []);
  const dzos = useMemo(() => uniqueSorted(forecast.map((f) => f.dzo)), []);
  const rows = all.filter((f) => (!dzo || f.dzo === dzo) && (!quarter || f.quarter === quarter));

  const high = forecast.filter((f) => probTone(f.probability) === 'red').length;
  const ptwLinked = rows.reduce((s, r) => s + r.ptw.total, 0);
  const ptwCritical = rows.filter((r) => r.ptw.level === 'critical').length;
  const chartData = useMemo(() => ptwCategoryChart(lang), [lang]);

  return (
    <div>
      <PageHeader
        title={t('forecast.title')}
        subtitle={t('forecast.subtitle')}
        breadcrumb={t('common.home')}
        actions={
          <Link to="/ptw" className="btn-primary">
            <IconDoc width={16} height={16} />{t('nav.ptw')}
          </Link>
        }
      />

      <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label={t('forecast.kpi.high')} value={high} accent="red" icon={IconAlert} />
        <KpiCard label={t('forecast.kpi.ptwTotal')} value={PTW_SUMMARY.total} hint={t('forecast.kpi.ptwHint')} accent="blue" icon={IconDoc} />
        <KpiCard label={t('forecast.kpi.ptwLinked')} value={ptwLinked} hint={t('forecast.kpi.ptwLinkedHint')} accent="amber" />
        <KpiCard label={t('forecast.kpi.ptwCritical')} value={ptwCritical} accent="red" icon={IconSpark} />
      </div>

      <div className="mb-5 mt-6 rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-blue-50 p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-kmg-blue text-white">
            <IconSpark width={20} height={20} />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-700">{t('forecast.model')}</p>
            <p className="mt-1 text-sm text-slate-500">{t('forecast.modelPtw')}</p>
            <div className="mt-2 flex items-center gap-2 text-sm font-bold text-kmg-red">
              <IconAlert width={16} height={16} /> {t('forecast.redzone')}
            </div>
          </div>
        </div>
      </div>

      <Card title={t('forecast.ptwChart')} className="mb-5">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="permits" name={t('forecast.chart.permits')} fill="#1559a8" radius={[6, 6, 0, 0]} maxBarSize={36} />
            <Bar dataKey="forecastHits" name={t('forecast.chart.hits')} fill="#e08a1e" radius={[6, 6, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="mb-5">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="label">{t('forecast.col.dzo')}</label>
            <select className="field !w-48" value={dzo} onChange={(e) => setDzo(e.target.value)}>
              <option value="">{t('common.all')}</option>
              {dzos.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="label">{t('forecast.col.quarter')}</label>
            <select className="field !w-32" value={quarter} onChange={(e) => setQuarter(e.target.value)}>
              <option value="">{t('common.all')}</option>
              <option value="Q2">Q2</option>
              <option value="Q3">Q3</option>
            </select>
          </div>
          <div className="ml-auto flex items-center gap-2 text-sm">
            <Badge tone="red">{high} × {t('forecast.prob.high')}</Badge>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {rows.map((f, idx) => (
          <div key={idx} className={`card border-l-4 p-4 ${probTone(f.probability) === 'red' ? 'border-l-kmg-red' : probTone(f.probability) === 'amber' ? 'border-l-kmg-amber' : 'border-l-kmg-green'}`}>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="blue">{f.dzo}</Badge>
              <Badge tone="slate">{f.quarter}</Badge>
              <Badge tone={probTone(f.probability)}>{probLabel(f.probability, t)}</Badge>
              <Badge tone={signalTone(f.ptw.level)}>{t(`forecast.ptw.${f.ptw.level}`)}</Badge>
              <span className="font-bold text-slate-700">{clean(f.risk)}</span>
            </div>
            <div className="mt-3 grid gap-3 text-sm md:grid-cols-2 lg:grid-cols-4">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{t('forecast.col.work')}</div>
                <div className="text-slate-600">{clean(f.work)}</div>
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{t('forecast.col.precursors')}</div>
                <div className="text-slate-600">{clean(f.precursors)}</div>
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{t('forecast.col.history')}</div>
                <div className="text-slate-600">{clean(f.history)}</div>
              </div>
              <div className="rounded-lg bg-emerald-50 p-2">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-600">{t('forecast.col.action')}</div>
                <div className="text-slate-700">{clean(f.action)}</div>
              </div>
            </div>
            <div className="mt-3 rounded-xl border border-kmg-blue/15 bg-kmg-light/50 p-3">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wide text-kmg-blue">{t('forecast.ptwSignal')}</span>
                <Badge tone="blue">{f.ptw.total} {t('forecast.ptw.permits')}</Badge>
                {f.ptw.rejected > 0 && <Badge tone="red">{f.ptw.rejected} {t('ptw.st.rejected')}</Badge>}
                {f.ptw.highRisk > 0 && <Badge tone="amber">{f.ptw.highRisk} {t('forecast.ptw.highRisk')}</Badge>}
              </div>
              <p className="text-sm text-slate-600">{f.ptwAction[lang]}</p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {f.ptw.categories.map((c) => (
                  <Link key={c} to="/ptw" className="text-xs text-kmg-blue hover:underline">
                    {CATEGORY_LABEL[c][lang]}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
