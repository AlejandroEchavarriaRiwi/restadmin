import { ResponseTextError, textError } from "@/models/user.models";

export async function textCheak(text: string): Promise<ResponseTextError> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };
        const reqOptions: RequestInit = {
            method: 'POST',
        };
        const url = `https://api.languagetool.org/v2/check?text=${text}&language=es`;
        const result: Response = await fetch(url, reqOptions);

        if (!result.ok) {
            const errorBody = await result.json();
            console.log(`Response body: ${errorBody}`);
            throw new Error("Registro de usuario fallo");
        }

        const responseTextError: ResponseTextError = await result.json();
        console.log(responseTextError)
        return responseTextError;
    }

