import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { PageHeader, KpiCard, Card, Badge } from '../components/ui';
import { Bars } from '../components/charts';
import { IconCheck, IconEye, IconDownload, IconClipboard, IconAlert } from '../components/icons';
import { dzoLabel } from '../labels';
import { AUDITS, AUDIT_TOTALS, COMPLETED_AUDITS, AUDIT_SCHEDULE_PDF } from '../data/audit';

export function Audit() {
  const { t, lang } = useI18n();
  const [status, setStatus] = useState('');
  const rows = AUDITS.filter((r) => !status || r.status === status);

  const findingsByDzo = COMPLETED_AUDITS.map((a) => ({ name: a.short, value: a.total }));

  return (
    <div>
      <PageHeader
        title={t('audit.title')}
        subtitle={t('audit.subtitle')}
        breadcrumb={t('common.home')}
        actions={
          <a href={AUDIT_SCHEDULE_PDF} target="_blank" rel="noreferrer" className="btn-primary">
            <IconDownload width={16} height={16} />{t('audit.schedule')}
          </a>
        }
      />

      <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label={t('audit.kpi.completed')} value={COMPLETED_AUDITS.length} hint={`/ ${AUDITS.length} ${t('audit.kpi.plan')}`} accent="blue" icon={IconCheck} />
        <KpiCard label={t('audit.kpi.findings')} value={AUDIT_TOTALS.findings} accent="amber" icon={IconClipboard} />
        <KpiCard label={t('audit.cat.system')} value={AUDIT_TOTALS.system} accent="red" icon={IconAlert} />
        <KpiCard label={t('audit.cat.gross')} value={AUDIT_TOTALS.gross} accent="amber" />
      </div>

      <Card title={t('audit.findingsByDzo')} className="mt-6">
        <Bars data={findingsByDzo} height={240} color="#1559a8" />
      </Card>

      <Card
        title={t('audit.list')}
        className="mt-6"
        action={
          <select className="field !w-52" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">{t('common.allStatuses')}</option>
            <option value="completed">{t('audit.st.completed')}</option>
            <option value="planned">{t('audit.st.planned')}</option>
          </select>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-3 py-2.5">{t('audit.col.dzo')}</th>
                <th className="px-3 py-2.5">{t('audit.col.dates')}</th>
                <th className="px-3 py-2.5 text-center">{t('audit.col.level')}</th>
                <th className="px-3 py-2.5 text-center">{t('audit.col.findings')}</th>
                <th className="px-3 py-2.5">{t('audit.col.status')}</th>
                <th className="px-3 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-slate-50 hover:bg-kmg-light/40">
                  <td className="px-3 py-3 font-medium text-slate-700">{dzoLabel(r.dzo, lang)}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-slate-500">{r.status === 'completed' ? r.dates : `${t('audit.planned')}: ${r.scheduled}`}</td>
                  <td className="px-3 py-3 text-center text-slate-600">{r.level}</td>
                  <td className="px-3 py-3 text-center">
                    {r.status === 'completed' ? (
                      <span className="font-extrabold text-slate-800">{r.total}</span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3"><Badge tone={r.status === 'completed' ? 'green' : 'slate'}>{t(`audit.st.${r.status}`)}</Badge></td>
                  <td className="px-3 py-3 text-right">
                    {r.status === 'completed' && (
                      <Link to={`/audit/${r.id}`} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-kmg-blue hover:bg-kmg-blue/10">
                        <IconEye width={18} height={18} />
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
