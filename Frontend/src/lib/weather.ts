import { getCountyCoordinates } from "@/data/countyCoordinates";

export type WeatherActionStatus = "good" | "watch" | "delay";
export type WeatherSeverity = "calm" | "watch" | "risk";

export interface DailyWeather {
  date: string;
  code: number;
  minTemp: number;
  maxTemp: number;
  precipitationMm: number;
  rainProbability: number;
  windSpeed: number;
  sunshineHours: number;
}

export interface FarmWeatherAction {
  label: string;
  status: WeatherActionStatus;
  message: string;
}

export interface FarmWeatherInsight {
  headline: string;
  summary: string;
  severity: WeatherSeverity;
  actions: FarmWeatherAction[];
  diseaseRisk: string;
}

export interface WeatherForecast {
  county: string;
  generatedAt: string;
  current: {
    temperature: number;
    apparentTemperature: number;
    humidity: number;
    precipitation: number;
    windSpeed: number;
    code: number;
    description: string;
  };
  daily: DailyWeather[];
  insight: FarmWeatherInsight;
}

interface OpenMeteoResponse {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  hourly?: {
    relative_humidity_2m?: number[];
    precipitation_probability?: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
    sunshine_duration: number[];
  };
}

const WEATHER_CODE_LABELS: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  56: "Freezing drizzle",
  57: "Freezing drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  66: "Freezing rain",
  67: "Freezing rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Light showers",
  81: "Showers",
  82: "Heavy showers",
  85: "Snow showers",
  86: "Snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Thunderstorm with hail",
};

export function describeWeatherCode(code: number): string {
  return WEATHER_CODE_LABELS[code] ?? "Mixed weather";
}

