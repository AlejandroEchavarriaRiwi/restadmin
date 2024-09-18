export interface Role {
  Id: number;
  Name: string;
}
export interface User {
    Id: number;
    Name: string;
    Email: string;
    PasswordHash: string;
    Phone: string;
    Address: string;
    RoleId: number;
    Role: Role;
  }
  export interface BodyRequestCreateUser {
    email: string;
    password: string;
  }
  
  export interface RequestLoginUser {
    email: string;
    password: string;
  }
  
  export interface ResponseCreateUser {
    message: string;
  }
  
  export interface ResponseLoginUser {
    token: string;
    email: string;
    name: string;
    roleId: number;
  }
  
  export interface TextError {
    text: string;
    language: string;
  }
  
  export interface ResponseTextError {
    message: string;
  }
  
  export interface UserFormProps {
    user?: User;
    onClose: () => void;
    onSubmit: () => void;
  }

  export interface UserFormData extends Omit<User, 'id' | 'passwordHash' | 'role'> {
    name: string;
    email: string;
    password?: string;
    phone: string;
    address: string;
    roleId: number;
  }