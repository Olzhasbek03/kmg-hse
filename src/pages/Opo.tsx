import { Link } from 'react-router-dom';
import { useI18n, type Lang } from '../i18n';
import { PageHeader, KpiCard, Card, Badge } from '../components/ui';
import { IconFactory, IconDoc, IconEye, IconDownload } from '../components/icons';
import { dzoLabel } from '../labels';
import { DECLARATIONS } from '../data/dpb';

interface Facility { name: Record<Lang, string>; cls: 'I' | 'II' | 'III' | 'IV'; dzo: string; devices: number; next: string; soon: boolean; }
const DATA: Facility[] = [
  { name: { ru: 'Площадка подготовки нефти м/р Узень', kz: 'Өзен к/о мұнай дайындау алаңы', en: 'Oil treatment site, Uzen field' }, cls: 'II', dzo: 'АО «Озенмунайгаз»', devices: 142, next: '2026-08-12', soon: true },
  { name: { ru: 'Установка ЭЛОУ-АВТ-3', kz: 'ЭТҚ-АВҚ-3 қондырғысы', en: 'CDU/VDU unit ELOU-AVT-3' }, cls: 'I', dzo: 'ТОО «ПНХЗ»', devices: 318, next: '2026-11-30', soon: false },
  { name: { ru: 'Резервуарный парк НПС «Атырау»', kz: '«Атырау» МАС резервуар паркі', en: 'Tank farm, Atyrau pump station' }, cls: 'II', dzo: 'АО «КазТрансОйл»', devices: 96, next: '2026-07-05', soon: true },
  { name: { ru: 'Газокомпрессорная станция КБМ', kz: 'КБМ газкомпрессорлық станциясы', en: 'Gas compressor station, KBM' }, cls: 'III', dzo: 'АО «Каражанбасмунай»', devices: 54, next: '2027-02-18', soon: false },
  { name: { ru: 'Цех первичной переработки нефти', kz: 'Мұнайды алғашқы өңдеу цехы', en: 'Primary oil refining shop' }, cls: 'II', dzo: 'ТОО «Атырауский НПЗ»', devices: 203, next: '2026-09-22', soon: false },
];

export function Opo() {
  const { t, lang } = useI18n();
  const totalDevices = DATA.reduce((s, f) => s + f.devices, 0);
  return (
    <div>
      <PageHeader title={t('opo.title')} subtitle={t('opo.subtitle')} breadcrumb={t('common.home')}
        actions={<button className="btn-green"><IconFactory width={16} height={16} />{t('opo.create')}</button>} />

      <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label={t('opo.kpi.total')} value={DATA.length * 6} accent="blue" icon={IconFactory} />
        <KpiCard label={t('opo.kpi.devices')} value={totalDevices.toLocaleString()} accent="blue" />
        <KpiCard label={t('opo.kpi.expertise')} value={28} accent="green" />
        <KpiCard label={t('opo.kpi.expiring')} value={DATA.filter((f) => f.soon).length + 4} accent="red" />
      </div>

      <Card title={t('opo.declarations')} className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-3 py-2.5">{t('dpb.col.org')}</th>
                <th className="px-3 py-2.5">{t('dpb.col.field')}</th>
                <th className="px-3 py-2.5">{t('dpb.col.year')}</th>
                <th className="px-3 py-2.5 text-center">{t('dpb.col.objects')}</th>
                <th className="px-3 py-2.5 text-center">{t('dpb.col.class')}</th>
                <th className="px-3 py-2.5 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {DECLARATIONS.map((d) => (
                <tr key={d.id} className="border-b border-slate-50 hover:bg-kmg-light/40">
                  <td className="px-3 py-3">
                    <Link to={`/opo/declaration/${d.id}`} className="flex items-center gap-2 font-medium text-slate-700 hover:text-kmg-blue">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-kmg-red/10 text-kmg-red"><IconDoc width={16} height={16} /></span>
                      {dzoLabel(d.org, lang)}
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-slate-600">{d.field}</td>
                  <td className="px-3 py-3"><Badge tone="blue">{t('dpb.badge', { year: d.year })}</Badge></td>
                  <td className="px-3 py-3 text-center font-semibold text-slate-700">{d.objectsCount}</td>
                  <td className="px-3 py-3 text-center"><Badge tone="red">{d.hazardClass}</Badge></td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/opo/declaration/${d.id}`} title={t('dpb.view')} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-kmg-blue hover:bg-kmg-blue/10"><IconEye width={18} height={18} /></Link>
                      <a href={d.pdf} download title={t('dpb.download')} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-kmg-blue hover:bg-kmg-blue/10"><IconDownload width={18} height={18} /></a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title={t('opo.facilities')} className="mt-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-3 py-2.5">{t('opo.col.name')}</th>
                <th className="px-3 py-2.5">{t('opo.col.class')}</th>
                <th className="px-3 py-2.5">{t('opo.col.dzo')}</th>
                <th className="px-3 py-2.5 text-right">{t('opo.col.devices')}</th>
                <th className="px-3 py-2.5">{t('opo.col.nextExp')}</th>
              </tr>
            </thead>
            <tbody>
              {DATA.map((f, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-kmg-light/40">
                  <td className="px-3 py-3 font-medium text-slate-700">{f.name[lang]}</td>
                  <td className="px-3 py-3"><Badge tone={f.cls === 'I' ? 'red' : f.cls === 'II' ? 'amber' : 'blue'}>{f.cls}</Badge></td>
                  <td className="px-3 py-3 text-slate-600">{dzoLabel(f.dzo, lang)}</td>
                  <td className="px-3 py-3 text-right font-semibold text-slate-700">{f.devices}</td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className={f.soon ? 'font-semibold text-kmg-red' : 'text-slate-500'}>{f.next}</span>
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
