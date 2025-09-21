
import React, { useMemo } from 'react';
import type { Order, Part, DepartmentInfo } from '../types';
import { PartStatus, OrderStatus } from '../types';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { MaximizeIcon } from './icons/MaximizeIcon';

interface OrderCardProps {
  order: Order;
  onEdit: () => void;
  onRequestDelete: () => void;
  departments: string[];
  onViewImage: (url: string, title: string) => void;
}

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.COMPLETED: return 'bg-green-100 text-green-800';
    case OrderStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-800';
    case OrderStatus.ON_HOLD: return 'bg-yellow-100 text-yellow-800';
    case OrderStatus.NEW: return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getDueDateInfo = (dueDateStr: string, status: OrderStatus) => {
    if (status === OrderStatus.COMPLETED) {
        return { text: `Completed`, className: 'text-green-600', accentClass: 'border-l-green-500' };
    }
    const dueDate = new Date(dueDateStr);
    const today = new Date();
    today.setHours(0,0,0,0);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
        return { text: `Overdue by ${Math.abs(diffDays)} day(s)`, className: 'text-red-600 font-semibold', accentClass: 'border-l-red-500' };
    }
    if (diffDays <= 3) {
        const text = diffDays === 0 ? 'Due Today' : `Due in ${diffDays} day(s)`;
        return { text, className: 'text-yellow-600 font-semibold', accentClass: 'border-l-yellow-500' };
    }
    return { text: `Due in ${diffDays} day(s)`, className: 'text-gray-500', accentClass: 'border-l-transparent' };
};

const getPartStatus = (part: Part): PartStatus => {
    const partStatuses = Object.values(part.departments).map(deptInfo => deptInfo.status);
    if (partStatuses.length === 0) return PartStatus.PENDING;

    if (partStatuses.includes(PartStatus.IN_PROGRESS)) {
        return PartStatus.IN_PROGRESS;
    }
    if (partStatuses.every(s => s === PartStatus.COMPLETED)) {
        return PartStatus.COMPLETED;
    }
    return PartStatus.PENDING;
};

const DepartmentStep: React.FC<{ name: string; info: DepartmentInfo; status: PartStatus }> = ({ name, info, status }) => {
    const getStepColor = () => {
        switch (status) {
            case PartStatus.COMPLETED: return 'bg-green-500 border-green-500';
            case PartStatus.IN_PROGRESS: return 'bg-blue-500 border-blue-500 animate-pulse';
            case PartStatus.PENDING: return 'bg-white border-gray-300';
        }
    };
    
    const weightLoss = parseFloat(info.weightIn) - parseFloat(info.weightOut);

    return (
        <div className="flex-1 flex flex-col items-center text-center px-1">
            <div className={`w-4 h-4 rounded-full z-10 border-2 ${getStepColor()}`}></div>
            <p className={`mt-2 text-xs font-semibold ${status === PartStatus.PENDING ? 'text-gray-400' : 'text-brand-text-primary'}`}>{name}</p>
            <div className="text-center text-xs text-gray-500 mt-1 space-y-0.5">
                {info.weightIn && <p>In: {info.weightIn}g</p>}
                {info.weightOut && <p>Out: {info.weightOut}g</p>}
                {info.weightIn && info.weightOut && !isNaN(weightLoss) && weightLoss > 0 && (
                    <p className="text-red-500 font-medium">Loss: {weightLoss.toFixed(2)}g</p>
                )}
            </div>
        </div>
    );
};

const PartTracker: React.FC<{ part: Part; departments: string[] }> = ({ part, departments }) => {
    const orderedPartDepartments = useMemo(() => {
        const partDepartmentNames = Object.keys(part.departments);
        return departments.filter(dept => partDepartmentNames.includes(dept));
    }, [part.departments, departments]);

    const activeStepIndex = useMemo(() => {
        const index = orderedPartDepartments.findIndex(dept => part.departments[dept]?.status === PartStatus.IN_PROGRESS);
        if (index !== -1) return index;
        const lastCompleted = orderedPartDepartments.map(d => part.departments[d]?.status).lastIndexOf(PartStatus.COMPLETED);
        return lastCompleted;
    }, [part.departments, orderedPartDepartments]);

    const progressPercent = orderedPartDepartments.length <= 1 ? (activeStepIndex >= 0 ? 100 : 0) : (activeStepIndex / (orderedPartDepartments.length - 1)) * 100;
    
    if (orderedPartDepartments.length === 0) {
        return (
             <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="font-semibold text-sm text-brand-text-primary">{part.name}</h4>
                <p className="text-sm text-gray-500 mt-2">No departments assigned to this part.</p>
            </div>
        );
    }

    return (
    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
        <h4 className="font-semibold text-sm text-brand-text-primary mb-6">{part.name}</h4>
        <div className="relative">
            <div className="absolute top-1.5 left-0 right-0 h-1 bg-gray-200 rounded-full" />
            <div className="absolute top-1.5 left-0 h-1 bg-brand-primary rounded-full transition-all duration-500" style={{width: `${progressPercent}%`}} />
            <div className="flex justify-between items-start">
                {orderedPartDepartments.map((dept) => {
                    const info = part.departments[dept];
                    return <DepartmentStep key={dept} name={dept} info={info} status={info.status} />;
                })}
            </div>
        </div>
    </div>
  );
};

