import './globals.css' 
import type { Metadata } from 'next' 
import { Inter } from 'next/font/google' 
import Header from './components/layout/Header' 
import Footer from './components/layout/Footer' 

const inter = Inter({ subsets: ['latin'] }) 

export const metadata: Metadata = { 
  title: 'Zava Retail Store', 
  description: 'Quality home improvement products and services', 
} 

export default function RootLayout({ children, }: { children: React.ReactNode }) { 
  return ( 
    <html lang="en"> 
    <head>
      <link rel="icon" href="/zava.png" type="image/svg+xml" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
        <body className={inter.className}> 
            <div className="flex flex-col min-h-screen"> 
                <Header /> 
                <main className="flex-grow">{children}</main> 
                <Footer /> 
            </div> 
        </body> 
    </html>
  ) 
}