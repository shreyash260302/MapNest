import { motion } from 'framer-motion';
import { X, Phone, CheckCircle2, PlusCircle as CirclePlus } from 'lucide-react';
import { Address } from '@/types/address';
import { validatePhoneNumber } from '@/utils/validation';

interface AddressSelectionModalProps {
  show: boolean;
  onClose: () => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  addresses: Address[];
  onAddressSelect: (id: string) => void;
  onAddNew: () => void;
}

export const AddressSelectionModal = ({
  show,
  onClose,
  phoneNumber,
  setPhoneNumber,
  addresses,
  onAddressSelect,
  onAddNew
}: AddressSelectionModalProps) => {
  if (!show) return null;

  const filteredAddresses = addresses.filter(addr => addr.phone === phoneNumber);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="bg-white rounded-lg w-[90%] md:w-[400px] h-auto max-h-[90vh] overflow-hidden"
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Select Address</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Person Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="Enter 10-digit mobile number"
                maxLength={10}
              />
            </div>
          </div>

          {filteredAddresses.length > 0 ? (
            <div className="overflow-x-auto pb-4 mb-6">
              <div className="flex space-x-4" style={{ minWidth: "max-content" }}>
                {filteredAddresses.map((addr) => (
                  <motion.div
                    key={addr.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 border rounded-lg cursor-pointer transition-all flex-shrink-0 w-60 ${
                      addr.isSelected
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-orange-200"
                    }`}
                    onClick={() => onAddressSelect(addr.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {addr.saveAs || addr.type}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {addr.flatNo}, {addr.addressLine1}
                          {addr.addressLine2 && `, ${addr.addressLine2}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {addr.city}, {addr.state}, {addr.pincode}
                        </p>
                      </div>
                      {addr.isSelected && (
                        <CheckCircle2 className="h-5 w-5 text-orange-500 flex-shrink-0" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            phoneNumber &&
            validatePhoneNumber(phoneNumber) && (
              <div className="text-center py-6 text-gray-500">
                <p>No addresses found for this number</p>
              </div>
            )
          )}

          <button
            onClick={onAddNew}
            disabled={!validatePhoneNumber(phoneNumber)}
            className="flex items-center justify-center w-full py-3 text-orange-500 font-medium rounded-lg border border-orange-500 hover:bg-orange-50 transition-colors mb-4"
          >
            <CirclePlus className="h-5 w-5 mr-2" />
            Add New Address
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};