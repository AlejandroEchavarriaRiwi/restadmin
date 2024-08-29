import { BodyRequestCreateUser, RequestLoginUser, ResponseCreateUser, ResponseLoginUser } from "../models/user.models";

export class UserController {
    private domain: string;

    constructor(private urlApi: string) {
        this.domain = urlApi;
    }

    async createUser(user: BodyRequestCreateUser): Promise<ResponseCreateUser> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };
        const reqOptions: RequestInit = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(user)
        };
        const url = this.domain + 'users/register';
        const result: Response = await fetch(url, reqOptions);

        if (!result.ok) {
            const errorBody = await result.json();
            console.log(`Response body: ${errorBody}`);
            throw new Error("Registro de usuario fallo");
        }

        const responseBodyCreate: ResponseCreateUser = await result.json();
        return responseBodyCreate;
    }

    async login(data: RequestLoginUser): Promise<ResponseLoginUser> {
        const endPointLogin: string = '/users'
        const url = this.urlApi + endPointLogin

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }
            const users = await response.json();

            const user = users.find((u: any) => u.email === data.email && u.password === data.password);

            if (user) {
                return {
                    message: "Login successful",
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        roles: user.roles
                    }
                };
            } else {
                throw new Error("Invalid email or password");
            }
        } catch (error) {
            console.error("Login error:", error);
            throw new Error("User or password incorrect");
        }
    }
}

export function showPreloader() {
    const preloader = document.getElementById('preloader')
    if (preloader) {
        preloader.style.display = 'flex';
    }
}

export function hidePreloader() {
    const preloader = document.getElementById('preloader')
    if (preloader) {
        preloader.style.display = 'none';
    }
}