import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { PageHeader, Card } from '../components/ui';
import { IconBook, IconDownload, IconChevronDown } from '../components/icons';
import { POLICY_CATEGORIES } from '../data/policiesCategories';
import {
  BUSINESS_DIRECTIONS,
  MATRIX_ALL_ID,
  getDzoSummary,
  getDirectionRollups,
  getAllTotals,
  getNotDoneItems,
  exportMatrixToExcel,
  STATUS_LABEL,
} from '../data/policiesMatrix';

const PDCA = {
  ru: [
    { k: 'P', c: 'Plan', t: 'Разработка политик и ВРД (КЦ КМГ)' },
    { k: 'D', c: 'Do', t: 'Адаптация и внедрение в ДЗО' },
    { k: 'C', c: 'Check', t: 'Аудит и матрица соответствия' },
    { k: 'A', c: 'Act', t: 'Актуализация (за 30 дней до истечения)' },
  ],
  kz: [
    { k: 'P', c: 'Plan', t: 'Саясат пен ІБҚ әзірлеу (ҚМГ КО)' },
    { k: 'D', c: 'Do', t: 'ЕТҰ-да бейімдеу және енгізу' },
    { k: 'C', c: 'Check', t: 'Аудит және сәйкестік матрицасы' },
    { k: 'A', c: 'Act', t: 'Өзектендіру (мерзімге 30 күн қалғанда)' },
  ],
  en: [
    { k: 'P', c: 'Plan', t: 'Develop policies & IRD (KMG CC)' },
    { k: 'D', c: 'Do', t: 'Adapt and implement at subsidiaries' },
    { k: 'C', c: 'Check', t: 'Audit & compliance matrix' },
    { k: 'A', c: 'Act', t: 'Update (30 days before expiry)' },
  ],
} as const;

