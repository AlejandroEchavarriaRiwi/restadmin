import React, { useState } from 'react';
import styled from 'styled-components';
import { Product } from '@/types/Imenu';
import { CldUploadWidget } from 'next-cloudinary';
import CategorySelection, { Category } from '../buttons/selectCategoriesButton';
import InputAlert from '../alerts/successAlert';

// Interface for editable product state
interface EditableProduct extends Omit<Product, 'Category' | 'CategoryId'> {
    Category: Category | null;
    CategoryId: number | null;
}

// Styled-components
const Overlay = styled.div`
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalContainer = styled.div`
    background-color: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto; /* Enable scroll if content is too large */
`;

const Title = styled.h2`
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Label = styled.label`
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
`;

const Input = styled.input`
    width: 100%;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    padding: 0.75rem;
    font-size: 1rem;
`;

const Button = styled.button<{ variant?: string }>`
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    cursor: pointer;
    ${(props) =>
        props.variant === 'primary'
            ? `
        background-color: #3b82f6;
        color: white;
        &:hover {
            background-color: #2563eb;
        }
    `
            : `
        background-color: #e5e7eb;
        color: black;
    `}
`;

const ImagePreview = styled.img`
    margin-top: 1rem;
    border-radius: 0.5rem;
    width: 200px;
    height: 200px;
    object-fit: cover;
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
`;

// Main EditProductModal component
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editedProduct.Category && editedProduct.CategoryId !== null) {
            const productToSave: Product = {
                ...editedProduct,
                Category: editedProduct.Category,
                CategoryId: editedProduct.CategoryId
            };
            onSave(productToSave);
        } else {
            await InputAlert('No se ha seleccionado una categoria valida', 'error')
            // You can show an error message here to the user
        }
    };

    return (
        <Overlay>
            <ModalContainer>
                <Title>Editar Producto</Title>
                <Form onSubmit={handleSubmit}>
                    <div>
                        <Label htmlFor="Name">Nombre:</Label>
                        <Input
                            type="text"
                            id="Name"
                            name="Name"
                            value={editedProduct.Name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="Cost">Costo:</Label>
                        <Input
                            type="number"
                            id="Cost"
                            name="Cost"
                            value={editedProduct.Cost}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="Price">Precio:</Label>
                        <Input
                            type="number"
                            id="Price"
                            name="Price"
                            value={editedProduct.Price}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <CategorySelection
                            category={editedProduct.Category}
                            setCategory={handleCategoryChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="image">Imagen del producto:</Label>
                        <CldUploadWidget
                            uploadPreset="my_preset"
                            onSuccess={handleUploadSuccess}
                        >
                            {({ open }) => (
                                <Button type="button" onClick={() => open()} variant="primary">
                                    Cargar imagen
                                </Button>
                            )}
                        </CldUploadWidget>
                        {localImageURL && (
                            <ImagePreview
                                src={localImageURL}
                                alt="Producto"
                            />
                        )}
                    </div>

                    <ButtonGroup>
                        <Button type="button" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary">
                            Guardar
                        </Button>
                    </ButtonGroup>
                </Form>
            </ModalContainer>
        </Overlay>
    );
};

export default EditProductModal;
