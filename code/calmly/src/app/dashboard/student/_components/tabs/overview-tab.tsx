"use client";

import { Calendar, Brain, Heart, AlertCircle, Activity, MessageCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// --- Helper Functions for Styling and Formatting ---

function formatDate(dateInput: Date | string): string {
  const date = new Date(dateInput);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getSeverityClasses(level: string) {
  if (level.includes("Severe"))
    return {
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      borderColor: "border-red-500",
      progressBarColor: "bg-red-500",
    };
  if (level.includes("Moderate"))
    return {
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      borderColor: "border-yellow-500",
      progressBarColor: "bg-yellow-500",
    };
  if (level.includes("Mild"))
    return {
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      borderColor: "border-blue-500",
      progressBarColor: "bg-blue-500",
    };
  return {
    // Minimal
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    borderColor: "border-green-500",
    progressBarColor: "bg-green-500",
  };
}

// MODIFIED: Define props for the component
interface OverviewTabProps {
  user: any;
  setActiveTab: (tabId: string) => void;
}

export default function OverviewTab({ user, setActiveTab }: OverviewTabProps) {
  const latestPHQ9 = user.phq9Scores?.[0];
  const latestGAD7 = user.gad7Scores?.[0];

  const phq9Severity = latestPHQ9 ? getSeverityClasses(latestPHQ9.level) : null;
  const gad7Severity = latestGAD7 ? getSeverityClasses(latestGAD7.level) : null;

  const chatMessageCount = user.chatHistories?.[0]?.messages
    ? Array.isArray(user.chatHistories[0].messages)
      ? user.chatHistories[0].messages.length
      : 0
    : 0;

  return (
    <div className="space-y-8">
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="PHQ-9 Tests" value={user.phq9Scores?.length || 0} icon={Brain} color="blue" />
        <StatCard title="GAD-7 Tests" value={user.gad7Scores?.length || 0} icon={Heart} color="teal" />
        <StatCard title="Bookings Made" value={user.bookings?.length || 0} icon={Calendar} color="purple" />
        <StatCard title="AI Chats" value={chatMessageCount} icon={MessageCircle} color="green" />
      </div>

      {/* Latest Screening Results */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ScreeningResultCard
          title="Latest PHQ-9 (Depression)"
          latestScore={latestPHQ9}
          severity={phq9Severity}
          maxScore={27}
          icon={Brain}
          color="blue"
          assessmentLink="/self-assessment"
        />
        <ScreeningResultCard
          title="Latest GAD-7 (Anxiety)"
          latestScore={latestGAD7}
          severity={gad7Severity}
          maxScore={21}
          icon={Heart}
          color="teal"
          assessmentLink="/self-assessment"
        />
      </div>

      {/* Recent Bookings */}
      {user.bookings && user.bookings.length > 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <h3 className="mb-6 text-xl font-bold text-gray-800">Recent Bookings</h3>
          <div className="space-y-4">
            {user.bookings.slice(0, 3).map((booking: any) => (
              <div
                key={booking.id}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-100">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Appointment</p>
                    <p className="text-sm text-gray-500">Booked on {formatDate(booking.createdAt)}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-blue-600 capitalize">
                  {booking.status.toLowerCase() || "Pending"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <ActionCard
          title="Take a Screening"
          description="Check on your well-being"
          icon={Activity}
          link="/self-assessment"
        />
        <ActionCard
          title="Book a Therapist"
          description="Schedule a confidential session"
          icon={Calendar}
          onClick={() => setActiveTab("booking")}
        />
        <ActionCard
          title="Talk to AI Assistant"
          description="Get immediate support, 24/7"
          icon={MessageCircle}
          onClick={() => setActiveTab("chat")}
        />
      </div>
    </div>
  );
}

// --- Reusable Sub-components for a Cleaner Layout ---

const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
      <div
        className={cn("flex h-12 w-12 items-center justify-center rounded-xl", {
          "bg-blue-100": color === "blue",
          "bg-teal-100": color === "teal",
          "bg-purple-100": color === "purple",
          "bg-green-100": color === "green",
        })}
      >
        <Icon
          className={cn("h-6 w-6", {
            "text-blue-600": color === "blue",
            "text-teal-600": color === "teal",
            "text-purple-600": color === "purple",
            "text-green-600": color === "green",
          })}
        />
      </div>
    </div>
  </div>
);

const ScreeningResultCard = ({ title, latestScore, severity, maxScore, icon: Icon, color, assessmentLink }: any) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
    <div className="mb-6 flex items-center justify-between">
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      <Icon className={cn("h-6 w-6", { "text-blue-600": color === "blue", "text-teal-600": color === "teal" })} />
    </div>
    {latestScore ? (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-gray-800">
              {latestScore.score}/{maxScore}
            </p>
            <p className="text-sm text-gray-500">Taken on {formatDate(latestScore.createdAt)}</p>
          </div>
          <span className={cn("rounded-full px-3 py-1 text-sm font-medium", severity?.bgColor, severity?.textColor)}>
            {latestScore.level}
          </span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-gray-200">
          <div
            className={cn("h-2.5 rounded-full", severity?.progressBarColor)}
            style={{ width: `${(latestScore.score / maxScore) * 100}%` }}
          ></div>
        </div>
        <Link href={assessmentLink}>
          <span
            className={cn("block w-full rounded-xl py-3 text-center font-medium transition-colors", {
              "bg-blue-50 text-blue-700 hover:bg-blue-100": color === "blue",
              "bg-teal-50 text-teal-700 hover:bg-teal-100": color === "teal",
            })}
          >
            Take New Assessment
          </span>
        </Link>
      </div>
    ) : (
      <div className="py-8 text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-gray-300" />
        <p className="mb-4 text-gray-500">No screening completed yet</p>
        <Link href={assessmentLink}>
          <span
            className={cn("rounded-lg px-5 py-2 font-medium transition-colors", {
              "bg-blue-600 text-white hover:bg-blue-700": color === "blue",
              "bg-teal-600 text-white hover:bg-teal-700": color === "teal",
            })}
          >
            Take Test
          </span>
        </Link>
      </div>
    )}
  </div>
);

const ActionCard = ({ title, description, icon: Icon, link, onClick }: any) => {
  const content = (
    <div className="h-full rounded-2xl border border-gray-200 bg-white p-6 text-left transition-all duration-200 hover:border-blue-500 hover:shadow-lg">
      <Icon className="mb-3 h-8 w-8 text-blue-600" />
      <h4 className="mb-1 font-semibold text-gray-800">{title}</h4>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );

  if (link) {
    return <Link href={link}>{content}</Link>;
  }

  return (
    <button onClick={onClick} className="w-full cursor-pointer text-left">
      {content}
    </button>
  );
};
