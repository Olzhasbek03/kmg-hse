import { useState } from 'react';
import { useI18n } from '../i18n';
import { PageHeader, Card, Badge } from '../components/ui';
import { IconCheck, IconEye, IconFilter } from '../components/icons';
import { dzoLabel } from '../labels';

interface Row { date: string; dzo: string; level: number; author: string; status: 'completed' | 'results' | 'nonconformity'; }
const DATA: Row[] = [
  { date: '2026-05-21 11:16', dzo: 'ТОО «КМГ Инжиниринг»', level: 3, author: 'Адилбек Оршабеков', status: 'completed' },
  { date: '2026-05-06 04:30', dzo: 'ТОО «ПетроКазахстан Ойл Продактс»', level: 2, author: 'Насихат Демисинова', status: 'results' },
  { date: '2026-05-05 12:42', dzo: 'ТОО «КазахОйл Актобе»', level: 4, author: 'Насихат Демисинова', status: 'nonconformity' },
  { date: '2026-04-24 04:28', dzo: 'АО «Эмбамунайгаз»', level: 2, author: 'Сания Надирова', status: 'completed' },
  { date: '2026-04-24 03:35', dzo: 'ТОО «ПНХЗ»', level: 5, author: 'Сания Надирова', status: 'completed' },
  { date: '2026-04-12 09:10', dzo: 'АО «Озенмунайгаз»', level: 3, author: 'Б.Б. Изтлеуов', status: 'results' },
  { date: '2026-03-30 14:05', dzo: 'АО «Каражанбасмунай»', level: 4, author: 'С.К. Ускенов', status: 'nonconformity' },
];

export function Audit() {
  const { t, lang } = useI18n();
  const [level, setLevel] = useState('');
  const [status, setStatus] = useState('');
  const rows = DATA.filter((r) => (!level || String(r.level) === level) && (!status || r.status === status));

  const tone = (s: Row['status']) => (s === 'completed' ? 'green' : s === 'results' ? 'blue' : 'red');

  return (
    <div>
      <PageHeader
        title={t('audit.title')}
        subtitle={t('audit.subtitle')}
        breadcrumb={t('common.home')}
        actions={<button className="btn-green"><IconCheck width={16} height={16} />{t('audit.create')}</button>}
      />

      <Card className="mb-5">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="label">{t('audit.level')}</label>
            <select className="field !w-44" value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="">{t('common.all')}</option>
              {[1, 2, 3, 4, 5].map((l) => <option key={l} value={String(l)}>{l} {t('audit.level')}</option>)}
            </select>
          </div>
          <div>
            <label className="label">{t('common.status')}</label>
            <select className="field !w-52" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">{t('common.allStatuses')}</option>
              <option value="completed">{t('audit.st.completed')}</option>
              <option value="results">{t('audit.st.results')}</option>
              <option value="nonconformity">{t('audit.st.nonconformity')}</option>
            </select>
          </div>
          <button onClick={() => { setLevel(''); setStatus(''); }} className="btn-ghost"><IconFilter width={16} height={16} />{t('common.reset')}</button>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-kmg-blue text-left text-xs font-semibold uppercase tracking-wide text-white">
                <th className="rounded-l-lg px-4 py-3">{t('audit.col.date')}</th>
                <th className="px-4 py-3">{t('audit.col.dzo')}</th>
                <th className="px-4 py-3">{t('audit.col.type')}</th>
                <th className="px-4 py-3">{t('audit.col.author')}</th>
                <th className="px-4 py-3">{t('audit.col.status')}</th>
                <th className="rounded-r-lg px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-kmg-light/40">
                  <td className="px-4 py-3 whitespace-nowrap text-slate-500">{r.date}</td>
                  <td className="px-4 py-3 font-medium text-slate-700">{dzoLabel(r.dzo, lang)}</td>
                  <td className="px-4 py-3 text-slate-600">{r.level} {t('audit.level')}</td>
                  <td className="px-4 py-3 text-slate-600">{r.author}</td>
                  <td className="px-4 py-3"><Badge tone={tone(r.status)}>{t(`audit.st.${r.status}`)}</Badge></td>
                  <td className="px-4 py-3 text-right">
                    <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-kmg-blue hover:bg-kmg-blue/10"><IconEye width={18} height={18} /></button>
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
