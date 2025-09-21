import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
// Import Jest globals to resolve TypeScript errors.
import { describe, it, expect, jest } from '@jest/globals';
import { OrderCard } from './OrderCard';
import { Order, OrderStatus } from '../types';

const mockOrder: Order = {
  id: 'ORD-001',
  customerName: 'Eleanor Vance',
  orderDate: '2024-07-15',
  dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  status: OrderStatus.IN_PROGRESS,
  details: 'Custom ring',
  parts: [],
};

describe('OrderCard', () => {
  const onEdit = jest.fn();
  const onRequestDelete = jest.fn();
  const onViewImage = jest.fn();

  it('renders order information', () => {
    render(
      <OrderCard
        order={mockOrder}
        departments={['Design']}
        onEdit={onEdit}
        onRequestDelete={onRequestDelete}
        onViewImage={onViewImage}
      />
    );
    expect(screen.getByText('ORD-001')).toBeInTheDocument();
    expect(screen.getByText('Eleanor Vance')).toBeInTheDocument();
    expect(screen.getByText(OrderStatus.IN_PROGRESS)).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <OrderCard
        order={mockOrder}
        departments={[]}
        onEdit={onEdit}
        onRequestDelete={onRequestDelete}
        onViewImage={onViewImage}
      />
    );
    fireEvent.click(screen.getByLabelText('Edit Order'));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('expands to show details when chevron is clicked', () => {
    render(
      <OrderCard
        order={mockOrder}
        departments={[]}
        onEdit={onEdit}
        onRequestDelete={onRequestDelete}
        onViewImage={onViewImage}
      />
    );
    expect(screen.queryByText('Custom ring')).not.toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Expand Order Details'));
    expect(screen.getByText('Custom ring')).toBeInTheDocument();
  });
});