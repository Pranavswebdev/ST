import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
// Import Jest globals to resolve TypeScript errors.
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Dashboard } from './Dashboard';
import { Order, OrderStatus, PartStatus } from '../types';

const mockOrders: Order[] = [
  {
    id: 'ORD-001', customerName: 'Alice', orderDate: '2024-07-01', dueDate: '2024-08-01', status: OrderStatus.IN_PROGRESS, details: '', parts: [
        { id: 'P1', name: 'Ring', departments: { 'Design': { status: PartStatus.IN_PROGRESS, weightIn: '', weightOut: '' } } }
    ]
  },
  {
    id: 'ORD-002', customerName: 'Bob', orderDate: '2024-07-02', dueDate: '2024-07-15', status: OrderStatus.COMPLETED, details: '', parts: []
  },
];

const mockDepartments = ['Design', 'Cast'];

describe('Dashboard', () => {
  const onAddOrder = jest.fn();
  const onUpdateOrder = jest.fn();
  const onDeleteOrder = jest.fn();
  const onSetDepartments = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders orders correctly', () => {
    render(
      <Dashboard
        orders={mockOrders}
        departments={mockDepartments}
        onAddOrder={onAddOrder}
        onUpdateOrder={onUpdateOrder}
        onDeleteOrder={onDeleteOrder}
        onSetDepartments={onSetDepartments}
      />
    );
    expect(screen.getByText('ORD-001')).toBeInTheDocument();
    expect(screen.getByText('ORD-002')).toBeInTheDocument();
  });

  it('opens new order modal on button click', () => {
    render(
      <Dashboard
        orders={mockOrders}
        departments={mockDepartments}
        onAddOrder={onAddOrder}
        onUpdateOrder={onUpdateOrder}
        onDeleteOrder={onDeleteOrder}
        onSetDepartments={onSetDepartments}
      />
    );
    fireEvent.click(screen.getByText('New Order'));
    expect(screen.getByText('Create New Order')).toBeInTheDocument();
  });

  it('filters orders by search term', () => {
    render(
      <Dashboard
        orders={mockOrders}
        departments={mockDepartments}
        onAddOrder={onAddOrder}
        onUpdateOrder={onUpdateOrder}
        onDeleteOrder={onDeleteOrder}
        onSetDepartments={onSetDepartments}
      />
    );
    const searchInput = screen.getByLabelText('Search Order ID or Name');
    fireEvent.change(searchInput, { target: { value: 'Alice' } });
    expect(screen.getByText('ORD-001')).toBeInTheDocument();
    expect(screen.queryByText('ORD-002')).not.toBeInTheDocument();
  });

  it('filters orders by status', () => {
    render(
      <Dashboard
        orders={mockOrders}
        departments={mockDepartments}
        onAddOrder={onAddOrder}
        onUpdateOrder={onUpdateOrder}
        onDeleteOrder={onDeleteOrder}
        onSetDepartments={onSetDepartments}
      />
    );
    const statusFilter = screen.getByLabelText('Filter by Status');
    fireEvent.change(statusFilter, { target: { value: OrderStatus.COMPLETED } });
    expect(screen.queryByText('ORD-001')).not.toBeInTheDocument();
    expect(screen.getByText('ORD-002')).toBeInTheDocument();
  });
});