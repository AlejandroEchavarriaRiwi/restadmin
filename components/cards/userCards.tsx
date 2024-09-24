import React from "react";
import styled from "styled-components";
import Button from "../../components/ui/Button";
import { Edit, Trash2 } from "lucide-react";
import { User } from "../../models/user.models";

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
  gap: 15px;
`;


const StyledEdit = styled(Edit)`
  margin-right: 0.5rem;
  height: 1rem;
  width: 1rem;
`;

const StyledTrash2 = styled(Trash2)`
  margin-right: 0.5rem;
  height: 1rem;
  width: 1rem;
`;

const EditButton = styled(ActionButton)`
  display: flex ;
  flex-direction: row;
  align-items: center;
  color: #2563eb;
  &:hover {
    color: #1e40af;
  }
`;

const DeleteButton = styled(ActionButton)`
  display: flex ;
  flex-direction: row;
  align-items: center;
  color: #dc2626;
  &:hover {
    color: #7f1d1d;
  }
`;


interface UserCardProps {
  user: User;
  onEdit: () => void;
  onDelete: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => (
  <Card>
    <CardField><strong>Nombre:</strong> {user.Name}</CardField>
    <CardField><strong>Email:</strong> {user.Email}</CardField>
    <CardField><strong>Celular:</strong> {user.Phone}</CardField>
    <CardField><strong>Dirección:</strong> {user.Address}</CardField>
    <CardField><strong>Rol:</strong> <RoleBadge>{user.Role.Name}</RoleBadge></CardField>
    <CardActions>
      <EditButton onClick={onEdit}>
        <StyledEdit />
        Editar
      </EditButton>
      <DeleteButton onClick={onDelete}>
        <StyledTrash2 />
        Borrar
      </DeleteButton>
    </CardActions>
  </Card>
);

export default UserCard;