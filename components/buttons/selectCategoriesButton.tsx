import React, { useState, useEffect } from 'react';

export interface Category {
    id: number;
    name: string;
}

interface CategorySelectionProps {
    category: Category | null;
    setCategory: (category: Category) => void;
}

const CategorySelection: React.FC<CategorySelectionProps> = ({ category, setCategory }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);

    useEffect(() => {
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

        fetchCategories();
    }, []);

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

    return (
        <div className="relative">
            <label htmlFor="category" className="block font-semibold mb-1">Categoría:</label>
            <select
                id="category"
                value={category?.id || ''}
                onChange={(e) => {
                    const selectedCategory = categories.find(cat => cat.id === parseInt(e.target.value));
                    if (selectedCategory) {
                        setCategory(selectedCategory);
                    }
                }}
                className="w-full border rounded-lg px-3 py-2 bg-white shadow-md transition-opacity duration-300 ease-in-out"
            >
                <option value="">Selecciona una categoría</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>
            <button
                type="button"
                onClick={() => setIsAddingCategory(true)}
                className="mt-2 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
                Añadir Nueva Categoría
            </button>
            {isAddingCategory && (
                <div className="absolute left-0 top-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-2">
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
