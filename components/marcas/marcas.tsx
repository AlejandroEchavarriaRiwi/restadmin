import Image from "next/image"

const brands = [
  { src: "/images/Logo-KFC.png", alt: "KFC Logo" },
  { src: "/images/Logo-Burger-King.png", alt: "Burger King Logo" },
  { src: "/images/Logo-Dominos-Pizza.png", alt: "Domino's Pizza Logo" },
  { src: "/images/Logo-Taco-Bell.png", alt: "Taco Bell Logo" },
  { src: "/images/Logo-Wendys.png", alt: "Wendy's Logo" },
]

export default function Marcas() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Marcas que confían en nosotros
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center">
          {brands.map((brand, index) => (
            <div key={index} className="flex items-center justify-center">
              <Image
                src={brand.src}
                width={200}
                height={100}
                alt={brand.alt}
                className="max-w-[100px] md:max-w-[120px] lg:max-w-[150px] h-auto object-contain transition-transform duration-300 hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}