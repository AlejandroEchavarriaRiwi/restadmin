"use client";
import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import Button from "../components/buttons/Button";
import { useAuth } from "../hooks/useAuth";
import { User, UserFormData } from "../models/user.models";
import Modal from "../components/modals/UsersModal";
import { FaPeopleRobbery } from "react-icons/fa6";

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

const Divcentertitle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  text-align: center;
  thead th {
    text-align: center;
  }
`;

const Th = styled.th`
  background-color: #f2f2f2;
  padding: 10px;
  text-align: left;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const ActionButton = styled(Button)`
  margin-right: 5px;
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

const TableSkeleton = () => (
  <tbody>
    {[...Array(5)].map((_, index) => (
      <SkeletonRow key={index}>
        <Td>
          <SkeletonCell />
        </Td>
        <Td>
          <SkeletonCell />
        </Td>
        <Td>
          <SkeletonCell />
        </Td>
        <Td>
          <SkeletonCell />
        </Td>
        <Td>
          <SkeletonCell />
        </Td>
        <Td>
          <SkeletonCell />
        </Td>
      </SkeletonRow>
    ))}
  </tbody>
);

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
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
      console.error("No se pudieron obtener los usuarios:", error);
      setError(
        error instanceof Error ? error.message : "Ocurrió un error desconocido"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm("¿Está seguro de que desea eliminar este usuario?")) {
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
        alert("Usuario eliminado con éxito!");
      } catch (error) {
        console.error("No se pudo eliminar el usuario:", error);
        alert("Error al eliminar el usuario. Por favor, intente de nuevo.");
      }
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

  const handleSaveUser = async (userData: UserFormData) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
      const isEditing = !!editingUser;
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing ? `${apiUrl}/v1/User/${editingUser.Id}` : `${apiUrl}/v1/User`;

      const dataToSend: Partial<User> = {
        Id: isEditing ? editingUser.Id : 0,
        Name: userData.name,
        Email: userData.email,
        Phone: userData.phone,
        Address: userData.address,
        RoleId: userData.roleId,
      };

      if (!isEditing || (isEditing && userData.password)) {
        dataToSend.PasswordHash = userData.password;
      }

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
      alert(
        isEditing
          ? "Usuario actualizado con éxito!"
          : "Usuario creado con éxito!"
      );
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
      alert("Error al guardar el usuario. Por favor, intente de nuevo.");
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
          <Button onClick={handleCreateUser}>Crear nuevo usuario</Button>
        </div>
      </NavBar>
      <ModuleContainer>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <Table>
          <thead>
            <tr>
              <Th>Nombre</Th>
              <Th>Email</Th>
              <Th>Celular</Th>
              <Th>Dirección</Th>
              <Th>Rol</Th>
              <Th>Acciones</Th>
            </tr>
          </thead>
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <tbody>
              {users.map((user) => (
                <tr key={user.Id}>
                  <Td>{user.Name}</Td>
                  <Td>{user.Email}</Td>
                  <Td>{user.Phone}</Td>
                  <Td>{user.Address}</Td>
                  <Td>{user.Role.Name}</Td>
                  <Td>
                    <ActionButton onClick={() => handleEditUser(user)}>
                      Editar
                    </ActionButton>
                    <ActionButton onClick={() => handleDeleteUser(user.Id)}>
                      Borrar
                    </ActionButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          )}
        </Table>

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