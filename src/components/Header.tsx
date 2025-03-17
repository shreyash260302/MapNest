import { ArrowLeft, Bell, ShoppingCart } from 'lucide-react';

export const Header = () => {
  return (
    <header className="fixed w-full top-0 bg-white z-20 border-b border-gray-200">
      <div className="px-4 py-3">
        <div className="flex justify-end space-x-4 mb-4">
          <Bell className="h-6 w-6 text-gray-800" />
          <ShoppingCart className="h-6 w-6 text-gray-800" />
        </div>
        <div className="flex items-center">
          <button className="mr-2">
            <ArrowLeft className="h-6 w-6 text-gray-800" />
          </button>
          <h1 className="text-lg font-semibold">My Address</h1>
        </div>
      </div>
    </header>
  );
};