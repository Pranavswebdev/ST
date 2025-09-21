import React, { useState, useMemo } from 'react';
import type { Order } from '../types';
import { Header } from './Header';
import { FilterBar } from './FilterBar';
import { OrderList } from './OrderList';
import { OrderModal } from './OrderModal';
import { DepartmentsModal } from './DepartmentsModal';
import { ConfirmationModal } from './ConfirmationModal';
import { ImageViewerModal } from './ImageViewerModal';
import { OrderStatus, PartStatus } from '../types';

interface DashboardProps {
  orders: Order[];
  onAddOrder: (order: Order) => void;
  onUpdateOrder: (order: Order) => void;
  onDeleteOrder: (orderId: string) => void;
  departments: string[];
  onSetDepartments: (departments: string[]) => void;
}

function exportDataToCSV(orders: Order[], departments: string[]) {
  // Flatten orders for CSV
  const orderRows = orders.map(order => {
    return {
      id: order.id,
      customerName: order.customerName,
      orderDate: order.orderDate,
      dueDate: order.dueDate,
      status: order.status,
      details: order.details,
      orderImage: order.orderImage || '',
      cadImage: order.cadImage || '',
      parts: JSON.stringify(order.parts),
    };
  });
  const orderHeaders = Object.keys(orderRows[0] || {});
  const orderCsv = [orderHeaders.join(','), ...orderRows.map(row => orderHeaders.map(h => '"' + String((row as any)[h]).replace(/"/g, '""') + '"').join(','))].join('\n');

  // Departments CSV
  const deptCsv = 'departments\n' + departments.map(d => '"' + d.replace(/"/g, '""') + '"').join('\n');

  // Combine
  const fullCsv = `#ORDERS\n${orderCsv}\n#DEPARTMENTS\n${deptCsv}`;
  return fullCsv;
}

function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const Dashboard: React.FC<DashboardProps> = ({ orders, onAddOrder, onUpdateOrder, onDeleteOrder, departments, onSetDepartments }) => {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isDeptsModalOpen, setIsDeptsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'overdue' | 'due-soon'>('all');
  const [departmentFilter, setDepartmentFilter] = useState<'all' | string>('all');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [viewingImage, setViewingImage] = useState<{ url: string; title: string } | null>(null);

  const openModalForNew = () => {
    setEditingOrder(null);
    setIsOrderModalOpen(true);
  };

  const openModalForEdit = (order: Order) => {
    setEditingOrder(order);
    setIsOrderModalOpen(true);
  };

  const closeModal = () => {
    setIsOrderModalOpen(false);
    setEditingOrder(null);
  };

  const handleSaveOrder = (order: Order) => {
    if (editingOrder) {
      onUpdateOrder(order);
    } else {
      onAddOrder(order);
    }
    closeModal();
  };
  
  const handleRequestDelete = (orderId: string) => {
    setDeletingOrderId(orderId);
  };

  const handleConfirmDelete = () => {
    if (deletingOrderId) {
      onDeleteOrder(deletingOrderId);
      setDeletingOrderId(null);
    }
  };

  const handleViewImage = (url: string, title: string) => {
    setViewingImage({ url, title });
  };

  const handleExport = () => {
    const csv = exportDataToCSV(orders, departments);
    downloadCSV(csv, 'jewellery-orders-export.csv');
  };

  // Import handler
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;
      // Split sections
      const [ordersSection, departmentsSection] = text.split('#DEPARTMENTS');
      // Parse orders
      let importedOrders: Order[] = [];
      if (ordersSection) {
        const lines = ordersSection.split('\n').filter(l => l && !l.startsWith('#'));
        const [header, ...rows] = lines;
        const headers = header.split(',');
        importedOrders = rows.map(row => {
          const values = row.match(/"([^"]|"")*"/g)?.map(v => v.slice(1, -1).replace(/""/g, '"')) || [];
          const obj: any = {};
          headers.forEach((h, i) => {
            obj[h] = values[i] || '';
          });
          // Parse parts JSON
          if (obj.parts) {
            try { obj.parts = JSON.parse(obj.parts); } catch { obj.parts = []; }
          }
          return obj as Order;
        });
      }
      // Parse departments
      let importedDepts: string[] = [];
      if (departmentsSection) {
        importedDepts = departmentsSection.split('\n').filter(l => l && l !== 'departments').map(l => l.replace(/"/g, ''));
      }
      // Merge departments from orders' parts
      importedOrders.forEach(order => {
        order.parts.forEach(part => {
          importedDepts.push(...Object.keys(part.departments || {}));
        });
      });
      // Unique departments
      const uniqueDepts = Array.from(new Set([...(departments || []), ...importedDepts]));
      // Merge orders (replace all for simplicity)
      onSetDepartments(uniqueDepts);
      if (importedOrders.length > 0) {
        // Replace all orders instead of adding one by one
        if (typeof window !== 'undefined') {
          localStorage.setItem('orders', JSON.stringify(importedOrders));
        }
        window.location.reload(); // reload to reflect imported orders
      }
      alert('Import successful!');
    };
    reader.readAsText(file);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const searchTermMatch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase());

      const statusMatch = statusFilter === 'all' || order.status === statusFilter;
      
      const today = new Date();
      today.setHours(0,0,0,0);
      const dueDate = new Date(order.dueDate);
      
      const dateMatch = () => {
        if (dateFilter === 'all') return true;
        if (dateFilter === 'overdue') {
            return dueDate < today && order.status !== OrderStatus.COMPLETED;
        }
        if (dateFilter === 'due-soon') {
            const sevenDaysFromNow = new Date();
            sevenDaysFromNow.setDate(today.getDate() + 7);
            return dueDate >= today && dueDate <= sevenDaysFromNow && order.status !== OrderStatus.COMPLETED;
        }
        return false;
      };

      const departmentMatch = departmentFilter === 'all' || order.parts.some(part => 
        part.departments[departmentFilter]?.status === PartStatus.IN_PROGRESS
      );

      return searchTermMatch && statusMatch && dateMatch() && departmentMatch;
    }).sort((a, b) => {
        const dateA = new Date(a.dueDate).getTime();
        const dateB = new Date(b.dueDate).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }, [orders, searchTerm, statusFilter, dateFilter, departmentFilter, sortDirection]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex justify-end mb-4 gap-2">
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-indigo-700"
        >
          Export Data
        </button>
        <label className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer">
          Import Data
          <input type="file" accept=".csv,text/csv" onChange={handleImport} className="hidden" />
        </label>
      </div>
      <Header onNewOrderClick={openModalForNew} onManageDepartmentsClick={() => setIsDeptsModalOpen(true)} />
      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        departments={departments}
      />
      <OrderList 
        orders={filteredOrders} 
        onEditOrder={openModalForEdit} 
        onRequestDelete={handleRequestDelete} 
        departments={departments}
        onViewImage={handleViewImage}
      />
      {isOrderModalOpen && (
        <OrderModal 
          isOpen={isOrderModalOpen} 
          onClose={closeModal} 
          onSave={handleSaveOrder} 
          order={editingOrder}
          existingOrderIds={orders.map(o => o.id)}
          departments={departments}
        />
      )}
      {isDeptsModalOpen && (
        <DepartmentsModal
            isOpen={isDeptsModalOpen}
            onClose={() => setIsDeptsModalOpen(false)}
            departments={departments}
            onSave={onSetDepartments}
        />
      )}
      <ConfirmationModal
        isOpen={!!deletingOrderId}
        onClose={() => setDeletingOrderId(null)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete order ${deletingOrderId}? This action cannot be undone.`}
      />
      <ImageViewerModal
        isOpen={!!viewingImage}
        onClose={() => setViewingImage(null)}
        imageUrl={viewingImage?.url ?? null}
        imageTitle={viewingImage?.title ?? null}
      />
    </div>
  );
};
