'use client';

import Link from 'next/link'
import Image from 'next/image'
import { useChat } from '../../contexts/ChatContext'
import { useState } from 'react'

export default function Header() {
    const { toggleChat } = useChat();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Mock cart count – replace with real cart context
    const cartItemCount = 3;

    return (
        <header className="bg-primary text-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between">

                {/* Mobile hamburger */}
                <button
                    onClick={() => setMobileMenuOpen((o) => !o)}
                    aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                    className="lg:hidden p-2 -ml-2 rounded-md hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        {mobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>

                {/* Logo */}
                <Link href="/" className="flex items-center focus:outline-none focus:ring-2 focus:ring-white rounded">
                    <Image src="/logo.svg" alt="Zava Retail Store Home" width={120} height={40} className="h-10 w-auto" />
                </Link>

                {/* Desktop navigation */}
                <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
                    <Link href="/products/flooring" className="text-sm font-medium hover:text-accent-light transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded px-1 py-0.5">Flooring</Link>
                    <Link href="/products/home-improvement" className="text-sm font-medium hover:text-accent-light transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded px-1 py-0.5">Home Improvement</Link>
                    <Link href="/products/paint-finishes" className="text-sm font-medium hover:text-accent-light transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded px-1 py-0.5">Paint &amp; Finishes</Link>
                    <Link href="/products/power-tools" className="text-sm font-medium hover:text-accent-light transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded px-1 py-0.5">Power Tools</Link>
                    <Link href="/products/storage-organization" className="text-sm font-medium hover:text-accent-light transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded px-1 py-0.5">Storage</Link>
                </nav>

                {/* Icon actions */}
                <div className="flex items-center gap-1 sm:gap-2">
                    {/* Search */}
                    <button
                        aria-label="Search"
                        className="p-2 rounded-full bg-accent text-primary hover:bg-accent-light transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </button>

                    {/* Cart with badge */}
                    <Link
                        href="/cart"
                        aria-label={cartItemCount > 0 ? `Shopping cart, ${cartItemCount} items` : 'Shopping cart, empty'}
                        className="relative p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                        style={{ backgroundColor: cartItemCount > 0 ? '#FFC857' : undefined }}
                    >
                        <svg className={`w-5 h-5 ${cartItemCount > 0 ? 'text-primary' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                        </svg>
                        {cartItemCount > 0 && (
                            <span
                                aria-hidden="true"
                                className="absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-error text-white font-bold"
                                style={{
                                    minWidth: cartItemCount > 9 ? 22 : 20,
                                    height: cartItemCount > 9 ? 22 : 20,
                                    fontSize: cartItemCount > 9 ? 10 : 11,
                                    paddingLeft: 2,
                                    paddingRight: 2,
                                }}
                            >
                                {cartItemCount > 9 ? '9+' : cartItemCount}
                            </span>
                        )}
                    </Link>

                    {/* Account */}
                    <button
                        aria-label="Account"
                        className="hidden sm:flex p-2 rounded-full hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    </button>

                    {/* Chat */}
                    <button
                        onClick={toggleChat}
                        aria-label="AI Chat"
                        className="hidden sm:flex p-2 rounded-full hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile nav drawer */}
            {mobileMenuOpen && (
                <nav className="lg:hidden border-t border-primary-dark px-4 pb-4 pt-2 space-y-1" aria-label="Mobile navigation">
                    {[
                        ['Flooring', '/products/flooring'],
                        ['Home Improvement', '/products/home-improvement'],
                        ['Paint & Finishes', '/products/paint-finishes'],
                        ['Power Tools', '/products/power-tools'],
                        ['Storage & Organization', '/products/storage-organization'],
                        ['Tools & Hardware', '/products/tools-hardware'],
                    ].map(([label, href]) => (
                        <Link
                            key={href}
                            href={href}
                            className="block py-2 px-3 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                        >
                            {label}
                        </Link>
                    ))}
                </nav>
            )}
        </header>
    )
}