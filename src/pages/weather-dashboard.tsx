import { RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";
import useGeoLocation from "../hooks/use-geolocation";
import WeatherSkeleton from "../components/loading-skeleton";

const WeatherDashboard = () => {
  const {
    coordinates,
    error: locationError,
    isLoading: locationLoading,
    getLocation,
  } = useGeoLocation();

  console.log(coordinates);

  const handleRefresh = () => {
    getLocation();
    if (coordinates) {
      // reload weather data
    }
  };

  if (locationLoading) {
    return <WeatherSkeleton />;
  }

  if(locationError) {
    
  }
  return (
    <div className="space-y-4">
      {/* Favourite cities */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">My Location</h1>
        <Button variant="outline" size={"icon"} onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* current and hourly weather */}
    </div>
  );
};

export default WeatherDashboard;
