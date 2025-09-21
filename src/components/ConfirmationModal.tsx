
import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-slideInUp" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <h2 className="text-xl font-bold text-brand-text-primary">{title}</h2>
          <p className="mt-2 text-brand-text-secondary">{message}</p>
        </div>
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-4 border-t">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-brand-text-secondary rounded-md hover:bg-gray-300 transition-colors">
            Cancel
          </button>
          <button type="button" onClick={handleConfirm} className="px-4 py-2 bg-brand-accent text-white rounded-md hover:bg-red-700 transition-colors">
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};
