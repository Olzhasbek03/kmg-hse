import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { NAV } from '../nav';
import { Card } from '../components/ui';
import { IconPlay, IconDoc, IconQr, IconHelp, IconArrow } from '../components/icons';
import { incidents, korgauSummary } from '../data';

function FakeQR({ seed = 0 }: { seed?: number }) {
  const cells = Array.from({ length: 49 }, (_, i) => ((i * 7 + seed * 3 + (i % 5)) % 3 === 0 ? 1 : 0));
  return (
    <div className="grid h-16 w-16 grid-cols-7 gap-[2px] rounded-md bg-white p-1 ring-1 ring-slate-200">
      {cells.map((c, i) => (
        <div key={i} className={c ? 'bg-slate-800' : 'bg-transparent'} />
      ))}
    </div>
  );
}

export function Home() {
  const { t } = useI18n();
  const total = incidents.length;
  const korgauTotal = korgauSummary['Итого карточек'] ?? 39521;

  return (
    <div className="space-y-6">
      {/* Help block */}
      <Card>
        <div className="mb-1 flex items-start justify-between">
          <h2 className="text-xl font-extrabold text-kmg-red">{t('home.help.title')}</h2>
          <span className="text-kmg-blue">
            <IconHelp />
          </span>
        </div>
        <p className="mb-5 text-sm text-slate-500">{t('home.help.subtitle')}</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start gap-3 rounded-xl border border-slate-100 p-4 transition hover:border-kmg-blue/30 hover:shadow-card">
            <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-kmg-blue/10 text-kmg-blue">
              <IconPlay width={18} height={18} />
            </span>
            <div>
              <div className="font-bold text-slate-700">{t('home.video.title')}</div>
              <div className="text-sm text-slate-500">{t('home.video.desc')}</div>
              <button className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-kmg-blue">
                {t('common.watch')} <IconArrow width={14} height={14} />
              </button>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-slate-100 p-4 transition hover:border-kmg-blue/30 hover:shadow-card">
            <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-kmg-blue/10 text-kmg-blue">
              <IconDoc width={18} height={18} />
            </span>
            <div>
              <div className="font-bold text-slate-700">{t('home.doc.title')}</div>
              <div className="text-sm text-slate-500">{t('home.doc.desc')}</div>
              <button className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-kmg-blue">
                {t('common.open')} <IconArrow width={14} height={14} />
              </button>
            </div>
          </div>
        </div>

        {/* QR */}
        <div className="mt-4 rounded-xl border border-slate-100 p-4">
          <div className="mb-3 flex items-center gap-2">
            <IconQr width={18} height={18} className="text-kmg-blue" />
            <div>
              <div className="font-bold text-slate-700">{t('home.qr.title')}</div>
              <div className="text-sm text-slate-500">{t('home.qr.desc')}</div>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { qr: 1, title: t('home.qr.korgau'), desc: t('home.qr.korgauDesc'), to: '/korgau' },
              { qr: 2, title: t('home.qr.survey'), desc: t('home.qr.surveyDesc'), to: '/forms' },
            ].map((x) => (
              <div key={x.qr} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                <FakeQR seed={x.qr} />
                <div>
                  <div className="font-semibold text-slate-700">{x.title}</div>
                  <div className="text-xs text-slate-500">{x.desc}</div>
                  <Link to={x.to} className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-kmg-blue">
                    {t('home.goto')} <IconArrow width={14} height={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Banner */}
      <div className="bg-brand-anim relative overflow-hidden rounded-2xl p-6 text-white shadow-soft md:p-8">
        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 animate-float rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 animate-float rounded-full bg-cyan-300/10 blur-2xl [animation-delay:2s]" />
        <div className="relative flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
          <div className="max-w-3xl">
            <h2 className="text-xl font-extrabold md:text-2xl">{t('home.banner.title')}</h2>
            <p className="mt-2 text-sm text-cyan-50/90">{t('home.banner.desc')}</p>
            <Link
              to="/command"
              className="shimmer-sweep mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-kmg-blue shadow-sm transition-all duration-200 hover:shadow-lift active:scale-95"
            >
              {t('home.banner.cta')} <IconArrow width={16} height={16} />
            </Link>
          </div>
          <div className="stagger flex gap-6">
            <div className="text-center">
              <div className="text-3xl font-extrabold">{total}</div>
              <div className="text-xs text-cyan-100">{t('nav.incidents')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold">{Number(korgauTotal).toLocaleString()}</div>
              <div className="text-xs text-cyan-100">{t('nav.korgau')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold">12</div>
              <div className="text-xs text-cyan-100">{t('nav.groupModules')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modules grid */}
      <div>
        <h3 className="text-lg font-extrabold text-slate-800">{t('home.modules.title')}</h3>
        <p className="mb-4 text-sm text-slate-500">{t('home.modules.subtitle')}</p>
        <div className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {NAV.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className="card card-hover group flex items-start gap-3 p-4"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-kmg-blue/10 text-kmg-blue transition-all duration-300 group-hover:scale-110 group-hover:bg-kmg-blue group-hover:text-white">
                <m.icon />
              </span>
              <div>
                {m.codeKey && (
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300">{t(m.codeKey)}</div>
                )}
                <div className="font-bold leading-tight text-slate-700">{t(m.labelKey)}</div>
              </div>
              <IconArrow
                width={16}
                height={16}
                className="ml-auto mt-1 shrink-0 -translate-x-1 text-slate-300 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-kmg-blue group-hover:opacity-100"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
