import Image from 'next/image'
import Link from 'next/link'

const popularProducts = [
    {
        id: 1,
        name: 'Interior Paints',
        price: 65000.00,
        image: '/images/interior-paints-1.png',
        link: '/products/painting/interior-paints'
    },
    {
        id: 2,
        name: 'Paint Sprayer',
        price: 65000.00,
        image: '/images/paint-sprayer-1.png',
        link: '/products/painting/paint-sprayer'
    },
    {
        id: 3,
        name: "Painter's Tape",
        price: 65000.00,
        image: '/images/tape-1.png',
        link: '/products/painting/painters-tape'
    },
    {
        id: 4,
        name: 'Ladders & Step Tools',
        price: 65000.00,
        image: '/images/ladders-and-stools-1.png',
        link: '/products/tools/ladders'
    }
]

export default function PopularProducts() {
    return (
        <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Explore All Popular Products
                    </h2>
                    <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                        Get your essential item from us and enjoy best services with quality
                    </p>
                    <Link 
                        href="/products" 
                        className="inline-flex items-center text-teal-600 font-semibold hover:text-teal-700 transition-colors duration-200"
                    >
                        Explore All
                        <svg 
                            className="ml-2 w-5 h-5" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M9 5l7 7-7 7" 
                            />
                        </svg>
                    </Link>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {popularProducts.map(product => (
                        <div 
                            key={product.id} 
                            className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
                        >
                            {/* Product Image */}
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            {/* Product Info */}
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    {product.name}
                                </h3>
                                
                                {/* More Info Button */}
                                <Link href={product.link}>
                                    <button className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 mb-4">
                                        More Info
                                    </button>
                                </Link>

                                {/* Price and Cart */}
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-gray-900">
                                        {product.price.toLocaleString()}
                                    </span>
                                    <button 
                                        className="bg-teal-600 text-white p-3 rounded-lg hover:bg-teal-700 transition-colors duration-200 shadow-md"
                                        aria-label="Add to cart"
                                    >
                                        <svg 
                                            className="w-5 h-5" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={2} 
                                                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5m2.5-5v5m0-5H17m0 0v5" 
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
