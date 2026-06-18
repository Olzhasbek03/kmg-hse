import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { PageHeader } from '../components/ui';
import { IconArrow, IconFactory, IconFire, IconTruck, IconUsers, IconDashboard } from '../components/icons';
import { GROUPS, dzosByGroup, type GroupId } from '../data/passport';

const GROUP_ICON = {
  production: IconFire,
  refining: IconFactory,
  transport: IconTruck,
  oilservice: IconUsers,
} as const;

export function Passport() {
  const { t, lang } = useI18n();
  const totalDzo = GROUPS.reduce((s, g) => s + dzosByGroup(g.id).length, 0);

  return (
    <div>
      <PageHeader
        title={t('nav.passport')}
        subtitle={t('pp.subtitle')}
        breadcrumb={t('nav.home')}
        actions={
          <Link to="/passport/compare" className="btn-primary">
            <IconDashboard width={16} height={16} />
            {t('pp.compare.title')}
          </Link>
        }
      />

      <div className="stagger grid gap-5 sm:grid-cols-2">
        {GROUPS.map((g) => {
          const list = dzosByGroup(g.id);
          const workers = list.reduce((s, d) => s + d.workers, 0);
          const nm = list.reduce((s, d) => s + d.nearMiss, 0);
          const Icon = GROUP_ICON[g.id as GroupId];
          return (
            <Link key={g.id} to={`/passport/${g.id}`} className="card card-hover group relative overflow-hidden p-6">
              <span className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-kmg-blue/5 transition-transform duration-500 group-hover:scale-150" />
              <div className="relative flex items-start gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-kmg-blue to-kmg-mid text-white shadow-soft transition-transform duration-300 group-hover:scale-110">
                  <Icon width={26} height={26} />
                </span>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    {t('pp.group')} {g.no}
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-800">{g.name[lang]}</h3>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {list.length} {t('pp.dzoCount')}
                  </p>
                </div>
                <IconArrow
                  width={20}
                  height={20}
                  className="ml-auto shrink-0 -translate-x-1 text-slate-300 transition-all duration-300 group-hover:translate-x-0 group-hover:text-kmg-blue"
                />
              </div>
              <div className="relative mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 px-4 py-3">
                  <div className="text-lg font-extrabold text-kmg-blue">{workers.toLocaleString('ru-RU')}</div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{t('pp.kpi.workers')}</div>
                </div>
                <div className="rounded-xl bg-slate-50 px-4 py-3">
                  <div className="text-lg font-extrabold text-kmg-green">{nm.toLocaleString('ru-RU')}</div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{t('pp.kpi.nearmiss')}</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">
        {GROUPS.length} {t('pp.group').toLowerCase()} · {totalDzo} {t('pp.dzoCount')}
      </p>
    </div>
  );
}
