import { useI18n } from '../i18n';
import { PageHeader, Card, Badge } from '../components/ui';
import { IconForm } from '../components/icons';
import { dzoLabel } from '../labels';

interface F { month: string; dzo: string; far: number; ltir: number; mvcr: number; hours: string; status: 'submitted' | 'draft' | 'correction'; }
const DATA: F[] = [
  { month: '2026-05', dzo: 'АО «Озенмунайгаз»', far: 0.0, ltir: 0.32, mvcr: 0.41, hours: '4 120 000', status: 'submitted' },
  { month: '2026-05', dzo: 'АО «Эмбамунайгаз»', far: 1.1, ltir: 0.28, mvcr: 0.36, hours: '3 980 000', status: 'submitted' },
  { month: '2026-05', dzo: 'АО «Каражанбасмунай»', far: 0.0, ltir: 0.45, mvcr: 0.52, hours: '2 410 000', status: 'correction' },
  { month: '2026-05', dzo: 'ТОО «ПНХЗ»', far: 0.0, ltir: 0.12, mvcr: 0.18, hours: '1 870 000', status: 'submitted' },
  { month: '2026-05', dzo: 'АО «КазТрансОйл»', far: 0.0, ltir: 0.21, mvcr: 0.29, hours: '2 050 000', status: 'draft' },
];

export function Forms() {
  const { t, lang } = useI18n();
  const tone = (s: F['status']) => (s === 'submitted' ? 'green' : s === 'correction' ? 'amber' : 'slate');
  const label = (s: F['status']) => (s === 'submitted' ? t('st.completed') : s === 'correction' ? t('audit.st.results') : 'Draft');
  return (
    <div>
      <PageHeader title={t('forms.title')} subtitle={t('forms.subtitle')} breadcrumb={t('common.home')}
        actions={<button className="btn-green"><IconForm width={16} height={16} />{t('forms.create')}</button>} />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-kmg-blue text-left text-xs font-semibold uppercase tracking-wide text-white">
                <th className="rounded-l-lg px-4 py-3">{t('forms.col.month')}</th>
                <th className="px-4 py-3">{t('forms.col.dzo')}</th>
                <th className="px-4 py-3 text-right">{t('forms.col.far')}</th>
                <th className="px-4 py-3 text-right">{t('forms.col.ltir')}</th>
                <th className="px-4 py-3 text-right">{t('forms.col.mvcr')}</th>
                <th className="px-4 py-3 text-right">{t('forms.col.hours')}</th>
                <th className="rounded-r-lg px-4 py-3">{t('forms.col.status')}</th>
              </tr>
            </thead>
            <tbody>
              {DATA.map((f, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-kmg-light/40">
                  <td className="px-4 py-3 text-slate-500">{f.month}</td>
                  <td className="px-4 py-3 font-medium text-slate-700">{dzoLabel(f.dzo, lang)}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{f.far.toFixed(1)}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{f.ltir.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{f.mvcr.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-slate-500">{f.hours}</td>
                  <td className="px-4 py-3"><Badge tone={tone(f.status)}>{label(f.status)}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-400">Power BI · IOGP benchmark · план vs факт</p>
      </Card>
    </div>
  );
}
