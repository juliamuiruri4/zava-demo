import Image from 'next/image' 
import Link from 'next/link' 

const categories = [
    { id: 1, name: 'Flooring material', active: true },
    { id: 2, name: 'Lighting Fixtures', active: false },
    { id: 3, name: 'Wall treatments & finishes', active: false },
    { id: 4, name: 'Smart home devices', active: false }
]

const products = [ 
    { 
        id: 1, 
        name: 'Oak Solid Hardwood Plank', 
        price: '$6.99/sq ft', 
        image: '/images/oak-solid-3.png', 
        link: '/products/flooring/oak-hardwood' 
    }, 
    { 
        id: 2, 
        name: 'Waterproof Vinyl Tile', 
        price: '$3.99/sq ft', 
        image: '/images/vinyl-tile-1.png', 
        link: '/products/flooring/vinyl-tile' 
    }, 
    { 
        id: 3, 
        name: 'Hexagon Mosaic Tile', 
        price: '$5.49/sq ft', 
        image: '/images/hexagon-tile-1.png', 
        link: '/products/flooring/hexagon-tile' 
    }
] 

export default function FeaturedProducts() { 
    return ( 
        <div className="py-8 bg-gray-50"> 
            <div className="max-w-7xl mx-auto px-6"> 
                {/* Category Navigation */}
                <div className="mb-8">
                    <div className="flex flex-wrap justify-center gap-1 rounded-2xl bg-white p-1 shadow-sm sm:inline-flex sm:flex-nowrap sm:rounded-full">
                        {categories.map(category => (
                            <button 
                                key={category.id}
                                type="button"
                                aria-pressed={category.active}
                                className={`min-h-11 rounded-full px-3 py-2 text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 sm:px-6 sm:py-3 sm:text-sm ${
                                    category.active 
                                        ? 'bg-teal-600 text-white shadow-md' 
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Products Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {products.map(product => (
                            <div key={product.id} className="group w-full overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                                <Link href={product.link}> 
                                    <div className="relative h-64 overflow-hidden"> 
                                        <Image 
                                            src={product.image} 
                                            alt={product.name} 
                                            fill 
                                            className="object-cover group-hover:scale-110 transition-transform duration-300" 
                                        /> 
                                    </div> 
                                    <div className="p-6"> 
                                        <h3 className="font-semibold text-gray-900 text-lg mb-3 group-hover:text-teal-600 transition-colors duration-200"> 
                                            {product.name} 
                                        </h3> 
                                        <div className="inline-flex items-center bg-teal-600 text-white font-medium px-4 py-2 rounded-full text-sm shadow-md"> 
                                            {product.price} 
                                        </div> 
                                    </div> 
                                </Link> 
                            </div> 
                        ))}
                </div> 
            </div> 
        </div>
    ) 
}