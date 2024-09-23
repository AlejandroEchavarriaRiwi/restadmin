import Link from 'next/link'
import { FaSquareFacebook, FaLinkedin} from "react-icons/fa6"
import { FaInstagramSquare, FaYoutubeSquare } from "react-icons/fa"

export default function MainFooter() {
    return (
        <footer className="bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">Software Punto de venta</h2>
                        <p className="text-gray-600">
                            RestAdmin es un Sistema de Punto de Venta para restaurantes
                            hecho para Colombia. Ideal para restaurantes y cafeterías.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <p className="text-gray-600">Envíenos un correo electrónico:</p>
                        <h3 className="text-xl font-semibold text-primary">info@RestAdmin.com</h3>
                        <p className="text-gray-600 mt-4">También puedes encontrarnos aquí:</p>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                                <FaSquareFacebook size={24} />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                                <FaLinkedin size={24} />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                                <FaInstagramSquare size={24} />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                                <FaYoutubeSquare size={24} />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                        <Link href="/" className="flex items-center">
                            <span className="text-2xl font-bold text-primary">Rest</span>
                            <span className="text-2xl font-bold text-secondary">Admin</span>
                        </Link>
                    </div>
                    <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                        <p className="text-sm text-gray-500">&copy; 2024 Todos los derechos reservados | RestAdmin</p>
                        <Link href="#" className="text-sm text-gray-500 hover:text-primary transition-colors duration-300">
                            Política de privacidad
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}