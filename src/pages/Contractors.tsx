import { useState } from 'react';
import { useI18n } from '../i18n';
import { PageHeader, KpiCard, Card, Badge } from '../components/ui';
import { Donut, Bars } from '../components/charts';
import { IconUsers, IconAlert, IconFire } from '../components/icons';
import { dzoLabel } from '../labels';
import {
  CONTR_DIR_2025,
  CONTR_TOTAL_2025,
  CONTR_BY_DZO_2025,
  CONTR_ACCIDENTS_2025,
  CONTR_NS_TYPES,
  ratingFor,
  type Rating,
} from '../data/contractors';

const ratingTone = (r: Rating) => (r === 'A' ? 'green' : r === 'B' ? 'blue' : r === 'C' ? 'amber' : 'red');
const ratingBg = (r: Rating) =>
  r === 'A' ? 'bg-emerald-100 text-emerald-700' : r === 'B' ? 'bg-kmg-blue/10 text-kmg-blue' : r === 'C' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700';

export function Contractors() {
  const { t, lang } = useI18n();
  const [dir, setDir] = useState('');

  const rows = CONTR_BY_DZO_2025.filter((c) => !dir || c.dir === dir).map((c) => ({ ...c, rating: ratingFor(c.ltir, c.ns) }));
  const ratingCount = (r: Rating) => CONTR_BY_DZO_2025.filter((c) => ratingFor(c.ltir, c.ns) === r).length;

  const dirBars = CONTR_DIR_2025.map((d) => ({ name: d.dir[lang], value: d.ltir }));
  const nsDonut = CONTR_NS_TYPES.map((n) => ({ name: n.name[lang], value: n.pct }));
  const fatalities = CONTR_ACCIDENTS_2025.reduce((s, a) => s + a.fatal, 0);

  return (
    <div>
      <PageHeader title={t('contractors.title')} subtitle={t('contractors.subtitle')} breadcrumb={t('common.home')} />

      <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label={t('contractors.kpi.orgs')} value={CONTR_TOTAL_2025.orgs.toLocaleString()} hint="2025" accent="blue" icon={IconUsers} />
        <KpiCard label={t('contractors.kpi.ns')} value={CONTR_TOTAL_2025.ns} hint={`${CONTR_TOTAL_2025.lti} LTI`} accent="amber" icon={IconAlert} />
        <KpiCard label={t('contractors.kpi.fatal')} value={fatalities} accent="red" icon={IconFire} />
        <KpiCard label={t('contractors.kpi.ltir')} value={CONTR_TOTAL_2025.ltir.toFixed(2)} hint="per 1M ч/ч" accent="green" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-5">
        <Card title={t('contractors.byDir')} className="lg:col-span-3">
          <Bars data={dirBars} height={260} color="#1559a8" />
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CONTR_DIR_2025.map((d) => (
              <div key={d.key} className="rounded-xl bg-slate-50 p-3">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{d.dir[lang]}</div>
                <div className="mt-1 text-lg font-extrabold text-slate-700">{d.ltir.toFixed(2)}</div>
                <div className="text-[11px] text-slate-400">{d.orgs} {t('contractors.unit.orgs')} · {d.ns} НС</div>
              </div>
            ))}
          </div>
        </Card>
        <Card title={t('contractors.nsTypes')} className="lg:col-span-2">
          <Donut data={nsDonut} height={300} />
        </Card>
      </div>

      <Card
        title={t('contractors.byDzo')}
        className="mt-6"
        action={
          <select className="field !w-48" value={dir} onChange={(e) => setDir(e.target.value)}>
            <option value="">{t('common.all')}</option>
            {CONTR_DIR_2025.map((d) => (
              <option key={d.key} value={d.key}>{d.dir[lang]}</option>
            ))}
          </select>
        }
      >
        <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {(['A', 'B', 'C', 'D'] as const).map((r) => (
            <div key={r} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
              <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-extrabold ${ratingBg(r)}`}>{r}</span>
              <div>
                <div className="text-lg font-extrabold text-slate-700">{ratingCount(r)}</div>
                <div className="text-[11px] text-slate-400">{t(`contractors.rating.${r.toLowerCase()}`)}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-3 py-2.5">{t('contractors.col.name')}</th>
                <th className="px-3 py-2.5 text-right">{t('contractors.col.orgs')}</th>
                <th className="px-3 py-2.5 text-right">{t('contractors.col.workers')}</th>
                <th className="px-3 py-2.5 text-right">{t('contractors.col.ns')}</th>
                <th className="px-3 py-2.5 text-right">{t('contractors.col.ltir')}</th>
                <th className="px-3 py-2.5">{t('contractors.col.rating')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.sort((a, b) => b.ltir - a.ltir).map((c) => (
                <tr key={c.short} className="border-b border-slate-50 hover:bg-kmg-light/40">
                  <td className="px-3 py-2.5 font-medium text-slate-700">{dzoLabel(c.dzo, lang)}</td>
                  <td className="px-3 py-2.5 text-right text-slate-500">{c.orgs}</td>
                  <td className="px-3 py-2.5 text-right text-slate-500">{c.workers.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-right font-semibold text-slate-700">{c.ns}</td>
                  <td className="px-3 py-2.5 text-right font-semibold text-slate-700">{c.ltir.toFixed(2)}</td>
                  <td className="px-3 py-2.5">
                    <Badge tone={ratingTone(c.rating)}>{c.rating}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title={t('contractors.accidents')} className="mt-6">
        <div className="space-y-3">
          {CONTR_ACCIDENTS_2025.map((a) => (
            <div
              key={a.no}
              className={`rounded-xl border p-3.5 transition-colors ${a.severity === 'fatal' ? 'border-red-200 bg-red-50/40' : 'border-slate-100 hover:bg-kmg-light/30'}`}
            >
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400">№{a.no}</span>
                <Badge tone="blue">{dzoLabel(a.dzo, lang)}</Badge>
                <Badge tone={a.severity === 'fatal' ? 'red' : a.severity === 'severe' ? 'amber' : 'green'}>{t(`contractors.sev.${a.severity}`)}</Badge>
                <Badge tone="slate">{a.type[lang]}</Badge>
                {a.fatal > 0 && <Badge tone="red">{t('contractors.deaths')}: {a.fatal}</Badge>}
                <span className="text-xs text-slate-400">{a.date} · {a.contractor}</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">{a.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
