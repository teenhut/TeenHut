"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Flame, MessageSquare, Trophy, Heart, Video, Send } from "lucide-react";

export default function ChallengesPage() {
  const { user } = useAuth();
  const currentXP = user?.credits || 0;
  const streak = user?.streak || 0;
  const stats = user?.stats || {
    commentsMade: 0,
    hypesUploaded: 0,
    likesGiven: 0,
    messagesSent: 0,
  };

  const challenges = [
    {
      id: "comment_10",
      title: "Hype Enthusiast",
      description: "Comment on 10 Hypes",
      target: 10,
      current: stats.commentsMade || 0,
      reward: 20,
      icon: <MessageSquare className="w-6 h-6 text-blue-500" />,
    },
    {
      id: "like_20",
      title: "Spread the Love",
      description: "Like 20 Hypes",
      target: 20,
      current: stats.likesGiven || 0,
      reward: 30,
      icon: <Heart className="w-6 h-6 text-pink-500" />,
    },
    {
      id: "hype_5",
      title: "Content Creator",
      description: "Upload 5 Hypes",
      target: 5,
      current: stats.hypesUploaded || 0,
      reward: 100,
      icon: <Video className="w-6 h-6 text-purple-500" />,
    },
    {
      id: "message_50",
      title: "Social Butterfly",
      description: "Send 50 Messages",
      target: 50,
      current: stats.messagesSent || 0,
      reward: 50,
      icon: <Send className="w-6 h-6 text-green-500" />,
    },
    {
      id: "streak_3",
      title: "Consistency is Key",
      description: "Reach a 3-day streak",
      target: 3,
      current: streak,
      reward: 30,
      icon: <Flame className="w-6 h-6 text-orange-500" />,
    },
    {
      id: "streak_5",
      title: "On Fire!",
      description: "Reach a 5-day streak",
      target: 5,
      current: streak,
      reward: 50,
      icon: <Flame className="w-6 h-6 text-red-500" />,
    },
    {
      id: "streak_7",
      title: "Legendary Streak",
      description: "Reach a 7-day streak",
      target: 7,
      current: streak,
      reward: 100,
      icon: <Trophy className="w-6 h-6 text-yellow-500" />,
    },
  ];

  return (
    <main className="min-h-screen bg-white text-black font-sans">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-5xl font-bold text-center mb-8">Challenges</h1>

        <div className="bg-black text-white rounded-2xl p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="text-gray-400 text-sm uppercase tracking-wider font-bold mb-1">
              Current Balance
            </div>
            <div className="text-5xl font-bold">
              {currentXP.toLocaleString()} XP
            </div>
          </div>
          <div className="flex items-center gap-4 bg-gray-800 rounded-xl p-4">
            <Flame className="w-8 h-8 text-orange-500 fill-orange-500" />
            <div>
              <div className="font-bold text-2xl">{streak} Days</div>
              <div className="text-xs text-gray-400">Current Streak</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {challenges.map((challenge) => {
            const isCompleted = user?.completedChallenges?.includes(
              challenge.id
            );
            const progress = Math.min(
              (challenge.current / challenge.target) * 100,
              100
            );

            return (
              <div
                key={challenge.id}
                className={`border rounded-2xl p-6 flex items-center gap-6 ${
                  isCompleted
                    ? "bg-green-50 border-green-200"
                    : "bg-white border-gray-200"
                }`}
              >
                <div
                  className={`p-4 rounded-full ${
                    isCompleted ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  {challenge.icon}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-bold text-xl">{challenge.title}</h3>
                    <span className="font-bold text-gray-500">
                      +{challenge.reward} XP
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{challenge.description}</p>

                  {isCompleted ? (
                    <div className="text-green-600 font-bold flex items-center gap-2">
                      <Trophy className="w-4 h-4" /> Completed
                    </div>
                  ) : (
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-black h-full rounded-full transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>
                {!isCompleted && (
                  <div className="text-sm font-bold text-gray-400 whitespace-nowrap">
                    {Math.min(challenge.current, challenge.target)} /{" "}
                    {challenge.target}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
