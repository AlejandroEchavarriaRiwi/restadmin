import React, { useState, useEffect } from 'react';
import Select from 'react-select';

export interface Category {
    id: number;
    name: string;
}

interface CategorySelectionProps {
    category: Category | null;
    setCategory: (category: Category | null) => void;
}

const CategorySelection: React.FC<CategorySelectionProps> = ({ category, setCategory }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

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
                body: JSON.stringify({ name: newCategory }),
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

            setCategories((prevCategories) => prevCategories.filter((cat) => cat.id !== id));
            if (category && category.id === id) {
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
                    handleDeleteCategory(data.value.id);
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
                value={category ? { value: category, label: category.name } : null}
                onChange={(selectedOption: any) => setCategory(selectedOption ? selectedOption.value : null)}
                options={categories.map(cat => ({ value: cat, label: cat.name }))}
                components={{ Option: CategoryOption }}
                className="w-full"
                classNamePrefix="react-select"
            />
            <button
                type="button"
                onClick={() => setIsAddingCategory(true)}
                className="mt-2 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
                Añadir Nueva Categoría
            </button>
            {isAddingCategory && (
                <div className="absolute left-0 top-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-10">
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
                        className="w-full py-2 bg-green-500 text-white rounded-b-lg hover:bg-green-600"
                    >
                        Añadir Categoría
                    </button>
                </div>
            )}
        </div>
    );
};

export default CategorySelection;