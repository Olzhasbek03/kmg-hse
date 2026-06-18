import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n, type Lang } from '../i18n';
import { IconGlobe, IconShield, IconUser } from '../components/icons';

export function Login() {
  const { t, lang, setLang } = useI18n();
  const nav = useNavigate();
  const [email, setEmail] = useState('e.brikkmann@kmg.kz');
  const [pwd, setPwd] = useState('demo');
  const langs: Lang[] = ['kz', 'ru', 'en'];

  return (
    <div className="bg-brand-anim relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-20 -top-20 h-96 w-96 animate-float rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] animate-float rounded-full bg-cyan-300/10 blur-3xl [animation-delay:1.5s]" />
        <div className="absolute left-1/3 top-1/4 h-72 w-72 animate-float rounded-full bg-kmg-mid/20 blur-3xl [animation-delay:3s]" />
      </div>

      <div className="absolute right-5 top-5 flex animate-fade-in gap-1">
        {langs.map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all duration-200 active:scale-95 ${
              l === lang ? 'bg-white text-kmg-blue shadow-soft' : 'text-white/80 hover:bg-white/15'
            }`}
          >
            {l === lang && <IconGlobe width={14} height={14} />}
            {t(`lang.${l}`)}
          </button>
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-10">
        <div className="mb-7 flex animate-fade-up flex-col items-center text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow md:text-4xl">{t('app.title')}</h1>
          <p className="mt-2 text-sm font-medium text-cyan-100">{t('app.ecosystem')}</p>
        </div>

        <div className="w-full max-w-md animate-scale-in rounded-3xl bg-white p-7 shadow-soft [animation-delay:0.1s]">
          <h2 className="text-xl font-extrabold text-slate-800">{t('login.welcome')}</h2>
          <p className="mt-1 text-sm text-slate-500">{t('login.subtitle')}</p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              nav('/home');
            }}
          >
            <div>
              <label className="label">{t('login.email')}</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <IconUser width={18} height={18} />
                </span>
                <input className="field pl-10" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="label">{t('login.password')}</label>
              <input type="password" className="field" value={pwd} onChange={(e) => setPwd(e.target.value)} />
            </div>
            <button type="submit" className="btn-primary w-full justify-center py-3 text-base">
              {t('login.signin')}
            </button>
            <button
              type="button"
              onClick={() => nav('/home')}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-kmg-blue/30 bg-kmg-light py-3 text-sm font-semibold text-kmg-blue transition hover:bg-kmg-blue/10"
            >
              <IconShield width={18} height={18} />
              {t('login.sso')}
            </button>
            <p className="text-center text-xs text-slate-400">{t('login.demo')}</p>
          </form>
        </div>

        <div className="stagger mt-7 flex flex-wrap items-center justify-center gap-3 text-center text-xs font-semibold text-white/90">
          <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur transition-colors hover:bg-white/20">{t('login.modules')}</span>
          <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur transition-colors hover:bg-white/20">{t('login.languages')}</span>
          <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur transition-colors hover:bg-white/20">{t('login.realtime')}</span>
        </div>
        <p className="mt-6 animate-fade-in text-xs text-white/60">© 2026 {t('app.company')} · hse.kmg.kz</p>
      </div>
    </div>
  );
}
