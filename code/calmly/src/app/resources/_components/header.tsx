import Image from "next/image";

export default function ResourcesHeader() {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center space-x-4">
          <Image src="/icon.png" alt="Calmly Logo" width={120} height={32} className="h-8 w-auto" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Mental Health Resources</h1>
            <p className="text-sm text-gray-600">Curated content to support your mental wellness journey</p>
          </div>
        </div>
      </div>
    </header>
  );
}
