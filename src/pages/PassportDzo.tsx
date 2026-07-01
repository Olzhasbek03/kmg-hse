import { useMemo, useState, type ReactNode } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useI18n } from '../i18n';
import { PageHeader, Card, Badge, KpiCard } from '../components/ui';
import { Donut } from '../components/charts';
import { BodySilhouette } from '../components/BodySilhouette';
import { PassportContractorsView } from '../components/PassportContractorsView';
import { PassportKpiRow } from '../components/PassportKpiRow';
import { IconFactory, IconArrow, IconDownload, IconChevronDown } from '../components/icons';
import {
  findDzo,
  groupOf,
  FORMS,
  rowValue,
  budgetFor,
  BUDGET_DIRECTIONS,
  type FormDef,
  type Dzo,
} from '../data/passport';
import { DECLARATIONS } from '../data/dpb';
import { SEVERITY_COLORS } from '../data';
import {
  computePassportStats,
  pctChange,
  type PassportCategory,
  type PeriodCompareRow,
  type LeadingRow,
} from '../data/passportIncidents';

const PERIOD_KEY: Record<string, string> = {
  monthly: 'pp.period.monthly',
  quarterly: 'pp.period.quarterly',
  halfyear: 'pp.period.halfyear',
  yearly: 'pp.period.yearly',
};

const CATEGORIES: { id: PassportCategory; key: string }[] = [
  { id: 'biot', key: 'pp.cat.biot' },
  { id: 'prombez', key: 'pp.cat.prombez' },
  { id: 'fire', key: 'pp.cat.fire' },
  { id: 'health', key: 'pp.cat.health' },
  { id: 'transport', key: 'pp.cat.transport' },
  { id: 'oos', key: 'pp.cat.oos' },
];

function fmtVal(v: number | null): string {
  if (v == null) return '—';
  if (v === 0) return '0';
  return v.toLocaleString('ru-RU');
}

function trendBad(prev: number, curr: number, row: { invertTrend?: boolean; worseUp?: boolean; worseDown?: boolean; label?: string }): boolean {
  const delta = curr - prev;
  if (delta === 0) return false;
  if (row.invertTrend) return delta < 0;
  if (row.worseDown) return delta < 0;
  if (row.worseUp) return delta > 0;
  if (row.label) return false;
  return delta > 0;
}

function TrendCell({ prev, curr, row }: { prev: number; curr: number; row: { invertTrend?: boolean; worseUp?: boolean; worseDown?: boolean } }) {
  const delta = curr - prev;
  const pct = pctChange(prev, curr);
  const bad = trendBad(prev, curr, row);
  const good = !bad && delta !== 0;
  const flat = delta === 0;

  const arrow = flat ? '→' : delta > 0 ? '↑' : '↓';
  const color = flat ? 'text-slate-400' : bad ? 'text-kmg-red' : good ? 'text-kmg-green' : 'text-slate-500';

  return (
    <div className="flex items-center justify-end gap-2">
      <span className={`font-semibold ${bad ? 'text-kmg-red' : 'text-slate-700'}`}>{delta > 0 ? `+${delta}` : delta}</span>
      <span className={`inline-flex items-center gap-0.5 text-xs font-bold ${color}`}>
        {arrow} {pct != null ? `${pct > 0 ? '+' : ''}${pct}%` : '—'}
      </span>
    </div>
  );
}

function CompareValue({ prev, curr, row }: { prev: number; curr: number; row: { invertTrend?: boolean; worseUp?: boolean; worseDown?: boolean } }) {
  const bad = trendBad(prev, curr, row);
  return (
    <span className={bad ? 'rounded-md bg-red-50 px-1.5 py-0.5 font-bold text-kmg-red' : 'font-bold text-slate-800'}>
      {curr}
    </span>
  );
}

