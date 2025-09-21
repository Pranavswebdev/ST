
import React from 'react';
import { XIcon } from './icons/XIcon';

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  imageTitle: string | null;
}

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({ isOpen, onClose, imageUrl, imageTitle }) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center animate-fadeIn" 
      onClick={onClose}
    >
      <div 
        className="bg-brand-surface rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col p-4 relative animate-slideInUp" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-brand-text-primary">{imageTitle || 'Image Preview'}</h3>
            <button 
                onClick={onClose} 
                className="p-2 text-gray-500 hover:text-brand-accent hover:bg-red-50 rounded-full transition-colors"
                aria-label="Close image viewer"
            >
                <XIcon className="w-6 h-6" />
            </button>
        </div>
        <div className="flex-1 flex justify-center items-center overflow-hidden">
            <img 
                src={imageUrl} 
                alt={imageTitle || 'Enlarged view'} 
                className="max-w-full max-h-full object-contain"
            />
        </div>
      </div>
    </div>
  );
};
