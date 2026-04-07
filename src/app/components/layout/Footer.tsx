import Link from 'next/link' 

export default function Footer() { 
    return ( 
    <footer className="bg-gray-100 pt-10 pb-6 text-gray-900">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="font-semibold text-lg mb-4 text-gray-900">About US</h3>
                    <ul className="space-y-2">
                        <li><Link href="/about" className="text-gray-700 hover:text-gray-900">Store Address</Link></li>
                        <li><Link href="/about/office" className="text-gray-700 hover:text-gray-900">Corporate Office</Link></li>
                        <li><Link href="/about/warehouse" className="text-gray-700 hover:text-gray-900">Warehouse</Link></li>
                        <li><Link href="/about/mission" className="text-gray-700 hover:text-gray-900">Our Mission and Vision</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-4 text-gray-900">Products</h3>
                    <ul className="space-y-2">
                        <li><Link href="/products" className="text-gray-700 hover:text-gray-900">All Products</Link></li>
                        <li><Link href="/offers" className="text-gray-700 hover:text-gray-900">Offers</Link></li>
                        <li><Link href="/events" className="text-gray-700 hover:text-gray-900">Events</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-4 text-gray-900">Delivery and Tracking</h3>
                    <ul className="space-y-2">
                        <li><Link href="/delivery" className="text-gray-700 hover:text-gray-900">Tracking</Link></li>
                        <li><Link href="/services/book" className="text-gray-700 hover:text-gray-900">Book Services</Link></li>
                        <li><Link href="/applications" className="text-gray-700 hover:text-gray-900">Experience Applications</Link></li>
                        <li><Link href="/services/map" className="text-gray-700 hover:text-gray-900">Services Center Map</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-4 text-gray-900">Terms And Condition</h3>
                    <ul className="space-y-2">
                        <li><Link href="/terms" className="text-gray-700 hover:text-gray-900">Terms of Use</Link></li>
                        <li><Link href="/billing" className="text-gray-700 hover:text-gray-900">Billing And Payments</Link></li>
                        <li><Link href="/return-policy" className="text-gray-700 hover:text-gray-900">Return Policy</Link></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-gray-200 mt-10 pt-6">
                <p className="text-center text-sm text-gray-700"> © {new Date().getFullYear()} Zava Retail Store. All rights reserved. </p>
            </div> 
        </div> 
    </footer> 
    ) 
}
