import { useParams, Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { PageHeader, Card, Badge } from '../components/ui';
import { IconSpark, IconArrow, IconDownload } from '../components/icons';
import { incidents } from '../data';
import { dzoLabel, regionLabel } from '../labels';

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  if (value == null || value === '' || value === '-') return null;
  return (
    <div className="border-b border-slate-50 py-2.5 last:border-0">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-0.5 text-sm text-slate-700">{value}</div>
    </div>
  );
}

export function IncidentDetail() {
  const { id } = useParams();
  const { t, lang } = useI18n();
  const inc = incidents.find((i) => i.id === Number(id));

  if (!inc) {
    return (
      <div>
        <PageHeader title={t('incidents.detail.title')} backTo="/incidents" breadcrumb={t('nav.incidents')} />
        <Card><div className="py-10 text-center text-slate-400">{t('common.noData')}</div></Card>
      </div>
    );
  }

  const sevTone = inc.severityNorm === 'fatal' ? 'red' : inc.severityNorm === 'severe' ? 'amber' : 'green';
  const similar = incidents
    .filter((i) => i.id !== inc.id && i.typeNorm === inc.typeNorm)
    .slice(0, 4);

  return (
    <div>
      <PageHeader
        title={`${t('incidents.detail.title')} № ${inc.num ?? inc.id}`}
        subtitle={`${dzoLabel(inc.dzoNorm, lang)} · ${inc.date ?? ''}`}
        backTo="/incidents"
        breadcrumb={t('nav.incidents')}
        actions={<button className="btn-ghost"><IconDownload width={16} height={16} />{t('common.export')}</button>}
      />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Badge tone={sevTone}>{t(`sev.${inc.severityNorm}`)}</Badge>
        <Badge tone="blue">{t(`type.${inc.typeNorm}`)}</Badge>
        <Badge tone={inc.status?.toLowerCase().includes('заверш') ? 'green' : 'amber'}>
          {inc.status?.toLowerCase().includes('заверш') ? t('st.completed') : t('st.ongoing')}
        </Badge>
        <Badge tone={inc.production?.toLowerCase().includes('связан') && !inc.production?.toLowerCase().includes('не ') ? 'slate' : 'slate'}>
          {inc.production}
        </Badge>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card title={t('incidents.detail.circumstances')}>
            <p className="text-sm leading-relaxed text-slate-700">{inc.description || t('common.noData')}</p>
            {inc.firstMeasures && (
              <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <div className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">{t('incidents.field.firstMeasures')}</div>
                <p className="text-sm text-slate-600">{inc.firstMeasures}</p>
              </div>
            )}
            {inc.consequences && (
              <div className="mt-3">
                <Field label={t('incidents.field.consequences')} value={inc.consequences} />
              </div>
            )}
          </Card>

          <Card title={t('incidents.detail.causes')}>
            <div className="space-y-1">
              <Field label={t('incidents.field.prelimCauses')} value={inc.prelimCauses} />
              <Field label={t('incidents.field.mainCauses')} value={inc.mainCauses} />
              <Field label={t('incidents.field.rootCauses')} value={inc.rootCauses} />
            </div>
          </Card>

          {/* AI block */}
          <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-blue-50 p-5">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-kmg-blue text-white">
                <IconSpark width={16} height={16} />
              </span>
              <h3 className="text-sm font-bold text-slate-700">{t('common.aiInsight')}</h3>
            </div>
            <p className="text-sm text-slate-600">{t('incidents.aiNote')}</p>
          </div>
        </div>

        <div className="space-y-5">
          <Card title={t('incidents.detail.victim')}>
            <Field label={t('incidents.col.victim')} value={inc.victim} />
            <Field label={t('incidents.field.gender')} value={inc.gender === 'М' ? t('gender.m') : inc.gender === 'Ж' ? t('gender.f') : inc.gender} />
            <Field label={t('incidents.field.age')} value={inc.age} />
            <Field label={t('incidents.field.position')} value={inc.position} />
            <Field label={t('incidents.field.personnel')} value={inc.personnelCategory} />
            <Field label={t('incidents.field.tenure')} value={inc.tenure} />
            <Field label={t('incidents.field.diagnosis')} value={inc.diagnosis} />
            <Field label={t('incidents.field.bodyPart')} value={inc.bodyPart} />
          </Card>

          <Card title={t('incidents.detail.classification')}>
            <Field label={t('incidents.col.dzo')} value={dzoLabel(inc.dzoNorm, lang)} />
            <Field label={t('incidents.field.businessLine')} value={t(`bl.${inc.businessLine}`) || inc.businessLine} />
            <Field label={t('incidents.col.region')} value={regionLabel(inc.region, lang)} />
            <Field label={t('incidents.field.place')} value={inc.place} />
            <Field label={t('incidents.field.workType')} value={inc.workType} />
            <Field label={t('incidents.field.time')} value={inc.time} />
            <Field label={t('incidents.field.weekday')} value={inc.weekday} />
            <Field label={t('incidents.field.period')} value={inc.period} />
            <Field label={t('incidents.field.damage')} value={inc.damage} />
            <Field label={t('incidents.field.notified')} value={inc.notifiedBodies} />
          </Card>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="mt-5">
          <Card title={t('incidents.detail.measures')} action={<span className="text-xs text-slate-400">{t(`type.${inc.typeNorm}`)}</span>}>
            <div className="grid gap-3 sm:grid-cols-2">
              {similar.map((s) => (
                <Link key={s.id} to={`/incidents/${s.id}`} className="flex items-center justify-between rounded-xl border border-slate-100 p-3 transition hover:border-kmg-blue/30 hover:shadow-card">
                  <div>
                    <div className="text-sm font-semibold text-slate-700">№ {s.num ?? s.id} · {dzoLabel(s.dzoNorm, lang)}</div>
                    <div className="text-xs text-slate-400">{s.date} · {regionLabel(s.region, lang)}</div>
                  </div>
                  <IconArrow width={16} height={16} className="text-kmg-blue" />
                </Link>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
