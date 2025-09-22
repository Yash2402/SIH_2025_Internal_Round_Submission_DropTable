"use client";

import { useState } from "react";
import { BarChart3, Users, Stethoscope, Settings } from "lucide-react";
import AnalyticsTab from "./tabs/analytics-tab";
import TherapistsTab from "./tabs/therapists-tab";
import StudentsTab from "./tabs/students-tab";
import SettingsTab from "./tabs/settings-tab";

interface DashboardTabsProps {
  institution: any; // Pass the full institution data
}

const tabs = [
  { id: "analytics", name: "Analytics", icon: BarChart3 },
  { id: "therapists", name: "Manage Therapists", icon: Stethoscope },
  { id: "students", name: "Student Overview", icon: Users },
  { id: "settings", name: "Settings", icon: Settings },
];

export default function InstitutionDashboardTabs({ institution }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState("analytics");

  const renderTabContent = () => {
    switch (activeTab) {
      case "analytics":
        return <AnalyticsTab />;
      case "therapists":
        return <TherapistsTab institution={institution} />;
      case "students":
        return <StudentsTab institution={institution} />;
      case "settings":
        return <SettingsTab institution={institution} />;
      default:
        return <div>Analytics Tab Content (Coming Soon)</div>;
    }
  };

  return (
    <div>
      {/* Tab Navigation */}
      <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
        <nav className="flex items-center space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex cursor-pointer items-center space-x-2 rounded-xl px-4 py-3 font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-blue-500 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-300">{renderTabContent()}</div>
    </div>
  );
}
