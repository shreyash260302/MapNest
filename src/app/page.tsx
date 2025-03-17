'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { PlusCircle as CirclePlus } from 'lucide-react';
import { Header } from '@/components/Header';
import { AddressCard } from '@/components/AddressCard';
import { useAddressStore } from '@/store/addressStore';
import { LocationService } from '@/services/locationService';
import { validatePhoneNumber, validateAddress } from '@/utils/validation';
import { Address, LocationResult } from '@/types/address';
import { AddressSelectionModal } from '@/components/AddressSelectionModal';
import { LocationModal } from '@/components/LocationModal';
import { AddressFormModal } from '@/components/AddressFormModal';

export default function Home() {
  const {
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    selectAddress
  } = useAddressStore();

  const [showAddressSelectionModal, setShowAddressSelectionModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newAddress, setNewAddress] = useState<Address>({
    id: '',
    type: 'Home',
    phone: '',
    flatNo: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    saveAs: '',
    isSelected: false,
  });

  const handlePhoneNumberChange = useCallback((value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length <= 10) {
      setPhoneNumber(digitsOnly);
    }
  }, []);

  const handleAddressSelect = useCallback((addressId: string) => {
    selectAddress(addressId);
    setShowAddressSelectionModal(false);
    toast.success('Address selected successfully');
  }, [selectAddress]);

  const handleEdit = useCallback((address: Address, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setNewAddress(address);
    setShowAddressModal(true);
  }, []);

  const handleDelete = useCallback((addressId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteAddress(addressId);
    toast.success('Address deleted successfully');
  }, [deleteAddress]);

  const handleLocationSelect = useCallback((location: LocationResult) => {
    const components = LocationService.extractAddressComponents(location);
    setNewAddress(prev => ({
      ...prev,
      phone: phoneNumber,
      addressLine1: components.streetAddress,
      city: components.city,
      state: components.state,
      pincode: components.pincode,
      addressLine2: components.neighbourhood,
    }));
    setShowLocationModal(false);
    setShowAddressModal(true);
    setSearchQuery('');
  }, [phoneNumber]);

  const handleAddAddress = useCallback(() => {
    if (validateAddress(newAddress)) {
      if (isEditing) {
        updateAddress(newAddress);
        toast.success('Address updated successfully');
      } else {
        const newId = Math.random().toString(36).substr(2, 9);
        addAddress({ ...newAddress, id: newId });
        toast.success('Address added successfully');
      }
      setShowAddressModal(false);
      setNewAddress({
        id: '',
        type: 'Home',
        phone: phoneNumber,
        flatNo: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        saveAs: '',
        isSelected: false,
      });
    } else {
      toast.error('Please fill all required fields');
    }
  }, [newAddress, isEditing, addAddress, updateAddress, phoneNumber]);

  return (
    <div className="min-h-screen bg-white">
      <Toaster />
      <Header />

      <div className="pt-28 px-4">
        <button
          onClick={() => {
            setIsEditing(false);
            setShowAddressSelectionModal(true);
          }}
          className="flex items-center text-[#FF6B00] mb-6"
        >
          <CirclePlus className="h-5 w-5 mr-2 stroke-[#FF6B00]" />
          <span className="text-sm">Add New Address</span>
        </button>

        <div className="space-y-4">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onSelect={handleAddressSelect}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
          {addresses.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No addresses added yet</p>
            </div>
          )}
        </div>
      </div>

      <AddressSelectionModal
        show={showAddressSelectionModal}
        onClose={() => setShowAddressSelectionModal(false)}
        phoneNumber={phoneNumber}
        setPhoneNumber={handlePhoneNumberChange}
        addresses={addresses}
        onAddressSelect={handleAddressSelect}
        onAddNew={() => {
          if (validatePhoneNumber(phoneNumber)) {
            setShowAddressSelectionModal(false);
            setShowLocationModal(true);
            setNewAddress(prev => ({ ...prev, phone: phoneNumber }));
          } else {
            toast.error('Please enter a valid phone number');
          }
        }}
      />

      <LocationModal
        show={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onLocationSelect={handleLocationSelect}
      />

      <AddressFormModal
        show={showAddressModal}
        onClose={() => {
          setShowAddressModal(false);
          setIsEditing(false);
        }}
        address={newAddress}
        setAddress={setNewAddress}
        isEditing={isEditing}
        onSubmit={handleAddAddress}
        onSearchLocation={() => {
          setShowAddressModal(false);
          setShowLocationModal(true);
        }}
      />
    </div>
  );
}