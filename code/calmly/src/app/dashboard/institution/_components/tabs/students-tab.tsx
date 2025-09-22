"use client";

import { useState } from "react";
import { User, Search, ChevronDown, Loader2, AlertTriangle } from "lucide-react";
import { getStudentDetails } from "../actions/studentActions";
import { ResponsiveContainer, LineChart as RechartsLineChart, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";

// Main Component
export default function StudentsTab({ institution }: { institution: any }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
  const [details, setDetails] = useState<any>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const handleStudentClick = async (studentId: string) => {
    if (expandedStudentId === studentId) {
      setExpandedStudentId(null); // Close if already open
      return;
    }

    setIsLoadingDetails(true);
    setExpandedStudentId(studentId);
    const result = await getStudentDetails(studentId);
    if (result.success) {
      setDetails(result.data);
    } else {
      console.error(result.message);
      setDetails(null); // Clear previous details on error
    }
    setIsLoadingDetails(false);
  };

  const filteredStudents = institution.users.filter((student: any) =>
    student.anonymousUsername.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
      {/* Header and Search */}
      <div className="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Student Overview</h2>
          <p className="text-gray-500">Click on a student to view their anonymized report.</p>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by anonymous ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:ring-blue-500 md:w-64"
          />
        </div>
      </div>

      {/* Students List */}
      <div className="space-y-3">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student: any) => (
            <div key={student.id} className="rounded-xl border border-gray-200">
              <button
                onClick={() => handleStudentClick(student.id)}
                className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-gray-50 p-4 transition hover:bg-gray-100"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-mono text-sm font-medium text-gray-700">{student.anonymousUsername}</p>
                    <p className="text-left text-xs text-gray-500">
                      Joined: {new Date(student.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-gray-500 transition-transform ${expandedStudentId === student.id ? "rotate-180" : ""}`}
                />
              </button>

              {/* Expanded View */}
              {expandedStudentId === student.id && (
                <div className="border-t border-gray-200 p-4">
                  {isLoadingDetails ? (
                    <div className="flex h-48 items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                  ) : (
                    <StudentDetailView details={details} />
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="rounded-xl border-2 border-dashed border-gray-200 py-12 text-center">
            <p className="text-gray-500">{searchTerm ? "No students found." : "No students have registered yet."}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Sub-component to Render the Expanded Detail View ---

const StudentDetailView = ({ details }: { details: any }) => {
  if (!details) {
    return <div className="text-center text-red-500">Could not load student details.</div>;
  }

  const latestPHQ9 = details.phq9Scores[details.phq9Scores.length - 1];
  const latestGAD7 = details.gad7Scores[details.gad7Scores.length - 1];

  // Combine scores into a single array for the trend chart
  const chartData = details.phq9Scores.map((score: any, index: number) => ({
    name: `Test ${index + 1}`,
    "PHQ-9": score.score,
    "GAD-7": details.gad7Scores[index]?.score, // Assumes tests are taken in pairs
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Guardian Contact */}
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <h4 className="mb-2 flex items-center font-semibold text-yellow-800">
            <AlertTriangle className="mr-2 h-5 w-5" /> Guardian Contact Info
          </h4>
          <p className="text-sm text-gray-700">
            <strong>Name:</strong> {details.emergencyContact || "Not Provided"}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Phone:</strong> {details.emergencyPhone || "Not Provided"}
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Use this information responsibly and only in case of a mental health emergency.
          </p>
        </div>

        {/* Latest Scores */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h4 className="mb-2 font-semibold text-gray-700">Latest Scores</h4>
          <p className="text-sm text-gray-700">
            <strong>PHQ-9 (Depression):</strong> {latestPHQ9?.score ?? "N/A"}
          </p>
          <p className="text-sm text-gray-700">
            <strong>GAD-7 (Anxiety):</strong> {latestGAD7?.score ?? "N/A"}
          </p>
        </div>
      </div>

      {/* Improvement Graph */}
      <div>
        <h4 className="mb-4 font-semibold text-gray-700">Assessment Score Trends</h4>
        <div className="h-64 w-full">
          <ResponsiveContainer>
            <RechartsLineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <XAxis dataKey="name" fontSize={12} />
              <YAxis domain={[0, 27]} fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid #e5e7eb" }} />
              <Legend wrapperStyle={{ fontSize: "14px" }} />
              <Line type="monotone" dataKey="PHQ-9" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="GAD-7" stroke="#10b981" strokeWidth={2} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
