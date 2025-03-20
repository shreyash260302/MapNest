import { LocationResult } from '@/types/address';

export class LocationService {
  static async searchLocation(query: string): Promise<LocationResult[]> {
    if (!query.trim()) {
      return [];
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&countrycodes=in&addressdetails=1`,
        {
          headers: {
            Accept: "application/json",
            "User-Agent": "Address Management App",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch location data");
      }

      const data = await response.json();
      return data.slice(0, 5);
    } catch (error) {
      console.error("Error searching location:", error);
      return [];
    }
  }

  static extractAddressComponents(location: LocationResult) {
    const address = location.address || {};
    const streetAddress = [address.road, address.suburb, address.neighbourhood]
      .filter(Boolean)
      .join(", ");

    return {
      streetAddress: streetAddress || location.display_name,
      city: address.city || address.town || "",
      state: address.state || "",
      pincode: address.pincode || "",
      neighbourhood: address.neighbourhood || address.suburb || ""
    };
  }
}