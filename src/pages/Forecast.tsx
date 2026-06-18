import { useMemo, useState } from 'react';
import { useI18n } from '../i18n';
import { PageHeader, Card, Badge } from '../components/ui';
import { IconSpark, IconAlert } from '../components/icons';
import { forecast, uniqueSorted } from '../data';

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

export function Forecast() {
  const { t } = useI18n();
  const [dzo, setDzo] = useState('');
  const [quarter, setQuarter] = useState('');

  const dzos = useMemo(() => uniqueSorted(forecast.map((f) => f.dzo)), []);
  const rows = forecast.filter((f) => (!dzo || f.dzo === dzo) && (!quarter || f.quarter === quarter));

  const high = forecast.filter((f) => probTone(f.probability) === 'red').length;

  return (
    <div>
      <PageHeader title={t('forecast.title')} subtitle={t('forecast.subtitle')} breadcrumb={t('common.home')} />

      <div className="mb-5 rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-blue-50 p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-kmg-blue text-white">
            <IconSpark width={20} height={20} />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-700">{t('forecast.model')}</p>
            <div className="mt-2 flex items-center gap-2 text-sm font-bold text-kmg-red">
              <IconAlert width={16} height={16} /> {t('forecast.redzone')}
            </div>
          </div>
        </div>
      </div>

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
          </div>
        ))}
      </div>
    </div>
  );
}
