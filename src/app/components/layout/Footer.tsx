import Link from 'next/link' 

export default function Footer() { 
    return ( 
    <footer className="bg-gray-100 pt-10 pb-6"> 
        <div className="container mx-auto px-4"> 
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8"> 
                <div> 
                    <h3 className="font-semibold text-lg mb-4">About US</h3> 
                    <ul className="space-y-2"> 
                        <li><Link href="/about">Store Address</Link></li> 
                        <li><Link href="/about/office">Corporate Office</Link></li> 
                        <li><Link href="/about/warehouse">Warehouse</Link></li> 
                        <li><Link href="/about/mission">Our Mission and Vision</Link></li> 
                    </ul> 
                </div>
                <div> 
                    <h3 className="font-semibold text-lg mb-4">Products</h3> 
                    <ul className="space-y-2"> 
                        <li><Link href="/products">All Products</Link></li> 
                        <li><Link href="/offers">Offers</Link></li> 
                        <li><Link href="/events">Events</Link></li> 
                    </ul> 
                </div> 
                <div> 
                    <h3 className="font-semibold text-lg mb-4">Delivery and Tracking</h3> 
                    <ul className="space-y-2"> 
                        <li><Link href="/delivery">Tracking</Link></li> 
                        <li><Link href="/services/book">Book Services</Link></li> 
                        <li><Link href="/applications">Experience Applications</Link></li> 
                        <li><Link href="/services/map">Services Center Map</Link></li> 
                    </ul> 
                </div> 
                <div> 
                    <h3 className="font-semibold text-lg mb-4">Terms And Condition</h3> 
                    <ul className="space-y-2"> 
                        <li><Link href="/terms">Terms of Use</Link></li> 
                        <li><Link href="/billing">Billing And Payments</Link></li> 
                        <li><Link href="/return-policy">Return Policy</Link></li> 
                    </ul> 
                </div> 
            </div> 
            <div className="border-t border-gray-200 mt-10 pt-6"> 
                <p className="text-center text-sm text-gray-500"> © {new Date().getFullYear()} Zava Retail Store. All rights reserved. </p> 
            </div> 
        </div> 
    </footer> 
    ) 
}
