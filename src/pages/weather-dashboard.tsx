import { RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";
import CurrentWeather from "../components/current-weather";
import useGeoLocation from "../hooks/use-geolocation";
import WeatherSkeleton from "../components/loading-skeleton";
import {
  useForcastQuery,
  useReverseGeocodeQuery,
  useWeatherQuery,
} from "../hooks/use-weather";
import AppAlert from "../components/app-alert";
import HourlyTemperature from "../components/hourly-temperature";
import WeatherDetails from "../components/weather-details";
import WeatherForecast from "../components/weather-forecast";
import FavouriteCities from "../components/favourite-cities";

const WeatherDashboard = () => {
  const {
    coordinates,
    error: locationError,
    isLoading: locationLoading,
    getLocation,
  } = useGeoLocation();

  const locationQuery = useReverseGeocodeQuery(coordinates);
  const weatherQuery = useWeatherQuery(coordinates);
  const forcastQuery = useForcastQuery(coordinates);

  const handleRefresh = () => {
    getLocation();
    if (coordinates) {
      weatherQuery.refetch();
      forcastQuery.refetch();
      locationQuery.refetch();
      // reload weather data
    }
  };

  if (locationLoading) {
    return <WeatherSkeleton />;
  }

  if (locationError) {
    return (
      <AppAlert
        title="Location Error"
        description={locationError}
        onClick={getLocation}
      />
    );
  }

  if (!coordinates) {
    return (
      <AppAlert
        title="Location Required"
        description="Please enable location access to see your local weather."
        onClick={getLocation}
      />
    );
  }

  let locationName;
  if (locationQuery.data && Array.isArray(locationQuery.data)) {
    locationName = locationQuery.data?.[0];
  }

  if (weatherQuery.error || forcastQuery.error) {
    return (
      <AppAlert
        title="Error"
        description="Failed to fetch weather data. Please try again."
        onClick={getLocation}
      />
    );
  }

  if (!weatherQuery.data || !forcastQuery.data) {
    return <WeatherSkeleton />;
  }

  return (
    <div className="space-y-4">
      <FavouriteCities />
      <div className="flex items-center justify-between mt-2">
        <h1 className="text-xl font-bold tracking-tight">My Location</h1>
        <Button
          variant="outline"
          size={"icon"}
          onClick={handleRefresh}
          disabled={weatherQuery.isFetching || forcastQuery.isFetching}
        >
          <RefreshCw
            className={`h-4 w-4 ${
              weatherQuery.isFetching ? "animate-spin" : ""
            }`}
          />
        </Button>
      </div>

      <div className="grid gap-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <CurrentWeather
            data={weatherQuery.data}
            locationName={locationName}
          />
          <HourlyTemperature data={forcastQuery.data} />
        </div>
        <div className="grid gap-6 md:grid-cols-2 grid-cols-2">
          <WeatherDetails data={weatherQuery.data} />
          <WeatherForecast data={forcastQuery.data} />
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
