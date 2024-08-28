import "./style/footerStyle.sass"
import Image from "next/image"

export default function MainFooter() {
    return (
        <div className="mainContainer">
            <div className="parteSuperior">
                <div className="parteIzquierda">
                    <h2>Software Punto de venta</h2>
                    <p>Vendty es un Sistema de Punto de Venta para restaurantes
                        hecho para Colombia. Ideal para  restaurantes y cafeterias</p>
                </div>
                <div className="parteDerecha">
                    <p>Envienos un correo electronico:</p>
                    <h3>info@RestAdmin.com</h3>
                    <br />
                    <p>Tambien puedes encontrarnos aqui:</p>
                    <p>Iconos</p>
                </div>
            </div>

            <div className="parteInferior">
                <div className="logo">
                    <Image
                        src="/images/logoletrasrestadmin.png"
                        width={500}
                        height={500}
                        alt="Picture of the author"
                    />
                </div>
                <div className="politicas">
                    <h4>&copy; 2024 Todos los derechos reservados | RestAdmin</h4>
                    <h4>Politica de privacidad</h4>
                </div>
            </div>
        </div>
    )
}