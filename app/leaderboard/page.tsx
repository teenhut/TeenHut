"use client";

import { useEffect, useState } from "react";
import LeaderboardRow from "@/components/leaderboard/LeaderboardRow";
import { Button } from "@/components/ui/button";

interface Leader {
  _id: string;
  username: string;
  credits: number;
  streak: number;
}

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/leaderboard");
        const data = await res.json();
        setLeaders(data);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <main className="min-h-screen bg-white text-primary font-sans">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-5xl font-bold text-center mb-8">Leaderboard</h1>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : (
            leaders.map((leader, index) => (
              <LeaderboardRow
                key={leader._id}
                rank={index + 1}
                name={leader.username}
                xp={leader.credits}
                avatarColor="bg-gray-200" // Default color for now
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
