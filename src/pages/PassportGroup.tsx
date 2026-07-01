import { Link, useParams, Navigate, NavLink } from 'react-router-dom';
import { useI18n } from '../i18n';
import { PageHeader, Badge } from '../components/ui';
import { IconArrow } from '../components/icons';
import { GROUPS, dzosByGroup, groupOf, type GroupId } from '../data/passport';
import { liveDzoKpis } from '../data/passportIncidents';

function Mini({ value, label, tone = 'blue' }: { value: string; label: string; tone?: 'blue' | 'green' | 'red' | 'amber' }) {
  const map = { blue: 'text-kmg-blue', green: 'text-kmg-green', red: 'text-kmg-red', amber: 'text-kmg-amber' };
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2 text-center">
      <div className={`text-base font-extrabold ${map[tone]}`}>{value}</div>
      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</div>
    </div>
  );
}

export function PassportGroup() {
  const { group } = useParams();
  const { t, lang } = useI18n();
  const valid = GROUPS.some((g) => g.id === group);
  if (!valid) return <Navigate to="/passport" replace />;
  const g = groupOf(group as GroupId);
  const list = dzosByGroup(group as GroupId);

  return (
    <div>
      <PageHeader
        title={`${t('pp.group')} ${g.no} — ${g.name[lang]}`}
        subtitle={t('pp.group.subtitle')}
        backTo="/passport"
        breadcrumb={t('nav.passport')}
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {GROUPS.map((grp) => (
          <NavLink
            key={grp.id}
            to={`/passport/${grp.id}`}
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 active:scale-95 ${
                isActive ? 'bg-kmg-blue text-white shadow-soft' : 'bg-white text-slate-500 shadow-card hover:text-kmg-blue'
              }`
            }
          >
            {grp.no}. {grp.name[lang]}
          </NavLink>
        ))}
      </div>

      <div className="stagger grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {list.map((d) => {
          const live = liveDzoKpis(d);
          return (
          <Link key={d.id} to={`/passport/${g.id}/${d.id}`} className="card card-hover group flex flex-col p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-[15px] font-extrabold text-slate-800">{d.name[lang]}</h3>
                <p className="mt-0.5 truncate text-xs text-slate-500">{d.region[lang]}</p>
              </div>
              <Badge tone="blue">{d.short}</Badge>
            </div>
            <p className="mt-1 line-clamp-1 text-xs text-slate-400">{d.activity[lang]}</p>

            <div className="mt-4 grid grid-cols-4 gap-2">
              <Mini value={String(live.ntr)} label={t('pp.kpi.ntr')} tone={live.ntr > 0 ? 'red' : 'green'} />
              <Mini value={d.workers.toLocaleString('ru-RU')} label={t('pp.kpi.workers')} tone="blue" />
              <Mini value={live.ltir.toFixed(3)} label="LTIR" tone={live.ltir > 0 ? 'amber' : 'green'} />
              <Mini value={String(live.nearMiss)} label="Near Miss" tone="green" />
            </div>

            <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-kmg-blue opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {t('pp.open')} <IconArrow width={14} height={14} />
            </div>
          </Link>
          );
        })}
      </div>
    </div>
  );
}
