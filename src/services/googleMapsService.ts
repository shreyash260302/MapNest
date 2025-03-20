import { Loader } from "@googlemaps/js-api-loader";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export class GoogleMapsService {
  private static loader = new Loader({
    apiKey: GOOGLE_MAPS_API_KEY,
    version: "weekly",
    libraries: ["places"],
  });

  private static isInitialized = false;

  static async init() {
    if (this.isInitialized) return;
    try {
      await this.loader.load();
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize Google Maps:", error);
    }
  }

  static extractAddressComponents(place: google.maps.places.PlaceResult) {
    if (!place.address_components) {
      console.warn("Google API did not return address components:", place);
      return {
        streetAddress: place.formatted_address || "Unknown Address",
        addressLine2: "N/A",
        city: "N/A",
        state: "N/A",
        pincode: "N/A",
        fullAddress: place.formatted_address || "Unknown Address",
      };
    }
  
    const getComponent = (types: string[], useShortName = false) => {
      const component = place.address_components?.find((comp) =>
        comp.types.some((type) => types.includes(type))
      );
      return component ? (useShortName ? component.short_name : component.long_name) : "N/A";
    };
  
    const streetNumber = getComponent(["street_number"]);
    const route = getComponent(["route"]);
    const addressLine2 = getComponent(["sublocality_level_1", "sublocality", "neighborhood"]);
    const city = getComponent(["locality", "administrative_area_level_2"]);
    const state = getComponent(["administrative_area_level_1"]);
    
    let pincode = getComponent(["postal_code"]);
  
    // ✅ Fallback: Extract pincode from formatted_address if missing
    if (pincode === "N/A" && place.formatted_address) {
      const match = place.formatted_address.match(/\b\d{6}\b/); // Matches a 6-digit pincode
      if (match) {
        pincode = match[0];
      }
    }

    console.log("Extracted Pincode:", pincode); // ✅ Debugging Step 3

    const streetAddress = route && route !== "N/A" ? route : streetNumber || "";
    const fullAddress = place.formatted_address || "Unknown Address";
    
    console.log("streetAddress:", streetAddress);

    return {
      streetAddress: streetAddress || fullAddress,
      addressLine2: addressLine2 !== "N/A" ? addressLine2 : "", // Address Line 2 is Optional
      city,
      state,
      pincode,
      fullAddress,
    };
  }   
}
