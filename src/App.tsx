import { useState } from 'react';
import MatrixProvider, {
  useMatrix,
  type ShelfItem,
  type ShelfData
} from 'matrix-core';
import './App.css';

const initialShelfData: ShelfData = {
  shelf: {
    id: "shelf-001",
    creation_date: "2024-11-21T10:30:00",
    structure: {
      num_shelves: 5,
      compartments_per_shelf: [4, 16, 11, 7, 13],
      total_compartments: 51,
      total_items: 25,
      max_capacity: 51
    },
    items: [
      { id: "item-001", category: "Books", quantity: 1, location: { shelf: 0, compartment: 0 }, metadata: { width: 1 } },
      { id: "item-002", category: "Books", quantity: 1, location: { shelf: 0, compartment: 1 }, metadata: { width: 1 } },
      { id: "item-003", category: "Books", quantity: 1, location: { shelf: 0, compartment: 2 }, metadata: { width: 1 } },
      { id: "item-004", category: "Books", quantity: 1, location: { shelf: 0, compartment: 3 }, metadata: { width: 1 } },
      { id: "item-005", category: "Books", quantity: 1, location: { shelf: 1, compartment: 0 }, metadata: { width: 1.5 } },
      { id: "item-006", category: "Books", quantity: 1, location: { shelf: 1, compartment: 2 }, metadata: { width: 1 } },
      { id: "item-007", category: "Books", quantity: 1, location: { shelf: 1, compartment: 3 }, metadata: { width: 2 } },
      { id: "item-008", category: "Books", quantity: 1, location: { shelf: 1, compartment: 5 }, metadata: { width: 1 } },
      { id: "item-009", category: "Books", quantity: 1, location: { shelf: 1, compartment: 7 }, metadata: { width: 1.5 } },
      { id: "item-010", category: "Books", quantity: 1, location: { shelf: 1, compartment: 9 }, metadata: { width: 1 } },
      { id: "item-011", category: "Books", quantity: 1, location: { shelf: 1, compartment: 11 }, metadata: { width: 1 } },
      { id: "item-012", category: "Books", quantity: 1, location: { shelf: 1, compartment: 13 }, metadata: { width: 1.5 } },
      { id: "item-013", category: "Books", quantity: 1, location: { shelf: 2, compartment: 0 }, metadata: { width: 1 } },
      { id: "item-014", category: "Books", quantity: 1, location: { shelf: 2, compartment: 2 }, metadata: { width: 1.5 } },
      { id: "item-015", category: "Books", quantity: 1, location: { shelf: 2, compartment: 4 }, metadata: { width: 1 } },
      { id: "item-016", category: "Books", quantity: 1, location: { shelf: 2, compartment: 6 }, metadata: { width: 2 } },
      { id: "item-017", category: "Books", quantity: 1, location: { shelf: 2, compartment: 8 }, metadata: { width: 1 } },
      { id: "item-018", category: "Books", quantity: 1, location: { shelf: 3, compartment: 1 }, metadata: { width: 1.5 } },
      { id: "item-019", category: "Books", quantity: 1, location: { shelf: 3, compartment: 3 }, metadata: { width: 1 } },
      { id: "item-020", category: "Books", quantity: 1, location: { shelf: 3, compartment: 5 }, metadata: { width: 1 } },
      { id: "item-021", category: "Books", quantity: 1, location: { shelf: 4, compartment: 0 }, metadata: { width: 1 } },
      { id: "item-022", category: "Books", quantity: 1, location: { shelf: 4, compartment: 2 }, metadata: { width: 1.5 } },
      { id: "item-023", category: "Books", quantity: 1, location: { shelf: 4, compartment: 4 }, metadata: { width: 1 } },
      { id: "item-024", category: "Books", quantity: 1, location: { shelf: 4, compartment: 6 }, metadata: { width: 2 } },
      { id: "item-025", category: "Books", quantity: 1, location: { shelf: 4, compartment: 9 }, metadata: { width: 1 } }
    ]
  }
};

interface CustomBookItemProps {
  item: ShelfItem | null;
  shelfIndex: number;
  compartmentIndex: number;
}

// Custom render item component
function CustomBookItem({ item, shelfIndex, compartmentIndex }: CustomBookItemProps) {
  const { removeItemByLocation } = useMatrix();
  const colorList = ['#ff6b6b', '#4ecdc4', '#95e1d3', '#ffd93d', '#c684ff'];
  const [isHovered, setIsHovered] = useState(false);

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    removeItemByLocation(shelfIndex, compartmentIndex);
  };

  // Use item id to generate consistent color
  const colorIndex = item ? item.id.charCodeAt(item.id.length - 1) % colorList.length : 0;
  const itemColor = item ? colorList[colorIndex] : 'transparent';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: itemColor,
        borderRadius: '3px',
        position: 'relative',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {item && isHovered && (
        <button
          onClick={handleRemove}
          style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            cursor: 'pointer',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

function ShelfContent() {
  const { renderMatrix, addItem, getItems, data } = useMatrix();
  const [shelfIndex, setShelfIndex] = useState<number>(0);
  const [compartmentIndex, setCompartmentIndex] = useState<number>(0);

  const maxShelf = data.shelf.structure.num_shelves - 1;
  const maxCompartment = data.shelf.structure.compartments_per_shelf[shelfIndex] - 1;

  const handleAddItem = () => {
    addItem(shelfIndex, compartmentIndex, {
      category: 'Books',
      quantity: 1,
      metadata: { width: 1 }
    });
  };

  return (
    <div className="container">
      <div className="controls">
        <label>
          Prateleira (0-{maxShelf})
          <input
            type="number"
            value={shelfIndex}
            min={0}
            max={maxShelf}
            onChange={(e) => {
              const val = Math.min(Math.max(0, Number(e.target.value)), maxShelf);
              setShelfIndex(val);
              setCompartmentIndex(0);
            }}
          />
        </label>
        <label>
          Compartimento (0-{maxCompartment})
          <input
            type="number"
            value={compartmentIndex}
            min={0}
            max={maxCompartment}
            onChange={(e) => {
              const val = Math.min(Math.max(0, Number(e.target.value)), maxCompartment);
              setCompartmentIndex(val);
            }}
          />
        </label>
        <button onClick={handleAddItem}>
          Adicionar
        </button>
        <span className="item-count">
          Total: {getItems().length}
        </span>
      </div>

      <div className="shelves-container">
        <div className="shelf-wrapper">
          <div className="shelf-unit">
            {renderMatrix()}
          </div>
        </div>
        <div className="shelf-wrapper">
          <div className="shelf-unit">
            {renderMatrix()}
          </div>
        </div>
      </div>
    </div>
  );
}

// App component
export default function App() {
  return (
    <MatrixProvider
      initialData={initialShelfData}
      renderItem={(item: ShelfItem | null, shelfIndex: number, compartmentIndex: number) => (
        <CustomBookItem
          item={item}
          shelfIndex={shelfIndex}
          compartmentIndex={compartmentIndex}
        />
      )}
    >
      <ShelfContent />
    </MatrixProvider>
  );
}