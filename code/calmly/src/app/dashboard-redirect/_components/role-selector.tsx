"use client";
import { useState, useTransition } from "react";
import { User, Building2, Heart, Shield, Users, BarChart3, Loader2 } from "lucide-react";
import { setUserRole } from "../actions";
import { useRouter } from "next/navigation";
import { Sansita } from "next/font/google";

const sansita = Sansita({
  variable: "--font-sansita",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export function RoleSelector() {
  const [selectedRole, setSelectedRole] = useState<"STUDENT" | "INSTITUTION_ADMIN" | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRoleSelect = (role: "STUDENT" | "INSTITUTION_ADMIN") => {
    console.log("🔍 Role selected:", role);
    setSelectedRole(role);
    setError(null);
  };

  const handleContinue = () => {
    if (!selectedRole) return;

    console.log("🔍 Starting role assignment for:", selectedRole);
    startTransition(async () => {
      try {
        const result = await setUserRole(selectedRole);
        if (result.success) {
          // Handle redirect based on role
          if (selectedRole === "STUDENT") {
            router.push("/onboarding/student");
          } else if (selectedRole === "INSTITUTION_ADMIN") {
            router.push("/onboarding/institution");
          }
        }
      } catch (error) {
        console.error("❌ Error setting role:", error);
        setError("Failed to set role. Please try again.");
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className={`mb-4 text-5xl font-bold text-gray-900 ${sansita.className}`}>Welcome to Calmly</h1>
          <p className="text-md mx-auto max-w-2xl text-gray-600">
            Choose your role to get started with our mental health support platform
          </p>
        </div>

        {error && (
          <div className="mb-8 rounded-lg border border-red-400 bg-red-100 p-4 text-center text-red-700">{error}</div>
        )}

        <div className="mb-12 grid gap-8 md:grid-cols-2">
          {/* Student Role Card */}
          <div
            onClick={() => handleRoleSelect("STUDENT")}
            className={`cursor-pointer rounded-2xl border-2 bg-white p-8 transition-all duration-200 hover:shadow-lg ${
              selectedRole === "STUDENT"
                ? "scale-[1.02] transform border-blue-500 shadow-lg"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 p-4">
                <User className="h-10 w-10 text-blue-600" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">{"I'm a Student"}</h2>
              <p className="text-gray-600">Access mental health resources and support tools</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Heart className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                <div>
                  <h3 className="font-semibold text-gray-900">AI-Guided Support</h3>
                  <p className="text-sm text-gray-600">24/7 AI chat for immediate mental health guidance</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                <div>
                  <h3 className="font-semibold text-gray-900">Confidential Screening</h3>
                  <p className="text-sm text-gray-600">PHQ-9 & GAD-7 assessments with private results</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Users className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-500" />
                <div>
                  <h3 className="font-semibold text-gray-900">Book Counselors</h3>
                  <p className="text-sm text-gray-600">Schedule sessions with certified therapists</p>
                </div>
              </div>
            </div>
          </div>

          {/* Institution Admin Role Card */}
          <div
            onClick={() => handleRoleSelect("INSTITUTION_ADMIN")}
            className={`cursor-pointer rounded-2xl border-2 bg-white p-8 transition-all duration-200 hover:shadow-lg ${
              selectedRole === "INSTITUTION_ADMIN"
                ? "scale-[1.02] transform border-purple-500 shadow-lg"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-purple-50 p-4">
                <Building2 className="h-10 w-10 text-purple-600" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">Institution Admin</h2>
              <p className="text-gray-600">Manage mental health services for your organization</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Users className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="font-semibold text-gray-900">Manage Therapists</h3>
                  <p className="text-sm text-gray-600">Add and organize counselor profiles and availability</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <BarChart3 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                <div>
                  <h3 className="font-semibold text-gray-900">Analytics Dashboard</h3>
                  <p className="text-sm text-gray-600">View anonymized trends and platform usage</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-500" />
                <div>
                  <h3 className="font-semibold text-gray-900">Student Wellbeing</h3>
                  <p className="text-sm text-gray-600">Support institutional mental health initiatives</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {selectedRole && (
          <div className="text-center">
            <button
              onClick={handleContinue}
              disabled={isPending}
              className={`inline-flex cursor-pointer items-center rounded-full bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-200 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                isPending ? "cursor-not-allowed" : "transform hover:scale-105 hover:shadow-lg"
              }`}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-3 -ml-1 h-5 w-5 animate-spin text-white" />
                  Setting up your account...
                </>
              ) : (
                `Continue as ${selectedRole === "STUDENT" ? "Student" : "Institution Admin"}`
              )}
            </button>

            <p className="mt-4 text-sm text-gray-500">You can change this later in your profile settings</p>
          </div>
        )}
      </div>
    </div>
  );
}
