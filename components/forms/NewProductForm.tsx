import React, { useState } from 'react';
import useFormStore from '../../app/dashboard/store';
import ImageUpload from '../buttons/ButtonImageUpdload';
import CategorySelection, { Category } from '../buttons/selectCategoriesButton';
import SubmitAlert from '../alerts/submitAlert';
import { Product } from '@/types/Imenu';

interface ProductFormProps {
    setIsModalOpen: (isOpen: boolean) => void;
    onProductAdded: (product: Product) => void;
    onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ setIsModalOpen, onProductAdded, onClose }) => {
    const { name, price, cost, setName, setPrice, setCost, imageURL, setImageURL } = useFormStore();
    const [category, setCategory] = useState<Category | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!name.trim()) newErrors.name = 'El nombre es requerido';
        if (price <= 0) newErrors.price = 'El precio debe ser mayor que 0';
        if (cost <= 0) newErrors.cost = 'El costo debe ser mayor que 0';
        if (!category) newErrors.category = 'La categoría es requerida';
        if (!imageURL.trim()) newErrors.imageURL = 'La imagen es requerida';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const productData = {
                name,
                price,
                cost,
                imageURL,
                categoryId: category!.Id,
                status: 0, // Añadimos el campo Status con valor 0 por defecto
            };

            const response = await fetch('/api/v1/Product', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Form submitted:', data);

            const newProduct: Product = {
                Id: data.Id,
                Name: data.Name,
                Cost: data.Cost,
                Price: data.Price,
                ImageURL: data.ImageURL,
                Category: { Id: data.CategoryId, Name: category!.Name },
                CategoryId: data.CategoryId,
                Status: data.Status, // Añadimos el campo Status al nuevo producto
            };

            onProductAdded(newProduct);

            SubmitAlert("El producto fue añadido exitosamente", "success", () => {
                setIsModalOpen(false);
                onClose();
            });

            // Reset form
            setName('');
            setCost(0);
            setPrice(0);
            setImageURL('');
            setCategory(null);

        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Agregar Nuevo Producto</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block font-semibold mb-1">Nombre:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 ${errors.name ? 'border-red-500' : ''}`}
                        placeholder="Ingresa el nombre del producto"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="cost" className="block font-semibold mb-1">Costo:</label>
                        <input
                            type="number"
                            id="cost"
                            value={cost}
                            onChange={(e) => setCost(e.target.valueAsNumber)}
                            className={`w-full border rounded-lg px-3 py-2 ${errors.cost ? 'border-red-500' : ''}`}
                            placeholder="Ingresa el costo"
                        />
                        {errors.cost && <p className="text-red-500 text-sm mt-1">{errors.cost}</p>}
                    </div>
                    <div>
                        <label htmlFor="price" className="block font-semibold mb-1">Precio:</label>
                        <input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.valueAsNumber)}
                            className={`w-full border rounded-lg px-3 py-2 ${errors.price ? 'border-red-500' : ''}`}
                            placeholder="Ingresa el precio"
                        />
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                    </div>
                </div>
                <CategorySelection category={category} setCategory={setCategory} />
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                <ImageUpload imageUrl={imageURL} setImageUrl={setImageURL} />
                {errors.imageURL && <p className="text-red-500 text-sm mt-1">{errors.imageURL}</p>}
                <button
                    type="submit"
                    className="w-full py-2 bg-amarillo text-white rounded-lg hover:bg-amber-500 transition-colors"
                >
                    Guardar Producto
                </button>
            </form>
        </div>
    );
};

export default ProductForm;