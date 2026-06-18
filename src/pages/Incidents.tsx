import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { PageHeader, KpiCard, Card, Badge } from '../components/ui';
import { Donut } from '../components/charts';
import { IconAlert, IconSearch, IconDownload, IconEye, IconFilter } from '../components/icons';
import { incidents, uniqueSorted, SEVERITY_COLORS } from '../data';
import { dzoLabel, regionLabel } from '../labels';

const PAGE_SIZE = 15;

export function Incidents() {
  const { t, lang } = useI18n();
  const [q, setQ] = useState('');
  const [sev, setSev] = useState('');
  const [type, setType] = useState('');
  const [dzo, setDzo] = useState('');
  const [year, setYear] = useState('');
  const [bl, setBl] = useState('');
  const [page, setPage] = useState(1);

  const dzos = useMemo(() => uniqueSorted(incidents.map((i) => i.dzoNorm)), []);
  const types = useMemo(() => uniqueSorted(incidents.map((i) => i.typeNorm)), []);
  const years = useMemo(() => uniqueSorted(incidents.map((i) => i.year)), []);
  const bls = useMemo(() => uniqueSorted(incidents.map((i) => i.businessLine)), []);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return incidents.filter((i) => {
      if (sev && i.severityNorm !== sev) return false;
      if (type && i.typeNorm !== type) return false;
      if (dzo && i.dzoNorm !== dzo) return false;
      if (year && String(i.year) !== year) return false;
      if (bl && i.businessLine !== bl) return false;
      if (ql) {
        const hay = `${i.victim ?? ''} ${i.description ?? ''} ${i.dzoNorm ?? ''} ${i.place ?? ''} ${i.diagnosis ?? ''} ${i.num ?? ''}`.toLowerCase();
        if (!hay.includes(ql)) return false;
      }
      return true;
    });
  }, [q, sev, type, dzo, year, bl]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageClamped = Math.min(page, totalPages);
  const rows = filtered.slice((pageClamped - 1) * PAGE_SIZE, pageClamped * PAGE_SIZE);

  const kpi = {
    total: filtered.length,
    fatal: filtered.filter((i) => i.severityNorm === 'fatal').length,
    severe: filtered.filter((i) => i.severityNorm === 'severe').length,
    light: filtered.filter((i) => i.severityNorm === 'light').length,
  };

  const sevData = (['fatal', 'severe', 'light'] as const)
    .map((s) => ({ name: t(`sev.${s}`), value: filtered.filter((i) => i.severityNorm === s).length, color: SEVERITY_COLORS[s] }))
    .filter((d) => d.value > 0);

  const reset = () => {
    setQ(''); setSev(''); setType(''); setDzo(''); setYear(''); setBl(''); setPage(1);
  };
  const onChange = (fn: (v: string) => void) => (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    fn(e.target.value);
    setPage(1);
  };

  const sevTone = (s: string | null) => (s === 'fatal' ? 'red' : s === 'severe' ? 'amber' : 'green');

  return (
    <div>
      <PageHeader
        title={t('incidents.title')}
        subtitle={t('incidents.subtitle')}
        breadcrumb={t('common.home')}
        actions={
          <>
            <button className="btn-ghost"><IconDownload width={16} height={16} />{t('common.export')}</button>
            <button className="btn-primary"><IconAlert width={16} height={16} />{t('incidents.create')}</button>
          </>
        }
      />

      <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label={t('incidents.kpi.total')} value={kpi.total} accent="blue" icon={IconAlert} />
        <KpiCard label={t('incidents.kpi.fatal')} value={kpi.fatal} accent="red" />
        <KpiCard label={t('incidents.kpi.severe')} value={kpi.severe} accent="amber" />
        <KpiCard label={t('incidents.kpi.light')} value={kpi.light} accent="green" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {/* Filters + table */}
        <div className="lg:col-span-2">
          <Card className="mb-5">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <div className="lg:col-span-3">
                <label className="label">{t('common.search')}</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <IconSearch width={18} height={18} />
                  </span>
                  <input className="field pl-10" value={q} onChange={onChange(setQ)} placeholder={t('common.search')} />
                </div>
              </div>
              <div>
                <label className="label">{t('incidents.f.year')}</label>
                <select className="field" value={year} onChange={onChange(setYear)}>
                  <option value="">{t('common.all')}</option>
                  {years.map((y) => <option key={String(y)} value={String(y)}>{String(y)}</option>)}
                </select>
              </div>
              <div>
                <label className="label">{t('incidents.f.severity')}</label>
                <select className="field" value={sev} onChange={onChange(setSev)}>
                  <option value="">{t('common.all')}</option>
                  {(['fatal', 'severe', 'light'] as const).map((s) => <option key={s} value={s}>{t(`sev.${s}`)}</option>)}
                </select>
              </div>
              <div>
                <label className="label">{t('incidents.f.type')}</label>
                <select className="field" value={type} onChange={onChange(setType)}>
                  <option value="">{t('common.all')}</option>
                  {types.map((ty) => <option key={ty} value={ty}>{t(`type.${ty}`)}</option>)}
                </select>
              </div>
              <div>
                <label className="label">{t('common.organization')}</label>
                <select className="field" value={dzo} onChange={onChange(setDzo)}>
                  <option value="">{t('common.allOrgs')}</option>
                  {dzos.map((d) => <option key={d} value={d}>{dzoLabel(d, lang)}</option>)}
                </select>
              </div>
              <div>
                <label className="label">{t('incidents.f.businessLine')}</label>
                <select className="field" value={bl} onChange={onChange(setBl)}>
                  <option value="">{t('common.all')}</option>
                  {bls.map((b) => <option key={b} value={b}>{t(`bl.${b}`) || b}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <button onClick={reset} className="btn-ghost w-full justify-center">
                  <IconFilter width={16} height={16} />{t('common.reset')}
                </button>
              </div>
            </div>
          </Card>

          <Card title={`${t('incidents.register')}`} action={<span className="text-xs text-slate-400">{t('common.showing', { n: rows.length, total: filtered.length })}</span>}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    <th className="px-3 py-2.5">№</th>
                    <th className="px-3 py-2.5">{t('incidents.col.date')}</th>
                    <th className="px-3 py-2.5">{t('incidents.col.dzo')}</th>
                    <th className="px-3 py-2.5">{t('incidents.col.type')}</th>
                    <th className="px-3 py-2.5">{t('incidents.col.severity')}</th>
                    <th className="px-3 py-2.5 text-right"></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((i) => (
                    <tr key={i.id} className="border-b border-slate-50 transition hover:bg-kmg-light/40">
                      <td className="px-3 py-2.5 font-semibold text-slate-400">{i.num ?? i.id}</td>
                      <td className="px-3 py-2.5 whitespace-nowrap text-slate-500">{i.date}</td>
                      <td className="px-3 py-2.5">
                        <div className="font-medium text-slate-700">{dzoLabel(i.dzoNorm, lang)}</div>
                        <div className="text-xs text-slate-400">{regionLabel(i.region, lang)}</div>
                      </td>
                      <td className="px-3 py-2.5 text-slate-600">{t(`type.${i.typeNorm}`)}</td>
                      <td className="px-3 py-2.5"><Badge tone={sevTone(i.severityNorm)}>{t(`sev.${i.severityNorm}`)}</Badge></td>
                      <td className="px-3 py-2.5 text-right">
                        <Link to={`/incidents/${i.id}`} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-kmg-blue transition hover:bg-kmg-blue/10">
                          <IconEye width={18} height={18} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr><td colSpan={6} className="px-3 py-10 text-center text-slate-400">{t('common.noData')}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-center gap-1">
                <button disabled={pageClamped <= 1} onClick={() => setPage(pageClamped - 1)} className="rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-500 disabled:opacity-40 hover:bg-slate-100">‹</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => Math.abs(p - pageClamped) < 3 || p === 1 || p === totalPages)
                  .map((p, idx, arr) => (
                    <span key={p} className="flex">
                      {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-1 text-slate-300">…</span>}
                      <button
                        onClick={() => setPage(p)}
                        className={`min-w-9 rounded-lg px-3 py-1.5 text-sm font-semibold transition ${p === pageClamped ? 'bg-kmg-blue text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                      >
                        {p}
                      </button>
                    </span>
                  ))}
                <button disabled={pageClamped >= totalPages} onClick={() => setPage(pageClamped + 1)} className="rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-500 disabled:opacity-40 hover:bg-slate-100">›</button>
              </div>
            )}
          </Card>
        </div>

        {/* Side donut */}
        <div className="space-y-5">
          <Card title={t('command.bySeverity')}>
            {sevData.length ? <Donut data={sevData} /> : <div className="py-10 text-center text-slate-400">{t('common.noData')}</div>}
          </Card>
        </div>
      </div>
    </div>
  );
}
