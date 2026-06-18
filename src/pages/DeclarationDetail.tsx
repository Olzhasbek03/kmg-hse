import { useParams } from 'react-router-dom';
import { useI18n } from '../i18n';
import { PageHeader, KpiCard, Card, Badge } from '../components/ui';
import { IconFactory, IconUsers, IconFire, IconDownload, IconDoc } from '../components/icons';
import { DECLARATIONS } from '../data/dpb';
import { dzoLabel, regionLabel } from '../labels';

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="border-b border-slate-50 py-2.5 last:border-0">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-0.5 text-sm text-slate-700">{value}</div>
    </div>
  );
}

export function DeclarationDetail() {
  const { id } = useParams();
  const { t, lang } = useI18n();
  const d = DECLARATIONS.find((x) => x.id === id) ?? DECLARATIONS[0];

  return (
    <div>
      <PageHeader
        title={`${dzoLabel(d.org, lang)} — ${t('dpb.badge', { year: d.year })}`}
        subtitle={t('dpb.subtitle')}
        backTo="/opo"
        breadcrumb={t('nav.opo')}
        actions={
          <a href={d.pdf} download className="btn-primary">
            <IconDownload width={16} height={16} />
            {t('dpb.download')}
          </a>
        }
      />

      <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-5">
        <KpiCard label={t('dpb.kpi.objects')} value={d.objectsCount} accent="blue" icon={IconFactory} />
        <KpiCard label={t('dpb.kpi.class')} value={d.hazardClass} accent="red" />
        <KpiCard label={t('dpb.kpi.personnel')} value={d.personnel.toLocaleString()} accent="blue" icon={IconUsers} />
        <KpiCard label={t('dpb.kpi.oil')} value={`${d.substances[0].tons.toLocaleString()} т`} accent="amber" icon={IconFire} />
        <KpiCard label={t('dpb.kpi.area')} value={`${d.areaHa.toLocaleString()} га`} accent="green" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card title={t('dpb.section.objects')}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                    <th className="px-3 py-2.5">№</th>
                    <th className="px-3 py-2.5">{t('dpb.obj.code')}</th>
                    <th className="px-3 py-2.5">{t('dpb.obj.name')}</th>
                    <th className="px-3 py-2.5">{t('dpb.obj.detail')}</th>
                  </tr>
                </thead>
                <tbody>
                  {d.objects.map((o) => (
                    <tr key={o.no} className="border-b border-slate-50 align-top hover:bg-kmg-light/40">
                      <td className="px-3 py-2.5 font-semibold text-slate-400">{o.no}</td>
                      <td className="px-3 py-2.5"><Badge tone="blue">{o.code}</Badge></td>
                      <td className="px-3 py-2.5 font-medium text-slate-700">{o.name[lang]}</td>
                      <td className="px-3 py-2.5 text-slate-500">{o.detail[lang]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title={t('dpb.section.document')}>
            <object data={`${d.pdf}#view=FitH`} type="application/pdf" className="h-[600px] w-full rounded-xl border border-slate-100">
              <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                <IconDoc width={40} height={40} className="text-kmg-blue" />
                <p className="text-sm text-slate-500">{t('dpb.openPdf', { pages: d.pages })}</p>
                <a href={d.pdf} target="_blank" rel="noreferrer" className="btn-primary">
                  <IconDownload width={16} height={16} />
                  {t('dpb.view')}
                </a>
              </div>
            </object>
          </Card>
        </div>

        <div className="space-y-5">
          <Card title={t('dpb.section.general')}>
            <Field label={t('dpb.col.org')} value={dzoLabel(d.org, lang)} />
            <Field label={t('dpb.field.parent')} value={d.parent} />
            <Field label={t('dpb.field.field')} value={d.field} />
            <Field label={t('dpb.field.region')} value={regionLabel(d.region, lang)} />
            <Field label={t('dpb.field.district')} value={d.district} />
            <Field label={t('dpb.field.inOperation')} value={d.inOperation} />
            <Field label={t('dpb.field.border')} value={`${d.borderKm} км`} />
            <Field label={t('dpb.field.address')} value={d.address} />
            <Field label={t('dpb.field.phone')} value={d.phone} />
            <Field label={t('dpb.field.email')} value={<a className="text-kmg-blue" href={`mailto:${d.email}`}>{d.email}</a>} />
            <Field label={t('dpb.field.workgroup')} value={d.workgroupOrder} />
          </Card>

          <Card title={t('dpb.section.substances')}>
            <div className="space-y-2">
              {d.substances.map((s) => {
                const max = Math.max(...d.substances.map((x) => x.tons));
                return (
                  <div key={s.name.ru}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-slate-600">{s.name[lang]}</span>
                      <span className="font-bold text-slate-700">{s.tons.toLocaleString()} т</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-kmg-amber" style={{ width: `${Math.max(4, (s.tons / max) * 100)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card title={t('dpb.section.climate')}>
            <div className="grid grid-cols-2 gap-3">
              {d.climate.map((c) => (
                <div key={c.key} className="rounded-lg bg-slate-50 p-3">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{c.label[lang]}</div>
                  <div className="mt-0.5 text-sm font-bold text-slate-700">{c.value}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card title={t('dpb.section.legal')}>
            <p className="text-sm leading-relaxed text-slate-600">{d.legalBasis[lang]}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
