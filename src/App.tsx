import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import type { Order } from './types';
import { OrderStatus, PartStatus } from './types';

const SAMPLE_DEPARTMENTS = ['SampleDept'];
const SAMPLE_ORDER: Order = {
  id: 'sample',
  customerName: 'Sample Customer',
  orderDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  status: OrderStatus.NEW,
  details: 'This is a sample order.',
  orderImage: '',
  cadImage: '',
  parts: [
    {
      id: 'part1',
      name: 'Sample Part',
      departments: {
        SampleDept: {
          status: PartStatus.PENDING,
          weightIn: '',
          weightOut: '',
        },
      },
    },
  ],
};

const LOCAL_STORAGE_ORDERS_KEY = 'orders';
const LOCAL_STORAGE_DEPTS_KEY = 'departments';

const App: React.FC = () => {
  const [departments, setDepartments] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage or set sample data
    const storedOrders = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    const storedDepts = localStorage.getItem(LOCAL_STORAGE_DEPTS_KEY);
    let initialOrders: Order[] = SAMPLE_ORDER ? [SAMPLE_ORDER] : [];
    let initialDepts: string[] = SAMPLE_DEPARTMENTS;
    if (storedOrders) {
      try { initialOrders = JSON.parse(storedOrders); } catch {}
    }
    if (storedDepts) {
      try { initialDepts = JSON.parse(storedDepts); } catch {}
    }
    setOrders(initialOrders);
    setDepartments(initialDepts);
    setIsLoading(false);
  }, []);

  const saveOrders = (orders: Order[]) => {
    setOrders(orders);
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
  };
  const saveDepartments = (depts: string[]) => {
    setDepartments(depts);
    localStorage.setItem(LOCAL_STORAGE_DEPTS_KEY, JSON.stringify(depts));
  };

  const addOrder = (order: Order) => {
    const newOrders = [order, ...orders];
    saveOrders(newOrders);
  };

  const updateOrder = (updatedOrder: Order) => {
    const newOrders = orders.map(order => (order.id === updatedOrder.id ? updatedOrder : order));
    saveOrders(newOrders);
  };

  const deleteOrder = (orderId: string) => {
    const newOrders = orders.filter(order => order.id !== orderId);
    saveOrders(newOrders);
  };

  const handleSetDepartments = (newDepartments: string[]) => {
    saveDepartments(newDepartments);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen text-brand-text-primary">
      <Dashboard 
        orders={orders}
        onAddOrder={addOrder}
        onUpdateOrder={updateOrder}
        onDeleteOrder={deleteOrder}
        departments={departments}
        onSetDepartments={handleSetDepartments}
      />
    </div>
  );
};

export default App;
