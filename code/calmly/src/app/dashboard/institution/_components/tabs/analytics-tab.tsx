"use client";

import { useState, useEffect } from "react";
import { getAnalyticsData } from "../actions/analyticsActions";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader2, AlertTriangle, BarChart3, TrendingUp, Calendar } from "lucide-react";

// Update the type to include our new time-series data
interface AnalyticsData {
  totalScreenings: number;
  phq9: { count: number; averageScore: number; distribution: Record<string, number> };
  gad7: { count: number; averageScore: number; distribution: Record<string, number> };
  monthlyTrends: { month: string; "PHQ-9 Average": number | null; "GAD-7 Average": number | null }[];
  screeningsPerMonth: { month: string; screenings: number }[];
}

export default function AnalyticsTab() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getAnalyticsData();
        if (result.success) {
          setData(result.data as AnalyticsData); // Cast to our new type
        } else {
          setError(result.message || "Failed to load data.");
        }
      } catch (e) {
        setError("An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-red-50 text-red-700 rounded-2xl">
        <AlertTriangle className="w-8 h-8 mb-2" />
        <p className="font-semibold">{error || "Could not retrieve analytics data."}</p>
      </div>
    );
  }

  const phq9ChartData = Object.entries(data.phq9.distribution).map(([name, value]) => ({ name, count: value }));
  const gad7ChartData = Object.entries(data.gad7.distribution).map(([name, value]) => ({ name, count: value }));
  
  // Format month names for display on the chart
  const formatMonth = (monthStr: string) => new Date(monthStr + '-02').toLocaleString('default', { month: 'short', year: '2-digit' });
  const trendData = data.monthlyTrends.map(d => ({ ...d, month: formatMonth(d.month) }));
  const screeningsData = data.screeningsPerMonth.map(d => ({ ...d, month: formatMonth(d.month) }));

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Screenings" value={data.totalScreenings} icon={BarChart3} />
        <StatCard title="Avg. PHQ-9 Score" value={data.phq9.averageScore.toFixed(1)} icon={TrendingUp} />
        <StatCard title="Avg. GAD-7 Score" value={data.gad7.averageScore.toFixed(1)} icon={TrendingUp} />
      </div>

      {/* --- NEW: Time-Series Charts --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TrendChartCard title="Average Score Trend" data={trendData} />
        <ScreeningsChartCard title="Screenings Per Month" data={screeningsData} />
      </div>

      {/* Existing Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DistributionChartCard title="PHQ-9 (Depression) Severity Distribution" data={phq9ChartData} />
        <DistributionChartCard title="GAD-7 (Anxiety) Severity Distribution" data={gad7ChartData} />
      </div>
    </div>
  );
}

// --- Reusable Components ---

const StatCard = ({ title, value, icon: Icon }: { title: string, value: string | number, icon: React.ElementType }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
      <div className="bg-blue-100 p-3 rounded-full">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
    </div>
  </div>
);

const DistributionChartCard = ({ title, data }: { title: string, data: { name: string, count: number }[] }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
    <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e5e7eb' }} />
          <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

// --- NEW: Chart Components for Time-Series Data ---

const TrendChartCard = ({ title, data }: { title: string, data: any[] }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
    <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
          <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e5e7eb' }} />
          <Legend wrapperStyle={{ fontSize: "14px" }} />
          <Line type="monotone" dataKey="PHQ-9 Average" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} connectNulls />
          <Line type="monotone" dataKey="GAD-7 Average" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} connectNulls />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const ScreeningsChartCard = ({ title, data }: { title: string, data: any[] }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
    <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e5e7eb' }} />
          <Bar dataKey="screenings" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);
