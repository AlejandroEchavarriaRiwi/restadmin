import { BodyRequestCreateUser, RequestLoginUser, ResponseCreateUser, ResponseLoginUser } from "../models/user.models";
export class UserController{

    private domain: string;

    constructor(private urlApi:string){
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
        const endPointLogin: string = 'auth/login'
        const headers: Record<string,string> = {
            'Content-Type':'application/json'
        }
        const reqOptions: RequestInit = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        }
        const url = this.urlApi + endPointLogin
        const result: Response = await fetch(url, reqOptions)
    
        if(result.status !== 201){
            const errorBody = await result.json()
            console.log(`Response body: ${errorBody.message}`)
            throw new Error("User or password incorrect")
        }
        
        const responseBodyLogin: ResponseLoginUser = await result.json()
        console.log(responseBodyLogin)
        return responseBodyLogin
    }
}

export function showPreloader(){
    const preloader = document.getElementById('preloader')
    if (preloader){
        preloader.style.display = 'flex';
    }
}

export function hidePreloader(){
    const preloader = document.getElementById('preloader')
    if (preloader){
        preloader.style.display = 'none';
    }
}