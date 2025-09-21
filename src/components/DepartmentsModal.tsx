
import React, { useState, useRef } from 'react';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';
import { GripVerticalIcon } from './icons/GripVerticalIcon';

interface DepartmentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    departments: string[];
    onSave: (departments: string[]) => void;
}

export const DepartmentsModal: React.FC<DepartmentsModalProps> = ({ isOpen, onClose, departments, onSave }) => {
    const [localDepts, setLocalDepts] = useState(departments);
    const [newDept, setNewDept] = useState('');
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    if (!isOpen) return null;

    const handleAddDept = () => {
        if (newDept && !localDepts.includes(newDept)) {
            setLocalDepts([...localDepts, newDept]);
            setNewDept('');
        }
    };

    const handleRemoveDept = (indexToRemove: number) => {
        setLocalDepts(localDepts.filter((_, index) => index !== indexToRemove));
    };

    const handleSave = () => {
        onSave(localDepts);
        onClose();
    };

    const handleDragStart = (e: React.DragEvent<HTMLLIElement>, position: number) => {
        dragItem.current = position;
    };
    
    const handleDragEnter = (e: React.DragEvent<HTMLLIElement>, position: number) => {
        dragOverItem.current = position;
    };

    const handleDragEnd = () => {
        if (dragItem.current !== null && dragOverItem.current !== null) {
            const newList = [...localDepts];
            const dragItemContent = newList[dragItem.current];
            newList.splice(dragItem.current, 1);
            newList.splice(dragOverItem.current, 0, dragItemContent);
            dragItem.current = null;
            dragOverItem.current = null;
            setLocalDepts(newList);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-slideInUp" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold">Manage Departments</h2>
                    <p className="text-sm text-brand-text-secondary mt-1">Drag and drop to reorder the workflow.</p>
                </div>
                <div className="p-6">
                    <ul className="space-y-2 mb-4">
                        {localDepts.map((dept, index) => (
                            <li
                                key={dept}
                                className="flex items-center justify-between p-2 bg-gray-100 rounded-md"
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragEnter={(e) => handleDragEnter(e, index)}
                                onDragEnd={handleDragEnd}
                                onDragOver={(e) => e.preventDefault()}
                            >
                                <div className="flex items-center gap-2">
                                    <GripVerticalIcon className="w-5 h-5 text-gray-400 cursor-grab" />
                                    <span>{dept}</span>
                                </div>
                                <button
                                    onClick={() => handleRemoveDept(index)}
                                    className="text-red-500 hover:text-red-700 p-1"
                                    aria-label={`Remove ${dept} department`}
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newDept}
                            onChange={(e) => setNewDept(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddDept()}
                            placeholder="New department name"
                            className="flex-grow w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                        />
                        <button
                            onClick={handleAddDept}
                            className="flex-shrink-0 flex items-center gap-2 px-3 py-2 text-white bg-brand-primary rounded-lg shadow-md hover:bg-indigo-700"
                        >
                            <PlusIcon className="w-5 h-5" /> Add
                        </button>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 flex justify-end gap-4 border-t">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                    <button type="button" onClick={handleSave} className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-indigo-700">Save Changes</button>
                </div>
            </div>
        </div>
    );
};
