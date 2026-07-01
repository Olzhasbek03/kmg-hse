import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { PageHeader, KpiCard, Card, Badge } from '../components/ui';
import { Donut, Bars } from '../components/charts';
import { IconUsers, IconAlert, IconFire, IconArrow } from '../components/icons';
import {
  CONTR_DIR_2025,
  CONTRACTOR_SUMMARY,
  CONTRACTOR_ORGS,
  CONTR_TOTAL_2025,
  CONTR_NS_TYPES,
  ratingFor,
  ltirForOrg,
  type Rating,
  type ContractorOrg,
} from '../data/contractors';

const ratingTone = (r: Rating) => (r === 'A' ? 'green' : r === 'B' ? 'blue' : r === 'C' ? 'amber' : 'red');

const PAGE_SIZE = 20;

export function Contractors() {
  const { t, lang } = useI18n();
  const [dir, setDir] = useState('');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [onlyNs, setOnlyNs] = useState(false);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return CONTRACTOR_ORGS.filter((o) => {
      if (dir && o.dir !== dir) return false;
      if (onlyNs && o.ns === 0) return false;
      if (ql) {
        const hay = `${o.name} ${o.activity ?? ''} ${o.dzoShort ?? ''}`.toLowerCase();
        if (!hay.includes(ql)) return false;
      }
      return true;
    });
  }, [dir, q, onlyNs]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageClamped = Math.min(page, totalPages);
  const rows = filtered.slice((pageClamped - 1) * PAGE_SIZE, pageClamped * PAGE_SIZE);

  const dirBars = CONTR_DIR_2025.map((d) => ({ name: d.dir[lang], value: d.ltir }));
  const nsDonut = CONTR_NS_TYPES.map((n) => ({ name: n.name[lang], value: n.pct }));

  const withRating = (o: ContractorOrg) => {
    const ltir = ltirForOrg(o);
    return { ...o, ltir, rating: ratingFor(ltir, o.ns) };
  };

  return (
    <div>
      <PageHeader title={t('contractors.title')} subtitle={t('contractors.subtitle')} breadcrumb={t('common.home')} />

      <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-5">
        <KpiCard label={t('contractors.kpi.orgs')} value={CONTRACTOR_SUMMARY.orgs.toLocaleString()} hint="2025" accent="blue" icon={IconUsers} />
        <KpiCard label={t('contractors.kpi.workersTotal')} value={CONTRACTOR_SUMMARY.workers.toLocaleString()} hint="2025" accent="blue" icon={IconUsers} />
        <KpiCard label={t('contractors.kpi.ns')} value={CONTRACTOR_SUMMARY.ns} hint={`${CONTRACTOR_SUMMARY.victims} ${t('contractors.kpi.victims').toLowerCase()}`} accent="amber" icon={IconAlert} />
        <KpiCard label={t('contractors.kpi.fatal')} value={CONTRACTOR_SUMMARY.fatal} accent="red" icon={IconFire} />
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
                <div className="text-[11px] text-slate-400">{d.orgs} {t('contractors.unit.orgs')} · {d.workers.toLocaleString()} {t('contractors.col.workers').toLowerCase()} · {d.ns} НС</div>
              </div>
            ))}
          </div>
        </Card>
        <Card title={t('contractors.nsTypes')} className="lg:col-span-2">
          <Donut data={nsDonut} height={300} />
        </Card>
      </div>

      <Card
        title={t('contractors.registry')}
        className="mt-6"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <input
              className="field !w-48"
              placeholder={t('common.search')}
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
            />
            <select className="field !w-40" value={dir} onChange={(e) => { setDir(e.target.value); setPage(1); }}>
              <option value="">{t('common.all')}</option>
              {['Переработка', 'Добыча', 'Транспортировка', 'Сервис'].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <input type="checkbox" checked={onlyNs} onChange={(e) => { setOnlyNs(e.target.checked); setPage(1); }} />
              {t('contractors.onlyNs')}
            </label>
          </div>
        }
      >
        <p className="mb-4 text-xs text-slate-400">
          {t('contractors.registryNote')} — {filtered.length} {t('contractors.unit.orgs')}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-3 py-2.5">{t('contractors.col.name')}</th>
                <th className="px-3 py-2.5">{t('contractors.detail.dzo')}</th>
                <th className="px-3 py-2.5">{t('contractors.col.activity')}</th>
                <th className="px-3 py-2.5 text-right">{t('contractors.col.workers')}</th>
                <th className="px-3 py-2.5 text-right">{t('contractors.col.ns')}</th>
                <th className="px-3 py-2.5 text-right">LTIR</th>
                <th className="px-3 py-2.5">{t('contractors.col.rating')}</th>
                <th className="px-3 py-2.5 w-10" />
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => {
                const { ltir, rating } = withRating(o);
                return (
                  <tr key={o.id} className="border-b border-slate-50 hover:bg-kmg-light/40">
                    <td className="px-3 py-2.5">
                      <Link to={`/contractors/${o.id}`} className="font-medium text-kmg-blue hover:underline">
                        {o.name}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 text-slate-500">{o.dzoShort ?? '—'}</td>
                    <td className="max-w-[200px] truncate px-3 py-2.5 text-slate-500">{o.activity ?? '—'}</td>
                    <td className="px-3 py-2.5 text-right text-slate-600">{o.workers.toLocaleString()}</td>
                    <td className="px-3 py-2.5 text-right font-semibold text-slate-700">{o.ns || '—'}</td>
                    <td className="px-3 py-2.5 text-right text-slate-600">{ltir.toFixed(2)}</td>
                    <td className="px-3 py-2.5"><Badge tone={ratingTone(rating)}>{rating}</Badge></td>
                    <td className="px-3 py-2.5">
                      <Link to={`/contractors/${o.id}`} className="text-kmg-blue"><IconArrow width={14} height={14} /></Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-400">{pageClamped} / {totalPages}</span>
            <div className="flex gap-2">
              <button type="button" className="btn-ghost" disabled={pageClamped <= 1} onClick={() => setPage(pageClamped - 1)}>←</button>
              <button type="button" className="btn-ghost" disabled={pageClamped >= totalPages} onClick={() => setPage(pageClamped + 1)}>→</button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
