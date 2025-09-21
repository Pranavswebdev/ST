
import React from 'react';
import type { OrderStatus } from '../types';
import { ORDER_STATUSES } from '../constants';

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: OrderStatus | 'all';
  setStatusFilter: (status: OrderStatus | 'all') => void;
  dateFilter: 'all' | 'overdue' | 'due-soon';
  setDateFilter: (filter: 'all' | 'overdue' | 'due-soon') => void;
  departmentFilter: string;
  setDepartmentFilter: (filter: string) => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (direction: 'asc' | 'desc') => void;
  departments: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  departmentFilter,
  setDepartmentFilter,
  sortDirection,
  setSortDirection,
  departments,
}) => {
  return (
    <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <label htmlFor="search" className="block text-sm font-medium text-brand-text-secondary mb-1">
            Search Order ID or Name
          </label>
          <input
            id="search"
            type="text"
            placeholder="e.g., ORD-001 or Eleanor"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
          />
        </div>
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-brand-text-secondary mb-1">
            Filter by Status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
          >
            <option value="all">All Statuses</option>
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="date-filter" className="block text-sm font-medium text-brand-text-secondary mb-1">
            Filter by Due Date
          </label>
          <select
            id="date-filter"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as 'all' | 'overdue' | 'due-soon')}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
          >
            <option value="all">All Dates</option>
            <option value="overdue">Overdue</option>
            <option value="due-soon">Due Soon (7 days)</option>
          </select>
        </div>
        <div>
          <label htmlFor="dept-filter" className="block text-sm font-medium text-brand-text-secondary mb-1">
            In Department
          </label>
          <select
            id="dept-filter"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
         <div>
          <label htmlFor="sort-direction" className="block text-sm font-medium text-brand-text-secondary mb-1">
            Sort by Due Date
          </label>
          <select
            id="sort-direction"
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
          >
            <option value="asc">Soonest First</option>
            <option value="desc">Latest First</option>
          </select>
        </div>
      </div>
    </div>
  );
};
