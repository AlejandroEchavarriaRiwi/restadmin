// NavBar.tsx
import React from "react";
import styled from "styled-components";
import { FaPeopleRobbery } from "react-icons/fa6";
import { PlusCircle } from "lucide-react";
import Button from "../../components/ui/Button";

const StyledFaPeopleRobbery = styled(FaPeopleRobbery)`
  font-size: 2em;
  color: #1f2937;
`;

const CreateUserButton = styled(Button)`
  display: flex;
  align-items: center;
  flex-direction: column;

  @media (min-width: 1024px) {
    flex-direction: row;
  }
`;

const StyledPlusCircle = styled(PlusCircle)`
  margin-right: 0.5rem;
  height: 1.5rem;
  width: 1.5rem;
  color: #10b981;
`;

const NavBarWrapper = styled.nav`
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

const NavBarContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavBarTitle = styled.h1`
  font-size: 1.5em;
  color: #1f2937;
`;

const NavBarActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-right: 1rem;

  @media (max-width: 1024px) {
    margin-top: 0.75rem;
  }
`;


interface NavBarProps {
  onCreateUser: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onCreateUser }) => (
  <NavBarWrapper>
    <NavBarContent>
      <StyledFaPeopleRobbery />
      <NavBarTitle>Administración de usuarios</NavBarTitle>
    </NavBarContent>
    <NavBarActions>
      <CreateUserButton onClick={onCreateUser}>
        <StyledPlusCircle />
        Crear nuevo usuario
      </CreateUserButton>
    </NavBarActions>
  </NavBarWrapper>
);

export default NavBar;