import { X, MapPin } from "lucide-react";
import { Address } from "@/types/address";

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
  onSearchLocation,
}: AddressFormModalProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[35%] 2xl:w-[30%] max-h-[85vh] h-auto mx-auto my-auto shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-3 flex justify-between items-center border-b">
          <h2 className="text-md font-semibold">
            {isEditing ? "Edit Address" : "Enter Address"}
          </h2>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col gap-3">
          {/* Contact Number */}
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
              className="w-full p-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Enter mobile number"
              maxLength={10}
            />
          </div>

          {/* Search Different Location */}
          <button
            onClick={onSearchLocation}
            className="flex items-center text-[#FF6B00] text-sm font-medium hover:underline"
          >
            <MapPin className="h-4 w-4 mr-1" />
            Search different location
          </button>

          {/* Flat Number */}
          <div>
            <label className="block text-sm font-medium mb-1">
               House/Flat No, Building Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={address.flatNo}
              placeholder="House/Flat No, Building Name"
              onChange={(e) =>
                setAddress({ ...address, flatNo: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
               Address Line 1<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={address.addressLine2}
              placeholder="Street Name, Area, Landmark"
              onChange={(e) =>
                setAddress({ ...address, addressLine2: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          {/* Selected Address */}
          <div className="border rounded-lg p-3 shadow-sm bg-gray-50 flex items-center text-sm">
            <span className="text-gray-600 mr-2"> <MapPin className="w-6 h-6 text-red-500" /></span>
            <p className="text-gray-800">
              {address.addressLine1}
              {/* {address.addressLine1},{address.addressLine2 && `${address.addressLine2}, `} */}
            </p>
          </div>

          {/* Save As Options */}
          <div>
            <label className="block text-sm font-medium mb-2">Save as</label>
            <div className="flex gap-2">
              {["Home", "Work", "Other"].map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    setAddress({ ...address, type, saveAs: type })
                  }
                  className={`px-3 py-1 rounded-full text-xs ${
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
                className="w-full p-2 border border-gray-300 rounded-lg text-sm mt-2"
                placeholder="Enter custom label"
              />
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="p-3 border-t">
          <button
            onClick={onSubmit}
            className="w-full py-2 bg-[#1a2b49] text-white rounded-lg font-medium text-sm hover:bg-[#14203a]"
          >
            {isEditing ? "Update Address" : "Save Address"}
          </button>
        </div>
      </div>
    </div>
  );
};
