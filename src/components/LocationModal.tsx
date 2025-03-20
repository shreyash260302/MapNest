import { useState, useEffect, useRef } from "react";
import { X, MapPin } from "lucide-react";
import { LocationResult } from "@/types/address";
import { GoogleMapsService } from "@/services/googleMapsService";
import { Wrapper } from "@googlemaps/react-wrapper";

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
  onLocationSelect,
}: LocationModalProps) => {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationResult | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [currentPosition, setCurrentPosition] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 19.076, // Default (Mumbai, India)
    lng: 72.8777,
  });

  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const loadAutocomplete = async () => {
      await GoogleMapsService.init();

      if (autocompleteRef.current) {
        autocompleteRef.current = null;
      }

      if (inputRef.current) {
        autocompleteRef.current = new google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ["address"],
            componentRestrictions: { country: "IN" },
          }
        );

        autocompleteRef.current.addListener("place_changed", async () => {
          const place = autocompleteRef.current?.getPlace();
          if (place) {
            const formattedLocation =
              GoogleMapsService.extractAddressComponents(place);

            const locationData: LocationResult = {
              display_name: formattedLocation.fullAddress,
              address: formattedLocation,
            };

            setSearchQuery(formattedLocation.fullAddress);
            setSelectedLocation(locationData);
            setIsButtonDisabled(false);

            if (place.geometry?.location) {
              setCurrentPosition({
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              });
            }
          }
        });
      }
    };

    if (show) {
      setTimeout(loadAutocomplete, 100);
      setMapLoaded(false);
      setTimeout(() => setMapLoaded(true), 300);
    }
  }, [show]);


  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition( 
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCurrentPosition({ lat, lng });

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && Array.isArray(results) && results.length > 0) {
            const formattedLocation =
              GoogleMapsService.extractAddressComponents(results[0]);

            const locationData: LocationResult = {
              display_name: formattedLocation.fullAddress,
              address: formattedLocation,
            };

            setSearchQuery(formattedLocation.fullAddress);
            setSelectedLocation(locationData);

            setIsButtonDisabled(false);
          } else {
            console.error("Geocoder failed:", status);
          }
        });
      },
      (error) => console.error("Geolocation error:", error),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };
  
  const handleConfirm = () => {
    if (selectedLocation) {
      console.log("selectedLocation:", selectedLocation);
      onLocationSelect(selectedLocation);
      resetModal();
    }
  };

  const resetModal = () => {
    setSearchQuery("");
    setSelectedLocation(null);
    setIsButtonDisabled(true);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-[95%] md:w-[500px] p-6 shadow-lg relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Select Location</h2>
          <button onClick={resetModal}>
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Google Maps with Marker */}
        <div className="w-full h-52 rounded-lg overflow-hidden border mb-2">
          {mapLoaded && (
            <Wrapper
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
              version="weekly"
              libraries={["places"]}
            >
              <MapComponent
                position={currentPosition}
                onPositionChange={(newPos) => {
                  setCurrentPosition(newPos);
                  setIsButtonDisabled(false); // 🔹 Enable confirm button when marker moves
                }}
                setSearchQuery={setSearchQuery}
                setSelectedLocation={setSelectedLocation}
                setIsButtonDisabled={setIsButtonDisabled}
              />
            </Wrapper>
          )}
        </div>

        {/* Fetch Current Location */}
        <div className="flex mb-4 mt-4">
          <button
            onClick={fetchCurrentLocation}
            className="flex items-center gap-2 text-blue-600 font-medium text-sm cursor-pointer"
          >
            <MapPin className="h-4 w-4 text-blue-600" />
            Fetch Current Location
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mt-2">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search address*"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-sm"
          />
        </div>

        {/* Confirm Button */}
        <div className="border-t mt-4 pt-4">
          <button
            onClick={handleConfirm}
            disabled={isButtonDisabled}
            className={`w-full py-3 rounded-lg font-medium text-sm ${
              isButtonDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#1a2b49] text-white"
            }`}
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
};

const MapComponent = ({
  position,
  onPositionChange,
  setSearchQuery,
  setSelectedLocation,
  setIsButtonDisabled,
}: {  
  position: { lat: number; lng: number } | null;
  onPositionChange: (pos: { lat: number; lng: number }) => void;
  setSearchQuery: (query: string) => void;
  setSelectedLocation: (location: LocationResult) => void;
  setIsButtonDisabled: (disabled: boolean) => void;
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Default position (fallback to India Gate if no location is available)
    const defaultPosition = position || { lat: 28.6129, lng: 77.2295 };

    // Initialize Google Map
    const map = new google.maps.Map(mapRef.current, {
      center: defaultPosition,
      zoom: 15,
      disableDefaultUI: true,
      gestureHandling: "greedy",
      keyboardShortcuts: false,
    });

    // Initialize Marker
    const marker = new google.maps.Marker({
      position: defaultPosition,
      map,
      draggable: true,
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
      },
    });

    // Handle marker drag event
    marker.addListener("dragend", async () => {
      const newPos = marker.getPosition();
      if (!newPos) return;

      const latLng = { lat: newPos.lat(), lng: newPos.lng() };
      onPositionChange(latLng);

      // Reverse geocode to fetch address
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === "OK" && Array.isArray(results) && results.length > 0) {
          const formattedLocation = GoogleMapsService.extractAddressComponents(
            results[0]
          );

          const locationData: LocationResult = {
            display_name: formattedLocation.fullAddress,
            address: formattedLocation,
          };

          setSearchQuery(formattedLocation.fullAddress);
          setSelectedLocation(locationData);
          setIsButtonDisabled(false); // Enable confirm button
        }
      });
    });

    // Hide unwanted Google Maps UI elements
    setTimeout(() => {
      if (mapRef.current) {
        const styleElement = document.createElement("style");
        styleElement.innerHTML = `
          .gm-style-cc, .gmnoprint a, .gmnoprint span, .gm-style-mtc,
          a[href^="https://maps.google.com"], a[href^="https://www.google.com/maps"] {
            display: none !important;
            pointer-events: none !important;
            visibility: hidden !important;
          }
        `;
        mapRef.current.appendChild(styleElement);
      }
    }, 500);
  }, [position]);

  return <div ref={mapRef} className="w-full h-full" />;
};

export default MapComponent;
