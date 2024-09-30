import Hero from "../components/Hero";
import ProductSection from "../components/ProductSection";

export default function HomeRoute() {

    return (
        <div className="bg-surface">
            <Hero />
            <ProductSection />
        </div>
    )
}