import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import useFormStore from '../../app/dashboard/store';
import ImageUpload from '../buttons/ButtonImageUpdload';
import CategorySelection, { Category } from '../buttons/selectCategoriesButton';
import SubmitAlert from '../alerts/submitAlert';
import { Product } from '@/types/Imenu';
import { Minimize2 } from 'lucide-react';
import InputAlert from '../alerts/successAlert';

// Styled components
const FormContainer = styled.div`
  padding: 1rem;
  max-width: 28rem;
  margin: 0 auto;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  position: relative;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const CloseButton = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 0.75rem;
  padding: 0.5rem;
  color: #111827;
  border-radius: 0.25rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  border: 1px solid ${props => props.hasError ? '#ef4444' : '#d1d5db'};
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.5rem;
  background-color: #4655c4;
  color: white;
  border-radius: 0.5rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #4b9fea;
  }
`;

// Component interface
interface ProductFormProps {
    setIsModalOpen: (isOpen: boolean) => void;
    onProductAdded: (product: Product) => void;
    onClose: () => void;
}

// Main component
const ProductForm: React.FC<ProductFormProps> = ({ setIsModalOpen, onProductAdded, onClose }) => {
    // State management using custom hook
    const { name, price, cost, setName, setPrice, setCost, imageURL, setImageURL } = useFormStore();
    const [category, setCategory] = useState<Category | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Function to reset the form
    const resetForm = useCallback(() => {
        setName('');
        setCost(0);
        setPrice(0);
        setImageURL('');
        setCategory(null);
        setErrors({});
    }, [setName, setCost, setPrice, setImageURL, setCategory]);

    // Effect to reset the form when the modal is closed
    useEffect(() => {
        return () => {
            resetForm();
        };
    }, [resetForm]);

    // Form validation function
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

    // Form submission handler
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            // Prepare product data
            const productData = {
                name,
                price,
                cost,
                imageURL,
                categoryId: category!.Id,
                status: 0,
            };

            // Send POST request to add new product
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

            // Create new product object
            const newProduct: Product = {
                Id: data.Id,
                Name: data.Name,
                Cost: data.Cost,
                Price: data.Price,
                ImageURL: data.ImageURL,
                Category: { Id: data.CategoryId, Name: category!.Name },
                CategoryId: data.CategoryId,
                Status: data.Status,
            };

            // Call onProductAdded callback
            onProductAdded(newProduct);

            // Show success alert and close modal
            SubmitAlert("El producto fue añadido exitosamente", "success", () => {
                setIsModalOpen(false);
                onClose();
            });

            // Reset form
            resetForm();

        } catch (error) {
            // Show error alert
            await InputAlert('Error enviando el producto', 'error')
        }
    };

    return (
        <FormContainer>
            <Title>Agregar Nuevo Producto</Title>
            <CloseButton onClick={() => setIsModalOpen(false)}>
                <Minimize2 size="1.5em" />
            </CloseButton>
            <Form onSubmit={handleSubmit}>
                <InputGroup>
                    <Label htmlFor="name">Nombre:</Label>
                    <Input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        hasError={!!errors.name}
                        placeholder="Ingresa el nombre del producto"
                    />
                    {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
                </InputGroup>
                <InputGrid>
                    <InputGroup>
                        <Label htmlFor="cost">Costo:</Label>
                        <Input
                            type="number"
                            id="cost"
                            value={cost}
                            onChange={(e) => setCost(e.target.valueAsNumber)}
                            hasError={!!errors.cost}
                            placeholder="Ingresa el costo"
                        />
                        {errors.cost && <ErrorMessage>{errors.cost}</ErrorMessage>}
                    </InputGroup>
                    <InputGroup>
                        <Label htmlFor="price">Precio:</Label>
                        <Input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.valueAsNumber)}
                            hasError={!!errors.price}
                            placeholder="Ingresa el precio"
                        />
                        {errors.price && <ErrorMessage>{errors.price}</ErrorMessage>}
                    </InputGroup>
                </InputGrid>
                <CategorySelection category={category} setCategory={setCategory} />
                {errors.category && <ErrorMessage>{errors.category}</ErrorMessage>}
                <ImageUpload imageUrl={imageURL} setImageUrl={setImageURL} />
                {errors.imageURL && <ErrorMessage>{errors.imageURL}</ErrorMessage>}
                <SubmitButton type="submit">
                    Guardar Producto
                </SubmitButton>
            </Form>
        </FormContainer>
    );
};

export default ProductForm;