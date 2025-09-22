import { Shield } from "lucide-react";
import { crisisResources } from "../data";

export default function CrisisResources() {
    return (
        <div className="bg-white rounded-3xl text-gray-800 py-10">
            <div className="text-center mb-8">
                <Shield className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Crisis Support Resources</h2>
                <p className="text-red-600">{"If you're in crisis or need immediate support, these resources are available 24/7"}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {crisisResources.map((resource, index) => (
                    <div key={index} className="bg-gray-100 hover:shadow-md backdrop-blur-sm rounded-2xl p-6">
                        <h3 className="font-semibold mb-2">{resource.title}</h3>
                        <div className="space-y-2 text-sm">
                            {resource.contacts.map((contact, contactIndex) => (
                                <div key={contactIndex}>
                                    <strong>{contact.label}:</strong> {contact.info}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
