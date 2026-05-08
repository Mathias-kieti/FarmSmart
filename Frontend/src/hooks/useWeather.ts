import { useEffect, useState } from "react";
import { fetchWeatherForecast, type WeatherForecast } from "@/lib/weather";

interface WeatherState {
  forecast: WeatherForecast | null;
  loading: boolean;
  error: string | null;
}

export function useWeather(county: string): WeatherState {
  const [state, setState] = useState<WeatherState>({
    forecast: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    setState((current) => ({
      forecast: current.forecast?.county === county ? current.forecast : null,
      loading: true,
      error: null,
    }));

    fetchWeatherForecast(county, controller.signal)
      .then((forecast) => {
        setState({ forecast, loading: false, error: null });
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setState({
          forecast: null,
          loading: false,
          error: error instanceof Error ? error.message : "Weather forecast unavailable",
        });
      });

    return () => controller.abort();
  }, [county]);

  return state;
}
