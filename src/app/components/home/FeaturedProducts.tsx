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
                <div className="flex justify-center mb-8">
                    <div className="inline-flex bg-white rounded-full p-1 shadow-sm">
                        {categories.map(category => (
                            <button 
                                key={category.id}
                                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
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
                <div className="flex justify-center">
                    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide max-w-fit"> 
                        {products.map(product => (
                            <div key={product.id} className="flex-shrink-0 w-80 group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"> 
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
        </div>
    ) 
}