export function Policies() {
  const { t, lang } = useI18n();
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [matrixDirectionId, setMatrixDirectionId] = useState(MATRIX_ALL_ID);
  const [matrixView, setMatrixView] = useState<'done' | 'notDone'>('done');
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const category = POLICY_CATEGORIES.find((c) => c.id === categoryId);
  const isAll = matrixDirectionId === MATRIX_ALL_ID;
  const dzoSummary = getDzoSummary(matrixDirectionId);
  const directionRollups = getDirectionRollups();
  const allTotals = getAllTotals();
  const direction = BUSINESS_DIRECTIONS.find((d) => d.id === matrixDirectionId);
  const totalNotDone = isAll
    ? allTotals.notDone
    : dzoSummary.reduce((s, m) => s + m.notDone, 0);

  const toggleExpand = (key: string) => setExpandedKey((k) => (k === key ? null : key));

  return (
    <div>
      <PageHeader title={t('policies.title')} subtitle={t('policies.subtitle')} breadcrumb={t('common.home')}
        actions={<button className="btn-green"><IconBook width={16} height={16} />{t('policies.create')}</button>} />

      <div className="mb-5 grid gap-5 lg:grid-cols-3">
        <Card
          title={t('policies.matrix')}
          className="lg:col-span-2"
          action={
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-ghost text-xs"
                onClick={() => exportMatrixToExcel(matrixDirectionId, lang)}
              >
                <IconDownload width={14} height={14} />
                {t('policies.exportExcel')}
              </button>
              <Link to="/policies/report" className="btn-green text-xs">
                {t('policies.report')}
              </Link>
            </div>
          }
        >
          <label className="mb-3 flex cursor-pointer items-center justify-between gap-2 rounded-lg bg-kmg-green px-3 py-2 text-white shadow-sm">
            <span className="text-xs font-semibold">{t('policies.businessDirection')}</span>
            <div className="relative flex items-center">
              <select
                value={matrixDirectionId}
                onChange={(e) => {
                  setMatrixDirectionId(e.target.value);
                  setExpandedKey(null);
                }}
                className="cursor-pointer appearance-none bg-transparent pr-5 text-right text-xs font-semibold text-white outline-none"
              >
                <option value={MATRIX_ALL_ID} className="text-slate-800">{t('policies.businessDirectionAll')}</option>
                {BUSINESS_DIRECTIONS.map((d) => (
                  <option key={d.id} value={d.id} className="text-slate-800">{d.label[lang]}</option>
                ))}
              </select>
              <IconChevronDown width={12} height={12} className="pointer-events-none absolute right-0 text-white/90" />
            </div>
          </label>

          <div className="mb-3 flex gap-2">
            <button
              type="button"
              onClick={() => { setMatrixView('done'); setExpandedKey(null); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                matrixView === 'done' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {t('policies.matrixDone')}
            </button>
            <button
              type="button"
              onClick={() => setMatrixView('notDone')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                matrixView === 'notDone' ? 'bg-kmg-red text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {t('policies.matrixNotDone')}
              {totalNotDone > 0 && (
                <span className={`ml-1.5 inline-flex min-w-[1.25rem] justify-center rounded-full px-1.5 py-0.5 text-[10px] ${
                  matrixView === 'notDone' ? 'bg-white/20' : 'bg-red-100 text-kmg-red'
                }`}
                >
                  {totalNotDone}
                </span>
              )}
            </button>
          </div>

          {matrixView === 'done' ? (
            isAll ? (
              <div className="max-h-[28rem] space-y-2 overflow-y-auto pr-1">
                {directionRollups.map((r) => {
                  const key = `dir:${r.id}`;
                  const open = expandedKey === key;
                  const dzos = getDzoSummary(r.id);
                  return (
                    <div key={r.id} className="overflow-hidden rounded-lg border border-emerald-100">
                      <button
                        type="button"
                        onClick={() => toggleExpand(key)}
                        className="flex w-full items-center gap-2 bg-emerald-50/80 px-3 py-2.5 text-left hover:bg-emerald-50"
                      >
                        <span className="min-w-0 flex-1 text-sm font-bold text-slate-700">{r.label[lang]}</span>
                        <div className="hidden h-2 w-24 overflow-hidden rounded-full bg-slate-100 sm:block">
                          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${r.done}%` }} />
                        </div>
                        <span className="text-sm font-bold text-emerald-700">{r.done}%</span>
                        {r.notDone > 0 && (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-kmg-red">
                            {r.notDone}
                          </span>
                        )}
                        <IconChevronDown width={14} height={14} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                      </button>
                      {open && (
                        <div className="grid gap-2 border-t border-emerald-100 bg-white p-3 sm:grid-cols-2">
                          {dzos.map((m) => (
                            <div key={m.code} className="flex items-center gap-2">
                              <span className="w-20 shrink-0 text-xs font-bold text-slate-600">{m.code}</span>
                              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${m.done}%` }} />
                              </div>
                              <span className="w-9 text-right text-xs font-bold text-emerald-700">{m.done}%</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2.5 text-white">
                  <span className="flex-1 text-sm font-bold">{t('policies.matrixTotal')}</span>
                  <span className="text-sm font-extrabold">{allTotals.done}%</span>
                  <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs">
                    {t('policies.matrixNotDone')}: {allTotals.notDone}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  {t('policies.matrixDone')} · {direction?.label[lang]}
                </p>
                <div className="grid max-h-[28rem] gap-x-6 gap-y-3 overflow-y-auto pr-1 sm:grid-cols-2">
                  {dzoSummary.map((m) => (
                    <div key={m.code} className="flex items-center gap-2">
                      <span className="w-24 shrink-0 text-sm font-bold text-slate-700">{m.code}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${m.done}%` }} />
                      </div>
                      <span className="w-10 shrink-0 text-right text-sm font-bold text-emerald-700">{m.done}%</span>
                    </div>
                  ))}
                </div>
              </>
            )
          ) : (
            <>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {t('policies.matrixNotDone')} · {t('policies.matrixNotDoneHint')}
                {!isAll && direction && ` · ${direction.label[lang]}`}
              </p>
              {totalNotDone === 0 ? (
                <p className="rounded-lg bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">{t('policies.matrixNotDoneEmpty')}</p>
              ) : isAll ? (
                <div className="max-h-[28rem] space-y-2 overflow-y-auto pr-1">
                  {directionRollups.filter((r) => r.notDone > 0).map((r) => {
                    const key = `nd:${r.id}`;
                    const open = expandedKey === key;
                    const items = getNotDoneItems(MATRIX_ALL_ID, undefined, r.id);
                    return (
                      <div key={r.id} className="overflow-hidden rounded-lg border border-red-100">
                        <button
                          type="button"
                          onClick={() => toggleExpand(key)}
                          className="flex w-full items-center gap-2 bg-red-50/80 px-3 py-2.5 text-left hover:bg-red-50"
                        >
                          <span className="flex-1 text-sm font-bold text-slate-700">{r.label[lang]}</span>
                          <span className="rounded-full bg-kmg-red px-2.5 py-0.5 text-xs font-bold text-white">{r.notDone}</span>
                          <IconChevronDown width={14} height={14} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                        </button>
                        {open && (
                          <div className="border-t border-red-100 bg-white px-3 py-2">
                            <NotDoneTable items={items} showDirection={false} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="max-h-[28rem] space-y-2 overflow-y-auto pr-1">
                  {dzoSummary.filter((m) => m.notDone > 0).map((m) => {
                    const key = `dzo:${m.code}`;
                    const open = expandedKey === key;
                    const items = getNotDoneItems(matrixDirectionId, m.code);
                    return (
                      <div key={m.code} className="overflow-hidden rounded-lg border border-red-100">
                        <button
                          type="button"
                          onClick={() => toggleExpand(key)}
                          className="flex w-full items-center gap-2 bg-red-50/80 px-3 py-2.5 text-left hover:bg-red-50"
                        >
                          <span className="w-24 shrink-0 text-sm font-bold text-slate-700">{m.code}</span>
                          <span className="flex-1 text-xs text-slate-500">{t('policies.matrixNotDoneList')}</span>
                          <span className="rounded-full bg-kmg-red px-2.5 py-0.5 text-xs font-bold text-white">{m.notDone}</span>
                          <IconChevronDown width={14} height={14} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                        </button>
                        {open && (
                          <div className="border-t border-red-100 bg-white px-3 py-2">
                            <NotDoneTable items={items} showDirection={false} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </Card>

        <Card title={t('policies.pdca')} className="p-4">
          <div className="grid gap-2">
            {PDCA[lang].map((p, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/80 px-2 py-1.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-kmg-blue text-[11px] font-extrabold text-white">{p.k}</span>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-700">{p.c}</span>
                  <span className="mt-0.5 block text-[11px] leading-tight text-slate-400">{p.t}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title={t('policies.categories')} className="mb-5">
        <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-white sm:grid-cols-4 lg:grid-cols-8">
          {POLICY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryId(cat.id === categoryId ? null : cat.id)}
              className={`border-r border-white/30 px-2 py-3 text-center text-xs font-bold leading-tight text-white transition-colors last:border-r-0 ${
                categoryId === cat.id ? 'bg-kmg-dark' : 'bg-kmg-blue hover:bg-kmg-mid'
              }`}
            >
              {cat.label[lang]}
            </button>
          ))}
        </div>

        {category && (
          <div className="mt-4">
            {category.docs.length === 0 ? (
              <p className="rounded-lg bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">{t('policies.noDocs')}</p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-kmg-blue text-white">
                      <th className="border border-white/20 px-4 py-2.5 text-left font-bold">{t('policies.col.name')}</th>
                      <th className="border border-white/20 px-4 py-2.5 text-left font-bold whitespace-nowrap">{t('policies.col.type')}</th>
                      <th className="border border-white/20 px-4 py-2.5 text-left font-bold whitespace-nowrap">{t('policies.col.approvalDate')}</th>
                      <th className="border border-white/20 px-4 py-2.5 text-left font-bold whitespace-nowrap">{t('policies.col.approvedBy')}</th>
                      <th className="border border-white/20 px-4 py-2.5 text-center font-bold">{t('policies.col.download')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.docs.map((doc) => (
                      <tr key={doc.id} className="bg-[#e8f2fb] hover:bg-[#dceaf8]">
                        <td className="border border-white px-4 py-3 font-medium text-slate-800">{doc.name[lang]}</td>
                        <td className="border border-white px-4 py-3 whitespace-nowrap text-slate-700">{doc.type[lang]}</td>
                        <td className="border border-white px-4 py-3 whitespace-nowrap text-slate-600">{doc.date}</td>
                        <td className="border border-white px-4 py-3 whitespace-nowrap text-slate-700">{doc.approvedBy[lang]}</td>
                        <td className="border border-white px-4 py-3 text-center">
                          <a
                            href={doc.file}
                            target="_blank"
                            rel="noreferrer"
                            title={t('policies.col.download')}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-kmg-blue hover:bg-kmg-blue/10"
                          >
                            <IconDownload width={18} height={18} />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

function NotDoneTable({
  items,
  showDirection,
}: {
  items: ReturnType<typeof getNotDoneItems>;
  showDirection: boolean;
}) {
  const { t, lang } = useI18n();
  return (
    <table className="w-full text-xs">
      <thead>
        <tr className="text-left text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {showDirection && <th className="pb-1.5 pr-2">{t('policies.businessDirection')}</th>}
          <th className="pb-1.5 pr-2">{t('policies.col.name')}</th>
          <th className="w-16 pb-1.5 text-right">{t('policies.matrixStatus')}</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, i) => {
          const dir = BUSINESS_DIRECTIONS.find((d) => d.id === item.directionId);
          return (
            <tr key={i} className="border-t border-slate-50">
              {showDirection && (
                <td className="py-2 pr-2 whitespace-nowrap text-slate-500">{dir?.label[lang]}</td>
              )}
              <td className="py-2 pr-2 leading-snug text-slate-700">
                {!showDirection && <span className="font-semibold text-slate-500">{item.dzo} · </span>}
                {item.document}
              </td>
              <td className="py-2 text-right font-bold text-kmg-red">{STATUS_LABEL[item.status]}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
