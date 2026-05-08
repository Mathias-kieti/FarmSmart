import {
  AlertTriangle,
  CalendarCheck,
  CloudRain,
  Droplets,
  Gauge,
  Leaf,
  Sprout,
  Sun,
  ThermometerSun,
  Umbrella,
  Wind,
} from "lucide-react";
import { getCropWeatherAdvice, formatDayLabel, type WeatherForecast } from "@/lib/weather";
import { useWeather } from "@/hooks/useWeather";
import { cn } from "@/lib/utils";

const actionStyles = {
  good: "border-emerald-200 bg-emerald-50 text-emerald-900",
  watch: "border-amber-200 bg-amber-50 text-amber-900",
  delay: "border-rose-200 bg-rose-50 text-rose-900",
} as const;

const severityStyles = {
  calm: "bg-emerald-600 text-white",
  watch: "bg-amber-500 text-white",
  risk: "bg-rose-600 text-white",
} as const;

function WeatherSkeleton() {
  return (
    <section className="mb-8 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="h-72 rounded-2xl border border-border bg-card animate-pulse" />
      <div className="h-72 rounded-2xl border border-border bg-card animate-pulse" />
    </section>
  );
}

function WeatherUnavailable({ county }: { county: string }) {
  return (
    <section className="mb-8 rounded-2xl border border-dashed border-border bg-card p-5">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-bold">Weather unavailable for {county}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Farm recommendations still work. Live weather will return when the forecast service is reachable.
          </p>
        </div>
      </div>
    </section>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ThermometerSun;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/35 bg-white/70 p-3 shadow-sm backdrop-blur">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="mt-1 text-lg font-extrabold text-slate-950">{value}</p>
    </div>
  );
}

function ForecastStrip({ forecast }: { forecast: WeatherForecast }) {
  const maxRain = Math.max(...forecast.daily.map((day) => day.precipitationMm), 8);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            7-day outlook
          </p>
          <h3 className="text-lg font-bold">Rain and field access</h3>
        </div>
        <Umbrella className="h-5 w-5 text-sky-600" />
      </div>

      <div className="mt-5 grid grid-cols-7 gap-2">
        {forecast.daily.map((day) => {
          const height = Math.max(16, Math.round((day.precipitationMm / maxRain) * 88));
          const wet = day.rainProbability >= 60 || day.precipitationMm >= 5;

          return (
            <div key={day.date} className="flex min-w-0 flex-col items-center gap-2">
              <span className="text-[10px] font-semibold text-muted-foreground">
                {formatDayLabel(day.date).split(" ")[0]}
              </span>
              <div className="flex h-24 w-full items-end rounded-lg bg-muted/50 px-1.5 pb-1.5">
                <div
                  className={cn(
                    "w-full rounded-md",
                    wet ? "bg-sky-500" : "bg-emerald-500",
                  )}
                  style={{ height }}
                />
              </div>
              <span className="text-[10px] font-bold tabular-nums">
                {Math.round(day.precipitationMm)}mm
              </span>
              <span className="text-[10px] text-muted-foreground">{day.rainProbability}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function WeatherDecisionPanel({
  county,
  cropName,
  className,
  compact = false,
}: {
  county: string;
  cropName?: string;
  className?: string;
  compact?: boolean;
}) {
  const { forecast, loading, error } = useWeather(county);

  if (loading || forecast?.county !== county) return <WeatherSkeleton />;
  if (error || !forecast) return <WeatherUnavailable county={county} />;

  const cropAdvice = cropName ? getCropWeatherAdvice(cropName, forecast) : forecast.insight.diseaseRisk;

  return (
    <section className={cn("mb-8 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]", className)}>
      <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-[linear-gradient(135deg,#ecfccb_0%,#f0fdfa_45%,#eff6ff_100%)] shadow-sm">
        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1 text-xs font-bold text-emerald-800 shadow-sm">
                <Sun className="h-3.5 w-3.5" />
                Weather intelligence
              </p>
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                {forecast.current.temperature}°C in {forecast.county}
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-700">
                {forecast.current.description}. Feels like {forecast.current.apparentTemperature}°C.
              </p>
            </div>

            <div className="rounded-2xl bg-white/80 px-4 py-3 text-right shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Today</p>
              <p className="text-xl font-black text-slate-950">
                {forecast.daily[0].minTemp}° / {forecast.daily[0].maxTemp}°
              </p>
              <p className="text-xs text-slate-600">{forecast.daily[0].rainProbability}% rain</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Metric icon={CloudRain} label="Rain" value={`${Math.round(forecast.daily[0].precipitationMm)} mm`} />
            <Metric icon={Droplets} label="Humidity" value={`${forecast.current.humidity}%`} />
            <Metric icon={Wind} label="Wind" value={`${forecast.current.windSpeed} km/h`} />
            <Metric icon={Gauge} label="Sunshine" value={`${forecast.daily[0].sunshineHours}h`} />
          </div>

          <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-white shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn("rounded-full px-2.5 py-1 text-xs font-bold", severityStyles[forecast.insight.severity])}>
                {forecast.insight.severity}
              </span>
              <h3 className="text-lg font-bold">{forecast.insight.headline}</h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-white/80">{forecast.insight.summary}</p>
          </div>

          {!compact && (
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {forecast.insight.actions.map((action) => (
                <div
                  key={action.label}
                  className={cn("rounded-xl border p-3", actionStyles[action.status])}
                >
                  <p className="text-sm font-bold">{action.label}</p>
                  <p className="mt-1 text-xs leading-snug opacity-80">{action.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        <ForecastStrip forecast={forecast} />
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              {cropName ? <Sprout className="h-5 w-5" /> : <Leaf className="h-5 w-5" />}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {cropName ? `${cropName} weather note` : "Disease pressure"}
              </p>
              <p className="mt-1 text-sm font-semibold leading-relaxed">{cropAdvice}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
