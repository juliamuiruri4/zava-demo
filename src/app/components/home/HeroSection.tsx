import Image from 'next/image' 

export default function HeroSection() { 
    return ( 
        <div className="relative bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"> 
            <div className="max-w-6xl mx-auto">
                <div className="relative rounded-lg overflow-hidden shadow-lg">
                    <Image 
                        src="/images/room-visualization-2.png" 
                        alt="Room visualization before and after" 
                        width={1200} 
                        height={600} 
                        className="w-full h-[400px] sm:h-[500px] lg:h-[600px] object-cover" 
                        priority
                    /> 
                </div>
            </div>
        </div> 
    ) 
}