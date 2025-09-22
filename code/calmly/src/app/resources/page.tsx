import ResourcesHeader from "./_components/header";
import HeroSection from "./_components/hero-section";
import ResourceSection from "./_components/resource-section";
import CrisisResources from "./_components/crisis-resources";
import SelfCareTips from "./_components/self-care-tips";
import { resourceCategories } from "./data";

export default function ResourcesPage() {
    // Separate large and small categories for layout
    const largeCategories = resourceCategories.filter(cat =>
        cat.id === "feel-good-videos"
    );
    const smallCategories = resourceCategories.filter(cat =>
        cat.id !== "feel-good-videos"
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50" >
            <ResourcesHeader />
            <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
                <HeroSection />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 space-y-8 lg:space-y-0 mt-12">

                    <div className="lg:col-span-1 space-y-8">
                        {largeCategories.map(category => (
                            <ResourceSection key={category.id} category={category} />
                        ))}
                    </div>

                    {smallCategories.slice(0, 2).map(category => (
                        <div key={category.id}>
                            <ResourceSection category={category} />
                        </div>
                    ))}
                </div>

                <SelfCareTips />
                {/* Additional Resources - Second Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {smallCategories.slice(2).map(category => (
                        <ResourceSection key={category.id} category={category} />
                    ))}
                </div>

                <CrisisResources />
            </div>
        </div>
    );
}

