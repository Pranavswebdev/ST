
import React from 'react';
import type { Order } from '../types';
import { OrderCard } from './OrderCard';

interface OrderListProps {
  orders: Order[];
  onEditOrder: (order: Order) => void;
  onRequestDelete: (orderId: string) => void;
  departments: string[];
  onViewImage: (url: string, title: string) => void;
}

export const OrderList: React.FC<OrderListProps> = ({ orders, onEditOrder, onRequestDelete, departments, onViewImage }) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-brand-surface rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-brand-text-primary">No Orders Found</h2>
        <p className="text-brand-text-secondary mt-2">
          Your search or filter returned no results. Try adjusting your criteria or add a new order.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <OrderCard 
          key={order.id} 
          order={order} 
          onEdit={() => onEditOrder(order)} 
          onRequestDelete={() => onRequestDelete(order.id)}
          departments={departments}
          onViewImage={onViewImage}
        />
      ))}
    </div>
  );
};
