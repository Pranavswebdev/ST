
import React from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { SettingsIcon } from './icons/SettingsIcon';

interface HeaderProps {
  onNewOrderClick: () => void;
  onManageDepartmentsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNewOrderClick, onManageDepartmentsClick }) => {
  return (
    <header className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
      <h1 className="text-3xl font-bold text-brand-text-primary">Jewellery Job Tracker</h1>
      <div className="flex items-center gap-2">
        <button
            onClick={onManageDepartmentsClick}
            className="flex items-center gap-2 px-4 py-2 text-brand-text-secondary bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
            title="Manage Departments"
        >
            <SettingsIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Manage Departments</span>
        </button>
        <button
            onClick={onNewOrderClick}
            className="flex items-center gap-2 px-4 py-2 text-white bg-brand-primary rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
        >
            <PlusIcon className="w-5 h-5" />
            New Order
        </button>
      </div>
    </header>
  );
};
