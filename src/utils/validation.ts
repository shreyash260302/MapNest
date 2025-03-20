export const validatePhoneNumber = (number: string): boolean => {
  if (!number) return false;
  if (!/^\d+$/.test(number)) return false;
  return number.length === 10;
};

export const validateAddress = (address: {
  phone: string;
  flatNo: string;
  addressLine1: string;
  city: string;
  state: string;
}): boolean => {
  return !!(
    address.phone.trim() &&
    address.flatNo.trim() &&
    address.addressLine1.trim() &&
    address.city.trim() &&
    address.state.trim()
  );
};