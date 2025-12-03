"use client";

import { useAuth } from "@/context/AuthContext";
import { BarChart3, TrendingUp, Users, Eye, Heart } from "lucide-react";
import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalViews: 0,
    totalLikes: 0,
    followers: 0,
    engagementRate: "0%",
  });

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/analytics?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => setStats(data))
        .catch((err) => console.error("Failed to fetch analytics", err));
    }
  }, [user?.id]);

  return (
    <main className="min-h-screen bg-white text-primary font-sans p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Analytics</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
            <div className="flex items-center gap-3 mb-2 text-gray-600">
              <Eye className="w-5 h-5" />
              <span className="font-bold">Total Views</span>
            </div>
            <div className="text-3xl font-bold">{stats.totalViews}</div>
            <div className="text-sm text-green-600 font-bold mt-1">
              Lifetime
            </div>
          </div>

          <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
            <div className="flex items-center gap-3 mb-2 text-gray-600">
              <Heart className="w-5 h-5" />
              <span className="font-bold">Total Likes</span>
            </div>
            <div className="text-3xl font-bold">{stats.totalLikes}</div>
            <div className="text-sm text-gray-500 font-bold mt-1">Lifetime</div>
          </div>

          <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
            <div className="flex items-center gap-3 mb-2 text-gray-600">
              <Users className="w-5 h-5" />
              <span className="font-bold">Followers</span>
            </div>
            <div className="text-3xl font-bold">{stats.followers}</div>
            <div className="text-sm text-green-600 font-bold mt-1">
              Lifetime
            </div>
          </div>

          <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
            <div className="flex items-center gap-3 mb-2 text-gray-600">
              <TrendingUp className="w-5 h-5" />
              <span className="font-bold">Engagement</span>
            </div>
            <div className="text-3xl font-bold">{stats.engagementRate}</div>
            <div className="text-sm text-green-600 font-bold mt-1">Rate</div>
          </div>
        </div>

        <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 h-96 flex items-center justify-center flex-col text-gray-500">
          <BarChart3 className="w-16 h-16 mb-4 opacity-50" />
          <p className="font-bold text-lg">Detailed charts coming soon</p>
        </div>
      </div>
    </main>
  );
}
