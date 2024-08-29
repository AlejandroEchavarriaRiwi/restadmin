'use client'
import { useEffect, useState } from "react";
import { UserController } from "../controllers/user.controller";
import InputAlert from "@/app/alerts/successAlert";


export function RegisterForm() {
    const [email, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        localStorage.removeItem('email');
    }, []);
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userController = new UserController('https://api-posts.codificando.xyz/');

        try {
            const createResult = await userController.createUser({ email, password });
            if(createResult)
                await InputAlert('Usuario creado exitosamente', 'success')
            localStorage.clear()
            window.location.href = '/login'
        } catch (error) {
            await InputAlert('Error al crear usuario', 'error')
        }
    };

    return (
<div className="font-[sans-serif] relative">
            <div className="flex flex-col items-center justify-center min-h-screen px-4 py-6">
                <div className="grid items-center w-full max-w-6xl gap-4 md:grid-cols-2">
                    <div className="border border-gray-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
                        <form className="space-y-4 login-form" onSubmit={handleSubmit}>
                            <div className="mb-8">
                                <h3 className="text-3xl font-extrabold text-gray-100">Registro</h3>
                                <p className="mt-4 text-sm leading-relaxed text-gray-500">
                                    Registrate para usar esta maravillosa pagina.
                                </p>
                            </div>
                            <div>
                                <label htmlFor="username" className="block mb-2 text-sm text-gray-100">Usuario</label>
                                <div className="relative flex items-center">
                                    <input
                                        name="username"
                                        id="username"
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 text-sm text-gray-800 border border-gray-300 rounded-lg outline-blue-600"
                                        placeholder="Ingresa tu usuario"
                                        value={email}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4" viewBox="0 0 24 24">
                                        <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                        <path d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z" data-original="#000000"></path>
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm text-gray-100">Contraseña</label>
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
                                <button type="submit" className="w-full px-4 py-3 text-sm tracking-wide text-black bg-orange-500 rounded-lg shadow-xl hover:bg-orange-600 focus:outline-none">
                                    Registrarse
                                </button>
                            </div>
                            <p className="text-sm !mt-8 text-center text-gray-100">
                                ya tienes una cuenta? <a href="#" onClick={(e) => { e.preventDefault(); window.location.href = '/login'}} className="ml-1 font-semibold text-orange-500 hover:underline whitespace-nowrap">Inicia sesión aquí</a>
                            </p>
                        </form>
                    </div>
                    <div className="lg:h-[400px] md:h-[300px] max-md:mt-8">
                        <img src="https://buzzoid.com/wp-content/uploads/2024/02/Dark-Mode-Why-is-My-Instagram-Black.jpg" className="block object-cover w-full h-full mx-auto max-md:w-4/5 rounded-lg" alt="Dining Experience" />
                    </div>
                </div>
            </div>
        </div>
    );
}