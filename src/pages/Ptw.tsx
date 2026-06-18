import { useI18n, type Lang } from '../i18n';
import { PageHeader, KpiCard, Card, Badge } from '../components/ui';
import { IconDoc } from '../components/icons';
import { dzoLabel } from '../labels';

interface Permit { num: string; work: Record<Lang, string>; dzo: string; risk: 'high' | 'medium' | 'low'; status: 'active' | 'closed' | 'pending'; }
const DATA: Permit[] = [
  { num: 'PTW-2026-04412', work: { ru: 'Огневые работы на технологическом трубопроводе', kz: 'Технологиялық құбырдағы отты жұмыстар', en: 'Hot work on process pipeline' }, dzo: 'АО «Озенмунайгаз»', risk: 'high', status: 'active' },
  { num: 'PTW-2026-04398', work: { ru: 'Работы в замкнутом пространстве (резервуар)', kz: 'Тұйық кеңістіктегі жұмыстар (резервуар)', en: 'Confined space entry (tank)' }, dzo: 'ТОО «ПНХЗ»', risk: 'high', status: 'active' },
  { num: 'PTW-2026-04375', work: { ru: 'Работы на высоте (замена оборудования СК)', kz: 'Биіктегі жұмыстар (ШС жабдығын ауыстыру)', en: 'Work at height (pumping unit replacement)' }, dzo: 'АО «Эмбамунайгаз»', risk: 'medium', status: 'pending' },
  { num: 'PTW-2026-04361', work: { ru: 'Земляные работы вблизи кабельных трасс', kz: 'Кабель трассасы маңындағы жер жұмыстары', en: 'Excavation near cable routes' }, dzo: 'АО «КазТрансОйл»', risk: 'medium', status: 'active' },
  { num: 'PTW-2026-04340', work: { ru: 'Электромонтажные работы (LOTO)', kz: 'Электрмонтаж жұмыстары (LOTO)', en: 'Electrical works (LOTO)' }, dzo: 'АО «Каражанбасмунай»', risk: 'low', status: 'closed' },
];

export function Ptw() {
  const { t, lang } = useI18n();
  const riskTone = (r: Permit['risk']) => (r === 'high' ? 'red' : r === 'medium' ? 'amber' : 'green');
  const riskLabel = (r: Permit['risk']) => t(r === 'high' ? 'forecast.prob.high' : r === 'medium' ? 'forecast.prob.medium' : 'forecast.prob.moderate');
  const statusLabel = (s: Permit['status']) => t(s === 'closed' ? 'st.completed' : s === 'pending' ? 'audit.st.results' : 'st.ongoing');

  return (
    <div>
      <PageHeader title={t('ptw.title')} subtitle={t('ptw.subtitle')} breadcrumb={t('common.home')} />

      <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label={t('ptw.kpi.active')} value={184} accent="blue" icon={IconDoc} />
        <KpiCard label={t('ptw.kpi.highrisk')} value={23} accent="red" />
        <KpiCard label={t('ptw.kpi.loto')} value={67} accent="amber" />
        <KpiCard label={t('ptw.kpi.closed')} value={512} accent="green" />
      </div>

      <Card title={t('ptw.title')} className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-3 py-2.5">{t('ptw.col.num')}</th>
                <th className="px-3 py-2.5">{t('ptw.col.work')}</th>
                <th className="px-3 py-2.5">{t('ptw.col.dzo')}</th>
                <th className="px-3 py-2.5">{t('ptw.col.risk')}</th>
                <th className="px-3 py-2.5">{t('ptw.col.status')}</th>
              </tr>
            </thead>
            <tbody>
              {DATA.map((p, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-kmg-light/40">
                  <td className="px-3 py-3 font-semibold text-slate-500">{p.num}</td>
                  <td className="px-3 py-3 font-medium text-slate-700">{p.work[lang]}</td>
                  <td className="px-3 py-3 text-slate-600">{dzoLabel(p.dzo, lang)}</td>
                  <td className="px-3 py-3"><Badge tone={riskTone(p.risk)}>{riskLabel(p.risk)}</Badge></td>
                  <td className="px-3 py-3"><Badge tone={p.status === 'closed' ? 'green' : p.status === 'pending' ? 'amber' : 'blue'}>{statusLabel(p.status)}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
