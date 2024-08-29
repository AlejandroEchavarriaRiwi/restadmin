export interface BodyRequestCreateUser{
    email: string,
    password: string
}

export interface RequestLoginUser{
    email:string,
    password:string
}
export interface ResponseCreateUser{
    message: string,
}

export interface ResponseLoginUser{
    message: string,
    user: {
        id: string,
        name: string,
        email: string,
        roles: string
    }
}

export interface textError{
    text: string,
    language: string
}

export interface ResponseTextError{
    message: string,
}