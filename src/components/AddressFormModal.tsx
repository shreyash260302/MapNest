import { X, MapPin } from 'lucide-react';
import { Address } from '@/types/address';

interface AddressFormModalProps {
  show: boolean;
  onClose: () => void;
  address: Address;
  setAddress: (address: Address) => void;
  isEditing: boolean;
  onSubmit: () => void;
  onSearchLocation: () => void;
}

export const AddressFormModal = ({
  show,
  onClose,
  address,
  setAddress,
  isEditing,
  onSubmit,
  onSearchLocation
}: AddressFormModalProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[35%] 2xl:w-[30%] max-h-[90vh] h-auto mx-auto my-auto transform -translate-y-1/2 top-1/2 absolute left-0 right-0 flex flex-col justify-between overflow-hidden">
        <div className="p-4 flex flex-col h-full max-h-[90vh]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {isEditing ? "Edit Address" : "Enter Address"}
            </h2>
            <button onClick={onClose}>
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4 flex-grow px-2 overflow-y-auto max-h-[65vh] pr-2">
            <div>
              <label className="block text-sm font-medium mb-1">
                Contact Person Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={address.phone}
                onChange={(e) =>
                  setAddress({ ...address, phone: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                placeholder="Enter mobile number"
                maxLength={10}
              />
            </div>

            <button
              onClick={onSearchLocation}
              className="flex items-center text-[#FF6B00] text-sm font-medium"
            >
              <MapPin className="h-4 w-4 mr-1" />
              Search different location
            </button>

            <div>
              <label className="block text-sm font-medium mb-1">
                Flat no. <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={address.flatNo}
                onChange={(e) =>
                  setAddress({ ...address, flatNo: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Address Line 1 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={address.addressLine1}
                onChange={(e) =>
                  setAddress({ ...address, addressLine1: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Address Line 2
              </label>
              <input
                type="text"
                value={address.addressLine2}
                onChange={(e) =>
                  setAddress({ ...address, addressLine2: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={address.state}
                  onChange={(e) =>
                    setAddress({ ...address, state: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Pincode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={address.pincode}
                onChange={(e) =>
                  setAddress({ ...address, pincode: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Save as*</label>
              <div className="flex gap-3 mb-2">
                {["Home", "Work", "Other"].map((type) => (
                  <button
                    key={type}
                    onClick={() =>
                      setAddress({ ...address, type, saveAs: type })
                    }
                    className={`px-4 py-2 rounded-full text-sm ${
                      address.type === type
                        ? "bg-[#FF6B00] text-white"
                        : "border border-gray-300"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {address.type === "Other" && (
                <input
                  type="text"
                  value={address.saveAs}
                  onChange={(e) =>
                    setAddress({ ...address, saveAs: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                  placeholder="Enter custom label"
                />
              )}
            </div>
          </div>

          <div className="p-4 border-t bg-white">
            <button
              onClick={onSubmit}
              className="w-full py-3 bg-[#1a2b49] text-white rounded-lg font-medium text-sm"
            >
              {isEditing ? "Update Address" : "Save Address"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};