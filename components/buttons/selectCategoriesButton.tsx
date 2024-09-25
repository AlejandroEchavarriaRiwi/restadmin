import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import styled from 'styled-components';

// Category interface
export interface Category {
  Id: number;
  Name: string;
}

interface CategorySelectionProps {
  category: Category | null;
  setCategory: (category: Category | null) => void;
}

// Custom hook to detect clicks outside an element
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

// Styled components for the various elements
const Container = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const AddButton = styled.button`
  margin-top: 0.5rem;
  width: 100%;
  padding: 0.5rem;
  background-color: #67b7f7;
  color: white;
  border-radius: 0.5rem;
  &:hover {
    background-color: #4b9fea;
  }
`;

const AddCategoryContainer = styled.div`
  position: absolute;
  left: 0;
  top: 100%;
  margin-top: 0.5rem;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  z-index: 10;
`;

const Input = styled.input`
  width: 100%;
  border-bottom: 1px solid #d1d5db;
  padding: 0.5rem;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
`;

const ConfirmButton = styled.button`
  width: 100%;
  padding: 0.5rem;
  background-color: #67b7f7;
  color: white;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  &:hover {
    background-color: #4b9fea;
  }
`;

const DeleteButton = styled.button`
  color: #f87171;
  &:hover {
    color: #ef4444;
  }
`;

// Main component
const CategorySelection: React.FC<CategorySelectionProps> = ({ category, setCategory }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const addCategoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Use the custom hook
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
      <DeleteButton
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteCategory(data.value.Id);
        }}
      >
        Eliminar
      </DeleteButton>
    </div>
  );

  return (
    <Container>
      <Label htmlFor="category">Categoría:</Label>
      <Select
        id="category"
        value={category ? { value: category, label: category.Name } : null}
        onChange={(selectedOption: any) => setCategory(selectedOption ? selectedOption.value : null)}
        options={categories.map(cat => ({ value: cat, label: cat.Name }))}
        components={{ Option: CategoryOption }}
        className="w-full"
        classNamePrefix="react-select"
      />
      <AddButton type="button" onClick={() => setIsAddingCategory(true)}>
        Añadir Nueva Categoría
      </AddButton>
      {isAddingCategory && (
        <AddCategoryContainer ref={addCategoryRef}>
          <Input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nombre de nueva categoría"
          />
          <ConfirmButton type="button" onClick={handleAddCategory}>
            Añadir Categoría
          </ConfirmButton>
        </AddCategoryContainer>
      )}
    </Container>
  );
};

export default CategorySelection;