const ImagePreview: React.FC<{
    src?: string;
    alt: string;
    onClick: () => void;
}> = ({ src, alt, onClick }) => {
    if (!src) return <p className="text-gray-400 text-sm">N/A</p>;
    return (
        <button onClick={onClick} className="relative group w-24 h-24 mt-1 rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-brand-primary">
            <img src={src} alt={alt} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex justify-center items-center">
                <MaximizeIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        </button>
    );
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onEdit, onRequestDelete, departments, onViewImage }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const dueDateInfo = getDueDateInfo(order.dueDate, order.status);
  
  const partStatusSummary = useMemo(() => {
    const summary = {
        [PartStatus.COMPLETED]: 0,
        [PartStatus.IN_PROGRESS]: 0,
        [PartStatus.PENDING]: 0,
    };
    order.parts.forEach(part => {
        const status = getPartStatus(part);
        summary[status]++;
    });
    return summary;
  }, [order.parts]);

  return (
    <div className={`bg-brand-surface rounded-lg shadow-md transition-all hover:shadow-lg animate-fadeIn border-l-4 ${dueDateInfo.accentClass}`}>
      <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex-1 mb-4 sm:mb-0">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-brand-primary">{order.id}</h2>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
          <p className="text-lg text-brand-text-primary font-medium mt-1">{order.customerName}</p>
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-sm mt-2">
            <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-gray-400" />
                <span className={dueDateInfo.className}>{dueDateInfo.text}</span>
                <span className="text-gray-300">|</span>
                <span>Due: {new Date(order.dueDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 font-mono pt-1">
                <span>{order.parts.length} Part(s):</span>
                {partStatusSummary[PartStatus.COMPLETED] > 0 && <span className="text-green-600">✓{partStatusSummary[PartStatus.COMPLETED]}</span>}
                {partStatusSummary[PartStatus.IN_PROGRESS] > 0 && <span className="text-blue-600">▶{partStatusSummary[PartStatus.IN_PROGRESS]}</span>}
                {partStatusSummary[PartStatus.PENDING] > 0 && <span className="text-gray-500">…{partStatusSummary[PartStatus.PENDING]}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button onClick={onEdit} className="p-2 text-gray-500 hover:text-brand-primary hover:bg-gray-100 rounded-full transition-colors" aria-label="Edit Order"><EditIcon className="w-5 h-5" /></button>
          <button onClick={onRequestDelete} className="p-2 text-gray-500 hover:text-brand-accent hover:bg-red-50 rounded-full transition-colors" aria-label="Delete Order"><TrashIcon className="w-5 h-5" /></button>
          <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 text-gray-500 hover:text-brand-primary hover:bg-gray-100 rounded-full transition-colors" aria-label={isExpanded ? 'Collapse Order Details' : 'Expand Order Details'}>
            <ChevronDownIcon className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
      {isExpanded && (
        <div className="p-4 border-t border-gray-200 animate-slideInUp">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <h3 className="text-sm font-semibold text-gray-500">Details</h3>
                    <p className="text-brand-text-secondary">{order.details}</p>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-gray-500">Order Image</h3>
                    <ImagePreview 
                        src={order.orderImage} 
                        alt="Order" 
                        onClick={() => onViewImage(order.orderImage!, `Order Image for ${order.id}`)} 
                    />
                </div>
                 <div>
                    <h3 className="text-sm font-semibold text-gray-500">CAD Image</h3>
                     <ImagePreview 
                        src={order.cadImage} 
                        alt="CAD" 
                        onClick={() => onViewImage(order.cadImage!, `CAD Image for ${order.id}`)} 
                    />
                 </div>
            </div>
          <div className="space-y-4">
            {order.parts.map(part => <PartTracker key={part.id} part={part} departments={departments} />)}
          </div>
        </div>
      )}
    </div>
  );
};
