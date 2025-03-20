export interface Address {
  id: string;
  type: string;
  phone: string;
  flatNo: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  saveAs: string;
  isSelected?: boolean;
}

export interface LocationResult {
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    state?: string;
    pincode?: string;
    road?: string;
    suburb?: string;
    neighbourhood?: string;
  };
}

// export interface GoogleMapsPlace {
//   address_components: Array<{
//     long_name: string;
//     short_name: string;
//     types: string[];
//   }>;
//   formatted_address: string;
// }
