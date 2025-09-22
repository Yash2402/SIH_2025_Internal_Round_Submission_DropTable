import { selfCareTips } from "../data";

export default function SelfCareTips() {
  return (
    <div className="mt-16 bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Daily Self-Care Tips</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {selfCareTips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <div key={index} className="text-center p-4">
              <div className={`w-16 h-16 ${tip.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{tip.title}</h3>
              <p className="text-sm text-gray-600">{tip.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
