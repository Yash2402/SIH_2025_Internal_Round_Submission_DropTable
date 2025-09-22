"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define a type for the institution data we will fetch
interface Institution {
  id: string;
  name: string;
}

export default function StudentOnboardingForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // State for fetching and storing institutions
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [isLoadingInstitutions, setIsLoadingInstitutions] = useState(true);

  const [formData, setFormData] = useState({
    // --- ADDED: institutionId field ---
    institutionId: "",

    // --- Your existing fields remain ---
    studentId: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    emergencyContact: "",
    emergencyPhone: "",
    medicalHistory: "",
    currentMedications: "",
    previousTherapy: false, // Correctly initialized as a boolean
    consentGiven: false,
  });

  // useEffect to fetch institutions when the component loads
  useEffect(() => {
    async function fetchInstitutions() {
      try {
        const response = await fetch("/api/institutions");
        if (!response.ok) throw new Error("Failed to fetch institutions list.");
        const data = await response.json();
        setInstitutions(data);
      } catch (error) {
        console.error("Error fetching institutions:", error);
      } finally {
        setIsLoadingInstitutions(false);
      }
    }
    fetchInstitutions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consentGiven) {
      alert("Please provide consent to continue with mental health services.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/onboarding/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/dashboard/student");
      } else {
        alert("Error saving information. Please try again.");
      }
    } catch (error) {
      console.error("Onboarding error:", error);
      alert("Error saving information. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    const inputValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({ ...prev, [name]: inputValue }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-12">
      <div className="mx-auto max-w-2xl px-6">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="text-gray-600">Help us provide you with personalized mental health support</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
          {/* --- ADDED: Institution and Academic Information Section --- */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Academic Information</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">Your Institution *</label>
                <select
                  name="institutionId"
                  value={formData.institutionId}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  required
                  disabled={isLoadingInstitutions}
                >
                  <option value="" disabled>
                    {isLoadingInstitutions ? "Loading..." : "Select your institution"}
                  </option>
                  {institutions.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Student ID</label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your student ID"
                />
              </div>
            </div>
          </div>

          {/* --- Your existing form fields remain unchanged --- */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Personal Information</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Emergency Contact</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Contact Name</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500"
                  placeholder="Parent/Guardian name"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Contact Phone</label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500"
                  placeholder="+91 XXXXX XXXXX"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Medical Information</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Current Medications <span className="text-gray-500">(Optional)</span>
                </label>
                <textarea
                  name="currentMedications"
                  value={formData.currentMedications}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500"
                  placeholder="List any medications you're currently taking"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Relevant Medical History <span className="text-gray-500">(Optional)</span>
                </label>
                <textarea
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500"
                  placeholder="Any medical conditions or history relevant to mental health"
                />
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="previousTherapy"
                  checked={formData.previousTherapy}
                  onChange={handleChange}
                  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700">I have received mental health treatment before</label>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-blue-50 p-6">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                name="consentGiven"
                checked={formData.consentGiven}
                onChange={handleChange}
                className="mt-1 h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                required
              />
              <div>
                <label className="text-sm font-medium text-gray-900">I consent to mental health services *</label>
                <p className="mt-1 text-sm text-gray-600">
                  I understand that this platform provides mental health support services and I consent to receiving
                  such services. All information will be kept confidential in accordance with privacy policies.
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || isLoadingInstitutions}
            className={`w-full cursor-pointer rounded-xl py-4 font-semibold text-white transition-all duration-200 ${
              isLoading || isLoadingInstitutions
                ? "cursor-not-allowed bg-gray-400"
                : "bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
            }`}
          >
            {isLoading ? "Saving..." : "Complete Setup"}
          </button>
        </form>
      </div>
    </div>
  );
}
