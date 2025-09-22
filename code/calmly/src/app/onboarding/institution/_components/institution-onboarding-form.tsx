"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InstitutionOnboardingForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    institutionName: "",
    hodName: "",
    hodEmail: "",
    hodPhone: "",
    totalStudents: "",
    institutionType: "",
    address: "",
    city: "",
    state: "",
    website: "",
    established: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/onboarding/institution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/dashboard/institution");
      } else {
        alert("Error saving institution information. Please try again.");
      }
    } catch (error) {
      console.error("Institution onboarding error:", error);
      alert("Error saving institution information. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">Setup Your Institution</h1>
          <p className="text-gray-600">
            Provide details about your institution to get started with mental health services
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
          {/* Institution Details */}
          <div>
            <h2 className="mb-6 text-xl font-semibold text-gray-900">Institution Information</h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">Institution Name *</label>
                <input
                  type="text"
                  name="institutionName"
                  value={formData.institutionName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter full institution name"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Institution Type *</label>
                <select
                  name="institutionType"
                  value={formData.institutionType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select type</option>
                  <option value="University">University</option>
                  <option value="College">College</option>
                  <option value="School">School</option>
                  <option value="Technical Institute">Technical Institute</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Total Students *</label>
                <input
                  type="number"
                  name="totalStudents"
                  value={formData.totalStudents}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  placeholder="Approximate number"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Year Established</label>
                <input
                  type="number"
                  name="established"
                  value={formData.established}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  placeholder="YYYY"
                  min="1800"
                  max="2025"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Institution Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  placeholder="https://www.yourschool.edu"
                />
              </div>
            </div>
          </div>

          {/* Admin Contact Details */}
          <div>
            <h2 className="mb-6 text-xl font-semibold text-gray-900">Administrator Information</h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Head/Admin Name *</label>
                <input
                  type="text"
                  name="hodName"
                  value={formData.hodName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  placeholder="Principal/Dean/HOD name"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Admin Email *</label>
                <input
                  type="email"
                  name="hodEmail"
                  value={formData.hodEmail}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  placeholder="admin@yourschool.edu"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">Admin Phone Number *</label>
                <input
                  type="tel"
                  name="hodPhone"
                  value={formData.hodPhone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  placeholder="+91 XXXXX XXXXX"
                  required
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h2 className="mb-6 text-xl font-semibold text-gray-900">Location Information</h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">Institution Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  placeholder="Full address"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  placeholder="City"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  placeholder="State"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-purple-50 p-6">
            <div className="flex items-start space-x-3">
              <svg className="mt-1 h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="font-medium text-purple-900">Verification Process</h3>
                <p className="mt-1 text-sm text-purple-700">
                  Your institution details will be reviewed by our team for verification. This process typically takes
                  1-2 business days. You'll receive an email confirmation once approved.
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full cursor-pointer rounded-xl py-4 font-semibold text-white transition-all duration-200 ${
              isLoading
                ? "cursor-not-allowed bg-gray-400"
                : "bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg hover:from-purple-700 hover:to-purple-800 hover:shadow-xl"
            }`}
          >
            {isLoading ? "Setting up institution..." : "Complete Institution Setup"}
          </button>
        </form>
      </div>
    </div>
  );
}
