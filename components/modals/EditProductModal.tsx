import React, { useState } from 'react';
import { Product } from '@/types/Imenu';
import { CldUploadWidget } from 'next-cloudinary';
import CategorySelection, { Category } from '../buttons/selectCategoriesButton';

// Definimos una interfaz para extender Product con category opcional
interface EditableProduct extends Omit<Product, 'category'> {
    category: Category | null;
}

const EditProductModal = ({ product, onSave, onClose }: { product: Product, onSave: (updatedProduct: Product) => void, onClose: () => void }) => {
    const [editedProduct, setEditedProduct] = useState<EditableProduct>({
        ...product,
        category: product.category || null
    });
    const [localImageURL, setLocalImageURL] = useState<string>(product.imageURL);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedProduct(prev => ({ ...prev, [name]: name === 'price' || name === 'cost' ? parseFloat(value) : value }));
    };

    const handleCategoryChange = (category: Category | null) => {
        setEditedProduct(prev => ({
            ...prev,
            category: category,
            categoryId: category ? category.id : null
        }));
    };

    const handleUploadSuccess = (result: any) => {
        const imageURL = result.info.secure_url;
        setLocalImageURL(imageURL);
        setEditedProduct(prev => ({ ...prev, imageURL: imageURL }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Asegúrate de que el producto cumple con la interfaz Product antes de pasarlo a onSave
        const productToSave: Product = {
            ...editedProduct,
            category: editedProduct.category as Category // Asumimos que category no será null al guardar
        };
        onSave(productToSave);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Editar Producto</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block font-semibold mb-1">Nombre:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={editedProduct.name}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="cost" className="block font-semibold mb-1">Costo:</label>
                        <input
                            type="number"
                            id="cost"
                            name="cost"
                            value={editedProduct.cost}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="price" className="block font-semibold mb-1">Precio:</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={editedProduct.price}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    <div>
                        <CategorySelection
                            category={editedProduct.category}
                            setCategory={handleCategoryChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="image" className="block font-semibold mb-1">Imagen del producto:</label>
                        <CldUploadWidget
                            uploadPreset="my_preset"
                            onSuccess={handleUploadSuccess}
                        >
                            {({ open }) => (
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-azulmedio text-white rounded-lg hover:bg-azuloscuro"
                                    onClick={() => open()}
                                >
                                    Cargar imagen
                                </button>
                            )}
                        </CldUploadWidget>
                        {localImageURL && (
                            <img
                                src={localImageURL}
                                alt="Producto"
                                className="mt-4 rounded-md"
                                style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                            />
                        )}
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductModal;