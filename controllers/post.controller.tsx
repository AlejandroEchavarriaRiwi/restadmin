
'use client'
import { Item, Welcome } from "@/models/post.models";

export default function PostController(){
    const post = async (): Promise<Item[]> => {
        const response = await fetch("https://api-posts.codificando.xyz/posts");
        let data: Welcome = await response.json();
        console.log(data)
        return data.items;
    }

    return(
        <h1>No post</h1>
    )
}
    
