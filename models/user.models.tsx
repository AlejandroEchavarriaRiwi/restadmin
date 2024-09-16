export interface Role {
    id: number;
    name: string;
  }
  export interface User {
    id?: number;
    name: string;
    email: string;
    passwordHash?: string;
    phone: string;
    address: string;
    roleId: number;
    role?: {
      id: number;
      name: string;
    };
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
    password: string;
  }