function CompareTable({
  rows,
  prevYear,
  compareYear,
  label,
  rowLabel,
}: {
  rows: (PeriodCompareRow | LeadingRow)[];
  prevYear: number;
  compareYear: number;
  label: (row: PeriodCompareRow | LeadingRow) => string;
  rowLabel: (year: number) => string;
}) {
  const { t } = useI18n();
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            <th className="pb-2 pr-3 text-left">{t('pp.col.indicator')}</th>
            <th className="w-0 whitespace-nowrap pb-2 pl-3 pr-2 text-right">{rowLabel(prevYear)}</th>
            <th className="w-0 whitespace-nowrap px-2 pb-2 text-right">{rowLabel(compareYear)}</th>
            <th className="min-w-[9rem] whitespace-nowrap pb-2 pl-2 text-right">{t('pp.col.change')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-slate-50">
              <td className={`py-2 pr-3 leading-snug ${'sub' in row && row.sub ? 'pl-4 text-slate-500' : 'font-medium text-slate-700'}`}>
                {label(row)}
              </td>
              <td className="w-0 whitespace-nowrap py-2 pl-3 pr-2 text-right tabular-nums text-slate-500">{row.prev}</td>
              <td className="w-0 whitespace-nowrap px-2 py-2 text-right tabular-nums">
                <CompareValue prev={row.prev} curr={row.curr} row={row} />
              </td>
              <td className="min-w-[9rem] whitespace-nowrap py-2 pl-2 text-right">
                <TrendCell prev={row.prev} curr={row.curr} row={row} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CollapsibleSection({
  title,
  hint,
  accent = 'white',
  defaultOpen = true,
  className = '',
  children,
}: {
  title: string;
  hint?: string;
  accent?: 'white' | 'green' | 'blue';
  defaultOpen?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(defaultOpen);
  const headClass =
    accent === 'green'
      ? 'bg-kmg-green text-white'
      : accent === 'blue'
        ? 'bg-kmg-blue text-white'
        : 'bg-white text-slate-700 border border-slate-200';

  return (
    <div className={`overflow-hidden rounded-xl shadow-card ${accent === 'white' ? 'border border-slate-200' : ''} ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors ${headClass} ${accent === 'white' ? 'hover:border-kmg-blue/30' : 'hover:brightness-95'}`}
      >
        <div className="min-w-0 pr-3">
          <div className={`text-sm font-bold ${accent === 'white' ? 'text-slate-700' : 'text-white'}`}>{title}</div>
          {hint && (
            <div className={`text-xs ${accent === 'white' ? 'text-slate-400' : 'text-white/75'}`}>{hint}</div>
          )}
        </div>
        <div className={`flex shrink-0 items-center gap-2 text-xs font-semibold ${accent === 'white' ? 'text-slate-400' : 'text-white/80'}`}>
          <span>{open ? t('pp.collapse.collapse') : t('pp.collapse.expand')}</span>
          <IconChevronDown width={18} height={18} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>
      {open && <div className="bg-white p-4">{children}</div>}
    </div>
  );
}

export function PassportDzo() {
  const { group, dzo } = useParams();
  const { t, lang } = useI18n();
  const d = findDzo(dzo);
  const [category, setCategory] = useState<PassportCategory>('health');
  const [activeForm, setActiveForm] = useState<string>(FORMS[0].id);
  const [viewMode, setViewMode] = useState<'company' | 'contractors' | 'dashboards'>('company');

  const stats = useMemo(() => (d ? computePassportStats(d, category) : null), [d, category]);
  const kmgTabs = [...FORMS.map((f) => ({ id: f.id, code: f.code, key: f.titleKey })), { id: 'kmg8', code: 'KMG-8', key: 'pp.form.kmg8' }];
  const form: FormDef | undefined = FORMS.find((f) => f.id === activeForm);

  if (!d || !stats) return <Navigate to="/passport" replace />;

  const g = groupOf(d.group);
  const declaration = DECLARATIONS.find((x) => x.org === d.name.ru);
  const prevYear = stats.compareYear - 1;

  const sevData = (['light', 'severe', 'fatal'] as const)
    .map((s) => ({
      name: t(`sev.${s}`),
      value: stats.severity[s],
      color: SEVERITY_COLORS[s],
    }))
    .filter((x) => x.value > 0);

  const periodLabel = (year: number) =>
    t('pp.period.months').replace('{n}', String(stats.compareMonths)).replace('{year}', String(year));

  return (
    <div>
      <PageHeader
        title={d.name[lang]}
        subtitle={`${g.name[lang]} · ${d.region[lang]}`}
        backTo={`/passport/${group}`}
        breadcrumb={`${t('nav.passport')} · ${g.name[lang]}`}
        actions={
          <>
            {declaration && (
              <Link to={`/opo/declaration/${declaration.id}`} className="btn-ghost">
                <IconFactory width={16} height={16} />
                {t('pp.declaration')}
              </Link>
            )}
            <Link
              to="/incidents"
              className="btn-ghost"
              state={{ dzoFilter: d.name.ru, productionFilter: 'Связан' }}
            >
              {t('pp.journalLink')}
              <IconArrow width={14} height={14} />
            </Link>
          </>
        }
      />

      {/* View mode tabs */}
      <div className="mb-4 flex flex-wrap gap-2 border-b border-slate-100 pb-3">
        {([
          ['company', t('pp.view.company')],
          ['contractors', t('pp.view.contractors')],
          ['dashboards', t('pp.view.dashboards')],
        ] as const).map(([mode, label]) => (
          <button
            key={mode}
            type="button"
            onClick={() => setViewMode(mode)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              viewMode === mode ? 'bg-kmg-blue text-white' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {viewMode === 'contractors' ? (
        <PassportContractorsView dzo={d} companyKpis={stats.kpis} />
      ) : (
      <>

      {/* HSE category tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 active:scale-95 ${
              category === c.id
                ? 'bg-kmg-blue text-white shadow-soft'
                : 'bg-white text-slate-500 shadow-card hover:text-kmg-blue'
            }`}
          >
            {t(c.key)}
          </button>
        ))}
      </div>

      <p className="mb-4 text-xs text-slate-400">
        {t('pp.dataSource')}{' '}
        <Badge tone="blue">{stats.categoryLinked.length}</Badge>{' '}
        {t('pp.dataSourceLinked')}
      </p>

      {/* KPI row */}
      <PassportKpiRow kpis={stats.kpis} />

      {/* Key indicators — full width, collapsible */}
      <CollapsibleSection title={t('pp.lagging.title')} className="mt-6" defaultOpen>
        <CompareTable
          rows={stats.laggingRows}
          prevYear={prevYear}
          compareYear={stats.compareYear}
          label={(row) => ('labelKey' in row && row.labelKey ? t(row.labelKey) : row.id)}
          rowLabel={periodLabel}
        />
      </CollapsibleSection>

      {/* Body + severity charts — collapsible */}
      <CollapsibleSection title={t('pp.charts.section')} hint={t('pp.charts.sectionHint')} className="mt-5" defaultOpen>
        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <h4 className="mb-3 text-sm font-bold text-slate-700">{t('pp.body.title')}</h4>
            <div className="flex items-start justify-around gap-4">
              <BodySilhouette counts={stats.bodyPrev} year={prevYear} title={t('pp.body.injuries')} />
              <BodySilhouette counts={stats.bodyCurr} year={stats.compareYear} title={t('pp.body.injuries')} />
            </div>
            <p className="mt-3 text-center text-[11px] text-slate-400">{t('pp.body.note')}</p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-bold text-slate-700">{t('pp.severity.title')}</h4>
            {sevData.length > 0 ? (
              <Donut data={sevData} height={240} />
            ) : (
              <div className="flex h-48 items-center justify-center text-sm text-slate-400">{t('pp.noData')}</div>
            )}
          </div>
        </div>
      </CollapsibleSection>

      {/* Leading indicators — collapsible */}
      <div className="mt-5">
        <CollapsibleSection title={t('pp.leading.title')} accent="green" defaultOpen>
          <CompareTable
            rows={stats.leadingRows}
            prevYear={prevYear}
            compareYear={stats.compareYear}
            label={(row) => {
              const lr = row as LeadingRow;
              if (lr.labelKey) return t(lr.labelKey);
              return lr.label ?? lr.id;
            }}
            rowLabel={periodLabel}
          />
        </CollapsibleSection>
      </div>

      {/* KMG 1–9 — collapsible */}
      <div className="mt-5">
        <CollapsibleSection title={t('pp.kmg.section')} hint={t('pp.kmg.sectionHint')} defaultOpen={false}>
          <div className="flex flex-wrap gap-2">
            {kmgTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveForm(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-200 active:scale-95 ${
                  activeForm === tab.id ? 'bg-kmg-blue text-white shadow-soft' : 'bg-white text-slate-500 shadow-card hover:text-kmg-blue'
                }`}
              >
                <span className={`text-[10px] font-bold ${activeForm === tab.id ? 'text-white/70' : 'text-slate-300'}`}>{tab.code}</span>
                {t(tab.key)}
              </button>
            ))}
          </div>
          <div className="mt-4">
            {activeForm === 'kmg8' ? (
              <BudgetTab dzo={d} />
            ) : form ? (
              <FormTab dzo={d} form={form} />
            ) : null}
          </div>
        </CollapsibleSection>
      </div>
      </>
      )}
    </div>
  );
}

function FormTab({ dzo, form }: { dzo: Dzo; form: FormDef }) {
  const { t } = useI18n();
  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge tone="blue">{form.code}</Badge>
          <h3 className="text-[15px] font-bold text-slate-700">{t(form.titleKey)}</h3>
        </div>
        <span className="text-xs font-medium text-slate-400">{t(PERIOD_KEY[form.periodicity])}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              <th className="w-12 px-3 py-2.5">№</th>
              <th className="px-3 py-2.5">{t('pp.col.indicator')}</th>
              <th className="w-24 px-3 py-2.5">{t('pp.col.unit')}</th>
              <th className="w-36 px-3 py-2.5 text-right">{t('pp.col.current')}</th>
              <th className="w-32 px-3 py-2.5 text-right">{t('pp.col.prev')}</th>
            </tr>
          </thead>
          <tbody>
            {form.rows.map((row, i) =>
              row.section ? (
                <tr key={i} className="bg-kmg-light/50">
                  <td colSpan={5} className="px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-kmg-blue">
                    {row.label}
                  </td>
                </tr>
              ) : (
                <tr key={i} className="border-b border-slate-50 hover:bg-kmg-light/30">
                  <td className="px-3 py-2.5 font-semibold text-slate-400">{row.code}</td>
                  <td className={`px-3 py-2.5 ${row.sub ? 'pl-7 text-slate-500' : 'font-medium text-slate-700'}`}>{row.label}</td>
                  <td className="px-3 py-2.5 text-slate-400">{row.unit || '—'}</td>
                  <td className="px-3 py-2.5 text-right font-bold text-slate-800">{fmtVal(rowValue(dzo, form.id, row, false))}</td>
                  <td className="px-3 py-2.5 text-right text-slate-400">{fmtVal(rowValue(dzo, form.id, row, true))}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function BudgetTab({ dzo }: { dzo: Dzo }) {
  const { t, lang } = useI18n();
  const rows = budgetFor(dzo);
  const totalPlan = rows.reduce((s, r) => s + r.plan, 0);
  const totalFact = rows.reduce((s, r) => s + r.fact, 0);
  const byId = (id: string) => rows.find((r) => r.id === id)?.fact ?? 0;

  return (
    <div className="space-y-5">
      <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label={t('pp.budget.total')} value={totalFact.toLocaleString('ru-RU')} hint={t('pp.budget.thsTenge')} accent="blue" />
        <KpiCard label={BUDGET_DIRECTIONS[0].label[lang]} value={byId('ot').toLocaleString('ru-RU')} hint={t('pp.budget.thsTenge')} accent="green" />
        <KpiCard label={BUDGET_DIRECTIONS[1].label[lang]} value={byId('pb').toLocaleString('ru-RU')} hint={t('pp.budget.thsTenge')} accent="amber" />
        <KpiCard label={BUDGET_DIRECTIONS[2].label[lang]} value={byId('fire').toLocaleString('ru-RU')} hint={t('pp.budget.thsTenge')} accent="red" />
      </div>

      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge tone="blue">KMG-8</Badge>
            <h3 className="text-[15px] font-bold text-slate-700">{t('pp.form.kmg8')}</h3>
          </div>
          <a href="#" onClick={(e) => e.preventDefault()} className="btn-ghost">
            <IconDownload width={16} height={16} />
            {t('pp.export')}
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="w-12 px-3 py-2.5">№</th>
                <th className="px-3 py-2.5">{t('pp.budget.direction')}</th>
                <th className="px-3 py-2.5 text-right">{t('pp.budget.plan')}</th>
                <th className="px-3 py-2.5 text-right">{t('pp.budget.fact')}</th>
                <th className="w-28 px-3 py-2.5 text-right">{t('pp.budget.exec')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const dir = BUDGET_DIRECTIONS.find((x) => x.id === r.id)!;
                const exec = Math.round((r.fact / r.plan) * 100);
                return (
                  <tr key={r.id} className="border-b border-slate-50 hover:bg-kmg-light/30">
                    <td className="px-3 py-2.5 font-semibold text-slate-400">{i + 1}</td>
                    <td className="px-3 py-2.5 font-medium text-slate-700">{dir.label[lang]}</td>
                    <td className="px-3 py-2.5 text-right text-slate-500">{r.plan.toLocaleString('ru-RU')}</td>
                    <td className="px-3 py-2.5 text-right font-bold text-slate-800">{r.fact.toLocaleString('ru-RU')}</td>
                    <td className="px-3 py-2.5 text-right">
                      <span className={`font-semibold ${exec >= 95 ? 'text-kmg-green' : exec >= 85 ? 'text-kmg-amber' : 'text-kmg-red'}`}>{exec}%</span>
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-slate-50 font-bold text-slate-800">
                <td className="px-3 py-3" />
                <td className="px-3 py-3 uppercase tracking-wide">{t('pp.budget.totalRow')}</td>
                <td className="px-3 py-3 text-right">{totalPlan.toLocaleString('ru-RU')}</td>
                <td className="px-3 py-3 text-right">{totalFact.toLocaleString('ru-RU')}</td>
                <td className="px-3 py-3 text-right text-kmg-blue">{Math.round((totalFact / totalPlan) * 100)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-400">{t('pp.budget.note')}</p>
      </Card>
    </div>
  );
}
