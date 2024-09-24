import React from "react";
import styled from "styled-components";
import { User } from "../../models/user.models";
import UserCard from "../../components/cards/userCards";
import CardSkeleton from "../skeletons/cardSkeleton";

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

const ErrorMessage = styled.p`
  color: red;
`;

interface UserListProps {
  users: User[];
  isLoading: boolean;
  error: string | null;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: number) => void;
}

const UserList: React.FC<UserListProps> = ({ users, isLoading, error, onEditUser, onDeleteUser }) => (
  <ModuleContainer>
    {error && <ErrorMessage>{error}</ErrorMessage>}
    <CardContainer>
      {isLoading
        ? Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))
        : users.map((user) => (
            <UserCard
              key={user.Id}
              user={user}
              onEdit={() => onEditUser(user)}
              onDelete={() => onDeleteUser(user.Id)}
            />
          ))}
    </CardContainer>
  </ModuleContainer>
);

export default UserList;