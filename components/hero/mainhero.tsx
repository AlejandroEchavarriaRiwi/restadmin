import Image from "next/image"
import "./style/stylehero.sass"

export default function Mainhero() {
    return (
        <section>
            <div className="contentcenter">
                <div className="contentleft">

                    <h1><span>Software POS</span> para Restaurantes y Retail general</h1>
                    <h5>Revoluciona tu negocio con una moderna solución de punto de venta y tienda virtual integrada. Incluye Factura electrónica y Pos Electrónico</h5>
                    <button>Agenda una demo</button>
                </div>
                <div className="contentright">
                    <Image
                        src="/images/hero.png"
                        width={500}
                        height={500}
                        alt="hero"
                    />
                </div>
            </div>
            <div className="banner"></div>
        </section>


    )
}