import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
  CommandSeparator,
} from "./ui/command";
import { useState } from "react";
import { Button } from "./ui/button";
import { Clock, Search, Star, XCircle } from "lucide-react";
import { useLocationSearch } from "../hooks/use-weather";
import { useNavigate } from "react-router-dom";
import { useSearchHistory } from "../hooks/use-search-history";
import { format } from "date-fns";
import { useFavourite } from "../hooks/use-favourite";

const CitySearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const { data: locations, isLoading } = useLocationSearch(query);
  const { history, clearHistory, addToHistory } = useSearchHistory();
  const { favourites: favorites } = useFavourite();

  const handleSelect = (cityData: string) => {
    const [lat, lon, name, country] = cityData.split("|");
    setOpen(false);

    // add to search history
    addToHistory.mutate({
      query,
      name,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      country,
    });

    navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
      >
        <Search className="mr-2 h-4 w-4" />
        Search cities...
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search cities..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {query.length > 2 && !isLoading && (
            <CommandInput placeholder="Search cities..." />
          )}
          <CommandEmpty>No cities found.</CommandEmpty>
          {favorites.length > 0 && (
            <CommandGroup heading="Favourites">
              {favorites.map((location) => (
                <CommandItem
                  key={`${location.lon} ${location.lat}`}
                  value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                  onSelect={handleSelect}
                >
                  <Star className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>
                    {location.name}, {location.country}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {history.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup>
                <div className="flex items-center justify-between px-2 my-2">
                  <p className="text-xs text-muted-foreground">
                    Recent Searches
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearHistory.mutate()}
                  >
                    <XCircle className="h-4 w-4" />
                    Clear
                  </Button>
                </div>
                {history.map((location) => (
                  <CommandItem
                    key={`${location.lon} ${location.lat}`}
                    value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                    onSelect={handleSelect}
                  >
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      {location.name}, {location.country}
                    </span>
                    <span>{format(location.searchedAt, "MMM d, h:mm a")}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          <CommandSeparator />

          {locations && locations.length > 0 && (
            <CommandGroup heading="Suggestions">
              {locations.map((location) => (
                <CommandItem
                  key={`${location.lon} ${location.lat}`}
                  value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                  onSelect={handleSelect}
                >
                  <Search className="mr-2 h-4 w-4" />
                  <span>
                    {location.name}, {location.state}, {location.country}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default CitySearch;
