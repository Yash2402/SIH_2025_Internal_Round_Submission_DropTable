"use client";

import { useState, useTransition } from "react";
import { UserPlus, Trash2, X, Loader2, Stethoscope } from "lucide-react";
import { addTherapist, deleteTherapist } from "../actions/therapistActions";

// This component receives the full institution object, which includes the therapists list.
export default function TherapistsTab({ institution }: { institution: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", specialty: "" });

  const handleAddTherapist = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const specialties = formData.specialty
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const result = await addTherapist({
        name: formData.name,
        email: formData.email,
        specialty: specialties,
        institutionId: institution.id,
      });

      if (result.success) {
        setIsModalOpen(false);
        setFormData({ name: "", email: "", specialty: "" }); // Reset form
      } else {
        setError(result.message || "An error occurred.");
      }
    });
  };

  const handleDelete = (therapistId: string) => {
    if (confirm("Are you sure you want to delete this therapist? This action cannot be undone.")) {
      startTransition(async () => {
        await deleteTherapist(therapistId, institution.id);
      });
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Therapists</h2>
          <p className="text-gray-500">Add, view, or remove therapists from your institution.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex cursor-pointer items-center space-x-2 rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition hover:bg-blue-600"
        >
          <UserPlus className="h-5 w-5" />
          <span>Add Therapist</span>
        </button>
      </div>

      {/* Therapists List */}
      <div className="space-y-4">
        {institution.therapists.length > 0 ? (
          institution.therapists.map((therapist: any) => (
            <div
              key={therapist.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4"
            >
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                  <Stethoscope className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{therapist.name}</p>
                  <p className="text-sm text-gray-500">{therapist.email}</p>
                  <p className="mt-1 text-xs text-gray-400">{therapist.specialty.join(", ")}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(therapist.id)}
                disabled={isPending}
                className="cursor-pointer rounded-full p-2 text-gray-400 transition hover:text-red-500 disabled:opacity-50"
                aria-label="Delete therapist"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))
        ) : (
          <div className="rounded-xl border-2 border-dashed border-gray-200 py-12 text-center">
            <p className="text-gray-500">No therapists have been added yet.</p>
          </div>
        )}
      </div>

      {/* Add Therapist Modal */}
      {isModalOpen && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black backdrop-blur-sm">
          <div className="m-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Add New Therapist</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddTherapist} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Specialties</label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., CBT, Anxiety, Trauma"
                />
                <p className="mt-1 text-xs text-gray-400">Separate specialties with a comma.</p>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                  {isPending ? "Adding..." : "Add Therapist"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