function round(value: number): number {
  return Math.round(value);
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function makeAction(
  label: string,
  status: WeatherActionStatus,
  message: string,
): FarmWeatherAction {
  return { label, status, message };
}

function buildInsight(daily: DailyWeather[], hourly?: OpenMeteoResponse["hourly"]): FarmWeatherInsight {
  const today = daily[0];
  const tomorrow = daily[1] ?? today;
  const nextThreeDays = daily.slice(0, 3);
  const nextTwoDays = daily.slice(0, 2);
  const nextWeekRain = daily.reduce((sum, day) => sum + day.precipitationMm, 0);
  const heavyRainDay = daily.find(
    (day) => day.precipitationMm >= 18 || day.rainProbability >= 80,
  );
  const drySpell = nextThreeDays.every(
    (day) => day.precipitationMm < 2 && day.rainProbability < 35,
  );
  const windyToday = today.windSpeed >= 28;
  const wetSoon =
    today.precipitationMm >= 5 ||
    tomorrow.precipitationMm >= 5 ||
    today.rainProbability >= 60 ||
    tomorrow.rainProbability >= 60;
  const humidNextDay = average(hourly?.relative_humidity_2m?.slice(0, 24) ?? []) >= 78;
  const rainChanceNextDay = average(hourly?.precipitation_probability?.slice(0, 24) ?? []) >= 50;

  let headline = "Good field-work window";
  let summary = "Conditions look workable. Keep normal scouting and watering checks active.";
  let severity: WeatherSeverity = "calm";

  if (heavyRainDay) {
    headline = "Heavy rain risk ahead";
    summary = `${round(heavyRainDay.precipitationMm)} mm may fall on ${formatDayLabel(
      heavyRainDay.date,
    )}. Prioritize drainage and delay chemical spraying.`;
    severity = "risk";
  } else if (drySpell) {
    headline = "Dry spell building";
    summary = "Rain looks limited for the next few days. Protect young crops with planned irrigation.";
    severity = "watch";
  } else if (wetSoon) {
    headline = "Rain is likely soon";
    summary = "Use the moisture for planting or top dressing, but avoid spraying before showers.";
    severity = "watch";
  }

  const actions: FarmWeatherAction[] = [
    wetSoon
      ? makeAction("Planting", "good", "Soil moisture should improve within 48 hours.")
      : drySpell
        ? makeAction("Planting", "watch", "Plant only where irrigation is available.")
        : makeAction("Planting", "good", "Conditions are balanced for land preparation."),
    wetSoon || windyToday
      ? makeAction("Spraying", "delay", windyToday ? "Wind may cause drift." : "Rain may wash chemicals away.")
      : makeAction("Spraying", "good", "Low rain and wind risk today."),
    drySpell
      ? makeAction("Irrigation", "good", "Water early morning or evening to reduce loss.")
      : wetSoon
        ? makeAction("Irrigation", "delay", "Skip watering and use expected rainfall.")
        : makeAction("Irrigation", "watch", "Check soil moisture before watering."),
    nextTwoDays.every((day) => day.precipitationMm < 3 && day.rainProbability < 45)
      ? makeAction("Harvest", "good", "A dry window should help handling and storage.")
      : makeAction("Harvest", "watch", "Harvest early and keep produce covered."),
  ];

  const diseaseRisk =
    humidNextDay && rainChanceNextDay
      ? "High fungal disease pressure. Scout tomatoes, potatoes, and beans closely."
      : wetSoon
        ? "Moderate disease pressure after rain. Watch lower leaves and dense crop canopies."
        : "Low to moderate disease pressure. Keep routine scouting active.";

  return {
    headline,
    summary: `${summary} Expected 7-day rainfall: ${round(nextWeekRain)} mm.`,
    severity,
    actions,
    diseaseRisk,
  };
}

export function formatDayLabel(date: string): string {
  return new Intl.DateTimeFormat("en-KE", {
    weekday: "short",
    day: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

export async function fetchWeatherForecast(
  county: string,
  signal?: AbortSignal,
): Promise<WeatherForecast> {
  const { latitude, longitude } = getCountyCoordinates(county);
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m",
    hourly: "relative_humidity_2m,precipitation_probability",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,sunshine_duration",
    forecast_days: "7",
    timezone: "auto",
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error("Could not load weather forecast");
  }

  const data = (await response.json()) as OpenMeteoResponse;
  const daily = data.daily.time.map((date, index) => ({
    date,
    code: data.daily.weather_code[index],
    minTemp: round(data.daily.temperature_2m_min[index]),
    maxTemp: round(data.daily.temperature_2m_max[index]),
    precipitationMm: data.daily.precipitation_sum[index],
    rainProbability: data.daily.precipitation_probability_max[index],
    windSpeed: round(data.daily.wind_speed_10m_max[index]),
    sunshineHours: Math.round((data.daily.sunshine_duration[index] / 3600) * 10) / 10,
  }));

  return {
    county,
    generatedAt: data.current.time,
    current: {
      temperature: round(data.current.temperature_2m),
      apparentTemperature: round(data.current.apparent_temperature),
      humidity: round(data.current.relative_humidity_2m),
      precipitation: data.current.precipitation,
      windSpeed: round(data.current.wind_speed_10m),
      code: data.current.weather_code,
      description: describeWeatherCode(data.current.weather_code),
    },
    daily,
    insight: buildInsight(daily, data.hourly),
  };
}

export function getCropWeatherAdvice(cropName: string, forecast?: WeatherForecast): string {
  if (!forecast) return "Weather advice will appear when the forecast is available.";

  const name = cropName.toLowerCase();
  const wetSoon = forecast.daily
    .slice(0, 3)
    .some((day) => day.precipitationMm >= 5 || day.rainProbability >= 60);
  const drySpell = forecast.daily
    .slice(0, 3)
    .every((day) => day.precipitationMm < 2 && day.rainProbability < 35);
  const humid = forecast.current.humidity >= 78;

  if ((name.includes("tomato") || name.includes("potato")) && (wetSoon || humid)) {
    return `${cropName} may face higher blight pressure. Keep spacing open and scout lower leaves after rain.`;
  }

  if (name.includes("bean") && wetSoon) {
    return "Beans can benefit from incoming rain, but avoid spraying before showers and watch for leaf spots.";
  }

  if (name.includes("maize") && drySpell) {
    return "Maize establishment may be uneven without moisture. Plant after rain or irrigate the seedbed.";
  }

  if (drySpell) {
    return `${cropName} will need moisture planning this week. Prioritize mulch, early watering, and soil checks.`;
  }

  if (wetSoon) {
    return `${cropName} has useful rainfall coming. Prepare fields now and keep fertilizer away from heavy downpours.`;
  }

  return `${cropName} conditions look workable. Keep monitoring wind before spraying and soil moisture before irrigation.`;
}
