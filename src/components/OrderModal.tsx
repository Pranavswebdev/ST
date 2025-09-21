import React, { useState, useEffect, useRef } from 'react';
import type { Order, Part } from '../types';
import { OrderStatus, PartStatus } from '../types';
import { ORDER_STATUSES, PART_STATUSES } from '../constants';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { XIcon } from './icons/XIcon';
import { CalendarIcon } from './icons/CalendarIcon';


interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: Order) => void;
  order: Order | null;
  existingOrderIds: string[];
  departments: string[];
}

const createEmptyPart = (): Omit<Part, 'id'> => ({
  name: '',
  departments: {},
});

export const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, onSave, order, existingOrderIds, departments }) => {
  const [formData, setFormData] = useState<Omit<Order, 'id'> | Order | null>(null);
  const [id, setId] = useState(order?.id || '');
  const [idError, setIdError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const orderDateRef = useRef<HTMLInputElement>(null);
  const dueDateRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (order) {
      setFormData(JSON.parse(JSON.stringify(order))); // Deep copy
      setId(order.id);
    } else {
      const newOrderId = `ORD-${String(Date.now()).slice(-4)}`;
      setFormData({
        customerName: '',
        orderDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        status: OrderStatus.NEW,
        details: '',
        orderImage: '',
        cadImage: '',
        parts: [{ ...createEmptyPart(), id: `P-${Date.now()}` }],
      });
      setId(newOrderId);
    }
  }, [order]);


  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newId = e.target.value;
    setId(newId);
    if (!order && existingOrderIds.includes(newId)) {
        setIdError('This Order ID already exists.');
    } else if (!newId) {
        setIdError('Order ID cannot be empty.');
    }
    else {
        setIdError('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };
  
  const handlePartChange = (partIndex: number, field: keyof Part, value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      const newParts = [...prev.parts];
      (newParts[partIndex] as any)[field] = value;
      return { ...prev, parts: newParts };
    });
  };
  
  const handleDeptChange = (partIndex: number, dept: string, field: string, value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      const newParts = JSON.parse(JSON.stringify(prev.parts));
      newParts[partIndex].departments[dept][field] = value;
      return { ...prev, parts: newParts };
    });
  };

  const addDepartmentToPart = (partIndex: number, deptName: string) => {
    if (!deptName) return;
    setFormData(prev => {
      if (!prev) return null;
      const newParts = JSON.parse(JSON.stringify(prev.parts));
      if (!newParts[partIndex].departments[deptName]) {
        newParts[partIndex].departments[deptName] = { status: PartStatus.PENDING, weightIn: '', weightOut: ''};
      }
      return { ...prev, parts: newParts };
    });
  };

  const removeDepartmentFromPart = (partIndex: number, deptName: string) => {
     setFormData(prev => {
      if (!prev) return null;
      const newParts = JSON.parse(JSON.stringify(prev.parts));
      delete newParts[partIndex].departments[deptName];
      return { ...prev, parts: newParts };
    });
  };

  const addPart = () => {
    setFormData(prev => {
      if (!prev) return null;
      return { ...prev, parts: [...prev.parts, { ...createEmptyPart(), id: `P-${Date.now()}` }] };
    });
  };
  
  const removePart = (partIndex: number) => {
    setFormData(prev => {
      if (!prev) return null;
      const newParts = prev.parts.filter((_, i) => i !== partIndex);
      return { ...prev, parts: newParts };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (idError || !id || !formData) {
        if(!id) setIdError('Order ID cannot be empty.');
        return;
    }

    setIsSubmitting(true);
    
    try {
        const finalOrderData: Order = {
            ...formData,
            id,
        };

        onSave(finalOrderData);

    } catch (error) {
        console.error("Failed to save order:", error);
        // You might want to show an error message to the user here
    } finally {
        setIsSubmitting(false);
    }
  };

  if (!isOpen || !formData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-slideInUp" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">{order ? 'Edit Order' : 'Create New Order'}</h2>
          </div>
          <div className="p-6 space-y-6 bg-slate-50">
            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white rounded-lg border border-slate-200">
                <div>
                    <label htmlFor="order-id" className="block text-sm font-medium">Order ID</label>
                    <input id="order-id" type="text" value={id} onChange={handleIdChange} disabled={!!order} className={`mt-1 block w-full border rounded-md p-2 bg-white ${idError ? 'border-red-500' : 'border-gray-300'} ${order ? 'bg-gray-100' : ''}`} />
                    {idError && <p className="text-red-500 text-xs mt-1">{idError}</p>}
                </div>
                <div>
                    <label htmlFor="customer-name" className="block text-sm font-medium">Customer Name</label>
                    <input id="customer-name" type="text" name="customerName" value={formData.customerName} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white" />
                </div>
                <div>
                    <label htmlFor="order-date" className="block text-sm font-medium">Order Date</label>
                    <div className="relative mt-1">
                        <input id="order-date" ref={orderDateRef} type="date" name="orderDate" value={formData.orderDate} onChange={handleChange} onClick={() => orderDateRef.current?.showPicker()} required className="block w-full border border-gray-300 rounded-md p-2 bg-white cursor-pointer" />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <CalendarIcon className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>
                <div>
                    <label htmlFor="due-date" className="block text-sm font-medium">Due Date</label>
                    <div className="relative mt-1">
                        <input id="due-date" ref={dueDateRef} type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} onClick={() => dueDateRef.current?.showPicker()} required className="block w-full border border-gray-300 rounded-md p-2 bg-white cursor-pointer" />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <CalendarIcon className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>
                <div>
                    <label htmlFor="status" className="block text-sm font-medium">Status</label>
                    <select id="status" name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white">
                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="details" className="block text-sm font-medium">Details</label>
                    <textarea id="details" name="details" value={formData.details} onChange={handleChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white"></textarea>
                </div>
            </div>
            {/* Parts Section */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Order Parts</h3>
              <div className="space-y-4">
                {formData.parts.map((part, pIndex) => {
                  const availableDepts = departments.filter(d => !part.departments[d]);
                  const orderedPartDepartments = Object.keys(part.departments).sort((a,b) => departments.indexOf(a) - departments.indexOf(b));

                  return (
                  <div key={part.id} className="p-4 border rounded-lg bg-white border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <input type="text" value={part.name} onChange={e => handlePartChange(pIndex, 'name', e.target.value)} placeholder="Part Name (e.g., Pendant)" required className="font-semibold text-lg border-b-2 border-gray-200 focus:border-brand-primary outline-none w-full bg-transparent" />
                        {formData.parts.length > 1 && <button type="button" onClick={() => removePart(pIndex)} className="text-red-500 hover:text-red-700 p-1 ml-2"><TrashIcon className="w-5 h-5"/></button>}
                    </div>
                    
                    {orderedPartDepartments.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {orderedPartDepartments.map(dept => (
                              <div key={dept} className="p-2 bg-slate-50 rounded-md relative">
                                  <button type="button" onClick={() => removeDepartmentFromPart(pIndex, dept)} className="absolute top-1 right-1 text-gray-400 hover:text-red-500"><XIcon className="w-3 h-3"/></button>
                                  <h4 className="font-medium text-sm text-brand-text-secondary">{dept}</h4>
                                  <select value={part.departments[dept]?.status || PartStatus.PENDING} onChange={e => handleDeptChange(pIndex, dept, 'status', e.target.value)} className="mt-1 text-sm w-full border border-gray-300 rounded p-1.5 bg-white">
                                      {PART_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                  </select>
                                  <input type="number" step="0.01" placeholder="In" value={part.departments[dept]?.weightIn || ''} onChange={e => handleDeptChange(pIndex, dept, 'weightIn', e.target.value)} className="mt-1 text-sm w-full border border-gray-300 rounded p-1.5 bg-white" aria-label={`${dept} Weight In`}/>
                                  <input type="number" step="0.01" placeholder="Out" value={part.departments[dept]?.weightOut || ''} onChange={e => handleDeptChange(pIndex, dept, 'weightOut', e.target.value)} className="mt-1 text-sm w-full border border-gray-300 rounded p-1.5 bg-white" aria-label={`${dept} Weight Out`}/>
                              </div>
                          ))}
                      </div>
                    )}
                    
                    {availableDepts.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-dashed">
                        <h5 className="text-sm font-medium text-brand-text-secondary mb-2">Available Departments to Add</h5>
                        <div className="flex flex-wrap gap-2">
                          {availableDepts.map(dept => (
                            <button
                              key={dept}
                              type="button"
                              onClick={() => addDepartmentToPart(pIndex, dept)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-brand-primary bg-indigo-50 rounded-md border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
                            >
                              <PlusIcon className="w-4 h-4" />
                              {dept}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )})}
              </div>
              <button type="button" onClick={addPart} className="mt-4 flex items-center gap-2 text-sm text-brand-primary font-semibold hover:text-indigo-800">
                <PlusIcon className="w-5 h-5"/> Add Part
              </button>
            </div>
          </div>
          <div className="p-4 bg-gray-100 flex justify-end gap-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300" disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
