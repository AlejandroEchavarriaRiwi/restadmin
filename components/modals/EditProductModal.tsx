import React, { useState } from 'react';
import { Product } from '@/types/Imenu';
import { CldUploadWidget } from 'next-cloudinary';
import CategorySelection, { Category } from '../buttons/selectCategoriesButton';

// Interfaz para el estado editable del producto
interface EditableProduct extends Omit<Product, 'Category' | 'CategoryId'> {
    Category: Category | null;
    CategoryId: number | null;
}

const EditProductModal = ({ product, onSave, onClose }: { product: Product, onSave: (updatedProduct: Product) => void, onClose: () => void }) => {
    const [editedProduct, setEditedProduct] = useState<EditableProduct>({
        ...product,
        Category: product.Category,
        CategoryId: product.CategoryId
    });
    const [localImageURL, setLocalImageURL] = useState<string>(product.ImageURL);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedProduct(prev => ({ 
            ...prev, 
            [name]: name === 'Price' || name === 'Cost' ? parseFloat(value) : value 
        }));
    };

    const handleCategoryChange = (category: Category | null) => {
        setEditedProduct(prev => ({
            ...prev,
            Category: category,
            CategoryId: category ? category.Id : null
        }));
    };

    const handleUploadSuccess = (result: any) => {
        const imageURL = result.info.secure_url;
        setLocalImageURL(imageURL);
        setEditedProduct(prev => ({ ...prev, ImageURL: imageURL }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editedProduct.Category && editedProduct.CategoryId !== null) {
            const productToSave: Product = {
                ...editedProduct,
                Category: editedProduct.Category,
                CategoryId: editedProduct.CategoryId
            };
            onSave(productToSave);
        } else {
            console.error('No se ha seleccionado una categoría válida');
            // Aquí puedes mostrar un mensaje de error al usuario
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Editar Producto</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="Name" className="block font-semibold mb-1">Nombre:</label>
                        <input
                            type="text"
                            id="Name"
                            name="Name"
                            value={editedProduct.Name}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="Cost" className="block font-semibold mb-1">Costo:</label>
                        <input
                            type="number"
                            id="Cost"
                            name="Cost"
                            value={editedProduct.Cost}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="Price" className="block font-semibold mb-1">Precio:</label>
                        <input
                            type="number"
                            id="Price"
                            name="Price"
                            value={editedProduct.Price}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    <div>
                        <CategorySelection
                            category={editedProduct.Category}
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