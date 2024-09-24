'use client'
import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useAuth } from "../hooks/useAuth";
import { User } from "../models/user.models";
import { AlertConfirm } from "./alerts/questionAlert";
import InputAlert from "./alerts/successAlert";
import NavBar from "./navbars/navbardashboard";
import UserList from "./list/userList";
import UserModal from "../components/modals/UsersModal";


const ErrorMessage = styled.p`
  color: red;
`;


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
      const response = await fetch(`/api/v1/User`, {
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
        const response = await fetch(`/api/v1/User/${userId}`, {
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
      const apiUrl = "/api";
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
      <NavBar onCreateUser={handleCreateUser} />
      <UserList
        users={users}
        isLoading={isLoading}
        error={error}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
      />
      {showModal && (
        <UserModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onSave={handleSaveUser}
          user={editingUser}
        />
      )}
    </>
  );
}
