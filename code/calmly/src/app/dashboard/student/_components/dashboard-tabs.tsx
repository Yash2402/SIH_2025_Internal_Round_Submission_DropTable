"use client";

import { useState } from "react";
import { Home, Settings, Calendar, MessageCircle } from "lucide-react";
import OverviewTab from "./tabs/overview-tab";
import SettingsTab from "./tabs/settings-tab";
import BookingTab from "./tabs/booking-tab";
import ChatTab from "./tabs/chat-tab";

interface DashboardTabsProps {
  user: any; // Full user data with relationships
}

const tabs = [
  { id: "overview", name: "Overview", icon: Home },
  { id: "booking", name: "Book Therapist", icon: Calendar },
  { id: "chat", name: "AI Support", icon: MessageCircle },
  { id: "settings", name: "Account Settings", icon: Settings },
];

export default function StudentDashboardTabs({ user }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        // MODIFIED: Pass the setActiveTab function down as a prop
        return <OverviewTab user={user} setActiveTab={setActiveTab} />;
      case "booking":
        return <BookingTab user={user} />;
      case "chat":
        return <ChatTab user={user} />;
      case "settings":
        return <SettingsTab user={user} />;
      default:
        // MODIFIED: Also pass the prop in the default case
        return <OverviewTab user={user} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div>
      {/* Tab Navigation */}
      <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
        <nav className="flex flex-row justify-between">
          <div className="flex space-x-1">
            {tabs.slice(0, 3).map((tab) => {
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
          </div>
          <button
            key={tabs[3].id}
            onClick={() => setActiveTab(tabs[3].id)}
            className={`flex cursor-pointer items-center space-x-2 rounded-xl px-4 py-3 font-medium transition-all duration-200 ${
              activeTab === tabs[3].id
                ? "bg-blue-500 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Settings className="h-5 w-5" />
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-300">{renderTabContent()}</div>
    </div>
  );
}
