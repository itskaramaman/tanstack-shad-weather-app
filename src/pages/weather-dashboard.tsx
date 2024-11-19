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

  console.log(weatherQuery.isFetching);

  //   if (!weather)
  return (
    <div className="space-y-4">
      {/* Favourite cities */}
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

      <div>
        <div>
          <CurrentWeather
            data={weatherQuery.data}
            locationName={locationName}
          />
          {/* Current Weather */}
          {/* Hourly Temp */}
        </div>
        <div>
          {/* details */}
          {/* forecast */}
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
