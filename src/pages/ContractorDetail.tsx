import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useI18n } from '../i18n';
import { PageHeader, Card, Badge, KpiCard } from '../components/ui';
import { IconUsers, IconAlert, IconFire } from '../components/icons';
import { dzoLabel } from '../labels';
import {
  findContractorOrg,
  accidentsForContractor,
  ltirForOrg,
  ratingFor,
  DZO_FULL_TO_SHORT,
  type ContrAccident,
} from '../data/contractors';

function dzoFullFromShort(short: string | null): string | null {
  if (!short) return null;
  for (const [full, shorts] of Object.entries(DZO_FULL_TO_SHORT)) {
    if (shorts.includes(short)) return full;
  }
  return short;
}

export function ContractorDetail() {
  const { id } = useParams();
  const { t, lang } = useI18n();
  const org = findContractorOrg(Number(id));

  const accidents = useMemo(() => (org ? accidentsForContractor(org.name) : []), [org]);
  const ltir = org ? ltirForOrg(org) : 0;
  const rating = org ? ratingFor(ltir, org.ns) : 'A';

  if (!org) {
    return (
      <div>
        <PageHeader title={t('contractors.detail.title')} backTo="/contractors" breadcrumb={t('nav.contractors')} />
        <Card><div className="py-10 text-center text-slate-400">{t('common.noData')}</div></Card>
      </div>
    );
  }

  const dzoFull = dzoFullFromShort(org.dzoShort);
  const ratingTone = rating === 'A' ? 'green' : rating === 'B' ? 'blue' : rating === 'C' ? 'amber' : 'red';

  return (
    <div>
      <PageHeader
        title={org.name}
        subtitle={org.activity ?? t('contractors.detail.noActivity')}
        backTo="/contractors"
        breadcrumb={t('nav.contractors')}
        actions={<Badge tone={ratingTone}>{rating}</Badge>}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {org.dir && <Badge tone="blue">{org.dir}</Badge>}
        {dzoFull && <Badge tone="slate">{dzoLabel(dzoFull, lang)}</Badge>}
        {org.dzoShort && org.dzoShort !== dzoFull && <Badge tone="slate">{org.dzoShort}</Badge>}
      </div>

      <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-5">
        <KpiCard label={t('contractors.col.workers')} value={org.workers.toLocaleString('ru-RU')} accent="blue" icon={IconUsers} />
        <KpiCard label={t('contractors.kpi.wh')} value={org.wh.toLocaleString('ru-RU')} hint={t('contractors.kpi.whHint')} accent="blue" />
        <KpiCard label={t('contractors.col.ns')} value={String(org.ns)} accent={org.ns > 0 ? 'amber' : 'green'} icon={IconAlert} />
        <KpiCard label={t('contractors.kpi.victims')} value={String(org.victims)} accent={org.victims > 0 ? 'amber' : 'green'} />
        <KpiCard label={t('contractors.kpi.fatal')} value={String(org.fatal)} accent={org.fatal > 0 ? 'red' : 'green'} icon={IconFire} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card title={t('contractors.detail.info')}>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <dt className="text-slate-400">{t('contractors.col.activity')}</dt>
              <dd className="max-w-[60%] text-right font-medium text-slate-700">{org.activity ?? '—'}</dd>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <dt className="text-slate-400">{t('contractors.detail.dzo')}</dt>
              <dd className="font-medium text-slate-700">{dzoFull ? dzoLabel(dzoFull, lang) : org.dzoShort ?? '—'}</dd>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <dt className="text-slate-400">LTIR</dt>
              <dd className="font-bold text-slate-800">{ltir.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <dt className="text-slate-400">{t('contractors.detail.km')}</dt>
              <dd className="font-medium text-slate-700">{org.km > 0 ? org.km.toLocaleString('ru-RU') : '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">{t('contractors.detail.dtp')}</dt>
              <dd className="font-medium text-slate-700">{org.dtp > 0 ? org.dtp : '—'}</dd>
            </div>
          </dl>
        </Card>

        <Card title={t('contractors.detail.safety')}>
          <div className="grid grid-cols-2 gap-3">
            {[
              { l: t('contractors.col.ns'), v: org.ns, tone: org.ns ? 'text-kmg-amber' : 'text-kmg-green' },
              { l: t('contractors.kpi.victims'), v: org.victims, tone: 'text-slate-800' },
              { l: t('contractors.kpi.fatal'), v: org.fatal, tone: org.fatal ? 'text-kmg-red' : 'text-kmg-green' },
              { l: t('contractors.col.rating'), v: rating, tone: 'text-kmg-blue' },
            ].map((x) => (
              <div key={x.l} className="rounded-xl bg-slate-50 p-4 text-center">
                <div className={`text-2xl font-extrabold ${x.tone}`}>{x.v}</div>
                <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{x.l}</div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-400">{t('contractors.detail.source')}</p>
        </Card>
      </div>

      {accidents.length > 0 && (
        <Card title={t('contractors.detail.accidents')} className="mt-6">
          <div className="space-y-3">
            {accidents.map((a: ContrAccident) => (
              <div
                key={a.no}
                className={`rounded-xl border p-3.5 ${a.severity === 'fatal' ? 'border-red-200 bg-red-50/40' : 'border-slate-100'}`}
              >
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">№{a.no}</span>
                  <Badge tone={a.severity === 'fatal' ? 'red' : a.severity === 'severe' ? 'amber' : 'green'}>
                    {t(`contractors.sev.${a.severity}`)}
                  </Badge>
                  <span className="text-xs text-slate-400">{a.date}</span>
                </div>
                <p className="text-sm text-slate-600">{a.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {dzoFull && (
        <div className="mt-4">
          <Link to="/passport" className="text-sm font-semibold text-kmg-blue hover:underline">
            {t('contractors.detail.backDzo')}
          </Link>
        </div>
      )}
    </div>
  );
}
