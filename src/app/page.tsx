
import HeroSection from './components/home/HeroSection';
import FeaturedProducts from './components/home/FeaturedProducts';
import PopularProducts from './components/home/PopularProducts';
import AllServices from './components/home/AllServices';

export default function Home() {
    return (
        <div>
            <HeroSection />
            <FeaturedProducts />
            <PopularProducts />
            <AllServices />
        </div>
    );
}
