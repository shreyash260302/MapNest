import { create } from 'zustand';
import { Address } from '@/types/address';

interface AddressState {
  addresses: Address[];
  selectedAddressId: string | null;
  setAddresses: (addresses: Address[]) => void;
  addAddress: (address: Address) => void;
  updateAddress: (address: Address) => void;
  deleteAddress: (id: string) => void;
  selectAddress: (id: string) => void;
}

export const useAddressStore = create<AddressState>((set) => ({
  addresses: [],
  selectedAddressId: null,
  setAddresses: (addresses) => set({ addresses }),
  addAddress: (address) => set((state) => ({ 
    addresses: [...state.addresses, address] 
  })),
  updateAddress: (address) => set((state) => ({
    addresses: state.addresses.map((addr) => 
      addr.id === address.id ? address : addr
    )
  })),
  deleteAddress: (id) => set((state) => ({
    addresses: state.addresses.filter((addr) => addr.id !== id)
  })),
  selectAddress: (id) => set((state) => ({
    selectedAddressId: id,
    addresses: state.addresses.map((addr) => ({
      ...addr,
      isSelected: addr.id === id
    }))
  }))
}));