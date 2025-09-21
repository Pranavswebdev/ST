
export enum PartStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
}

export interface DepartmentInfo {
  status: PartStatus;
  weightIn: string;
  weightOut: string;
}

export interface Part {
  id: string;
  name: string;
  departments: {
    [key: string]: DepartmentInfo;
  };
}

export enum OrderStatus {
  NEW = 'New',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  ON_HOLD = 'On Hold',
}

export interface Order {
  id: string;
  customerName: string;
  orderDate: string;
  dueDate: string;
  status: OrderStatus;
  details: string;
  orderImage?: string;
  cadImage?: string;
  parts: Part[];
}
