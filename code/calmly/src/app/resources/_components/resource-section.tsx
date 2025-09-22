import { ExternalLink } from "lucide-react";
import { ResourceCategory } from "../data";

interface ResourceSectionProps {
  category: ResourceCategory;
}

export default function ResourceSection({ category }: ResourceSectionProps) {
  const Icon = category.icon;
  
  return (
    <div className={`${category.bgColor} rounded-3xl p-6 h-fit`}>
      <div className="flex items-center space-x-3 mb-6">
        <Icon className="w-6 h-6 text-red-600" />
        <h2 className="text-xl font-bold text-gray-900">{category.title}</h2>
      </div>
      
      <div className="space-y-4">
        {category.resources.map((resource, index) => (
          <a
            key={index}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-2xl p-4 hover:shadow-lg transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {resource.title}
              </h3>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0 ml-2" />
            </div>
            
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium">
                {resource.type}
              </span>
              {resource.duration && (
                <span className="text-xs text-gray-500">• {resource.duration}</span>
              )}
            </div>
            
            <p className="text-sm text-gray-600 leading-relaxed">
              {resource.description}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
