import { Address } from '@/types/address';
import { Edit2, Trash2, CheckCircle2 } from 'lucide-react';

interface AddressCardProps {
  address: Address;
  onSelect: (id: string) => void;
  onEdit: (address: Address, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export const AddressCard = ({
  address,
  onSelect,
  onEdit,
  onDelete
}: AddressCardProps) => {
  return (
    <div
      onClick={() => onSelect(address.id)}
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        address.isSelected
          ? "border-orange-500 bg-orange-50"
          : "border-gray-200 hover:border-orange-200"
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h2 className="text-sm font-medium text-gray-900 mb-1">
            {address.saveAs || address.type}
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            {address.flatNo}
          </p>
          {address.addressLine2 && (
            <p className="text-sm text-gray-500 leading-relaxed">
              {address.addressLine2}
            </p>
          )}
          <p className="text-sm text-gray-500">
          {address.addressLine1},{address.city}, {address.state}, {address.pincode}
          </p>
          <p className="text-sm text-gray-500 leading-relaxed">
            {address.phone}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={(e) => onEdit(address, e)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Edit2 className="h-4 w-4 text-[#FF6B00]" />
          </button>
          <button
            onClick={(e) => onDelete(address.id, e)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
        </div>
        {address.isSelected && (
          <CheckCircle2 className="h-5 w-5 text-orange-500 ml-2" />
        )}
      </div>
    </div>
  );
};