import { createContext, useContext, useState, useCallback } from 'react';
import type {
  MatrixContextType,
  MatrixProviderProps,
  ShelfData,
  ShelfItem,
  ItemInput
} from './types';

const MatrixContext = createContext<MatrixContextType | undefined>(undefined);

export default function MatrixProvider({
  initialData,
  renderItem,
  children
}: MatrixProviderProps) {
  const [data, setData] = useState<ShelfData>(initialData);

  const addItem = useCallback((shelfIndex: number, compartmentIndex: number, item: ItemInput) => {
    setData(prevData => {
      const newData = { ...prevData };
      
      // Create item with metadata if not provided
      const newItem: ShelfItem = {
        id: item.id || `item-${Date.now()}`,
        category: item.category || 'Uncategorized',
        quantity: item.quantity || 1,
        location: {
          shelf: shelfIndex,
          compartment: compartmentIndex
        },
        metadata: item.metadata || { width: 1 }
      };

      // Check if shelf exists
      if (!newData.shelf.items) {
        newData.shelf.items = [];
      }

      // Check if item already exists at location
      const existingIndex = newData.shelf.items.findIndex(
        i => i.location.shelf === shelfIndex && i.location.compartment === compartmentIndex
      );

      if (existingIndex !== -1) {
        newData.shelf.items[existingIndex] = newItem;
      } else {
        newData.shelf.items.push(newItem);
      }

      // Update total_items count
      newData.shelf.structure.total_items = newData.shelf.items.length;

      return newData;
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setData(prevData => {
      const newData = { ...prevData };
      
      if (!newData.shelf.items) {
        return prevData;
      }

      newData.shelf.items = newData.shelf.items.filter(item => item.id !== itemId);
      newData.shelf.structure.total_items = newData.shelf.items.length;

      return newData;
    });
  }, []);

  const removeItemByLocation = useCallback((shelfIndex: number, compartmentIndex: number) => {
    setData(prevData => {
      const newData = { ...prevData };
      
      if (!newData.shelf.items) {
        return prevData;
      }

      newData.shelf.items = newData.shelf.items.filter(
        item => !(item.location.shelf === shelfIndex && item.location.compartment === compartmentIndex)
      );
      newData.shelf.structure.total_items = newData.shelf.items.length;

      return newData;
    });
  }, []);

  const updateItem = useCallback((itemId: string, updates: Partial<ShelfItem>) => {
    setData(prevData => {
      const newData = { ...prevData };
      
      if (!newData.shelf.items) {
        return prevData;
      }

      const itemIndex = newData.shelf.items.findIndex(item => item.id === itemId);
      
      if (itemIndex !== -1) {
        newData.shelf.items[itemIndex] = {
          ...newData.shelf.items[itemIndex],
          ...updates
        };
      }

      return newData;
    });
  }, []);

  const getItemByLocation = useCallback((shelfIndex: number, compartmentIndex: number): ShelfItem | null => {
    if (!data.shelf.items) return null;
    
    return data.shelf.items.find(
      item => item.location.shelf === shelfIndex && item.location.compartment === compartmentIndex
    ) || null;
  }, [data]);

  const getItems = useCallback((): ShelfItem[] => {
    return data.shelf.items || [];
  }, [data]);

  const renderMatrix = () => {
    const { shelf } = data;

    return shelf.structure.compartments_per_shelf.map((compartmentCount, shelfIndex) => (
      <div key={`shelf-${shelfIndex}`} className="matrix-shelf-row">
        {Array.from({ length: compartmentCount }).map((_, compartmentIndex) => {
          const item = getItemByLocation(shelfIndex, compartmentIndex);

          return (
            <div key={`compartment-${shelfIndex}-${compartmentIndex}`} className="matrix-compartment">
              {renderItem ? (
                renderItem(item, shelfIndex, compartmentIndex)
              ) : (
                <div className="matrix-default-item">
                  {item && <span>{item.id}</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    ));
  };

  const value: MatrixContextType = {
    data,
    addItem,
    removeItem,
    removeItemByLocation,
    updateItem,
    getItemByLocation,
    getItems,
    renderMatrix
  };

  return (
    <MatrixContext.Provider value={value}>
      {children}
    </MatrixContext.Provider>
  );
};

// Hook to use Matrix context
export function useMatrix(): MatrixContextType {
  const context = useContext(MatrixContext);

  if (!context) {
    throw new Error('useMatrix must be used within MatrixProvider');
  }

  return context;
}

export * from './types'