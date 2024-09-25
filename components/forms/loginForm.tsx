'use client'
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import InputAlert from "../alerts/successAlert";
import LoadingSpinner from "@/components/loadingSpinner";

// Interfaces
interface User {
    token: string;
    email: string;
    name: string;
    roleId: number;
}

interface LoginResponse {
    Token: string;
    Email: string;
    Name: string;
    RoleId: number;
}

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1.5rem 1rem;
`;

const Grid = styled.div`
  display: grid;
  align-items: center;
  width: 100%;
  max-width: 72rem;
  gap: 1rem;
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FormContainer = styled.div`
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 1.5rem;
  max-width: 28rem;
  box-shadow: 0 2px 22px -4px rgba(93,96,127,0.2);
  @media (max-width: 768px) {
    margin: 0 auto;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Title = styled.h3`
  font-size: 1.875rem;
  font-weight: 800;
  color: black;
  margin-bottom: 2rem;
`;

const Subtitle = styled.p`
  margin-top: 1rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #6b7280;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #111827;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #1f2937;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  outline: none;
  &:focus {
    border-color: #2563eb;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  margin-top: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: black;
  background-color: #fcd34d;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  &:hover {
    background-color: #fbbf24;
  }
  &:focus {
    outline: none;
  }
`;

const ImageContainer = styled.div`
  height: 400px;
  @media (max-width: 1024px) {
    height: 300px;
  }
  @media (max-width: 768px) {
    margin-top: 2rem;
  }
`;

const Image = styled.img`
  display: block;
  object-fit: cover;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  border-radius: 0.5rem;
  @media (max-width: 768px) {
    width: 80%;
  }
`;

// UserController class
class UserController {
    private domain: string;

    constructor(private urlApi: string) {
        this.domain = urlApi;
    }

    async login(email: string, password: string): Promise<LoginResponse> {
        const url = `${this.domain}/api/Auth/login`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Email: email, Password: password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Login failed");
        }

        return await response.json();
    }
}

// Main component
export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Clear user data on component mount
    useEffect(() => {
        localStorage.removeItem('user');
    }, []);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userController = new UserController('https://restadmin.azurewebsites.net');

        try {
            setIsLoading(true);
            const loginResult = await userController.login(email, password);

            const user: User = {
                token: loginResult.Token,
                email: loginResult.Email,
                name: loginResult.Name,
                roleId: loginResult.RoleId
            };
            localStorage.setItem("user", JSON.stringify(user));
            await InputAlert('Bienvenido', 'success');

            // Redirect based on role
            let redirectPath = '/dashboard';
            if (loginResult.RoleId === 2) {
                redirectPath = '/dashboard/createusers';
            } else if (loginResult.RoleId === 3) {
                redirectPath = '/dashboard/pos';
            } else if (loginResult.RoleId === 1) {
                redirectPath = '/dashboard/tables';
            }
            window.location.href = redirectPath;

        } catch (error) {
            if (error instanceof Error) {
                await InputAlert(error.message, 'error');
            } else {
                await InputAlert('An unexpected error occurred', 'error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <Container>
            <Grid>
                <FormContainer>
                    <Form onSubmit={handleSubmit}>
                        <div>
                            <Title>Inicia sesión</Title>
                            <Subtitle>
                                Inicia sesión para ingresar a un nuevo mundo de posibilidades.
                            </Subtitle>
                        </div>
                        <div>
                            <Label htmlFor="email">Correo electrónico</Label>
                            <InputWrapper>
                                <Input
                                    name="email"
                                    id="email"
                                    type="email"
                                    required
                                    placeholder="Ingresa tu correo electrónico"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" width="18" height="18" viewBox="0 0 24 24" style={{position: 'absolute', right: '1rem'}}>
                                    <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.7-8 5.334L4 8.7V6.297l8 5.333 8-5.333V8.7z"/>
                                </svg>
                            </InputWrapper>
                        </div>
                        <div>
                            <Label htmlFor="password">Contraseña</Label>
                            <InputWrapper>
                                <Input
                                    name="password"
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="Ingresa tu contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="#bbb"
                                    stroke="#bbb"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 128 128"
                                    style={{position: 'absolute', right: '1rem', cursor: 'pointer'}}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" data-original="#000000"></path>
                                </svg>
                            </InputWrapper>
                        </div>
                        <SubmitButton type="submit">
                            Ingresar
                        </SubmitButton>
                    </Form>
                </FormContainer>
                <ImageContainer>
                    <Image src="/images/login.png" alt="Dining Experience" />
                </ImageContainer>
            </Grid>
        </Container>
    );
}