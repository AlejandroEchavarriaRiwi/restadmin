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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!category) {
            alert('Por favor selecciona una categoría');
            return;
        }

        try {
            const response = await fetch('https://restadmin.azurewebsites.net/api/v1/Product', {
                method: 'POST',
                headers: {
                    'accept': 'text/plain',
                    'Content-Type': 'application/json',
                    
                },
                body: JSON.stringify({
                    name,
                    price,
                    cost,
                    imageURL,
                    categoryId: category.id,
                    category: {
                        id: category.id,
                        name: category.name,
                    },
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Form submitted:', data);

            const newProduct: Product = {
                id: data.id,
                name,
                cost,
                price,
                imageURL,
                category: data.name,
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
                        className="w-full border rounded-lg px-3 py-2"
                        placeholder="Ingresa el nombre del producto"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="cost" className="block font-semibold mb-1">Costo:</label>
                        <input
                            type="number"
                            id="cost"
                            value={cost}
                            onChange={(e) => setCost(e.target.valueAsNumber)}
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="Ingresa el costo"
                        />
                    </div>
                    <div>
                        <label htmlFor="price" className="block font-semibold mb-1">Precio:</label>
                        <input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.valueAsNumber)}
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="Ingresa el precio"
                        />
                    </div>
                </div>
                <CategorySelection category={category} setCategory={setCategory} />
                <ImageUpload imageUrl={imageURL} setImageUrl={setImageURL} />
                <button
                    type="submit"
                    className="w-full py-2 bg-amarillo text-white rounded-lg"
                >
                    Guardar Producto
                </button>
            </form>
        </div>
    );
};

export default ProductForm;
