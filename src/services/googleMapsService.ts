import { Loader } from '@googlemaps/js-api-loader';
import { GoogleMapsPlace } from '@/types/address';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export class GoogleMapsService {
  private static loader = new Loader({
    apiKey: GOOGLE_MAPS_API_KEY,
    version: "weekly",
    libraries: ["places"]
  });

  private static isInitialized = false;

  static async init() {
    if (this.isInitialized) return;
    
    try {
      await this.loader.load();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Google Maps:', error);
    }
  }

  static extractAddressComponents(place: GoogleMapsPlace) {
    const getComponent = (type: string, useShortName = false) => {
      const component = place.address_components.find(comp => 
        comp.types.includes(type)
      );
      return component ? (useShortName ? component.short_name : component.long_name) : '';
    };

    const streetNumber = getComponent('street_number');
    const route = getComponent('route');
    const streetAddress = [streetNumber, route].filter(Boolean).join(' ');

    return {
      streetAddress: streetAddress || place.formatted_address,
      city: getComponent('locality') || getComponent('administrative_area_level_2'),
      state: getComponent('administrative_area_level_1'),
      pincode: getComponent('postal_code'),
      neighbourhood: getComponent('sublocality_level_1') || getComponent('sublocality')
    };
  }
}