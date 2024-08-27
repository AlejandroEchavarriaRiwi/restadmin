import Image from "next/image"
import Link from "next/link"
import "./styles/navbarstyles.sass"

export default function Mainnav() {
    return (
        <nav className="mainnav">
            <div className="logo">
                <Image
                    src="/images/logoletrasrestadmin.png"
                    width={500}
                    height={500}
                    alt="Picture of the author"
                />
            </div>
            <ul className="navcenter">
                <li>
                    <Link className="link" href="#">Restaurantes</Link>
                    <Link className="link" href="#">Retail</Link>
                    <Link className="link" href="#">Mas</Link>
                    <Link className="link" href="#">Precios</Link>
                </li>
            </ul>
            <ul className="navright">
                <li>
                <Link className="link" href="#">Entrar</Link>
                <button>
                <Link className="link" href="#"><span>Agenda una demo</span></Link>    
                </button>
                </li>
            </ul>
        </nav>
    )
}