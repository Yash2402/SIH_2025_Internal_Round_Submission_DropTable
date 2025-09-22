"use client";

import { useState, useEffect, useTransition } from "react";
import { User as UserIcon, Home, Loader2, CheckCircle, AlertTriangle } from "lucide-react";

// Define a type for the institution data we will fetch
interface Institution {
  id: string;
  name: string;
}

export default function SettingsTab({ user }: { user: any }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // State for fetching and storing the list of institutions
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [isLoadingInstitutions, setIsLoadingInstitutions] = useState(true);

  // Initialize form state with the data passed from the server
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    studentId: user.studentId || "",
    dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split("T")[0] : "",
    gender: user.gender || "",
    phoneNumber: user.phoneNumber || "",
    emergencyContact: user.emergencyContact || "",
    emergencyPhone: user.emergencyPhone || "",
    institutionId: user.institutionId || "", // This will be the user's current institution
  });

  // Fetch the list of all institutions when the component mounts
  useEffect(() => {
    // Only fetch if the user doesn't already have an institution
    if (!user.institution) {
      async function fetchInstitutions() {
        try {
          const response = await fetch("/api/institutions");
          if (!response.ok) throw new Error("Failed to fetch");
          const data = await response.json();
          setInstitutions(data);
        } catch (err) {
          setMessage({ type: "error", text: "Could not load institutions list." });
        } finally {
          setIsLoadingInstitutions(false);
        }
      }
      fetchInstitutions();
    } else {
      setIsLoadingInstitutions(false);
    }
  }, [user.institution]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/user/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "An unknown error occurred.");

        setMessage({ type: "success", text: "Your profile has been updated successfully." });
      } catch (err: any) {
        setMessage({ type: "error", text: err.message });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <UserIcon className="h-6 w-6 text-gray-500" />
        <h2 className="text-2xl font-bold text-gray-800">Account Settings</h2>
      </div>
      {/* Personal Information Section */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-700">Personal Information</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-style w-full"
              disabled
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-style w-full"
              disabled
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">Student ID</label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              className="input-style w-full"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="input-style w-full"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="input-style w-full">
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="input-style w-full"
            />
          </div>
        </div>
      </div>

      {/* Emergency Contact Section */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-700">Emergency Contact</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">Contact Name</label>
            <input
              type="text"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              className="input-style w-full"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">Contact Phone</label>
            <input
              type="tel"
              name="emergencyPhone"
              value={formData.emergencyPhone}
              onChange={handleChange}
              className="input-style w-full"
            />
          </div>
        </div>
      </div>

      {/* Institution Section */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-700">Institution</h3>
        {user.institution ? (
          // If user HAS an institution, show a disabled info box
          <div className="flex items-center space-x-3 rounded-lg bg-blue-50 p-4">
            <Home className="h-5 w-5 text-blue-600" />
            <p className="text-sm text-blue-800">
              You are registered under: <span className="font-semibold">{user.institution.name}</span>
            </p>
          </div>
        ) : (
          // If user DOES NOT have an institution, show the dropdown
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">Select Your Institution *</label>
            <select
              name="institutionId"
              value={formData.institutionId}
              onChange={handleChange}
              className="input-style w-full disabled:bg-gray-100"
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
            <p className="mt-2 text-xs text-gray-500">
              Contact your institution admin to get added to your university's Calmly platform if you don't see it here.
            </p>
          </div>
        )}
      </div>

      {/* Form Message (Success or Error) */}
      {message && (
        <div
          className={`flex items-center space-x-3 rounded-lg p-3 text-sm font-medium ${
            message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
          }`}
        >
          {message.type === "success" ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end border-t border-gray-200 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
