import type { ComponentType, ReactNode, SVGProps } from 'react';
import { Link } from 'react-router-dom';
import { IconChevronLeft } from './icons';

export function PageHeader({
  title,
  subtitle,
  breadcrumb,
  actions,
  backTo,
}: {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
  actions?: ReactNode;
  backTo?: string;
}) {
  return (
    <div className="mb-6">
      {breadcrumb && (
        <div className="mb-2 text-sm text-slate-400">
          <Link to="/home" className="hover:text-kmg-blue">
            {breadcrumb}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-500">{title}</span>
        </div>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {backTo && (
            <Link
              to={backTo}
              className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-white text-kmg-blue shadow-card"
            >
              <IconChevronLeft />
            </Link>
          )}
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 md:text-[28px]">{title}</h1>
            {subtitle && <p className="mt-1 max-w-3xl text-sm text-slate-500">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

const accentMap: Record<string, string> = {
  blue: 'border-l-kmg-blue',
  green: 'border-l-kmg-green',
  amber: 'border-l-kmg-amber',
  red: 'border-l-kmg-red',
};
const accentText: Record<string, string> = {
  blue: 'text-kmg-blue',
  green: 'text-kmg-green',
  amber: 'text-kmg-amber',
  red: 'text-kmg-red',
};
const accentBg: Record<string, string> = {
  blue: 'bg-kmg-blue/10 text-kmg-blue',
  green: 'bg-kmg-green/10 text-kmg-green',
  amber: 'bg-kmg-amber/10 text-kmg-amber',
  red: 'bg-kmg-red/10 text-kmg-red',
};

export function KpiCard({
  label,
  value,
  hint,
  accent = 'blue',
  icon: Icon,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  accent?: 'blue' | 'green' | 'amber' | 'red';
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
}) {
  return (
    <div className={`card card-hover group border-l-4 ${accentMap[accent]} p-4`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</div>
          <div className={`mt-1 text-2xl font-extrabold ${accentText[accent]}`}>{value}</div>
          {hint && <div className="mt-0.5 text-[11px] text-slate-400">{hint}</div>}
        </div>
        {Icon && (
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${accentBg[accent]} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
          >
            <Icon />
          </div>
        )}
      </div>
    </div>
  );
}

export function Card({
  title,
  children,
  className = '',
  action,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div className={`card p-5 ${className}`}>
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-slate-700">{title}</h3>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = 'slate',
}: {
  children: ReactNode;
  tone?: 'slate' | 'blue' | 'green' | 'amber' | 'red';
}) {
  const map: Record<string, string> = {
    slate: 'bg-slate-100 text-slate-600',
    blue: 'bg-kmg-blue/10 text-kmg-blue',
    green: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    red: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${map[tone]}`}>
      {children}
    </span>
  );
}

export function EmptyHint({ text }: { text: string }) {
  return <span className="text-slate-300">{text}</span>;
}
