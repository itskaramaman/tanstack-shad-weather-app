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
import { Loader2, Search } from "lucide-react";
import { useLocationSearch } from "../hooks/use-weather";
import { useNavigate } from "react-router-dom";

const CitySearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const { data: locations, isLoading } = useLocationSearch(query);
  console.log(locations);

  const handleSelect = (cityData: string) => {
    const [lat, lon, name, country] = cityData.split("|");
    setOpen(false);

    // add to search history
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
          <CommandGroup heading="Favourites">
            <CommandItem>Calendar</CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Recent Searches">
            <CommandItem>Calendar</CommandItem>
          </CommandGroup>

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
