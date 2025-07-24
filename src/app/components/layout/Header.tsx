'use client';

import Link from 'next/link' 
import Image from 'next/image' 
import { useChat } from '../../contexts/ChatContext' 

export default function Header() { 
    const { toggleChat } = useChat();
    
    return ( 
        <header className="bg-teal-600 text-white shadow-sm"> 
            <div className="container mx-auto px-6 py-4 flex items-center justify-between"> 

                <Link href="/" className="flex items-center"> 
                    <Image src="/logo.svg" alt="Zava Retail Store Logo" width={120} height={40} className="h-10" />
                </Link> 
                
                <nav className="hidden lg:flex space-x-8"> 
                    <Link href="/products/paints" className="font-medium hover:text-yellow-300 transition-colors duration-200">Paint & Finishes</Link> 
                    <Link href="/products/tools" className="font-medium hover:text-yellow-300 transition-colors duration-200">Hand Tools</Link> 
                    <Link href="/products/home" className="font-medium hover:text-yellow-300 transition-colors duration-200">Lumber & Building material</Link> 
                    <Link href="/services" className="font-medium hover:text-yellow-300 transition-colors duration-200">Plumbing</Link> 
                    <Link href="/store" className="font-medium hover:text-yellow-300 transition-colors duration-200">Power Tools</Link> 
                </nav> 

                <div className="flex items-center space-x-3"> 
                    
                    <button aria-label="Search" className="p-2 rounded-full bg-yellow-400 text-teal-600 hover:bg-yellow-300 transition-all duration-200"> 
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"> <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /> </svg> 
                    </button> 
                    
                    <button aria-label="Cart" className="p-2 rounded-full hover:bg-teal-700 transition-all duration-200"> 
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"> <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /> </svg> 
                    </button> 
                    
                    <button aria-label="Account" className="p-2 rounded-full hover:bg-teal-700 transition-all duration-200"> 
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"> <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /> </svg> 
                    </button> 
                    
                    <button 
                        onClick={toggleChat}
                        aria-label="AI Chat" 
                        className="p-2 rounded-full hover:bg-teal-700 transition-all duration-200"
                    > 
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"> <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /> </svg> 
                    </button> 
                </div> 
            </div> 
        </header> 
    ) 
}