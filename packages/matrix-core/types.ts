import type { PropsWithChildren, ReactNode } from "react";

export interface ItemMetadata {
  width?: number;
  [key: string]: any;
}

export interface ItemLocation {
  shelf: number;
  compartment: number;
}

export interface ShelfItem {
  id: string;
  category: string;
  quantity: number;
  location: ItemLocation;
  metadata: ItemMetadata;
}

export interface ItemInput {
  id?: string;
  category?: string;
  quantity?: number;
  metadata?: ItemMetadata;
}

export interface ShelfStructure {
  num_shelves: number;
  compartments_per_shelf: number[];
  total_compartments: number;
  total_items: number;
  max_capacity: number;
}

export interface Shelf {
  id: string;
  creation_date: string;
  structure: ShelfStructure;
  items: ShelfItem[];
}

export interface ShelfData {
  shelf: Shelf;
}

export interface MatrixContextType {
  data: ShelfData;
  addItem: (shelfIndex: number, compartmentIndex: number, item: ItemInput) => void;
  removeItem: (itemId: string) => void;
  removeItemByLocation: (shelfIndex: number, compartmentIndex: number) => void;
  updateItem: (itemId: string, updates: Partial<ShelfItem>) => void;
  getItemByLocation: (shelfIndex: number, compartmentIndex: number) => ShelfItem | null;
  getItems: () => ShelfItem[];
  renderMatrix: () => React.ReactNode;
}

interface MatrixProvider {
  initialData: ShelfData;
  renderItem?: (item: ShelfItem | null, shelfIndex: number, compartmentIndex: number) => ReactNode;
}

export type MatrixProviderProps = PropsWithChildren<MatrixProvider>