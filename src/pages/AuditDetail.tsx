import { useParams } from 'react-router-dom';
import { useI18n } from '../i18n';
import { PageHeader, KpiCard, Card, Badge } from '../components/ui';
import { Donut } from '../components/charts';
import { IconClipboard, IconAlert, IconDownload, IconDoc, IconLeaf, IconTruck } from '../components/icons';
import { dzoLabel } from '../labels';
import { AUDITS, type FindingCategory } from '../data/audit';

const catTone = (c: FindingCategory) => (c === 'system' ? 'red' : c === 'gross' ? 'amber' : 'blue');

export function AuditDetail() {
  const { id } = useParams();
  const { t, lang } = useI18n();
  const a = AUDITS.find((x) => x.id === id) ?? AUDITS[0];

  const breakdown = [
    { name: t('audit.cat.system'), value: a.system, color: '#d24545' },
    { name: t('audit.cat.gross'), value: a.gross, color: '#e08a1e' },
    { name: t('audit.cat.significant'), value: a.significant, color: '#1559a8' },
  ];

  return (
    <div>
      <PageHeader
        title={`${dzoLabel(a.dzo, lang)} — ${t('audit.report')}`}
        subtitle={`${t('audit.dates')}: ${a.dates}`}
        backTo="/audit"
        breadcrumb={t('audit.title')}
        actions={
          a.pdf && (
            <a href={a.pdf} target="_blank" rel="noreferrer" className="btn-primary">
              <IconDownload width={16} height={16} />{t('audit.openReport')}
            </a>
          )
        }
      />

      <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-5">
        <KpiCard label={t('audit.kpi.findings')} value={a.total} accent="blue" icon={IconClipboard} />
        <KpiCard label={t('audit.cat.system')} value={a.system} accent="red" icon={IconAlert} />
        <KpiCard label={t('audit.cat.gross')} value={a.gross} accent="amber" />
        <KpiCard label={t('audit.area.env')} value={a.envCount} accent="green" icon={IconLeaf} />
        <KpiCard label={t('audit.area.rta')} value={a.rtaCount} accent="amber" icon={IconTruck} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card title={t('audit.keyFindings')}>
            <div className="space-y-3">
              {a.findings.map((f) => (
                <div key={f.no} className="rounded-xl border border-slate-100 p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">№{f.no}</span>
                    <Badge tone={catTone(f.category)}>{t(`audit.cat.${f.category}`)}</Badge>
                    <Badge tone="slate">{t(`audit.area.${f.area}`)}</Badge>
                  </div>
                  <p className="text-sm font-medium text-slate-700">{f.text[lang]}</p>
                  <div className="mt-2 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-500">
                    <span className="font-semibold uppercase tracking-wide text-slate-400">{t('audit.basis')}: </span>
                    {f.basis}
                  </div>
                  <div className="mt-2 flex gap-2 rounded-lg bg-emerald-50/60 p-2.5 text-sm text-slate-600">
                    <span className="font-semibold text-kmg-green">→</span>
                    <span><span className="font-semibold text-kmg-green">{t('audit.recommendation')}: </span>{f.recommendation[lang]}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-400">{t('audit.sampleNote', { shown: String(a.findings.length), total: String(a.total) })}</p>
          </Card>

          {a.pdf && (
            <Card title={t('audit.document')}>
              <object data={`${a.pdf}#view=FitH`} type="application/pdf" className="h-[600px] w-full rounded-xl border border-slate-100">
                <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                  <IconDoc width={40} height={40} className="text-kmg-blue" />
                  <p className="text-sm text-slate-500">{t('dpb.openPdf', { pages: a.pages ?? '' })}</p>
                  <a href={a.pdf} target="_blank" rel="noreferrer" className="btn-primary">
                    <IconDownload width={16} height={16} />{t('audit.openReport')}
                  </a>
                </div>
              </object>
            </Card>
          )}
        </div>

        <div className="space-y-5">
          <Card title={t('audit.breakdown')}>
            <Donut data={breakdown} height={260} />
          </Card>
          <Card title={t('audit.measuresLink')}>
            <p className="text-sm leading-relaxed text-slate-600">{t('audit.measuresNote')}</p>
            <a href="/measures" className="btn-ghost mt-3">
              <IconClipboard width={16} height={16} />{t('nav.measures')}
            </a>
          </Card>
        </div>
      </div>
    </div>
  );
}
