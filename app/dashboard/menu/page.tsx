'use client'

import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import ProductCard from "@/components/cards/ProductCard";
import EditProductModal from "@/components/modals/EditProductModal";
import { AlertConfirm } from "@/components/alerts/questionAlert";
import InputAlert from "@/components/alerts/successAlert";
import ProductForm from "@/components/forms/NewProductForm";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { BiSolidFoodMenu } from "react-icons/bi";
import { Product } from "@/types/Imenu";

// Styled components
const NavBar = styled.nav`
  background-color: #f8f9fa;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    font-weight: bold;
    font-size: 1.5em;
  }
  @media screen and (max-width: 600px) {
    flex-direction: column;
    h1 {
      margin-left: 0;
    }
    div {
      flex-direction: row;
      margin-bottom: 10px;
      gap: 10px;
      margin-right: 0;
    }
  }
`;

const Container = styled.div`
  margin: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const SearchBar = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    width: 350px;
  }
`;

const CategoryButtons = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 10px;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 768px) {
    flex-wrap: wrap;
    overflow-x: visible;
  }
`;

const CategoryButton = styled.button<{ $active?: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  white-space: nowrap;
  background-color: ${props => props.$active ? '#67b7f7' : '#f8f9fa'};
  color: ${props => props.$active ? 'white' : 'black'};

  &:hover {
    opacity: 0.8;
  }
`;

// Skeleton styles
const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const SkeletonPulse = styled.div`
  display: inline-block;
  height: 100%;
  width: 100%;
  background-color: #f6f7f8;
  background-image: linear-gradient(
    to right,
    #f6f7f8 0%,
    #edeef1 20%,
    #f6f7f8 40%,
    #f6f7f8 100%
  );
  background-repeat: no-repeat;
  background-size: 800px 200px;
  animation: ${shimmer} 1.5s infinite linear;
`;

const ProductCardSkeleton = styled(SkeletonPulse)`
  height: 300px;
  border-radius: 8px;
`;

