
import { OrderStatus, PartStatus } from './types';

export const ORDER_STATUSES: OrderStatus[] = [
  OrderStatus.NEW,
  OrderStatus.IN_PROGRESS,
  OrderStatus.COMPLETED,
  OrderStatus.ON_HOLD,
];

export const PART_STATUSES: PartStatus[] = [
  PartStatus.PENDING,
  PartStatus.IN_PROGRESS,
  PartStatus.COMPLETED,
];
