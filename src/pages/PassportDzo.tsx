import { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useI18n } from '../i18n';
import { PageHeader, KpiCard, Card, Badge } from '../components/ui';
import { IconUsers, IconAlert, IconShield, IconDownload, IconFactory } from '../components/icons';
import {
  findDzo,
  groupOf,
  FORMS,
  rowValue,
  budgetFor,
  BUDGET_DIRECTIONS,
  type FormDef,
} from '../data/passport';
import { DECLARATIONS } from '../data/dpb';

const PERIOD_KEY: Record<string, string> = {
  monthly: 'pp.period.monthly',
  quarterly: 'pp.period.quarterly',
  halfyear: 'pp.period.halfyear',
  yearly: 'pp.period.yearly',
};

function fmt(v: number | null): string {
  if (v == null) return '—';
  if (v === 0) return '0';
  return v.toLocaleString('ru-RU');
}

export function PassportDzo() {
  const { group, dzo } = useParams();
  const { t, lang } = useI18n();
  const d = findDzo(dzo);
  const [active, setActive] = useState<string>(FORMS[0].id);

  if (!d) return <Navigate to="/passport" replace />;
  const g = groupOf(d.group);
  const declaration = DECLARATIONS.find((x) => x.org === d.name.ru);

  const tabs = [...FORMS.map((f) => ({ id: f.id, code: f.code, key: f.titleKey })), { id: 'kmg8', code: 'KMG-8', key: 'pp.form.kmg8' }];
  const form: FormDef | undefined = FORMS.find((f) => f.id === active);

  return (
    <div>
      <PageHeader
        title={d.name[lang]}
        subtitle={`${g.name[lang]} · ${d.region[lang]}`}
        backTo={`/passport/${group}`}
        breadcrumb={`${t('nav.passport')} · ${g.name[lang]}`}
        actions={
          declaration && (
            <Link to={`/opo/declaration/${declaration.id}`} className="btn-ghost">
              <IconFactory width={16} height={16} />
              {t('pp.declaration')}
            </Link>
          )
        }
      />

      <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-5">
        <KpiCard label={t('pp.kpi.workers')} value={d.workers.toLocaleString('ru-RU')} accent="blue" icon={IconUsers} />
        <KpiCard label="LTIR" value={d.ltir.toFixed(3)} hint={t('pp.kpi.ltirHint')} accent={d.ltir > 0 ? 'amber' : 'green'} />
        <KpiCard label="FAR" value={d.far.toFixed(3)} accent={d.far > 0 ? 'red' : 'green'} />
        <KpiCard label={t('pp.kpi.ntr')} value={d.ntr} accent={d.ntr > 0 ? 'red' : 'green'} icon={IconAlert} />
        <KpiCard label="Near Miss" value={d.nearMiss} accent="green" icon={IconShield} />
      </div>

      {/* General info */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { l: t('pp.info.activity'), v: d.activity[lang] },
          { l: t('pp.info.parent'), v: d.parent },
          { l: t('pp.info.founded'), v: d.founded ? String(d.founded) : '—' },
          { l: t('pp.info.contractors'), v: String(d.contractors) },
        ].map((x) => (
          <div key={x.l} className="card p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{x.l}</div>
            <div className="mt-1 text-sm font-semibold text-slate-700">{x.v}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-200 active:scale-95 ${
              active === tab.id ? 'bg-kmg-blue text-white shadow-soft' : 'bg-white text-slate-500 shadow-card hover:text-kmg-blue'
            }`}
          >
            <span className={`text-[10px] font-bold ${active === tab.id ? 'text-white/70' : 'text-slate-300'}`}>{tab.code}</span>
            {t(tab.key)}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {active === 'kmg8' ? (
          <BudgetTab dzo={d} />
        ) : form ? (
          <FormTab dzo={d} form={form} />
        ) : null}
      </div>
    </div>
  );
}

function FormTab({ dzo, form }: { dzo: ReturnType<typeof findDzo>; form: FormDef }) {
  const { t } = useI18n();
  if (!dzo) return null;
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
              <th className="px-3 py-2.5 w-12">№</th>
              <th className="px-3 py-2.5">{t('pp.col.indicator')}</th>
              <th className="px-3 py-2.5 w-24">{t('pp.col.unit')}</th>
              <th className="px-3 py-2.5 w-36 text-right">{t('pp.col.current')}</th>
              <th className="px-3 py-2.5 w-32 text-right">{t('pp.col.prev')}</th>
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
                  <td className="px-3 py-2.5 text-right font-bold text-slate-800">{fmt(rowValue(dzo, form.id, row, false))}</td>
                  <td className="px-3 py-2.5 text-right text-slate-400">{fmt(rowValue(dzo, form.id, row, true))}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function BudgetTab({ dzo }: { dzo: ReturnType<typeof findDzo> }) {
  const { t, lang } = useI18n();
  if (!dzo) return null;
  const rows = budgetFor(dzo);
  const totalPlan = rows.reduce((s, r) => s + r.plan, 0);
  const totalFact = rows.reduce((s, r) => s + r.fact, 0);
  const byId = (id: string) => rows.find((r) => r.id === id)?.fact ?? 0;

  return (
    <div className="space-y-5">
      <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label={t('pp.budget.total')} value={`${totalFact.toLocaleString('ru-RU')}`} hint={t('pp.budget.thsTenge')} accent="blue" />
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
                <th className="px-3 py-2.5 w-12">№</th>
                <th className="px-3 py-2.5">{t('pp.budget.direction')}</th>
                <th className="px-3 py-2.5 text-right">{t('pp.budget.plan')}</th>
                <th className="px-3 py-2.5 text-right">{t('pp.budget.fact')}</th>
                <th className="px-3 py-2.5 w-28 text-right">{t('pp.budget.exec')}</th>
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
