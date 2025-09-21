
import React, { useRef, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { XIcon } from './icons/XIcon';

interface ImagePickerProps {
    label: string;
    value?: string;
    onChange: (base64: string) => void;
    name: string;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({ label, value, onChange, name }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };
    
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };


    return (
        <div>
            <label className="block text-sm font-medium">{label}</label>
            <div 
                className={`mt-1 flex justify-center items-center w-full min-h-[8rem] px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-brand-primary transition-colors relative ${isDragging ? 'border-brand-primary bg-indigo-50' : ''}`}
                onClick={() => inputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
            >
                {value ? (
                    <>
                        <img src={value} alt="preview" className="max-w-full max-h-48 rounded-md object-contain" />
                        <button 
                            type="button" 
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 p-1 bg-white bg-opacity-70 rounded-full text-red-500 hover:text-red-700 hover:bg-white transition"
                            aria-label="Remove image"
                        >
                            <XIcon className="w-5 h-5" />
                        </button>
                    </>
                ) : (
                    <div className="space-y-1 text-center">
                        <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                            <p className="pl-1">Upload a file or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF, WebP</p>
                    </div>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    name={name}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
};
