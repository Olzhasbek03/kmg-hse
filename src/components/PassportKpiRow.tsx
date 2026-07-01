import { useI18n } from '../i18n';

export interface PassportKpis {
  workers: number;
  far: number;
  ltir: number;
  mvcr: number;
  nonWorkCoeff: number;
  nearMiss: number;
  workStops: number;
}

function fmtNum(n: number, digits = 2): string {
  return n.toLocaleString('ru-RU', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

function BlueKpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-kmg-blue to-[#1a6fd4] px-4 py-3 text-center text-white shadow-soft">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-white/75">{label}</div>
      <div className="mt-1 text-xl font-extrabold">{value}</div>
    </div>
  );
}

export function PassportKpiRow({ kpis, className = '' }: { kpis: PassportKpis; className?: string }) {
  const { t } = useI18n();
  return (
    <div className={`stagger grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7 ${className}`}>
      <BlueKpi label={t('pp.kpi.workers')} value={kpis.workers.toLocaleString('ru-RU')} />
      <BlueKpi label="FAR" value={fmtNum(kpis.far)} />
      <BlueKpi label="LTIR" value={fmtNum(kpis.ltir)} />
      <BlueKpi label="MVCR" value={fmtNum(kpis.mvcr)} />
      <BlueKpi label={t('pp.kpi.nonWorkCoeff')} value={fmtNum(kpis.nonWorkCoeff)} />
      <BlueKpi label={t('pp.kpi.nearmiss')} value={String(kpis.nearMiss)} />
      <BlueKpi label={t('pp.kpi.workStops')} value={String(kpis.workStops)} />
    </div>
  );
}
