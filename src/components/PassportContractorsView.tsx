import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { Card, Badge } from '../components/ui';
import { PassportKpiRow, type PassportKpis } from './PassportKpiRow';
import { IconArrow } from '../components/icons';
import type { Dzo } from '../data/passport';
import {
  contractorsForDzoFull,
  aggregateContractors,
  computeContractorKpis,
  ltirForOrg,
  ratingFor,
  type ContractorOrg,
} from '../data/contractors';

const ratingTone = (r: ReturnType<typeof ratingFor>) =>
  r === 'A' ? 'green' : r === 'B' ? 'blue' : r === 'C' ? 'amber' : 'red';

export function PassportContractorsView({ dzo, companyKpis }: { dzo: Dzo; companyKpis: PassportKpis }) {
  const { t } = useI18n();
  const [q, setQ] = useState('');

  const list = useMemo(() => contractorsForDzoFull(dzo.name.ru), [dzo.name.ru]);
  const agg = useMemo(() => aggregateContractors(list), [list]);
  const kpis = useMemo(() => computeContractorKpis(dzo.name.ru, companyKpis), [dzo.name.ru, companyKpis]);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    if (!ql) return list;
    return list.filter((o) => `${o.name} ${o.activity ?? ''}`.toLowerCase().includes(ql));
  }, [list, q]);

  const withMeta = (o: ContractorOrg) => {
    const ltir = ltirForOrg(o);
    return { ...o, ltir, rating: ratingFor(ltir, o.ns) };
  };

  return (
    <div>
      <PassportKpiRow kpis={kpis} className="mb-6" />

      <div className="mb-4 flex flex-wrap gap-3 text-sm text-slate-500">
        <span>
          {t('contractors.kpi.orgs')}: <strong className="text-slate-700">{agg.orgs.toLocaleString()}</strong>
        </span>
        <span>·</span>
        <span>
          {t('contractors.kpi.ns')}: <strong className="text-slate-700">{agg.ns}</strong>
          {agg.victims > 0 && ` (${agg.victims} ${t('contractors.kpi.victims').toLowerCase()})`}
        </span>
        <span>·</span>
        <span>
          {t('contractors.kpi.fatal')}: <strong className={agg.fatal > 0 ? 'text-kmg-red' : 'text-slate-700'}>{agg.fatal}</strong>
        </span>
      </div>

      <p className="mb-4 text-xs text-slate-400">{t('contractors.ppSource')}</p>

      <Card
        title={t('pp.view.contractors')}
        action={
          <input
            className="field !w-52"
            placeholder={t('common.search')}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        }
      >
        {filtered.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-400">{t('common.noData')}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <th className="px-3 py-2.5">{t('contractors.col.name')}</th>
                  <th className="px-3 py-2.5">{t('contractors.col.activity')}</th>
                  <th className="px-3 py-2.5 text-right">{t('contractors.col.workers')}</th>
                  <th className="px-3 py-2.5 text-right">{t('contractors.col.ns')}</th>
                  <th className="px-3 py-2.5 text-right">LTIR</th>
                  <th className="px-3 py-2.5">{t('contractors.col.rating')}</th>
                  <th className="w-10 px-3 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => {
                  const { ltir, rating } = withMeta(o);
                  return (
                    <tr key={o.id} className="border-b border-slate-50 hover:bg-kmg-light/40">
                      <td className="px-3 py-2.5">
                        <Link to={`/contractors/${o.id}`} className="font-medium text-kmg-blue hover:underline">
                          {o.name}
                        </Link>
                      </td>
                      <td className="max-w-[220px] truncate px-3 py-2.5 text-slate-500">{o.activity ?? '—'}</td>
                      <td className="px-3 py-2.5 text-right text-slate-600">{o.workers.toLocaleString()}</td>
                      <td className="px-3 py-2.5 text-right font-semibold">{o.ns || '—'}</td>
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
        )}
      </Card>
    </div>
  );
}
