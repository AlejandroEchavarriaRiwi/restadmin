import Image from "next/image";
import "./style/marcaStyles.sass"

export default function Marcas(){
    return(
        <div className="marcas">
            <Image 
                src="/images/Logo-KFC.png"
                className="img"
                width={200}
                height={100}
                alt="hero"
            />
            <Image 
                src="/images/Logo-Burger-King.png"
                className="img"
                width={200}
                height={100}
                alt="hero"
            />
            <Image 
                src="/images/Logo-Dominos-Pizza.png"
                className="img"
                width={200}
                height={100}
                alt="hero"
            />
            <Image  
                src="/images/Logo-Taco-Bell.png"
                className="img"
                width={200}
                height={100}
                alt="hero"
            />
            <Image 
                src="/images/Logo-Wendys.png"
                className="img"
                width={200}
                height={100}
                alt="hero"
            />
        </div>
    )
}