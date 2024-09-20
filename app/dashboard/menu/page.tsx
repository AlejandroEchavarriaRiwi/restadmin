"use client";
import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import ProductCard from "@/components/cards/ProductCard";
import EditProductModal from "@/components/modals/EditProductModal";
import { AlertConfirm } from "@/components/alerts/questionAlert";
import InputAlert from "@/components/alerts/successAlert";
import ProductForm from "@/components/forms/NewProductForm";
import { PlusCircle, Edit, Trash2, Minimize2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { BiSolidFoodMenu } from "react-icons/bi";
import { Product } from "@/types/Imenu";


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

export default function Menu() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDisableMode, setIsDisableMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [categories, setCategories] = useState<string[]>(['Todas']);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setIsLoading(true);
    fetch("/api/v1/Product")
      .then((response) => response.json())
      .then((data: Product[]) => {
        if (Array.isArray(data)) {
          setProducts(data);
          console.log("Productos cargados:", data);

          // Extract categories
          const categorySet = new Set<string>();
          data.forEach((item: Product) => categorySet.add(item.Category.Name));
          const uniqueCategories = ['Todas', ...Array.from(categorySet)];
          setCategories(uniqueCategories);
        } else {
          console.error("Formato de datos incorrecto");
        }
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setIsLoading(false));
  };
  const handleProductAdded = (newProduct: Product) => {
    setProducts([...products, newProduct]);
  };

  const handleDisableProduct = async (id: number) => {
    try {
      const result = await AlertConfirm(
        "¿Estás seguro de querer eliminar este producto?"
      );

      if (result.isConfirmed) {
        const productToUpdate = products.find(p => p.Id === id);
        if (!productToUpdate) throw new Error("Producto no encontrado");

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
            "El producto ha sido eliminado exitosamente",
            "success"
          );
        } else {
          throw new Error("Network response was not ok");
        }
      }
    } catch (error) {
      await InputAlert("Error eliminando el producto", "error");
    }
  };

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
          "El producto ha sido actualizado exitosamente",
          "success"
        );
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error al enviar solicitud PUT:", error);
      await InputAlert("Error actualizando el producto", "error");
    }
  };

  const toggleDisableMode = () => {
    setIsDisableMode(!isDisableMode);
    setIsEditMode(false);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setIsDisableMode(false);
  };

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

  const enabledProducts = products.filter(p => p.Status === 0);

  const filteredProducts = enabledProducts.filter(product => {
    const matchesCategory = selectedCategory === 'Todas' || product.Category.Name === selectedCategory;
    const matchesSearch = product.Name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="">
      <NavBar>
        <div className="flex items-center gap-2 ">
          <BiSolidFoodMenu className="text-[2em] text-gray-800" />
          <h1 className="text-[1.5em] text-gray-800">Gestión de productos</h1>
        </div>
        <div className="flex gap-8 mt-3 lg:mt-0">
          <Button
            variant="secondary"
            className="flex flex-col items-center lg:flex-row"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusCircle className="mr-2 w-6 h-6   text-green-500 " />
            Agregar Producto

          </Button>
          <Button
            className={`flex flex-col items-center lg:flex-row  ${isEditMode ? "text-blue-600" : "text-black"
              }`}
            variant="secondary"
            onClick={toggleEditMode}
            disabled={isDisableMode}
          >
            <Edit className="mr-2 w-6 h-6 text-blue-500" />
            {isEditMode ? "Cancelar Edición" : "Editar Productos"}
          </Button>
          <Button
            className={`flex flex-col items-center lg:flex-row ${isDisableMode ? "text-red-600" : "text-black"
              }`}
            variant="secondary"
            onClick={toggleDisableMode}
            disabled={isEditMode}
          >
            <Trash2 className="mr-2 w-6 h-6 text-red-500" />
            {isDisableMode ? "Cancelar Eliminación" : "Eliminar Productos"}
          </Button>
        </div>
      </NavBar>

      <div className="m-5 lg:m-10">
        <SearchBar
          type="text"
          placeholder="Buscar..."
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
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
              <p className="col-span-full text-center">No hay productos disponibles</p>
            )}
          </div>
        )}
      </div>
      
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative p-4 rounded-lg w-full">
            
            <ProductForm
              onProductAdded={handleProductAdded}
              setIsModalOpen={setIsModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onSave={handleEditProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
}