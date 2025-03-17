import { useState, useEffect } from 'react';
import { X, MapPin } from 'lucide-react';
import { LocationResult } from '@/types/address';
import { LocationService } from '@/services/locationService';

interface LocationModalProps {
  show: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onLocationSelect: (location: LocationResult) => void;
}

export const LocationModal = ({
  show,
  onClose,
  searchQuery,
  setSearchQuery,
  onLocationSelect
}: LocationModalProps) => {
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery) {
        const results = await LocationService.searchLocation(searchQuery);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-[90%] md:w-[400px] mx-auto my-auto transform -translate-y-1/2 top-1/2 absolute left-0 right-0">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Select Location</h2>
            <button onClick={onClose}>
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="mb-4">
            <img
              src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/72.8777,19.0760,13,0/400x200?access_token=pk.eyJ1Ijoic2hyZXlhc2gyNiIsImEiOiJjbTZzeHNoMXkwYWN1MmlzbWFxejV2c3p1In0.cm0A3yJrtktEtIaeIHDbzw"
              alt="Map"
              className="w-full h-40 rounded-lg object-cover mb-4"
              referrerPolicy="no-referrer"
            />
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search address*"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            {searchResults.length > 0 && (
              <div className="mt-2 border-t pt-2 max-h-40 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedLocation(result);
                      onLocationSelect(result);
                    }}
                    className="w-full text-left p-3 hover:bg-gray-50 text-sm"
                  >
                    {result.display_name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => selectedLocation && onLocationSelect(selectedLocation)}
            disabled={!selectedLocation}
            className={`w-full py-3 rounded-lg font-medium text-sm ${
              selectedLocation
                ? "bg-[#1a2b49] text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
};