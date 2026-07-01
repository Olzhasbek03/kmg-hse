import { useState } from 'react';
import { useI18n } from '../i18n';
import { PageHeader, Card } from '../components/ui';
import { IconDownload, IconChevronDown } from '../components/icons';
import {
  BUSINESS_DIRECTIONS,
  MATRIX_ALL_ID,
  LEGEND,
  STATUS_LABEL,
  downloadMatrixReport,
  exportMatrixToExcel,
  type MatrixStatus,
  type BusinessDirection,
} from '../data/policiesMatrix';

function statusTone(s: MatrixStatus): string {
  if (s === 'VN' || s === 'PLUS') return 'text-emerald-700 font-semibold';
  if (s === 'AKT' || s === 'PLAN26' || s === 'PLAN27') return 'text-kmg-blue font-semibold';
  if (s === 'RAZ') return 'text-amber-700 font-semibold';
  if (s === 'NR' || s === 'NES' || s === 'MINUS') return 'text-red-600 font-semibold';
  if (s === 'EMPTY') return 'text-slate-300';
  return 'text-slate-500';
}

function MatrixTable({ direction, lang }: { direction: BusinessDirection; lang: 'ru' | 'kz' | 'en' }) {
  const { t } = useI18n();
  return (
    <div className="mb-6 overflow-x-auto rounded-lg border border-slate-200">
      <h4 className="border-b border-slate-100 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700">
        {direction.label[lang]}
      </h4>
      <table className="w-full min-w-[900px] border-collapse text-xs">
        <thead>
          <tr className="bg-kmg-blue text-white">
            <th className="sticky left-0 z-10 min-w-[280px] border border-white/20 bg-kmg-blue px-3 py-2 text-left font-bold">
              {t('policies.matrixByDirection', { direction: direction.label[lang] })}
            </th>
            {direction.columns.map((col) => (
              <th key={col} className="border border-white/20 px-2 py-2 text-center font-bold whitespace-nowrap">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {direction.rows.map((row, i) => (
            <tr key={i} className="bg-[#e8f2fb] hover:bg-[#dceaf8]">
              <td className="sticky left-0 z-10 border border-white bg-[#e8f2fb] px-3 py-2 font-medium text-slate-800">{row.name}</td>
              {row.statuses.map((s, j) => (
                <td key={j} className={`border border-white px-2 py-2 text-center ${statusTone(s)}`}>
                  {STATUS_LABEL[s] ?? s}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PoliciesReport() {
  const { t, lang } = useI18n();
  const [directionId, setDirectionId] = useState(MATRIX_ALL_ID);

  const isAll = directionId === MATRIX_ALL_ID;
  const direction = BUSINESS_DIRECTIONS.find((d) => d.id === directionId) ?? BUSINESS_DIRECTIONS[0];
  const visibleDirections = isAll ? BUSINESS_DIRECTIONS : [direction];

  return (
    <div>
      <PageHeader
        title={t('policies.reportTitle')}
        subtitle={t('policies.reportDesc')}
        backTo="/policies"
        breadcrumb={t('policies.title')}
      />

      <Card>
        <div className="mb-4 flex flex-wrap items-stretch gap-3">
          <label className="flex min-w-[240px] flex-1 cursor-pointer items-center justify-between gap-3 rounded-lg bg-kmg-green px-4 py-2.5 text-white shadow-sm">
            <span className="text-sm font-semibold">{t('policies.businessDirection')}</span>
            <div className="relative flex items-center gap-1">
              <select
                value={directionId}
                onChange={(e) => setDirectionId(e.target.value)}
                className="cursor-pointer appearance-none bg-transparent pr-6 text-right text-sm font-semibold text-white outline-none"
              >
                <option value={MATRIX_ALL_ID} className="text-slate-800">{t('policies.businessDirectionAll')}</option>
                {BUSINESS_DIRECTIONS.map((d) => (
                  <option key={d.id} value={d.id} className="text-slate-800">{d.label[lang]}</option>
                ))}
              </select>
              <IconChevronDown width={14} height={14} className="pointer-events-none absolute right-0 text-white/90" />
            </div>
          </label>
          <button type="button" className="btn-green" onClick={() => exportMatrixToExcel(directionId, lang)}>
            <IconDownload width={16} height={16} />
            {t('policies.exportExcel')}
          </button>
          {!isAll && (
            <button type="button" className="btn-ghost" onClick={() => downloadMatrixReport(direction)}>
              <IconDownload width={16} height={16} />
              {t('policies.downloadReport')}
            </button>
          )}
        </div>

        {visibleDirections.map((d) => (
          <MatrixTable key={d.id} direction={d} lang={lang} />
        ))}

        <h4 className="mb-2 text-sm font-bold text-slate-700">{t('policies.matrixLegend')}</h4>
        <div className="max-w-xl overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full border-collapse text-sm">
            <tbody>
              {LEGEND.map((item) => (
                <tr key={item.code} className="bg-[#e8f2fb]">
                  <td className="w-24 border border-white px-4 py-2 text-center font-bold text-slate-800">{STATUS_LABEL[item.code]}</td>
                  <td className="border border-white px-4 py-2 text-slate-700">{item.desc[lang]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
