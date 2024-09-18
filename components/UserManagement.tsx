"use client";
import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { User, UserFormData } from "../models/user.models";
import Modal from "../components/modals/UsersModal";
import { FaPeopleRobbery } from "react-icons/fa6";
import { Edit, PlusCircle, Trash2 } from "lucide-react";

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
  padding-left: 20px; /* px-5 */
  padding-right: 20px; /* px-5 */
  padding-top: 12px; /* py-3 */
  padding-bottom: 12px; /* py-3 */
  border-bottom-width: 2px; /* border-b-2 */
  border-bottom-color: #e5e7eb; /* border-gray-200 */
  background-color: #f3f4f6; /* bg-gray-100 */
  text-align: left; /* text-left */
  font-size: 12px; /* text-xs */
  font-weight: 600; /* font-semibold */
  color: #4b5563; /* text-gray-600 */
  text-transform: uppercase; /* uppercase */
  letter-spacing: 0.05em; /* tracking-wider */
`;

const Td = styled.td`
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
  border-bottom-width: 1px;
  border-bottom-color: #e5e7eb; /* border-gray-200 */
  font-size: 14px;
  line-height: 20px;
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
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

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

  const handleDeleteUser = async (userId: number | undefined) => {
    if (userId === undefined) {
      alert("ID de usuario no válido");
      return;
    }

    if (window.confirm("¿Está seguro de que desea eliminar este usuario?")) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
        const response = await fetch(`${apiUrl}/v1/User/${userId.toString()}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`, // Asegúrate de que 'user' esté definido
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        fetchUsers(); // Actualiza la lista de usuarios
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
      const url =
        isEditing && editingUser?.id
          ? `${apiUrl}/v1/User/${editingUser.id.toString()}`
          : `${apiUrl}/v1/User`;

      const dataToSend: Partial<User> = {
        id: isEditing ? editingUser!.id : 0,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        roleId: Number(userData.roleId),
      };

      // Solo incluir la contraseña si es un nuevo usuario o si se ha cambiado
      if (!isEditing || (isEditing && userData.password)) {
        dataToSend.passwordHash = userData.password;
      }

      console.log("Sending data:", JSON.stringify(dataToSend, null, 2));

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        if (responseText) {
          try {
            const errorData = JSON.parse(responseText);
            errorMessage += `, message: ${errorData.message || JSON.stringify(errorData)
              }`;
          } catch (e) {
            errorMessage += `, body: ${responseText}`;
          }
        }
        throw new Error(errorMessage);
      }

      let responseData;
      if (responseText) {
        try {
          responseData = JSON.parse(responseText);
          console.log("Parsed server response:", responseData);
        } catch (e) {
          console.warn("Error parsing JSON response:", e);
          throw new Error(`Invalid JSON response: ${responseText}`);
        }
      } else {
        console.warn("Empty response from server");
        responseData = {};
      }

      fetchUsers();
      handleCloseModal();
      alert(
        isEditing
          ? "Usuario actualizado con éxito!"
          : "Usuario creado con éxito!"
      );
    } catch (error) {
      console.error("Error detallado al guardar el usuario:", error);
      let errorMessage =
        error instanceof Error ? error.message : "Error desconocido";

      if (
        error instanceof TypeError &&
        errorMessage.includes("Failed to fetch")
      ) {
        errorMessage =
          "No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet y que el servidor esté accesible.";
      }

      alert(`Error al guardar el usuario: ${errorMessage}`);
    }
  };

  const getRoleName = (roleId: number): string => {
    switch (roleId) {
      case 1:
        return "Mesero";
      case 2:
        return "Administrador";
      case 3:
        return "Cajero";
      default:
        return "Desconocido";
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
          <Button onClick={handleCreateUser}
            className="flex items-center">
            <PlusCircle className="mr-2 h-4 w-4 text-green-500" />
            Crear nuevo usuario
          </Button>
        </div>
      </NavBar>
      <ModuleContainer>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full leading-normal">
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
                  <tr
                    key={user.id ?? user.email}
                    className="hover:bg-gray-50 transition-colors duration-200 ease-in-out"
                    onMouseEnter={() => setHoveredRow(user.id ?? null)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <Td className="px-5 py-5 border-b border-gray-200 text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{user.name}</p>
                    </Td>
                    <Td className="px-5 py-5 border-b border-gray-200 text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{user.email}</p>
                    </Td>
                    <Td className="px-5 py-5 border-b border-gray-200 text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{user.phone}</p>
                    </Td>
                    <Td className="px-5 py-5 border-b border-gray-200 text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{user.address}</p>
                    </Td>
                    <Td className="px-5 py-5 border-b border-gray-200 text-sm">
                      <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                        <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                        <span className="relative">{getRoleName(user.roleId)}</span>
                      </span>
                    </Td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                      <div className={`flex space-x-2 ${hoveredRow === user.id ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200 ease-in-out`}>
                        <ActionButton onClick={() => handleEditUser(user)} className="flex items-center text-blue-600 hover:text-blue-900">
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </ActionButton>
                        <ActionButton onClick={() => handleDeleteUser(user.id)} className="flex items-center text-red-600 hover:text-red-900">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Borrar
                        </ActionButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
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
