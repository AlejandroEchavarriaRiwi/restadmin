'use client'
import React, { useState, useEffect, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { User } from "../models/user.models";
import Modal from "../components/modals/UsersModal";
import { FaPeopleRobbery } from "react-icons/fa6";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import { AlertConfirm } from "./alerts/questionAlert";
import InputAlert from "./alerts/successAlert";

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

const ModuleContainer = styled.div`
  padding: 20px;
  width: 100%;

  h1 {
    font-weight: bold;
    font-size: x-large;
    margin-bottom: 20px;
  }
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
`;

const CardField = styled.p`
  margin-bottom: 10px;
  font-size: 14px;

  strong {
    font-weight: 600;
    margin-right: 5px;
  }
`;

const RoleBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  background-color: #e5f7ed;
  color: #0f766e;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
`;

const ActionButton = styled(Button)`
  margin-right: 5px;
`;

const CardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
`;
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
  background-size: 800px 104px;
  animation: ${shimmer} 1.5s infinite linear;
`;

const SkeletonCell = styled(SkeletonPulse)`
  height: 20px;
  width: 100%;
`;

const SkeletonRow = styled.tr`
  td {
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }
`;

const CardSkeleton = () => (
  <Card>
    <SkeletonCell />
    <SkeletonCell />
    <SkeletonCell />
    <SkeletonCell />
    <SkeletonCell />
  </Card>
);

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();


  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
      const response = await fetch(`${apiUrl}/v1/User`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: User[] = await response.json();
      setUsers(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Ocurrió un error desconocido"
      );
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user, fetchUsers]);

  const handleDeleteUser = async (userId: number) => {
    try {    
      const result = await AlertConfirm("¿Está seguro de que desea eliminar este usuario?")
      if (result.isConfirmed) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
        const response = await fetch(`${apiUrl}/v1/User/${userId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        fetchUsers();
        await InputAlert("Usuario eliminado con éxito!", "success");
      } catch (error) {
        await InputAlert("Error al eliminar el usuario","error");
      }
    }}catch (error) { await InputAlert("Error al eliminar el usuario","error")
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleSaveUser = async (userData: User) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
      const isEditing = !!editingUser;
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `${apiUrl}/v1/User/${userData.Id}`
        : `${apiUrl}/v1/User`;

      const dataToSend: Partial<User> = {
        Id: userData.Id,
        Name: userData.Name,
        Email: userData.Email,
        Phone: userData.Phone,
        Address: userData.Address,
        RoleId: userData.RoleId,
        PasswordHash: userData.PasswordHash,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchUsers();
      handleCloseModal();
      
      isEditing
          ? InputAlert("Usuario actualizado con éxito!","success")
          : InputAlert("Usuario creado con éxito!","success")
  
    } catch (error) {
      InputAlert("Error al guardar el usuario. Por favor, intente de nuevo.","error");
    }
  };

  return (
    <>
      <NavBar>
        <div className="flex items-center ">
          <FaPeopleRobbery className="text-3xl text-gray-800" />
          <h1 className="ml-4 text-gray-800">Administración de usuarios</h1>
        </div>
        <div className="flex gap-4 mr-4 ">
          <Button onClick={handleCreateUser} className="flex items-center">
            <PlusCircle className="mr-2 h-4 w-4 text-green-500" />
            Crear nuevo usuario
          </Button>
        </div>
      </NavBar>
      <ModuleContainer>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <CardContainer>
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))
            : users.map((user) => (
                <Card key={user.Id}>
                  <CardField>
                    <strong>Nombre:</strong> {user.Name}
                  </CardField>
                  <CardField>
                    <strong>Email:</strong> {user.Email}
                  </CardField>
                  <CardField>
                    <strong>Celular:</strong> {user.Phone}
                  </CardField>
                  <CardField>
                    <strong>Dirección:</strong> {user.Address}
                  </CardField>
                  <CardField>
                    <strong>Rol:</strong> <RoleBadge>{user.Role.Name}</RoleBadge>
                  </CardField>
                  <CardActions>
                    <ActionButton
                      onClick={() => handleEditUser(user)}
                      className="flex items-center text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </ActionButton>
                    <ActionButton
                      onClick={() => handleDeleteUser(user.Id)}
                      className="flex items-center text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Borrar
                    </ActionButton>
                  </CardActions>
                </Card>
              ))}
        </CardContainer>
        {showModal && (
          <Modal
            isOpen={showModal}
            onClose={handleCloseModal}
            onSave={handleSaveUser}
            user={editingUser}
          />
        )}
      </ModuleContainer>
    </>
  );
}