export const validatePhoneNumber = (number: string): boolean => {
  if (!number) return false;
  if (!/^\d+$/.test(number)) return false;
  return number.length === 10;
};

export const validateAddress = (address: {
  flatNo: string;
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
}): boolean => {
  return !!(
    address.flatNo &&
    address.addressLine1 &&
    address.city &&
    address.state &&
    address.pincode
  );
};