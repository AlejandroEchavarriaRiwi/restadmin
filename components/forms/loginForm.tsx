'use client'
import React, { useEffect, useState } from "react";
import InputAlert from "../alerts/successAlert";

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

export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        localStorage.removeItem('user');
    }, []);

    const getRoleName = (roleId: number): string => {
        switch (roleId) {
            case 1: return "Admin";
            case 2: return "Administrator";
            case 3: return "Waiter";
            default: return "Unknown";
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userController = new UserController('https://restadmin.azurewebsites.net');

        try {
            showPreloader();
            const loginResult = await userController.login(email, password);

            const user: User = {
                token: loginResult.Token,
                email: loginResult.Email,
                name: loginResult.Name,
                roleId: loginResult.RoleId
            };
            localStorage.setItem("user", JSON.stringify(user));

            console.log("Stored user:", JSON.parse(localStorage.getItem("user") || "{}"));

            hidePreloader();
            await InputAlert('Bienvenido', 'success');

            // Redirección basada en rol
            let redirectPath = '/dashboard';
            if (loginResult.RoleId === 2) {
                redirectPath = '/dashboard/createusers';
            } else if (loginResult.RoleId === 1) {
                redirectPath = '/dashboard/pos';
            } else if (loginResult.RoleId === 3) {
                redirectPath = '/dashboard/tables';
            }
            window.location.href = redirectPath;

        } catch (error) {
            hidePreloader();
            if (error instanceof Error) {
                await InputAlert(error.message, 'error');
            } else {
                await InputAlert('An unexpected error occurred', 'error');
            }
        }
    };

    function showPreloader() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.display = 'flex';
        }
    }
    
    function hidePreloader() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.display = 'none';
        }
    }

    return (
        <div className="relative">
            <div className="flex flex-col items-center justify-center min-h-screen px-4 py-6">
                <div className="grid items-center w-full max-w-6xl gap-4 md:grid-cols-2">
                    <div className="border border-gray-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
                        <form className="space-y-4 login-form" onSubmit={handleSubmit}>
                            <div className="mb-8">
                                <h3 className="text-3xl font-extrabold text-black">Inicia sesión</h3>
                                <p className="mt-4 text-sm leading-relaxed text-gray-500">
                                    Inicia sesión para ingresar a un nuevo mundo de posibilidades.
                                </p>
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm text-gray-900">Correo electrónico</label>
                                <div className="relative flex items-center">
                                    <input
                                        name="email"
                                        id="email"
                                        type="email"
                                        required
                                        className="w-full px-4 py-3 text-sm text-gray-800 border border-gray-300 rounded-lg outline-blue-600"
                                        placeholder="Ingresa tu correo electrónico"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4" viewBox="0 0 24 24">
                                        <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.7-8 5.334L4 8.7V6.297l8 5.333 8-5.333V8.7z"/>
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm text-gray-900">Contraseña</label>
                                <div className="relative flex items-center">
                                    <input
                                        name="password"
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="w-full px-4 py-3 text-sm text-gray-800 border border-gray-300 rounded-lg outline-green-500"
                                        placeholder="Ingresa tu contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="#bbb"
                                        stroke="#bbb"
                                        className="w-[18px] h-[18px] absolute right-4 cursor-pointer"
                                        viewBox="0 0 128 128"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" data-original="#000000"></path>
                                    </svg>
                                </div>
                            </div>
                            <div className="!mt-8">
                                <button type="submit" className="w-full px-4 py-3 text-sm tracking-wide text-black bg-amber-300 rounded-lg shadow-xl hover:bg-amber-400 focus:outline-none">
                                    Ingresar
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="lg:h-[400px] md:h-[300px] max-md:mt-8">
                        <img src="/images/login.png" className="block object-cover w-full h-full mx-auto max-md:w-4/5 rounded-lg" alt="Dining Experience" />
                    </div>
                </div>
            </div>
        </div>
    );
}