import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useI18n, type Lang } from '../i18n';
import { NAV } from '../nav';
import {
  IconBell,
  IconMenu,
  IconChevronDown,
  IconHelp,
  IconUser,
  IconHome,
  IconGlobe,
} from './icons';

function LangSwitcher() {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const langs: Lang[] = ['kz', 'ru', 'en'];
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-white/90 transition-all duration-200 hover:bg-white/15 active:scale-95"
      >
        <IconGlobe width={16} height={16} />
        {t(`lang.${lang}`)}
        <IconChevronDown width={14} height={14} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-1 w-32 origin-top-right animate-slide-down overflow-hidden rounded-xl bg-white py-1 shadow-soft ring-1 ring-slate-100">
          {langs.map((l) => (
            <button
              key={l}
              onMouseDown={() => {
                setLang(l);
                setOpen(false);
              }}
              className={`flex w-full items-center px-4 py-2 text-sm font-medium transition-colors hover:bg-kmg-light ${
                l === lang ? 'text-kmg-blue' : 'text-slate-600'
              }`}
            >
              {t(`lang.${l}`)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Sidebar({ collapsed }: { collapsed: boolean }) {
  const { t } = useI18n();
  const groups: { key: string; titleKey: string; g: 'modules' | 'analytics' }[] = [
    { key: 'm', titleKey: 'nav.groupModules', g: 'modules' },
    { key: 'a', titleKey: 'nav.groupAnalytics', g: 'analytics' },
  ];

  const itemClass = (isActive: boolean) =>
    `group relative mb-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-gradient-to-r from-kmg-blue to-kmg-mid text-white shadow-soft'
        : 'text-slate-500 hover:translate-x-0.5 hover:bg-kmg-light hover:text-kmg-blue'
    }`;

  return (
    <aside
      className={`fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] overflow-y-auto border-r border-slate-200 bg-white/90 backdrop-blur transition-[width] duration-300 ease-out ${
        collapsed ? 'w-[68px]' : 'w-64'
      }`}
    >
      <nav className="px-2 py-3">
        <NavLink to="/home" title={t('nav.home')} className={({ isActive }) => itemClass(isActive)}>
          {({ isActive }) => (
            <>
              {isActive && <span className="absolute left-0 top-1/2 h-6 -translate-y-1/2 w-1 rounded-r-full bg-white/90" />}
              <IconHome className="shrink-0 transition-transform duration-200 group-hover:scale-110" width={20} height={20} />
              {!collapsed && <span className="truncate">{t('nav.home')}</span>}
            </>
          )}
        </NavLink>

        {groups.map((grp) => (
          <div key={grp.key} className="mt-3">
            {!collapsed && (
              <div className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                {t(grp.titleKey)}
              </div>
            )}
            {NAV.filter((n) => n.group === grp.g).map((item) => (
              <NavLink key={item.to} to={item.to} title={t(item.labelKey)} className={({ isActive }) => itemClass(isActive)}>
                {({ isActive }) => (
                  <>
                    {isActive && <span className="absolute left-0 top-1/2 h-6 -translate-y-1/2 w-1 rounded-r-full bg-white/90" />}
                    <item.icon className="shrink-0 transition-transform duration-200 group-hover:scale-110" width={20} height={20} />
                    {!collapsed && <span className="truncate">{t(item.labelKey)}</span>}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}

export function Layout() {
  const { t } = useI18n();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-hero">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-40 h-16 bg-brand-anim shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-black/10" />
        <div className="relative flex h-full items-center justify-between gap-3 px-3 md:px-5">
          <div className="flex min-w-0 items-center gap-2">
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/90 transition-all duration-200 hover:bg-white/15 active:scale-90"
              aria-label="Toggle sidebar"
            >
              <IconMenu width={20} height={20} />
            </button>
            <Link to="/home" className="min-w-0 truncate text-[14px] font-bold tracking-wide text-white transition-opacity hover:opacity-90 sm:text-[15px] lg:text-lg">
              {t('app.title')}
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 md:gap-3">
            <LangSwitcher />
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-white/90 transition-all duration-200 hover:bg-white/15 active:scale-90">
              <IconBell width={20} height={20} />
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
              </span>
            </button>
            <div className="flex items-center gap-2 pl-1">
              <div className="hidden text-right sm:block">
                <div className="text-sm font-bold leading-tight text-white">«Елена Бриккманн»</div>
                <div className="text-[11px] leading-tight text-white/70">{t('common.logout')}</div>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/20 transition-transform duration-200 hover:scale-105">
                <IconUser width={20} height={20} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <Sidebar collapsed={collapsed} />

      <main
        className={`min-h-[calc(100vh-4rem)] pt-16 transition-[padding] duration-300 ease-out ${
          collapsed ? 'pl-[68px]' : 'pl-64'
        }`}
      >
        <div key={location.pathname} className="mx-auto max-w-[1400px] animate-fade-up px-4 py-6 md:px-8">
          <Outlet />
        </div>
        <footer className="mt-6 border-t border-slate-200 bg-white/60 px-8 py-5">
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-8 text-xs font-semibold tracking-wide text-slate-400 md:justify-between">
            <span className="cursor-pointer transition-colors hover:text-kmg-blue">{t('footer.info')}</span>
            <span className="cursor-pointer transition-colors hover:text-kmg-blue">{t('footer.contacts')}</span>
            <span className="cursor-pointer transition-colors hover:text-kmg-blue">{t('footer.complaints')}</span>
            <span className="text-slate-300">© 2026 {t('app.company')} · hse.kmg.kz</span>
          </div>
        </footer>
      </main>

      {/* floating help */}
      <button className="group fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-kmg-blue px-4 py-3 text-sm font-semibold text-white shadow-soft transition-all duration-200 hover:bg-kmg-dark hover:shadow-lift active:scale-95">
        <span className="absolute inset-0 -z-10 rounded-full bg-kmg-blue/40 animate-ring-pulse" />
        <IconHelp width={18} height={18} className="transition-transform duration-300 group-hover:rotate-12" />
        <span className="hidden sm:inline">{t('common.questions')}</span>
      </button>
    </div>
  );
}