const ProductGridSkeleton = () => (
  <Container>
    {[...Array(8)].map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </Container>
);

// Styled components for the layout
const PageWrapper = styled.div``;

const ContentWrapper = styled.div`
  margin: 1.25rem;
  @media (min-width: 1024px) {
    margin: 2.5rem;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div`
  position: relative;
  padding: 1rem;
  border-radius: 0.5rem;
  width: 100%;
`;

const NoProductsMessage = styled.p`
  grid-column: 1 / -1;
  text-align: center;
`;

// Main component
export default function Menu() {
  // State variables
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDisableMode, setIsDisableMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [categories, setCategories] = useState<string[]>(['Todas']);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to fetch products from the API
  const fetchProducts = () => {
    setIsLoading(true);
    fetch("/api/v1/Product")
      .then((response) => response.json())
      .then((data: Product[]) => {
        if (Array.isArray(data)) {
          setProducts(data);

          // Extract unique categories
          const categorySet = new Set<string>();
          data.forEach((item: Product) => categorySet.add(item.Category.Name));
          const uniqueCategories = ['Todas', ...Array.from(categorySet)];
          setCategories(uniqueCategories);
        } else {
          InputAlert('Incorrect data format', 'error');
        }
      })
      .catch((error) => InputAlert('Error fetching information', 'error'))
      .finally(() => setIsLoading(false));
  };

  // Function to handle adding a new product
  const handleProductAdded = (newProduct: Product) => {
    setProducts([...products, newProduct]);
  };

  // Function to handle disabling a product
  const handleDisableProduct = async (id: number) => {
    try {
      const result = await AlertConfirm(
        "Are you sure you want to delete this product?"
      );

      if (result.isConfirmed) {
        const productToUpdate = products.find(p => p.Id === id);
        if (!productToUpdate) throw new Error("Product not found");

        const response = await fetch(`/api/v1/Product/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...productToUpdate, Status: 1 }),
        });

        if (response.ok) {
          setProducts(products.map(p => p.Id === id ? { ...p, Status: 1 } : p));
          setIsDisableMode(false);
          await InputAlert(
            "The product has been successfully deleted",
            "success"
          );
        } else {
          throw new Error("Network response was not ok");
        }
      }
    } catch (error) {
      await InputAlert("Error deleting the product", "error");
    }
  };

  // Function to handle editing a product
  const handleEditProduct = async (updatedProduct: Product) => {
    try {
      const response = await fetch(`/api/v1/Product/${updatedProduct.Id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        setProducts(
          products.map((p) => (p.Id === updatedProduct.Id ? updatedProduct : p))
        );
        setEditingProduct(null);
        await InputAlert(
          "El producto ha sido exitosamente actualizado",
          "success"
        );
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      await InputAlert("Error updating the product", "error");
    }
  };

  // Toggle disable mode
  const toggleDisableMode = () => {
    setIsDisableMode(!isDisableMode);
    setIsEditMode(false);
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setIsDisableMode(false);
  };

  // Handle product click based on current mode
  const handleProductClick = (id: number) => {
    if (isDisableMode) {
      handleDisableProduct(id);
    } else if (isEditMode) {
      const productToEdit = products.find((p) => p.Id === id);
      if (productToEdit) {
        setEditingProduct(productToEdit);
      }
    }
  };

  // Filter enabled products
  const enabledProducts = products.filter(p => p.Status === 0);

  // Filter products based on search term and selected category
  const filteredProducts = enabledProducts.filter(product => {
    const matchesCategory = selectedCategory === 'Todas' || product.Category.Name === selectedCategory;
    const matchesSearch = product.Name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageWrapper>
      <NavBar>
        <div className="flex items-center gap-2">
          <BiSolidFoodMenu className="text-[2em] text-gray-800" />
          <h1 className="text-[1.5em] text-gray-800">Product Management</h1>
        </div>
        <div className="flex gap-8 mt-3 lg:mt-0">
          <Button
            variant="secondary"
            className="flex flex-col items-center lg:flex-row"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusCircle className="mr-2 w-6 h-6 text-green-500" />
            Add Product
          </Button>
          <Button
            className={`flex flex-col items-center lg:flex-row ${isEditMode ? "text-blue-600" : "text-black"}`}
            variant="secondary"
            onClick={toggleEditMode}
            disabled={isDisableMode}
          >
            <Edit className="mr-2 w-6 h-6 text-blue-500" />
            {isEditMode ? "Cancel Edit" : "Edit Products"}
          </Button>
          <Button
            className={`flex flex-col items-center lg:flex-row ${isDisableMode ? "text-red-600" : "text-black"}`}
            variant="secondary"
            onClick={toggleDisableMode}
            disabled={isEditMode}
          >
            <Trash2 className="mr-2 w-6 h-6 text-red-500" />
            {isDisableMode ? "Cancel Delete" : "Delete Products"}
          </Button>
        </div>
      </NavBar>

      <ContentWrapper>
        <SearchBar
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <CategoryButtons>
          {categories.map(category => (
            <CategoryButton
              key={category}
              onClick={() => setSelectedCategory(category)}
              $active={selectedCategory === category}
            >
              {category}
            </CategoryButton>
          ))}
        </CategoryButtons>

        {isLoading ? (
          <ProductGridSkeleton />
        ) : (
          <ProductGrid>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.Id}
                  product={product}
                  onClick={handleProductClick}
                  priority={index === 0}
                />
              ))
            ) : (
              <NoProductsMessage>No products available</NoProductsMessage>
            )}
          </ProductGrid>
        )}
      </ContentWrapper>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ProductForm
              onProductAdded={handleProductAdded}
              setIsModalOpen={setIsModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </ModalContent>
        </ModalOverlay>
      )}

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onSave={handleEditProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </PageWrapper>
  );
}