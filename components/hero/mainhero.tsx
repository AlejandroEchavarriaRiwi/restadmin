'use client'

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

export default function MainHero() {
    return (
        <section className="relative bg-gradient-to-b from-gray-50 to-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    <motion.div 
                        className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                            <span className="block text-primary xl:inline">Software POS</span>{' '}
                            <span className="block xl:inline">para Restaurantes y Retail general</span>
                        </h1>
                        <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                            Revoluciona tu negocio con una moderna solución de punto de venta y tienda virtual integrada. Incluye Factura electrónica y POS Electrónico.
                        </p>
                        <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left">
                            <Link href="/contactus">
                                <motion.button
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark transition-colors duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Agenda una demo
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                    <motion.div 
                        className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                            <Image
                                className="w-full rounded-lg"
                                src="/images/hero.png"
                                alt="Hero image"
                                width={1880}
                                height={1576}
                                priority
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-primary to-transparent opacity-20"></div>
        </section>
    )
}