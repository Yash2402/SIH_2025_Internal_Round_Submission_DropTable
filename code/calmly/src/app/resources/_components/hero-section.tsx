import { Heart } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="text-center mb-16">
      <div className="inline-flex items-center space-x-2 bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
        <Heart className="w-4 h-4" />
        <span>Trusted Mental Health Resources</span>
      </div>
      <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
        Your Mental Health Toolkit
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Discover videos, articles, apps, and tools carefully selected to support your mental wellness journey. From recovery stories to practical coping strategies.
      </p>
    </div>
  );
}
