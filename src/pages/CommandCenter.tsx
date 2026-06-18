import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { PageHeader, KpiCard, Card, Badge } from '../components/ui';
import { Donut, Bars, Lines } from '../components/charts';
import { IconAlert, IconShield, IconSpark, IconArrow, IconClock, IconForm } from '../components/icons';
import { incidents, SEVERITY_COLORS, korgauSummary } from '../data';
import {
  TOTAL,
  FATAL,
  LTIR,
  FAR,
  fatalByYear,
  byType,
  bySeverity,
  byDzo,
  byMonth,
} from '../selectors';
import { dzoLabel, monthName, regionLabel } from '../labels';
import { byRegion } from '../selectors';

export function CommandCenter() {
  const { t, lang } = useI18n();
  const nm = korgauSummary['Near Miss всего'] ?? 1822;
  const korgauTotal = korgauSummary['Итого карточек'] ?? 39521;

  const yearData = fatalByYear().map((d) => ({
    name: d.year,
    [t('command.kpi.incidents')]: d.all,
    [t('incidents.kpi.fatal')]: d.fatal,
  }));

  const typeData = byType().map((d) => ({ name: t(`type.${d.key}`), value: d.value }));
  const sevData = bySeverity().map((d) => ({
    name: t(`sev.${d.key}`),
    value: d.value,
    color: SEVERITY_COLORS[d.key],
  }));
  const dzoData = byDzo().map((d) => ({ name: dzoLabel(d.name, lang), value: d.value }));
  const regionData = byRegion().map((d) => ({ name: regionLabel(d.name, lang), value: d.value }));
  const monthData = byMonth().map((v, i) => ({ name: monthName(i + 1, lang), value: v }));

  const recent = [...incidents]
    .filter((i) => i.date)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, 6);

  const sevTone = (s: string | null) =>
    s === 'fatal' ? 'red' : s === 'severe' ? 'amber' : 'green';

  return (
    <div>
      <PageHeader
        title={t('command.title')}
        subtitle={t('command.subtitle')}
        breadcrumb={t('common.home')}
        actions={
          <Link to="/command/report" className="btn-primary">
            <IconForm width={16} height={16} />
            {t('rep.btn')}
          </Link>
        }
      />

      <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard label={t('command.kpi.incidents')} value={TOTAL} hint={t('command.kpi.period')} accent="blue" icon={IconAlert} />
        <KpiCard label={t('command.kpi.fatal')} value={FATAL} hint={t('command.kpi.period')} accent="red" icon={IconAlert} />
        <KpiCard label={t('command.kpi.ltir')} value={LTIR.toFixed(2)} hint={t('command.kpi.ltirHint')} accent="amber" />
        <KpiCard label={t('command.kpi.far')} value={FAR.toFixed(2)} hint={t('command.kpi.farHint')} accent="red" />
        <KpiCard label={t('command.kpi.korgau')} value={Number(korgauTotal).toLocaleString()} accent="blue" icon={IconShield} />
        <KpiCard label={t('command.kpi.nearmiss')} value={Number(nm).toLocaleString()} accent="green" icon={IconShield} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Card title={t('command.dynamics')} className="lg:col-span-2">
          <Lines
            data={yearData}
            series={[
              { key: t('command.kpi.incidents'), color: '#1559a8', name: t('command.kpi.incidents') },
              { key: t('incidents.kpi.fatal'), color: '#d24545', name: t('incidents.kpi.fatal') },
            ]}
          />
        </Card>
        <Card title={t('command.bySeverity')}>
          <Donut data={sevData} />
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card title={t('command.byDzo')}>
          <Bars data={dzoData} horizontal height={340} />
        </Card>
        <Card title={t('command.byType')}>
          <Bars data={typeData} horizontal height={340} color="#2f73c4" />
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card title={t('command.byMonth')}>
          <Bars data={monthData} height={260} color="#1f9d57" />
        </Card>
        <Card title={t('command.byRegion')}>
          <Bars data={regionData} horizontal height={260} color="#e08a1e" />
        </Card>
      </div>

      {/* AI block */}
      <div className="mt-5">
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-kmg-blue text-white">
              <IconSpark width={18} height={18} />
            </span>
            <h3 className="text-[15px] font-bold text-slate-700">{t('command.ai.title')}</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-red-100 bg-red-50/60 p-4">
              <div className="mb-1 flex items-center gap-2 text-sm font-bold text-kmg-red">
                <IconClock width={16} height={16} /> {t('command.ai.forecast')}
              </div>
              <p className="text-sm text-slate-600">{t('command.ai.forecastText')}</p>
              <Link to="/forecast" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-kmg-red">
                {t('nav.forecast')} <IconArrow width={14} height={14} />
              </Link>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-4">
              <div className="mb-2 text-sm font-bold text-kmg-amber">{t('command.ai.causes')}</div>
              <ol className="space-y-1.5 text-sm text-slate-600">
                <li className="flex gap-2"><span className="font-bold text-kmg-amber">1.</span>{t('command.ai.cause1')}</li>
                <li className="flex gap-2"><span className="font-bold text-kmg-amber">2.</span>{t('command.ai.cause2')}</li>
                <li className="flex gap-2"><span className="font-bold text-kmg-amber">3.</span>{t('command.ai.cause3')}</li>
              </ol>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
              <div className="mb-1 text-sm font-bold text-kmg-green">{t('command.ai.opportunity')}</div>
              <p className="text-sm text-slate-600">{t('command.ai.opportunityText')}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* recent */}
      <div className="mt-5">
        <Card
          title={t('command.recent')}
          action={
            <Link to="/incidents" className="inline-flex items-center gap-1 text-sm font-semibold text-kmg-blue">
              {t('common.viewAll')} <IconArrow width={14} height={14} />
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <th className="px-3 py-2">{t('incidents.col.date')}</th>
                  <th className="px-3 py-2">{t('incidents.col.dzo')}</th>
                  <th className="px-3 py-2">{t('incidents.col.type')}</th>
                  <th className="px-3 py-2">{t('incidents.col.region')}</th>
                  <th className="px-3 py-2">{t('incidents.col.severity')}</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((i) => (
                  <tr key={i.id} className="border-b border-slate-50 hover:bg-kmg-light/40">
                    <td className="px-3 py-2.5 text-slate-500">{i.date}</td>
                    <td className="px-3 py-2.5 font-medium text-slate-700">{dzoLabel(i.dzoNorm, lang)}</td>
                    <td className="px-3 py-2.5 text-slate-600">{t(`type.${i.typeNorm}`)}</td>
                    <td className="px-3 py-2.5 text-slate-500">{regionLabel(i.region, lang)}</td>
                    <td className="px-3 py-2.5">
                      <Badge tone={sevTone(i.severityNorm)}>{t(`sev.${i.severityNorm}`)}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">{t('command.benchmark')} · IOGP 2025</p>
    </div>
  );
}
