import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';

export interface Category {
  Id: number;
  Name: string;
}

interface CategorySelectionProps {
  category: Category | null;
  setCategory: (category: Category | null) => void;
}

// Hook personalizado para detectar clics fuera del elemento
const useClickOutside = (ref: React.RefObject<HTMLElement>, callback: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};

const CategorySelection: React.FC<CategorySelectionProps> = ({ category, setCategory }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const addCategoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Usar el hook personalizado
  useClickOutside(addCategoryRef, () => {
    setIsAddingCategory(false);
  });

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://restadmin.azurewebsites.net/api/v1/Categories');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.trim() === '') return;

    try {
      const response = await fetch('https://restadmin.azurewebsites.net/api/v1/Categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Name: newCategory }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCategories((prevCategories) => [...prevCategories, data]);
      setNewCategory('');
      setIsAddingCategory(false);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      const response = await fetch(`https://restadmin.azurewebsites.net/api/v1/Categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setCategories((prevCategories) => prevCategories.filter((cat) => cat.Id !== id));
      if (category && category.Id === id) {
        setCategory(null);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const CategoryOption = ({ innerProps, label, data }: any) => (
    <div {...innerProps} className="flex justify-between items-center p-2">
      <span>{label}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteCategory(data.value.Id);
        }}
        className="text-red-500 hover:text-red-700"
      >
        Eliminar
      </button>
    </div>
  );

  return (
    <div className="relative">
      <label htmlFor="category" className="block font-semibold mb-1">Categoría:</label>
      <Select
        id="category"
        value={category ? { value: category, label: category.Name } : null}
        onChange={(selectedOption: any) => setCategory(selectedOption ? selectedOption.value : null)}
        options={categories.map(cat => ({ value: cat, label: cat.Name }))}
        components={{ Option: CategoryOption }}
        className="w-full"
        classNamePrefix="react-select"
      />
      <button
        type="button"
        onClick={() => setIsAddingCategory(true)}
        className="mt-2 w-full py-2 bg-[#67b7f7] text-white rounded-lg hover:bg-[#4b9fea]"
      >
        Añadir Nueva Categoría
      </button>
      {isAddingCategory && (
        <div ref={addCategoryRef} className="absolute left-0 top-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-10">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-full border-b border-gray-300 px-3 py-2 rounded-t-lg"
            placeholder="Nombre de nueva categoría"
          />
          <button
            type="button"
            onClick={handleAddCategory}
            className="w-full py-2 bg-[#67b7f7] text-white rounded-b-lg hover:bg-[#4b9fea]"
          >
            Añadir Categoría
          </button>
        </div>
      )}
    </div>
  );
};

export default CategorySelection;