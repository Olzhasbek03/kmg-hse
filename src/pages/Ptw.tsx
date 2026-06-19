import { useMemo, useState } from 'react';
import { useI18n } from '../i18n';
import { PageHeader, KpiCard, Card, Badge } from '../components/ui';
import { Donut, Bars } from '../components/charts';
import { IconDoc, IconFilter } from '../components/icons';
import {
  permits,
  PTW_CATEGORIES,
  CATEGORY_LABEL,
  countByField,
  topIssuers,
  type PtwStatus,
  type PtwRisk,
} from '../data/ptw';

const PAGE = 25;

export function Ptw() {
  const { t, lang } = useI18n();
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [risk, setRisk] = useState('');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return permits.filter((p) => {
      if (status && p.status !== status) return false;
      if (category && p.category !== category) return false;
      if (risk && p.risk !== risk) return false;
      if (s && !`${p.num} ${p.issuer} ${p.work}`.toLowerCase().includes(s)) return false;
      return true;
    });
  }, [status, category, risk, q]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const slice = filtered.slice((page - 1) * PAGE, page * PAGE);

  const closed = permits.filter((p) => p.status === 'closed').length;
  const rejected = permits.filter((p) => p.status === 'rejected').length;
  const highRisk = permits.filter((p) => p.risk === 'high').length;

  const catData = PTW_CATEGORIES.map((c) => ({
    name: CATEGORY_LABEL[c][lang],
    value: countByField(permits, 'category')[c] ?? 0,
  })).filter((d) => d.value > 0);

  const issuerBars = topIssuers(8);

  const riskTone = (r: PtwRisk) => (r === 'high' ? 'red' : r === 'medium' ? 'amber' : 'green');
  const riskLabel = (r: PtwRisk) => t(r === 'high' ? 'forecast.prob.high' : r === 'medium' ? 'forecast.prob.medium' : 'forecast.prob.moderate');
  const statusTone = (s: PtwStatus) => (s === 'closed' ? 'green' : s === 'rejected' ? 'red' : s === 'active' ? 'blue' : 'amber');

  const reset = () => {
    setStatus('');
    setCategory('');
    setRisk('');
    setQ('');
    setPage(1);
  };

  return (
    <div>
      <PageHeader title={t('ptw.title')} subtitle={t('ptw.subtitle')} breadcrumb={t('common.home')} />

      <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label={t('ptw.kpi.total')} value={permits.length} accent="blue" icon={IconDoc} />
        <KpiCard label={t('ptw.kpi.closed')} value={closed} accent="green" />
        <KpiCard label={t('ptw.kpi.rejected')} value={rejected} accent="red" />
        <KpiCard label={t('ptw.kpi.highrisk')} value={highRisk} accent="amber" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card title={t('ptw.byCategory')}>
          <Donut data={catData} height={280} />
        </Card>
        <Card title={t('ptw.byIssuer')}>
          <Bars data={issuerBars} horizontal height={280} color="#1559a8" />
        </Card>
      </div>

      <Card title={t('ptw.journal')} className="mt-6">
        <div className="mb-4 flex flex-wrap items-end gap-3">
          <div className="min-w-[200px] flex-1">
            <label className="label">{t('common.search')}</label>
            <input
              className="field w-full"
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              placeholder={t('ptw.searchHint')}
            />
          </div>
          <div>
            <label className="label">{t('common.status')}</label>
            <select className="field !w-40" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
              <option value="">{t('common.all')}</option>
              <option value="closed">{t('ptw.st.closed')}</option>
              <option value="rejected">{t('ptw.st.rejected')}</option>
            </select>
          </div>
          <div>
            <label className="label">{t('ptw.col.work')}</label>
            <select className="field !w-48" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
              <option value="">{t('common.all')}</option>
              {PTW_CATEGORIES.map((c) => (
                <option key={c} value={c}>{CATEGORY_LABEL[c][lang]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">{t('ptw.col.risk')}</label>
            <select className="field !w-36" value={risk} onChange={(e) => { setRisk(e.target.value); setPage(1); }}>
              <option value="">{t('common.all')}</option>
              <option value="high">{t('forecast.prob.high')}</option>
              <option value="medium">{t('forecast.prob.medium')}</option>
              <option value="low">{t('forecast.prob.moderate')}</option>
            </select>
          </div>
          <button onClick={reset} className="btn-ghost"><IconFilter width={16} height={16} />{t('common.reset')}</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-3 py-2.5">{t('ptw.col.num')}</th>
                <th className="px-3 py-2.5">{t('ptw.col.work')}</th>
                <th className="px-3 py-2.5">{t('ptw.col.issuer')}</th>
                <th className="px-3 py-2.5">{t('ptw.col.end')}</th>
                <th className="px-3 py-2.5">{t('ptw.col.risk')}</th>
                <th className="px-3 py-2.5">{t('ptw.col.status')}</th>
              </tr>
            </thead>
            <tbody>
              {slice.map((p) => (
                <tr key={p.num} className="border-b border-slate-50 align-top hover:bg-kmg-light/40">
                  <td className="px-3 py-3 whitespace-nowrap font-semibold text-kmg-blue">{p.num}</td>
                  <td className="max-w-md px-3 py-3">
                    <div className="font-medium text-slate-700">{CATEGORY_LABEL[p.category][lang]}</div>
                    <div className="mt-0.5 line-clamp-2 text-xs text-slate-400">{p.work}</div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-slate-600">{p.issuer}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-slate-500">{p.end ?? '—'}</td>
                  <td className="px-3 py-3"><Badge tone={riskTone(p.risk)}>{riskLabel(p.risk)}</Badge></td>
                  <td className="px-3 py-3"><Badge tone={statusTone(p.status)}>{t(`ptw.st.${p.status}`)}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <span>{filtered.length} {t('ptw.unit')} · {t('ptw.page', { page, pages })}</span>
          <div className="flex gap-2">
            <button className="btn-ghost !px-3 !py-1.5" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>←</button>
            <button className="btn-ghost !px-3 !py-1.5" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>→</button>
          </div>
        </div>
      </Card>
    </div>
  );
}
